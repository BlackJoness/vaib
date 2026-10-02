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
});
