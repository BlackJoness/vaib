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
    // Cobre: quente no claro, mais luminoso no escuro (contraste AA sobre o fundo).
    accent: "#C98A5E",
    accentStrong: "#A86D44",
    accentDark: "#E0A072",
    accentDarkStrong: "#EDB48A",
    defaultMode: "system",
  },
  // A home é uma landing de um produto: a nav e o rodapé apontam para as seções.
  sections: ["hero", "showcase", "beneficios", "comoFunciona", "oferta", "provaSocial", "faq", "ctaFinal"],
  announcements: ["Orçamento fechado antes de começar", "Atendimento 100% remoto", "Plano express em 15 dias"],
  nav: [
    { label: "Projeto", href: "#showcase" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Oferta", href: "#oferta" },
    { label: "Dúvidas", href: "#faq" },
  ],
  footer: {
    columns: [
      {
        title: "Nesta página",
        links: [
          { label: "O projeto", href: "#showcase" },
          { label: "Como funciona", href: "#como-funciona" },
          { label: "Oferta", href: "#oferta" },
        ],
      },
      {
        title: "Ajuda",
        links: [
          { label: "Dúvidas frequentes", href: "#faq" },
          { label: "Fale conosco", href: "#contato" },
        ],
      },
    ],
    payments: ["Pix", "Cartão", "Boleto"],
  },
  newsletter: {
    title: "Entre para o clube",
    subtitle: "Receba lançamentos e 10% na primeira compra.",
    cta: "Quero entrar",
    success: "Pronto! Você está dentro.",
  },
} satisfies StoreConfig;
