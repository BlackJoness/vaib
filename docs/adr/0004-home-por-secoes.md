# ADR 0004: Home montada por seções a partir do conteúdo do produto

**Data:** 05/10/2026 · **Status:** aceito · **Etapa:** 4 do pivô (CAR-7)

## Contexto

Depois da etapa 2, o texto de venda mora em `Product.content` (headline, ênfase, benefícios, passos, FAQ, prova social). A home ainda tinha seções fixas da loja de roupa (hero com vídeo, régua de frete, editorial do tecido, manifesto) e uma oferta básica sem visual.

## Decisão

| O quê | Como |
|---|---|
| Seções | `components/sections/`: Hero, Showcase, Beneficios, ComoFunciona, Oferta, ProvaSocial, Faq, CtaFinal (e Newsletter). Todas recebem `{ produto }` e retornam `null` se o conteúdo delas faltar |
| Ordem | `storeConfig.sections` (validada no build: sem repetição, só chaves conhecidas). `lib/sections.ts` mapeia chave → componente; `app/page.tsx` só percorre a lista |
| Nav | Pill de vidro flutuante (`sticky`), itens numerados apontando para âncoras das seções, toggle de tema e atalho para a oferta. Menu próprio no celular |
| Hero | Headline com `content.enfase` em serifa itálica, subtítulo, dois CTAs e pills da primeira opção do produto. Mídia: `VidroProduto`, composição em CSS (formas nítidas + bloco de vidro) com tilt; usa a foto de `Product.media` quando existir |
| Pills → oferta | Evento `vaib:escolher` no `window`: o hero continua componente de servidor e a oferta (cliente) escuta e pré-seleciona |
| Oferta | Estado da seleção sobe para a seção; `OptionSelector` virou controlado (rádios). Preço da combinação com `aria-live`. CTA abre `wa.me` com o pedido escrito se houver WhatsApp no config; senão leva ao `#contato` |
| Fallback | `PRODUTO_FALLBACK` com o conteúdo completo do seed, para a loja nunca ficar vazia com a API fora |

### Orçamento de desfoque
Na primeira dobra: nav (`glass-2`), bloco do produto (`glass-3`) e selo de preço (`glass-1`). O restante usa `glass-flat` ou só entra em cena depois que o hero sai da tela.

## Removidos
`Hero`, `Benefits`, `Editorial`, `Manifesto`, `OfertaBasica`, `Reveal` (substituído por `RevealRow`) e `lib/motion.ts`.

## Consequências
- Trocar de produto ou de nicho é editar o conteúdo no banco (e, na etapa 6, no dashboard); reordenar ou esconder seções é editar uma lista no config.
- A marca (`brand`, `seo`, `newsletter` no `store.config.ts`) ainda é a da Solê. Fica para quando o nome novo for definido.
- O botão de compra ainda não cria pedido; isso é a etapa 5.
