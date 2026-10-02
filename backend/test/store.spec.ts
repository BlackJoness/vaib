import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import request from "supertest";
import { StoreService } from "../src/store/store.service";
import { criarApp, criarPrismaMock } from "./helpers";

describe("identidade da loja", () => {
  describe("GET /store (HTTP)", () => {
    let app: INestApplication;

    beforeEach(async () => {
      app = await criarApp(criarPrismaMock());
    });
    afterEach(() => app.close());

    it("é público: responde 200 sem token", async () => {
      // setup-env.ts não define STORE_*: vale o nome padrão e contatos nulos.
      await request(app.getHttpServer()).get("/store").expect(200, { nome: "Loja", whatsapp: null, email: null });
    });

    it("devolve só os três campos e nenhum segredo do ambiente", async () => {
      const r = await request(app.getHttpServer()).get("/store").expect(200);
      expect(Object.keys(r.body).sort()).toEqual(["email", "nome", "whatsapp"]);
      expect(JSON.stringify(r.body)).not.toMatch(/JWT|DATABASE|postgresql|segredo/i);
    });
  });

  describe("StoreService", () => {
    // ConfigService simulado: o ambiente real é validado no import do AppModule,
    // então os valores de STORE_* se testam aqui, isolados.
    const servico = (env: Record<string, string | undefined>) =>
      new StoreService({
        get: (k: string) => env[k],
        getOrThrow: (k: string) => {
          if (env[k] === undefined) throw new Error(k);
          return env[k];
        },
      } as unknown as ConfigService);

    it("expõe nome, whatsapp e e-mail do ambiente", () => {
      expect(
        servico({ STORE_NAME: "Minha Loja", STORE_WHATSAPP: "5581999990000", STORE_EMAIL: "oi@loja.dev" }).info(),
      ).toEqual({ nome: "Minha Loja", whatsapp: "5581999990000", email: "oi@loja.dev" });
    });

    it("contatos ausentes saem como null, nunca como undefined (JSON estável)", () => {
      expect(servico({ STORE_NAME: "X" }).info()).toEqual({ nome: "X", whatsapp: null, email: null });
    });
  });
});
