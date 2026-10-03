import type { Product } from "./types";

// Exibido quando a API está fora ou sem produto em destaque. Mesma forma do
// seed (backend/prisma/seed.ts), para a loja nunca renderizar vazia.
export const PRODUTO_FALLBACK: Product = {
  id: "fallback",
  slug: "xpto",
  nome: "XPTO",
  tagline: "Design e decoração sob medida, do briefing à entrega.",
  descricao: "Projeto de interiores completo para um ambiente ou para a casa inteira.",
  kind: "SERVICE",
  precoBase: "2900.00",
  destaque: true,
  options: [
    { key: "escopo", label: "Escopo", values: [{ value: "ambiente", label: "Um ambiente" }, { value: "casa", label: "Casa completa" }] },
    { key: "entrega", label: "Entrega", values: [{ value: "padrao", label: "30 dias" }, { value: "express", label: "15 dias" }] },
  ],
  media: [],
  content: {
    headline: "Um espaço com a sua cara",
    enfase: "sua cara",
    subtitulo: "Projeto completo de interiores, do briefing ao último detalhe.",
  },
  variants: [
    { id: "f1", sku: "XPTO-AMBIENTE-PADRAO", attributes: { escopo: "ambiente", entrega: "padrao" }, descricao: "Um ambiente · 30 dias", disponivel: true, preco: "2900.00" },
    { id: "f2", sku: "XPTO-AMBIENTE-EXPRESS", attributes: { escopo: "ambiente", entrega: "express" }, descricao: "Um ambiente · 15 dias", disponivel: true, preco: "3600.00" },
    { id: "f3", sku: "XPTO-CASA-PADRAO", attributes: { escopo: "casa", entrega: "padrao" }, descricao: "Casa completa · 30 dias", disponivel: true, preco: "6900.00" },
    { id: "f4", sku: "XPTO-CASA-EXPRESS", attributes: { escopo: "casa", entrega: "express" }, descricao: "Casa completa · 15 dias", disponivel: true, preco: "8400.00" },
  ],
};
