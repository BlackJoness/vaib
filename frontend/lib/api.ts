import type { Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Busca produtos na API NestJS.
 * `revalidate` mantém SSR com cache leve (ISR). Em caso de falha de rede,
 * retorna [] para a página renderizar sem quebrar (degradação graciosa).
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return (await res.json()) as Product[];
  } catch {
    return [];
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Product;
  } catch {
    return null;
  }
}

// Finaliza o pedido na API (status inicial: "Aguardando Pagamento").
export type CreateOrderPayload = {
  clienteNome: string;
  clienteEmail: string;
  items: { variantId: string; quantidade: number }[];
};

export async function createOrder(payload: CreateOrderPayload) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Falha ao criar pedido");
  }
  return res.json();
}
