/**
 * Contrato da configuração de marca (store.config.ts).
 *
 * A forma é garantida pelo TypeScript (`satisfies StoreConfig` no config).
 * O que o tipo não expressa (formato de cor, WhatsApp, e-mail, limites de
 * tamanho) é checado em `validateStoreConfig`, chamada no layout raiz, no
 * servidor. Como o Next renderiza o layout no `next build`, uma configuração
 * inválida derruba o build com a mensagem do campo errado, em vez de subir
 * uma loja com título vazio ou cor que o CSS ignora.
 *
 * Sem biblioteca de schema de propósito: é um objeto estático, e um validador
 * de 40 linhas evita uma dependência no caminho do cliente.
 */

export interface StoreLink {
  label: string;
  href: string;
}

export interface StoreConfig {
  brand: {
    /** Nome exibido na nav, no rodapé e no título das páginas. */
    name: string;
    tagline: string;
  };
  seo: {
    title: string;
    description: string;
    /** Formato xx-YY, ex.: pt-BR. */
    locale: string;
  };
  contact: {
    /** Só dígitos, com DDI e DDD: 5581999990000. Vira link wa.me na etapa de compra. */
    whatsapp?: string;
    email?: string;
    /** Usuário sem @. */
    instagram?: string;
  };
  theme: {
    /** Acento no tema claro. Hex de 6 dígitos, ex.: #C98A5E. */
    accent: string;
    /** Variação para hover/pressionado no tema claro. */
    accentStrong: string;
    /** Acento no tema escuro (costuma ser mais claro, para manter contraste). */
    accentDark: string;
    accentDarkStrong: string;
    /** Tema na primeira visita. "system" segue o sistema operacional. */
    defaultMode: "light" | "dark" | "system";
  };
  /** Avisos da barra do topo. Vazio esconde a barra. */
  announcements: string[];
  nav: StoreLink[];
  footer: {
    columns: Array<{ title: string; links: StoreLink[] }>;
    payments: string[];
  };
  newsletter: {
    title: string;
    subtitle: string;
    cta: string;
    success: string;
  };
}

const HEX = /^#[0-9a-fA-F]{6}$/;
const WHATSAPP = /^\d{10,15}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INSTAGRAM = /^[A-Za-z0-9._]{1,30}$/;
const LOCALE = /^[a-z]{2}-[A-Z]{2}$/;

export function validateStoreConfig(c: StoreConfig): StoreConfig {
  const erros: string[] = [];
  const texto = (campo: string, valor: string, max: number) => {
    if (valor.trim().length === 0) erros.push(`${campo}: não pode ficar vazio`);
    else if (valor.length > max) erros.push(`${campo}: no máximo ${max} caracteres`);
  };

  texto("brand.name", c.brand.name, 40);
  texto("brand.tagline", c.brand.tagline, 120);
  texto("seo.title", c.seo.title, 70);
  texto("seo.description", c.seo.description, 160);
  if (!LOCALE.test(c.seo.locale)) erros.push("seo.locale: formato xx-YY, ex.: pt-BR");

  if (c.contact.whatsapp !== undefined && !WHATSAPP.test(c.contact.whatsapp)) {
    erros.push("contact.whatsapp: só dígitos, com DDI e DDD, ex.: 5581999990000");
  }
  if (c.contact.email !== undefined && !EMAIL.test(c.contact.email)) {
    erros.push("contact.email: e-mail inválido");
  }
  if (c.contact.instagram !== undefined && !INSTAGRAM.test(c.contact.instagram)) {
    erros.push("contact.instagram: usuário sem @, até 30 caracteres");
  }

  for (const campo of ["accent", "accentStrong", "accentDark", "accentDarkStrong"] as const) {
    if (!HEX.test(c.theme[campo])) erros.push(`theme.${campo}: cor em hex de 6 dígitos, ex.: #C98A5E`);
  }
  if (!["light", "dark", "system"].includes(c.theme.defaultMode)) {
    erros.push('theme.defaultMode: "light", "dark" ou "system"');
  }

  if (c.announcements.length > 6) erros.push("announcements: no máximo 6 avisos");
  if (c.nav.length > 8) erros.push("nav: no máximo 8 links");
  if (c.footer.columns.length > 4) erros.push("footer.columns: no máximo 4 colunas");
  c.footer.columns.forEach((col, i) => {
    if (col.links.length === 0) erros.push(`footer.columns[${i}]: precisa de ao menos 1 link`);
  });

  if (erros.length > 0) {
    throw new Error(`store.config.ts inválido:\n${erros.map((e) => `  - ${e}`).join("\n")}`);
  }
  return c;
}
