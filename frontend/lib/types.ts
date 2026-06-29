export type Tamanho = "P" | "M" | "G" | "GG";

export interface Variant {
  id: string;
  sku: string;
  cor: string;
  corHex: string;
  tamanho: Tamanho;
  estoque: number;
  preco: string; // Prisma Decimal serializa como string
}

export interface Product {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  precoBase: string;
  variants: Variant[];
}
