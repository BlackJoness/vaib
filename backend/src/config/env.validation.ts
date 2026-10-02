// Valida as variáveis de ambiente na subida da API.
// Falhar no boot é melhor que subir com segredo fraco ou ausente.
type Env = Record<string, unknown>;

const MIN_JWT_SECRET = 32;

// Identidade da loja do lado da API. Opcional: a API sobe sem ela, com um nome
// genérico. O que a loja (Next) exibe vem do store.config.ts dela, não daqui.
export const STORE_NAME_PADRAO = "Loja";
const WHATSAPP = /^\d{10,15}$/; // só dígitos, com DDI e DDD: 5581999990000
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEnv(config: Env): Env {
  const erros: string[] = [];

  if (!config.DATABASE_URL) erros.push("DATABASE_URL é obrigatória");

  const secret = config.JWT_SECRET;
  if (typeof secret !== "string" || secret.length < MIN_JWT_SECRET) {
    erros.push(`JWT_SECRET é obrigatória e precisa ter ao menos ${MIN_JWT_SECRET} caracteres`);
  }

  const whatsapp = config.STORE_WHATSAPP;
  if (whatsapp !== undefined && whatsapp !== "" && !WHATSAPP.test(String(whatsapp))) {
    erros.push("STORE_WHATSAPP precisa ter só dígitos, com DDI e DDD (ex.: 5581999990000)");
  }

  const email = config.STORE_EMAIL;
  if (email !== undefined && email !== "" && !EMAIL.test(String(email))) {
    erros.push("STORE_EMAIL precisa ser um e-mail válido");
  }

  if (erros.length > 0) {
    throw new Error(`Configuração inválida:\n- ${erros.join("\n- ")}`);
  }

  const nome = typeof config.STORE_NAME === "string" ? config.STORE_NAME.trim() : "";

  return {
    ...config,
    JWT_EXPIRES_IN: config.JWT_EXPIRES_IN ?? "1h",
    STORE_NAME: nome || STORE_NAME_PADRAO,
    STORE_WHATSAPP: whatsapp || undefined,
    STORE_EMAIL: email || undefined,
  };
}
