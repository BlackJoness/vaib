// Valida as variáveis de ambiente na subida da API.
// Falhar no boot é melhor que subir com segredo fraco ou ausente.
type Env = Record<string, unknown>;

const MIN_JWT_SECRET = 32;

export function validateEnv(config: Env): Env {
  const erros: string[] = [];

  if (!config.DATABASE_URL) erros.push("DATABASE_URL é obrigatória");

  const secret = config.JWT_SECRET;
  if (typeof secret !== "string" || secret.length < MIN_JWT_SECRET) {
    erros.push(`JWT_SECRET é obrigatória e precisa ter ao menos ${MIN_JWT_SECRET} caracteres`);
  }

  if (erros.length > 0) {
    throw new Error(`Configuração inválida:\n- ${erros.join("\n- ")}`);
  }

  return {
    ...config,
    JWT_EXPIRES_IN: config.JWT_EXPIRES_IN ?? "1h",
  };
}
