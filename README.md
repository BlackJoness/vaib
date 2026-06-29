# Vaib~ — Guia do Desenvolvedor & Deploy

Monorepo do MVP de e-commerce de scrubs. Três aplicações independentes:

| Pasta | App | Tecnologia | Deploy |
|---|---|---|---|
| `frontend/` | Loja | Next.js + Tailwind + Framer Motion | Vercel |
| `backend/` | API | NestJS + Prisma | Render |
| `dashboard/` | Painel de gestão | Next.js + Shadcn UI | Vercel |
| (gerenciado) | Banco | PostgreSQL | Supabase |

> **Importante:** cada pasta é um projeto separado com seu próprio `package.json`. No deploy, você aponta o **Root Directory** de cada plataforma para a pasta certa.

---

## 1. Qual projeto abrir no Cursor

Abra **a pasta `codigo/`** como workspace no Cursor (`File → Open Folder → .../Scrubs/codigo`).
Assim você vê `frontend`, `backend` e `dashboard` lado a lado e a IA do Cursor enxerga todo o contexto.

O Cursor **não faz o deploy sozinho** — ele é seu editor. O deploy acontece quando você envia o código para o GitHub e as plataformas (Vercel/Render) constroem automaticamente. O Cursor entra em duas frentes: editar o código (com a IA) e rodar comandos no **terminal integrado** (`Ctrl+'`).

---

## 2. Rodar localmente (antes de subir)

**Backend (API):**
```bash
cd backend
npm install
cp .env.example .env          # preencha DATABASE_URL com o Supabase
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed            # popula dados de demonstração
npm run start:dev             # API em http://localhost:3001
```

**Frontend (loja):**
```bash
cd frontend
npm install
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:3001
npm run dev                   # loja em http://localhost:3000
```

---

## 3. Subir para deploy (fluxo profissional)

### Passo 1 — Versionar com Git (no terminal do Cursor)
```bash
cd codigo
git init
git add .
git commit -m "feat: MVP Vaib inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/vaib.git
git push -u origin main
```

### Passo 2 — Banco no Supabase
1. Crie um projeto em supabase.com.
2. Copie a **Connection string** (Settings → Database → Connection string, modo *Session*).
3. Guarde — será o `DATABASE_URL`.

### Passo 3 — API no Render
1. New → **Web Service** → conecte o repositório GitHub.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npx prisma generate && npm run build`
4. **Start Command:** `npm run start:prod`
5. **Environment:** `DATABASE_URL` (Supabase), `FRONTEND_URL`, `PORT=10000`
6. Após o 1º deploy, rode as migrations (Render Shell): `npx prisma migrate deploy && npx prisma db seed`

### Passo 4 — Loja no Vercel
1. New Project → importe o mesmo repositório.
2. **Root Directory:** `frontend`
3. **Environment:** `NEXT_PUBLIC_API_URL=https://vaib-api.onrender.com`
4. Deploy.

### Passo 5 — Dashboard no Vercel
Repita o passo 4 com **Root Directory:** `dashboard`.

> A partir daqui, todo `git push` na branch `main` redeploya tudo automaticamente.

---

## 4. O que é cada arquivo

### `frontend/` (loja Next.js)
| Arquivo | O que é |
|---|---|
| `package.json` | Dependências e scripts (`dev`, `build`, `start`). É o que a Vercel lê para instalar e buildar. |
| `next.config.ts` | Configuração do Next (domínios de imagem, variável da API). |
| `tsconfig.json` | Regras do TypeScript e o atalho `@/` para imports. |
| `tailwind.config.ts` | Tokens da marca (cores, fontes, sombras) usados nas classes Tailwind. |
| `postcss.config.js` | Liga o Tailwind ao processo de build do CSS. |
| `app/layout.tsx` | Layout raiz: carrega as fontes Poppins/Inter e envolve todas as páginas. |
| `app/page.tsx` | Página inicial (Home): Hero + grade de destaques. |
| `app/globals.css` | CSS global e diretivas do Tailwind. |
| `components/Hero.tsx` | Banner com vídeo e animação de entrada (Framer Motion). |
| `components/ProductCard.tsx` | Card de produto com reveal no scroll e hover. |
| `components/SizeSelector.tsx` | Seletor de tamanho P/M/G/GG. |
| `lib/motion.ts` | Variantes de animação reutilizáveis (fadeUp, stagger). |
| `.env.example` | Modelo das variáveis de ambiente (copie para `.env.local`). |
| `.gitignore` | Lista o que o Git deve ignorar (`node_modules`, `.env`). |

### `backend/` (API NestJS)
| Arquivo | O que é |
|---|---|
| `package.json` | Dependências e scripts (`build`, `start:prod`, `prisma:*`). O que o Render lê. |
| `prisma/schema.prisma` | Modelagem do banco: Product, Variant, Order, OrderItem + enums Tamanho e OrderStatus. |
| `prisma/seed.ts` | Popula o banco com dados de demonstração (72 variantes). |
| `tsconfig.json` / `nest-cli.json` | Configuração de TypeScript e do CLI do NestJS. |
| `src/main.ts` | Ponto de entrada: sobe o servidor e configura CORS. |
| `src/app.module.ts` | Módulo raiz que junta os demais módulos. |
| `src/prisma/prisma.service.ts` | Cliente Prisma injetável (conexão com o banco). |
| `src/prisma/prisma.module.ts` | Disponibiliza o PrismaService para toda a app. |
| `src/orders/orders.service.ts` | Regra de negócio: cria pedido, baixa estoque, avança status. |
| `src/orders/orders.controller.ts` | Rotas HTTP de pedidos (`POST /orders`, `PATCH /orders/:id/status`). |
| `src/orders/order-status.enum.ts` | Rótulos e transições válidas dos status. |
| `src/orders/orders.module.ts` | Agrupa service + controller de pedidos. |
| `src/dashboard/dashboard.service.ts` | Calcula KPIs (produto mais vendido, estoque baixo). |
| `src/dashboard/dashboard.controller.ts` | Rota `GET /dashboard/kpis`. |
| `src/dashboard/dashboard.module.ts` | Agrupa service + controller do dashboard. |
| `.env.example` | Modelo das variáveis (`DATABASE_URL`, `FRONTEND_URL`, `PORT`). |
| `.gitignore` | Ignora `node_modules`, `dist`, `.env`. |

### `dashboard/`
| Arquivo | O que é |
|---|---|
| `components/KpiCards.tsx` | Cards de KPI que consomem `GET /dashboard/kpis` da API. |

---

## 5. Status atual e próximos passos

Este é um **MVP esqueleto**: a fundação (marca, modelagem, regras de negócio, animações e configuração de deploy) está pronta e buildável. Para virar loja completa ainda faltam: páginas de produto (PDP) e checkout reais consumindo a API, carrinho, imagens dos produtos em `frontend/public/produtos/`, autenticação do dashboard e um gateway de pagamento (Pix).
