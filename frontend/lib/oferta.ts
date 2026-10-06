import type { Product, Variant, VariantAttributes } from "./types";
import { formatBRL } from "./format";

/** Evento que o hero dispara para pré-selecionar uma opção na oferta. */
export const EVENTO_ESCOLHER = "vaib:escolher";
export type Escolha = { key: string; value: string };

/** Primeira combinação: o primeiro valor de cada opção. */
export function selecaoInicial(produto: Product): VariantAttributes {
  return Object.fromEntries(produto.options.map((o) => [o.key, o.values[0]?.value ?? ""]));
}

/** A variante que casa com todos os atributos escolhidos, ou null. */
export function varianteDe(produto: Product, sel: VariantAttributes): Variant | null {
  return produto.variants.find((v) => produto.options.every((o) => v.attributes[o.key] === sel[o.key])) ?? null;
}

/** Menor preço entre as variantes disponíveis ("a partir de"). */
export function precoMinimo(produto: Product): number {
  const precos = produto.variants.filter((v) => v.disponivel).map((v) => Number(v.preco));
  return precos.length ? Math.min(...precos) : Number(produto.precoBase);
}

/**
 * Link wa.me com a mensagem pronta. O pedido de verdade entra na etapa 5;
 * até lá o fechamento é pelo WhatsApp (ADR 0001).
 */
export function linkWhatsApp(numero: string, produto: Product, variante: Variant): string {
  const msg = `Olá! Tenho interesse em ${produto.nome} (${variante.descricao}, ${formatBRL(variante.preco)}).`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
}
