// Cliente da API do dashboard.
//
// Decisão: o token fica em sessionStorage, não em localStorage.
// Some ao fechar a aba e expira em 1h no servidor. É um painel interno
// sem conteúdo de terceiros, o que reduz o risco de XSS que roubaria o token.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const CHAVE_TOKEN = "vaib.admin.token";

export class NaoAutorizadoError extends Error {}

export const sessao = {
  token: () => sessionStorage.getItem(CHAVE_TOKEN),
  salvar: (token: string) => sessionStorage.setItem(CHAVE_TOKEN, token),
  limpar: () => sessionStorage.removeItem(CHAVE_TOKEN),
};

export async function login(email: string, senha: string): Promise<void> {
  const r = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (r.status === 401) throw new NaoAutorizadoError("E-mail ou senha incorretos.");
  if (r.status === 429) throw new Error("Muitas tentativas. Aguarde um minuto.");
  if (!r.ok) throw new Error("Não foi possível entrar agora.");
  const { accessToken } = (await r.json()) as { accessToken: string };
  sessao.salvar(accessToken);
}

// GET autenticado. 401 limpa a sessão para o app voltar ao login.
export async function apiGet<T>(caminho: string): Promise<T> {
  const r = await fetch(`${API_URL}${caminho}`, {
    headers: { Authorization: `Bearer ${sessao.token() ?? ""}` },
  });
  if (r.status === 401) {
    sessao.limpar();
    throw new NaoAutorizadoError("Sessão expirada.");
  }
  if (!r.ok) throw new Error(`Falha ${r.status}`);
  return (await r.json()) as T;
}

// Identidade da loja (nome e contatos). Rota pública: usada no cabeçalho
// antes mesmo do login. Em falha, o painel mostra só "Dashboard".
export interface LojaInfo {
  nome: string;
  whatsapp: string | null;
  email: string | null;
}

export async function getLoja(): Promise<LojaInfo | null> {
  try {
    const r = await fetch(`${API_URL}/store`);
    if (!r.ok) return null;
    return (await r.json()) as LojaInfo;
  } catch {
    return null;
  }
}
