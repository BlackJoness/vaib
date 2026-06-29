# Vaib~ — Análise Técnica Sênior (Front · Back · Banco)

Revisão completa do MVP. Classificação por severidade e por categoria.

> **Status (atualizado):** os bloqueadores L1–L5 e os itens sênior S1/S2/S3/S6 + iniciante I1–I5 foram **corrigidos** nesta rodada. Restam apenas itens de evolução (autenticação, testes/CI, catálogo real das referências). Veja a seção "Correções aplicadas" ao final.

---

## 🔴 Erros de Lógica (bloqueiam funcionamento correto)

| # | Onde | Problema | Correção |
|---|---|---|---|
| L1 | `frontend/app/page.tsx` | A loja usa `DESTAQUES` fixos (hard-coded). **Nunca chama a API.** Front e back não se falam. | Criar `frontend/lib/api.ts` e buscar `GET /products` (de preferência em Server Component). |
| L2 | `backend/orders.service.ts` | **Oversell:** o decremento de estoque (`decrement`) não trava a linha. Dois pedidos simultâneos podem vender o mesmo último item → estoque negativo. | Usar `updateMany({ where: { id, estoque: { gte: qty } }, data: { decrement } })` e abortar se `count === 0`. |
| L3 | `dashboard/` | Só existe `KpiCards.tsx`, que importa `@/components/ui/card` (shadcn) inexistente. **Não há projeto** (sem `package.json`, sem build, sem shadcn). Não roda nem deploya. | Inicializar app React/Vite + shadcn, ou migrar o painel para uma rota dentro do `frontend`. |
| L4 | `frontend` (assets) | Referências a `/hero.mp4` e `/produtos/*.jpg` que não existem em `public/`. Imagens/vídeo quebram. | Adicionar os arquivos em `frontend/public/` ou usar placeholders. |
| L5 | Front × Back (preço) | Back retorna `preco` como **Decimal** (string/número); front espera string já formatada `"R$ 159,90"`. Sem formatador, o preço sai errado. | Centralizar em `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`. |

---

## 🟠 Erros de Nível Sênior (arquitetura/segurança/escala)

| # | Onde | Problema | Correção |
|---|---|---|---|
| S1 | `backend/main.ts` | **Sem `ValidationPipe` global** e **sem DTOs** (`@Body()` é `any`). Entrada não validada = risco de dados corrompidos e injeção de payload. | `app.useGlobalPipes(new ValidationPipe({ whitelist: true }))` + DTOs com `class-validator`. |
| S2 | `frontend/app/page.tsx` | Página inteira `"use client"`. Perde SSR/SEO — justamente um objetivo da stack. | Tornar a Home Server Component; isolar só o que precisa de interação em ilhas client. |
| S3 | `backend` | Lê `process.env` direto, sem `@nestjs/config` nem validação de env na subida. App sobe quebrado se faltar `DATABASE_URL`. | `ConfigModule.forRoot({ validationSchema })`. |
| S4 | `backend` | **Sem camada de autenticação** em `dashboard` e em `PATCH /orders/:id/status`. Qualquer um avança pedidos. | Guard/JWT (ex.: `@nestjs/passport`) protegendo rotas administrativas. |
| S5 | `frontend` (imagens) | Uso de `<img>` em vez de `next/image`. Sem otimização → LCP/performance ruins. | Trocar por `next/image` com `width/height`. |
| S6 | `backend/dashboard.service.ts` | KPI "mais vendido" faz **N+1 queries** (loop com `findUnique` por variante). Não escala. | Uma query com `groupBy` + `include`, ou agregação SQL única. |
| S7 | Geral | **Zero testes** e **sem CI**. Para nível corporativo, falta cobertura mínima e pipeline. | Jest (unit no `OrdersService`) + GitHub Actions. |

---

## 🟡 Erros de Iniciante (rápidos de corrigir)

