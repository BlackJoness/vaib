import type { Product } from "./types";

// Exibido quando a API está fora ou sem produto em destaque. Mesmo conteúdo
// do seed (backend/prisma/seed.ts), para a loja nunca renderizar vazia.
export const PRODUTO_FALLBACK: Product = {
  id: "fallback",
  slug: "xpto",
  nome: "XPTO",
  tagline: "Design e decoração sob medida, do briefing à entrega.",
  descricao:
    "Projeto de interiores completo para um ambiente ou para a casa inteira, com acompanhamento até a montagem.",
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
    subtitulo:
      "Projeto completo de interiores, do briefing ao último detalhe. Você escolhe o escopo e o prazo; a gente cuida do resto.",
    beneficios: [
      { titulo: "Projeto autoral", texto: "Nada de catálogo: cada ambiente nasce da sua rotina e do que você gosta." },
      { titulo: "Orçamento fechado", texto: "Preço definido antes de começar. Sem surpresa no fim." },
      { titulo: "Acompanhamento", texto: "Da compra à montagem, com alguém respondendo no WhatsApp." },
    ],
    passos: [
      { titulo: "Briefing", texto: "Uma conversa de 40 minutos sobre o espaço, a rotina e as referências." },
      { titulo: "Proposta", texto: "Plantas, paleta e moodboard em até 7 dias, com uma rodada de ajustes." },
      { titulo: "Execução", texto: "Lista de compras, fornecedores e acompanhamento da montagem." },
    ],
    faq: [
      { pergunta: "Atende fora da minha cidade?", resposta: "Sim. O projeto é remoto; a montagem conta com parceiros locais." },
      { pergunta: "Posso contratar só a consultoria?", resposta: "Pode. O escopo \"Um ambiente\" cobre uma consultoria completa." },
      { pergunta: "Como funciona o pagamento?", resposta: "Depois do pedido, a gente entra em contato para alinhar e fechar." },
    ],
    provaSocial: {
      numeros: [
        { valor: "120+", rotulo: "projetos entregues" },
        { valor: "4.9", rotulo: "avaliação média" },
        { valor: "15", rotulo: "dias no plano express" },
      ],
      depoimentos: [
        { texto: "Entregaram exatamente o que eu não sabia descrever.", autor: "Marina, Recife" },
        { texto: "Prazo cumprido e zero dor de cabeça com fornecedor.", autor: "Caio, São Paulo" },
      ],
    },
  },
  variants: [
    { id: "f1", sku: "XPTO-AMBIENTE-PADRAO", attributes: { escopo: "ambiente", entrega: "padrao" }, descricao: "Um ambiente · 30 dias", disponivel: true, preco: "2900.00" },
    { id: "f2", sku: "XPTO-AMBIENTE-EXPRESS", attributes: { escopo: "ambiente", entrega: "express" }, descricao: "Um ambiente · 15 dias", disponivel: true, preco: "3600.00" },
    { id: "f3", sku: "XPTO-CASA-PADRAO", attributes: { escopo: "casa", entrega: "padrao" }, descricao: "Casa completa · 30 dias", disponivel: true, preco: "6900.00" },
    { id: "f4", sku: "XPTO-CASA-EXPRESS", attributes: { escopo: "casa", entrega: "express" }, descricao: "Casa completa · 15 dias", disponivel: true, preco: "8400.00" },
  ],
};
