import { API_URL } from "./api";
import { formatBRL } from "./format";

/** Campos do formulário que a API valida. */
export type Campo = "nome" | "email" | "whatsapp" | "mensagem";

export type DadosCliente = {
  nome: string;
  email: string;
  whatsapp: string;
  mensagem: string;
  quantidade: number;
};

export type PedidoCriado = {
  id: string;
  numero: number;
  total: string;
  items: Array<{ descricao: string; quantidade: number }>;
};

export type FalhaPedido = {
  tipo: "validacao" | "indisponivel" | "esgotado" | "limite" | "rede" | "desconhecido";
  mensagem: string;
  campos?: Partial<Record<Campo, string>>;
};

export type ResultadoPedido = { ok: true; pedido: PedidoCriado } | { ok: false; falha: FalhaPedido };

// Nome do campo na API → campo do formulário e a mensagem que o cliente lê.
const CAMPOS_API: Record<string, { campo: Campo; mensagem: string }> = {
  clienteNome: { campo: "nome", mensagem: "Informe seu nome (de 2 a 120 caracteres)." },
  clienteEmail: { campo: "email", mensagem: "Informe um e-mail válido." },
  clienteWhatsapp: { campo: "whatsapp", mensagem: "Informe o WhatsApp com DDD, ex.: 81 99999-0000." },
  clienteMensagem: { campo: "mensagem", mensagem: "A mensagem pode ter até 500 caracteres." },
};

/**
 * WhatsApp como a API espera: só dígitos, com DDI. Quem digita um número
 * brasileiro sem o 55 (10 ou 11 dígitos, DDD + número) ganha o 55.
 */
export function normalizarWhatsApp(valor: string): string {
  const digitos = valor.replace(/\D/g, "");
  return digitos.length === 10 || digitos.length === 11 ? `55${digitos}` : digitos;
}

/** Mesmas regras da API, para o cliente saber do erro antes de enviar. */
export function validar(dados: DadosCliente, whatsappObrigatorio: boolean): Partial<Record<Campo, string>> {
  const erros: Partial<Record<Campo, string>> = {};
  const nome = dados.nome.trim();
  if (nome.length < 2 || nome.length > 120) erros.nome = CAMPOS_API.clienteNome.mensagem;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email.trim())) erros.email = CAMPOS_API.clienteEmail.mensagem;
  const zap = normalizarWhatsApp(dados.whatsapp);
  if ((whatsappObrigatorio || zap.length > 0) && !/^\d{10,15}$/.test(zap)) erros.whatsapp = CAMPOS_API.clienteWhatsapp.mensagem;
  if (dados.mensagem.length > 500) erros.mensagem = CAMPOS_API.clienteMensagem.mensagem;
  return erros;
}

/** Traduz a resposta de erro da API (formato do Nest) para algo que o cliente entenda. */
export function traduzirErro(status: number, corpo: unknown): FalhaPedido {
  const bruto = (corpo as { message?: string | string[] } | null)?.message;
  const mensagens = Array.isArray(bruto) ? bruto : bruto ? [bruto] : [];

  if (status === 429) {
    return { tipo: "limite", mensagem: "Muitas tentativas seguidas. Espere um minuto e envie de novo." };
  }
  if (status === 409) {
    return { tipo: "esgotado", mensagem: "Essa combinação acabou de esgotar. Escolha outra opção." };
  }
  if (status === 404) {
    return { tipo: "indisponivel", mensagem: "Essa opção não está mais disponível. Recarregue a página e escolha de novo." };
  }
  if (status === 400) {
    const campos: Partial<Record<Campo, string>> = {};
    for (const m of mensagens) {
      const chave = Object.keys(CAMPOS_API).find((k) => m.startsWith(k));
      if (chave) campos[CAMPOS_API[chave].campo] = CAMPOS_API[chave].mensagem;
    }
    if (Object.keys(campos).length > 0) {
      return { tipo: "validacao", mensagem: "Confira os campos marcados.", campos };
    }
  }
  return { tipo: "desconhecido", mensagem: "Não foi possível registrar o pedido. Tente de novo em instantes." };
}

/**
 * Cria o pedido chamando a API direto do navegador. Não passa pelo servidor
 * da loja de propósito: o limite de pedidos por IP precisa ver o IP de quem
 * compra, não o da Vercel (ADR 0005).
 */
export async function criarPedido(variantId: string, dados: DadosCliente): Promise<ResultadoPedido> {
  const zap = normalizarWhatsApp(dados.whatsapp);
  const corpo = {
    clienteNome: dados.nome.trim(),
    clienteEmail: dados.email.trim(),
    ...(zap ? { clienteWhatsapp: zap } : {}),
    ...(dados.mensagem.trim() ? { clienteMensagem: dados.mensagem.trim() } : {}),
    items: [{ variantId, quantidade: dados.quantidade }],
  };

  let res: Response;
  try {
    res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
  } catch {
    return { ok: false, falha: { tipo: "rede", mensagem: "Sem conexão com a loja agora." } };
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) return { ok: false, falha: traduzirErro(res.status, json) };
  return { ok: true, pedido: json as PedidoCriado };
}

/** Mensagem para o lojista depois do pedido, com o número para ele achar no dashboard. */
export function linkAvisoPedido(numeroLoja: string, pedido: PedidoCriado): string {
  const itens = pedido.items.map((i) => (i.quantidade > 1 ? `${i.quantidade}x ${i.descricao}` : i.descricao)).join(", ");
  const msg = `Olá! Acabei de fazer o pedido #${pedido.numero}: ${itens} (${formatBRL(pedido.total)}).`;
  return `https://wa.me/${numeroLoja}?text=${encodeURIComponent(msg)}`;
}
