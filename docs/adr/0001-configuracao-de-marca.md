# ADR 0001: Onde mora a identidade da marca

**Data:** 02/10/2026 · **Status:** aceito · **Etapa:** 1 do pivô (CAR-7)

## Contexto

O vaib nasceu como loja de scrubs da marca Solê. O nome da marca estava fixo em 13 arquivos da loja, do dashboard e da API. O projeto vai virar uma loja de um produto só, em que a troca de nicho acontece por configuração, não por reescrita. A primeira coisa a tirar do código é a marca.

## Decisão

Três lugares, cada um com um papel:

| Onde | O quê | Quem edita |
|---|---|---|
| `frontend/store.config.ts` | nome, tagline, SEO, contatos, cor de acento, nav, rodapé, avisos, newsletter | desenvolvedor, por PR |
| `backend` (`STORE_NAME`, `STORE_WHATSAPP`, `STORE_EMAIL`) | o mínimo que a API precisa para o link `wa.me` e os e-mails | operação, no painel do Render |
| `GET /store` (público) | expõe os três valores acima | o dashboard lê daqui; não tem config própria |

O que é do **produto** (nome, preço, opções, mídia, textos de venda) não entra em nenhum deles: mora no banco e é editado no dashboard (etapas 2 e 6).

### Garantias

- A forma de `store.config.ts` é garantida pelo TypeScript (`satisfies StoreConfig`). Formatos que o tipo não expressa (cor em hex, WhatsApp, e-mail, locale, limites de tamanho) são checados por `validateStoreConfig` no layout raiz. Como o Next renderiza o layout no `next build`, configuração inválida derruba o build com a mensagem do campo errado, não a loja em produção.
- A validação é um validador próprio de ~40 linhas, sem biblioteca de schema: é um objeto estático, e isso evita uma dependência no caminho do cliente. Componentes de cliente importam só o objeto e o tipo (`import type`).
- A cor de acento vira CSS variables no `<html>` (`--accent`, `--accent-strong`) em canais RGB, para que `bg-coral/12` siga funcionando no Tailwind.
- `STORE_*` são opcionais na API: ela sobe sem elas, com nome padrão. WhatsApp e e-mail, quando presentes, são validados no boot.
- O CI falha se o nome da marca voltar a aparecer fixo em `app/`, `components/`, `lib/` da loja ou em `src/`, `components/`, `index.html` do dashboard (`npm run check:brand`).

## Alternativas descartadas

- **Loja lê tudo da API.** Custa uma requisição no build e perde a tipagem estática de fontes e seções. Fontes e ordem de seções são decisão de código, não de operação.
- **Pacote compartilhado no monorepo.** Exigiria transformar o repositório em workspace (npm/pnpm). Mudança grande para evitar três linhas de env.
- **Tabela `StoreConfig` no banco.** Faz sentido quando houver vários lojistas. Com um só, é um CRUD a mais sem quem o use.

## Consequências

- Trocar de marca é um PR na loja e três variáveis no Render.
- Duas fontes de verdade (config da loja e env da API) em vez de uma. Aceito: os conjuntos não se sobrepõem (a API nunca precisa de cor ou fontes; a loja nunca precisa saber o que a API tem no ambiente).
- Fica para a etapa 3: mover o resto da paleta (creme, grafite, etc.) para CSS variables, junto com o tema claro/escuro.
- Os nomes dos pacotes (`sole-frontend`, `sole-backend`, `sole-dashboard`) ficam como estão nesta etapa: mudá-los altera os três `package-lock.json`, e a renomeação sai junto com a próxima mudança de dependências, quando os lockfiles serão regenerados de qualquer forma.
