import type { Product } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Chamadas à API NestJS com cache leve (ISR, 60 s). Em falha de rede ou
 * resposta não-2xx, devolve null para a página renderizar com o fallback
 * em vez de quebrar (degradação graciosa).
 */
async function buscar<T>(caminho: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${caminho}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** O produto da home (loja de um produto só). */
export function getProdutoDestaque() {
  return buscar<Product>("/products/destaque");
}

export function getProducts(): Promise<Product[]> {
  return buscar<Product[]>("/products").then((r) => r ?? []);
}

export function getProductBySlug(slug: string) {
  return buscar<Product>(`/products/${slug}`);
}
