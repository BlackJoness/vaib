// Contrato público da API (GET /products/destaque, GET /products/:slug).
// Os tipos dos campos JSON são os mesmos da API: backend/src/products/product-content.types.ts.

export type ProductKind = "PHYSICAL" | "SERVICE";

export interface ProductOptionValue {
  value: string;
  label: string;
  meta?: Record<string, string>;
}

export interface ProductOption {
  key: string;
  label: string;
  values: ProductOptionValue[];
}

export interface ProductMedia {
  url: string;
  alt: string;
  kind: "image" | "video";
}

export interface ProductContent {
  headline: string;
  enfase?: string;
  subtitulo: string;
  beneficios: Array<{ titulo: string; texto: string }>;
  passos: Array<{ titulo: string; texto: string }>;
  faq: Array<{ pergunta: string; resposta: string }>;
  provaSocial: {
    numeros: Array<{ valor: string; rotulo: string }>;
    depoimentos: Array<{ texto: string; autor: string }>;
  };
}

export type VariantAttributes = Record<string, string>;

export interface Variant {
  id: string;
  sku: string;
  attributes: VariantAttributes;
  descricao: string; // "Casa completa · 15 dias", já montada pela API
  disponivel: boolean; // a API não expõe o estoque exato; serviço é sempre disponível
  preco: string; // Prisma Decimal serializa como string
}

export interface Product {
  id: string;
  slug: string;
  nome: string;
  tagline: string | null;
  descricao: string | null;
  kind: ProductKind;
  precoBase: string;
  destaque: boolean;
  options: ProductOption[];
  media: ProductMedia[];
  content: Partial<ProductContent>;
  variants: Variant[];
}
