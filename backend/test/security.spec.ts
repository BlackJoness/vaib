import { INestApplication } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import request from "supertest";
import { criarApp, criarPrismaMock, JWT_SECRET_TESTE, PrismaMock, tokenAdmin } from "./helpers";

describe("Segurança HTTP", () => {
  let app: INestApplication;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = criarPrismaMock();
    app = await criarApp(prisma);
  });
  afterEach(() => app.close());

  describe("rotas protegidas", () => {
    it("GET /dashboard/kpis sem token devolve 401", async () => {
      await request(app.getHttpServer()).get("/dashboard/kpis").expect(401);
    });

    it("PATCH /orders/:id/status sem token devolve 401 e não toca no banco", async () => {
      await request(app.getHttpServer()).patch("/orders/abc/status").expect(401);
      expect(prisma.order.findUnique).not.toHaveBeenCalled();
    });

    it("token assinado com outro segredo devolve 401", async () => {
      const falso = jwt.sign({ sub: "x", email: "x@x.com", role: "admin" }, "outro-segredo-qualquer-com-32-chars!!");
      await request(app.getHttpServer()).get("/dashboard/kpis").set("Authorization", `Bearer ${falso}`).expect(401);
    });

    it("token expirado devolve 401", async () => {
      const expirado = jwt.sign({ sub: "x", email: "x@x.com", role: "admin" }, JWT_SECRET_TESTE, { expiresIn: -10 });
      await request(app.getHttpServer()).get("/dashboard/kpis").set("Authorization", `Bearer ${expirado}`).expect(401);
    });

    it("token sem papel de admin devolve 401", async () => {
      const t = tokenAdmin(app, { role: "cliente" });
      await request(app.getHttpServer()).get("/dashboard/kpis").set("Authorization", `Bearer ${t}`).expect(401);
    });

    it("token com algoritmo 'none' devolve 401", async () => {
      const semAssinatura = jwt.sign({ sub: "x", email: "x@x.com", role: "admin" }, "", { algorithm: "none" });
      await request(app.getHttpServer()).get("/dashboard/kpis").set("Authorization", `Bearer ${semAssinatura}`).expect(401);
    });

    it("token de admin válido acessa o dashboard", async () => {
      await request(app.getHttpServer())
        .get("/dashboard/kpis")
        .set("Authorization", `Bearer ${tokenAdmin(app)}`)
        .expect(200)
        .expect((r) => expect(r.body).toEqual({ produtoMaisVendido: null, alertasEstoqueBaixo: [] }));
    });
  });

  describe("rotas públicas", () => {
    it("GET /products é público e não expõe o estoque exato", async () => {
      prisma.product.findMany.mockResolvedValue([
        { id: "p1", slug: "x", nome: "X", ativo: true, options: [], media: [], content: {}, variants: [
          { id: "v1", sku: "S1", attributes: { tamanho: "P" }, preco: "10.00", estoque: 7 },
          { id: "v2", sku: "S2", attributes: { tamanho: "M" }, preco: "10.00", estoque: 0 },
        ] },
      ]);
      const r = await request(app.getHttpServer()).get("/products").expect(200);
      expect(r.body[0].variants[0]).not.toHaveProperty("estoque");
      expect(r.body[0].variants.map((v: { disponivel: boolean }) => v.disponivel)).toEqual([true, false]);
    });

    it("GET /health responde ok", async () => {
      await request(app.getHttpServer()).get("/health").expect(200, { status: "ok" });
    });
  });

  describe("login", () => {
    it("credenciais corretas devolvem um token aceito nas rotas de admin", async () => {
      prisma.adminUser.findUnique.mockResolvedValue({
        id: "a1", email: "admin@loja.dev", senhaHash: await bcrypt.hash("senha-forte-123", 4),
      });
      const r = await request(app.getHttpServer())
        .post("/auth/login").send({ email: "Admin@Loja.dev ", senha: "senha-forte-123" }).expect(200);
      await request(app.getHttpServer())
        .get("/dashboard/kpis").set("Authorization", `Bearer ${r.body.accessToken}`).expect(200);
    });

    it("senha errada e e-mail inexistente devolvem a mesma resposta", async () => {
      prisma.adminUser.findUnique.mockResolvedValueOnce({
        id: "a1", email: "admin@loja.dev", senhaHash: await bcrypt.hash("senha-forte-123", 4),
      });
      const errada = await request(app.getHttpServer())
        .post("/auth/login").send({ email: "admin@loja.dev", senha: "errada" }).expect(401);
      prisma.adminUser.findUnique.mockResolvedValueOnce(null);
      const inexistente = await request(app.getHttpServer())
        .post("/auth/login").send({ email: "ninguem@loja.dev", senha: "errada" }).expect(401);
      expect(errada.body.message).toBe(inexistente.body.message);
    });

    it("bloqueia a 6ª tentativa de login no mesmo minuto (429)", async () => {
      prisma.adminUser.findUnique.mockResolvedValue(null);
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer()).post("/auth/login").send({ email: "a@a.com", senha: "x" }).expect(401);
      }
      await request(app.getHttpServer()).post("/auth/login").send({ email: "a@a.com", senha: "x" }).expect(429);
    });
  });

  describe("validação do pedido", () => {
    const pedido = (extra: object = {}) => ({
      clienteNome: "Ana", clienteEmail: "ana@exemplo.com",
      items: [{ variantId: "v1", quantidade: 1 }], ...extra,
    });

    it.each([
      ["campo extra (ex.: total enviado pelo cliente)", pedido({ total: 0.01 })],
      ["quantidade acima do limite", pedido({ items: [{ variantId: "v1", quantidade: 11 }] })],
      ["variante repetida", pedido({ items: [{ variantId: "v1", quantidade: 1 }, { variantId: "v1", quantidade: 1 }] })],
      ["itens demais", pedido({ items: Array.from({ length: 21 }, (_, i) => ({ variantId: `v${i}`, quantidade: 1 })) })],
      ["e-mail inválido", pedido({ clienteEmail: "nao-e-email" })],
      ["nome gigante", pedido({ clienteNome: "a".repeat(121) })],
    ])("rejeita %s com 400 sem tocar no banco", async (_nome, body) => {
      await request(app.getHttpServer()).post("/orders").send(body).expect(400);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("limita a criação de pedidos a 5 por minuto por IP (429)", async () => {
      prisma.$transaction.mockResolvedValue({ id: "o1" });
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer()).post("/orders").send(pedido()).expect(201);
      }
      await request(app.getHttpServer()).post("/orders").send(pedido()).expect(429);
    });
  });

  describe("cabeçalhos", () => {
    it("aplica helmet e esconde o x-powered-by", async () => {
      const r = await request(app.getHttpServer()).get("/health");
      expect(r.headers["x-content-type-options"]).toBe("nosniff");
      expect(r.headers["strict-transport-security"]).toBeDefined();
      expect(r.headers["x-powered-by"]).toBeUndefined();
    });

    it("CORS só libera origens configuradas", async () => {
      const ok = await request(app.getHttpServer()).get("/health").set("Origin", "http://localhost:3000");
      expect(ok.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
      const bloqueada = await request(app.getHttpServer()).get("/health").set("Origin", "https://site-malicioso.com");
      expect(bloqueada.headers["access-control-allow-origin"]).toBeUndefined();
    });
  });

  describe("erros do banco", () => {
    it("não vazam detalhes internos", async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('relation "secreta" does not exist'));
      const r = await request(app.getHttpServer()).get("/health").expect(503);
      expect(JSON.stringify(r.body)).not.toContain("secreta");
    });
  });
});
