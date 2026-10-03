import { validateEnv } from "../src/config/env.validation";

describe("validateEnv", () => {
  const base = { DATABASE_URL: "postgresql://x", JWT_SECRET: "x".repeat(32) };

  it("aceita configuração válida e aplica expiração padrão de 1h", () => {
    expect(validateEnv(base).JWT_EXPIRES_IN).toBe("1h");
  });

  it("recusa subir sem JWT_SECRET", () => {
    expect(() => validateEnv({ DATABASE_URL: "x" })).toThrow(/JWT_SECRET/);
  });

  it("recusa JWT_SECRET curto", () => {
    expect(() => validateEnv({ ...base, JWT_SECRET: "curto" })).toThrow(/32/);
  });

  it("recusa subir sem DATABASE_URL", () => {
    expect(() => validateEnv({ JWT_SECRET: "x".repeat(32) })).toThrow(/DATABASE_URL/);
  });

  describe("identidade da loja (STORE_*)", () => {
    it("é opcional: aplica nome padrão e deixa contatos vazios", () => {
      const env = validateEnv({ ...base, STORE_NAME: "", STORE_WHATSAPP: "", STORE_EMAIL: "" });
      expect(env.STORE_NAME).toBe("Loja");
      expect(env.STORE_WHATSAPP).toBeUndefined();
      expect(env.STORE_EMAIL).toBeUndefined();
    });

    it("aceita WhatsApp só com dígitos, DDI e DDD", () => {
      expect(validateEnv({ ...base, STORE_WHATSAPP: "5581999990000" }).STORE_WHATSAPP).toBe("5581999990000");
    });

    it.each(["+55 81 99999-0000", "(81) 99999-0000", "123"])("recusa WhatsApp mal formatado: %s", (v) => {
      expect(() => validateEnv({ ...base, STORE_WHATSAPP: v })).toThrow(/STORE_WHATSAPP/);
    });

    it("recusa e-mail inválido", () => {
      expect(() => validateEnv({ ...base, STORE_EMAIL: "nao-e-email" })).toThrow(/STORE_EMAIL/);
    });

    it("apara espaços do nome", () => {
      expect(validateEnv({ ...base, STORE_NAME: "  Loja X  " }).STORE_NAME).toBe("Loja X");
    });
  });
});