| # | Onde | Problema | Correção |
|---|---|---|---|
| I1 | `frontend/package.json` | Script `"lint": "next lint"` **sem** `eslint`/`eslint-config-next` instalados. Quebra ao rodar. | Adicionar `eslint` e `eslint-config-next` em devDependencies. |
| I2 | `backend/orders.service.ts` | `const itemsData = []` sem tipo (`any[]`). | Tipar: `const itemsData: { variantId: string; quantidade: number; precoUnitario: Prisma.Decimal }[] = []`. |
| I3 | `frontend/next.config.ts` | Reexpõe `NEXT_PUBLIC_API_URL` em `env{}` — variáveis `NEXT_PUBLIC_` já são expostas. Redundante. | Remover o bloco `env`. |
| I4 | `frontend` | Sem páginas `loading.tsx`, `error.tsx`, `not-found.tsx`. | Adicionar as três (UX e robustez). |
| I5 | `dashboard/KpiCards.tsx` | Usa `process.env.NEXT_PUBLIC_API_URL`, mas um app Vite usa `import.meta.env.VITE_*`. Prefixo errado para a stack do painel. | Alinhar o prefixo ao bundler do dashboard. |

---

## 🟢 Boas Práticas (recomendações)

- **Banco:** sem `onDelete` definido nas relações → apagar um `Product` com variantes dá erro. Definir `onDelete: Restrict/Cascade` conscientemente. Adicionar índice em `Order.createdAt` (relatórios). Estoque pode ficar negativo no nível do banco — adicionar `CHECK (estoque >= 0)` via migration raw.
- **Histórico de pedido:** não há trilha de auditoria de mudança de status. Para corporativo, criar tabela `OrderStatusHistory`.
- **Catálogo (restrição do projeto):** os produtos ainda são genéricos no `seed.ts`. Ao copiar dos sites de referência, a **única** alteração permitida é a marca (nome/descrição Vaib) — preços, modelagem e fotos devem refletir as referências. Isso ainda não foi transcrito.
- **Segurança:** `.env` já está no `.gitignore` (correto). Garantir que nenhuma chave do Supabase/Render entre no repositório.
- **Versionamento:** branch atual `master`; renomear para `main`.

---

## ✅ O que já está correto

Modelagem Produto × Variante × Pedido bem normalizada; enums `Tamanho` (P/M/G/GG) e `OrderStatus` exatamente conforme a regra; transação na criação do pedido; tokens de marca centralizados no Tailwind; animações Framer Motion organizadas em `lib/motion.ts`; segredos fora do Git.

---

## ✅ Correções aplicadas (rodada sênior)

| Item | O que foi feito |
|---|---|
| L1 | Criado `frontend/lib/api.ts` + módulo `products` no back. A Home agora é **Server Component** e consome `GET /products` (com fallback se a API cair). |
| L2 | `orders.service.ts` usa `updateMany({ where: { estoque: { gte } } })` — baixa de estoque atômica, **sem oversell**; lança `409 Conflict` se faltar. |
| L3 | `dashboard/` virou **projeto Vite + React + Tailwind** real (package.json, vite.config, index.html, src/). `KpiCards` reescrito sem shadcn quebrado e usando `VITE_API_URL`. |
| L4 | `Hero` agora tem fundo em gradiente da marca (não quebra sem o vídeo); `ProductCard` usa placeholder de cor quando não há foto. |
| L5 | `frontend/lib/format.ts` centraliza `Intl.NumberFormat` (BRL). Tipos do back serializados em `lib/types.ts`. |
| S1 | `ValidationPipe` global + DTOs (`create-order.dto.ts`) com `class-validator`. |
| S2 | Home convertida em Server Component (SSR/SEO); interatividade isolada em `ProductGrid` (client). |
| S3 | `ConfigModule.forRoot({ isGlobal: true })` adicionado. |
| S6 | KPI "mais vendido" agora resolve em **2 queries** (groupBy + findMany), sem N+1. |
| I1 | `eslint` + `eslint-config-next` adicionados; `.eslintrc.json` criado. |
| I2 | `itemsData` tipado (`ItemData[]`). |
| I3 | Removido bloco `env{}` redundante do `next.config.ts`. |
| I4 | Criados `loading.tsx`, `error.tsx`, `not-found.tsx`. |
| I5 | Dashboard usa o prefixo correto `VITE_*`. |
| Banco | `onDelete: Cascade` em Variant→Product; índices em `Order.createdAt` e `Variant.productId`. |

### Pendências conscientes (fora do escopo desta rodada)
- **S4** Autenticação/JWT nas rotas administrativas (dashboard e avanço de status).
- **S7** Testes (Jest) e CI (GitHub Actions).
- **Catálogo** Transcrever os produtos reais das referências, alterando **apenas** a marca.
- **Banco** `CHECK (estoque >= 0)` via migration SQL raw (defesa extra no nível do banco).
