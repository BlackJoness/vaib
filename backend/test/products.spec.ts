import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { attributesKey, descreverAtributos } from "../src/products/product-content.types";
import { criarApp, criarPrismaMock, PrismaMock } from "./helpers";

const OPTIONS = [
  { key: "escopo", label: "Escopo", values: [{ value: "casa", label: "Casa completa" }, { value: "ambiente", label: "Um ambiente" }] },
  { key: "entrega", label: "Entrega", values: [{ value: "express", label: "15 dias" }] },
];

const xpto = {
  id: "p1", slug: "xpto", nome: "XPTO", kind: "SERVICE", ativo: true, destaque: true,
  options: OPTIONS, media: [], content: { headline: "Oi" },
  variants: [
    { id: "v1", sku: "A", attributes: { escopo: "casa", entrega: "express" }, preco: "8400.00", estoque: null },
    { id: "v2", sku: "B", attributes: { escopo: "ambiente", entrega: "express" }, preco: "3600.00", estoque: 0 },
  ],
};

describe("produto genérico", () => {
  describe("GET /products/destaque", () => {
    let app: INestApplication;
    let prisma: PrismaMock;

    beforeEach(async () => {
      prisma = criarPrismaMock();
      app = await criarApp(prisma);
    });
    afterEach(() => app.close());

    it("devolve o produto da home com opções, conteúdo e variantes descritas", async () => {
      prisma.product.findFirst.mockResolvedValue(xpto);
      const r = await request(app.getHttpServer()).get("/products/destaque").expect(200);
      expect(r.body.slug).toBe("xpto");
      expect(r.body.options).toHaveLength(2);
      expect(r.body.content.headline).toBe("Oi");
      expect(r.body.variants[0].descricao).toBe("Casa completa · 15 dias");
      expect(prisma.product.findFirst.mock.calls[0][0].where).toEqual({ destaque: true, ativo: true });
    });

    it("serviço (estoque null) é sempre disponível; físico sem estoque não; o número nunca sai", async () => {
      prisma.product.findFirst.mockResolvedValue(xpto);
      const r = await request(app.getHttpServer()).get("/products/destaque").expect(200);
      expect(r.body.variants.map((v: { disponivel: boolean }) => v.disponivel)).toEqual([true, false]);
      expect(r.body.variants[0]).not.toHaveProperty("estoque");
    });

    it("sem produto em destaque responde 404", async () => {
      prisma.product.findFirst.mockResolvedValue(null);
      await request(app.getHttpServer()).get("/products/destaque").expect(404);
    });
  });

  describe("atributos", () => {
    it("a chave canônica ignora a ordem das chaves", () => {
      expect(attributesKey({ escopo: "casa", entrega: "express" })).toBe("entrega=express;escopo=casa");
      expect(attributesKey({ entrega: "express", escopo: "casa" })).toBe("entrega=express;escopo=casa");
    });

    it("a descrição segue a ordem das opções do produto e ignora atributos desconhecidos", () => {
      expect(descreverAtributos(OPTIONS, { entrega: "express", escopo: "casa", extra: "x" })).toBe(
        "Casa completa · 15 dias",
      );
      expect(descreverAtributos(OPTIONS, {})).toBe("");
    });
  });
});
