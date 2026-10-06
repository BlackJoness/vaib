// Formato dos campos JSON do produto. A loja importa estes mesmos tipos
// (frontend/lib/types.ts reexporta), então API e loja falam o mesmo contrato.
// Validação na escrita entra com os DTOs do dashboard (etapa 6).

/** Um valor selecionável de uma opção. `meta` guarda extras de exibição (ex.: hex de cor). */
export interface ProductOptionValue {
  value: string; // chave estável: "casa"
  label: string; // exibido: "Casa completa"
  meta?: Record<string, string>;
}

/** Um seletor que a loja renderiza: "Escopo" com seus valores. */
export interface ProductOption {
  key: string; // "escopo"; a mesma chave aparece em Variant.attributes
  label: string;
  values: ProductOptionValue[];
}

export interface ProductMedia {
  url: string;
  alt: string;
  kind: "image" | "video";
}

export interface ProductContent {
  /** Headline do hero; `enfase` é a palavra ou trecho destacado em serifa itálica. */
  headline: string;
  enfase?: string;
  subtitulo: string;
  beneficios: Array<{ titulo: string; texto: string }>;
  /** Para serviço, "como funciona"; para físico, especificações. */
  passos: Array<{ titulo: string; texto: string }>;
  faq: Array<{ pergunta: string; resposta: string }>;
  provaSocial: {
    numeros: Array<{ valor: string; rotulo: string }>;
    depoimentos: Array<{ texto: string; autor: string }>;
  };
}

/** Combinação de opções de uma variante: { escopo: "casa", entrega: "express" } */
export type VariantAttributes = Record<string, string>;

/**
 * Forma canônica dos atributos, usada na unicidade (Variant.attributesKey).
 * Chaves ordenadas para que { a, b } e { b, a } sejam a mesma variante.
 */
export function attributesKey(attributes: VariantAttributes): string {
  return Object.keys(attributes)
    .sort()
    .map((k) => `${k}=${attributes[k]}`)
    .join(";");
}

/** "Casa completa · Express": rótulos dos atributos na ordem das opções do produto. */
export function descreverAtributos(options: ProductOption[], attributes: VariantAttributes): string {
  return options
    .map((o) => o.values.find((v) => v.value === attributes[o.key])?.label)
    .filter((l): l is string => Boolean(l))
    .join(" · ");
}
