import type { StoreConfig } from "@/lib/store-config.schema";

/**
 * Identidade da loja. Único lugar com nome de marca, contatos, cor de acento
 * e textos fixos (nav, rodapé, avisos, newsletter).
 *
 * Trocar de marca é editar este arquivo. Nenhum componente deve ter nome de
 * marca ou cor fixa: o CI falha se "Solê" voltar a aparecer em app/, components/
 * ou lib/ (script `check:brand`).
 *
 * O que é do PRODUTO (nome, preço, opções, mídia, textos de venda) não mora
 * aqui: vem da API e é editado no dashboard.
 */
export const storeConfig = {
  brand: {
    name: "Solê",
    tagline: "Vista o seu dia de leveza.",
  },
  seo: {
    title: "Solê — Vista o seu dia de leveza",
    description: "Scrubs leves e alegres.",
    locale: "pt-BR",
  },
  contact: {
    // whatsapp: "5581999990000",
    // email: "contato@exemplo.com",
    // instagram: "exemplo",
  },
  theme: {
    accent: "#FF7E67",
    accentStrong: "#F2654D",
  },
  announcements: [
    "Frete grátis acima de R$ 279",
    "5% off no Pix",
    "Até 4x sem juros",
    "10% na primeira compra: BEMVINDO",
  ],
  nav: [
    { label: "Feminino", href: "/feminino" },
    { label: "Masculino", href: "/masculino" },
    { label: "Jalecos", href: "/jalecos" },
    { label: "Kits", href: "/kits" },
    { label: "Sobre", href: "/sobre" },
  ],
  footer: {
    columns: [
      {
        title: "Ajuda",
        links: [
          { label: "Trocas e devoluções", href: "#" },
          { label: "Entrega e frete", href: "#" },
          { label: "Guia de tamanhos", href: "#" },
          { label: "Fale conosco", href: "#" },
        ],
      },
      {
        title: "Institucional",
        links: [
          { label: "Sobre a marca", href: "#" },
          { label: "Sustentabilidade", href: "#" },
          { label: "Trabalhe conosco", href: "#" },
          { label: "Lojas", href: "#" },
        ],
      },
      {
        title: "Minha conta",
        links: [
          { label: "Entrar", href: "#" },
          { label: "Meus pedidos", href: "#" },
          { label: "Favoritos", href: "#" },
        ],
      },
    ],
    payments: ["Visa", "Master", "Elo", "Amex", "Pix"],
  },
  newsletter: {
    title: "Entre para o clube",
    subtitle: "Receba lançamentos e 10% na primeira compra.",
    cta: "Quero entrar",
    success: "Pronto! Você está dentro.",
  },
} satisfies StoreConfig;
