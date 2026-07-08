# ✅ EXECUTAR TUDO — Documento final (Vaib~)

> **Este é o único arquivo que você precisa abrir no Cursor.**
> Ele reúne o passo a passo completo: enviar ao GitHub → configurar → rodar tudo (loja, API e banco).

---

## Pré-requisitos na sua máquina
- **Node.js 20+** · **Docker Desktop** (aberto) · **Git**
- Uma conta no **GitHub** (e, para deploy, contas em Supabase, Render e Vercel)

---

## PARTE 1 — Subir tudo para o GitHub e rodar local

Abra a pasta `codigo` no Cursor (**File → Open Folder**), crie um repositório **vazio** em https://github.com/new, e cole o prompt abaixo no chat do Cursor (`Cmd/Ctrl + L`), trocando a URL.

```
Você está na pasta "codigo", um monorepo já versionado em Git (branch main) com:
frontend/ (Next.js), backend/ (NestJS + Prisma), dashboard/ (Next.js + Shadcn),
docker-compose.yml (Postgres) e os scripts setup.sh / dev.sh.

Execute, no terminal integrado, nesta ordem, mostrando a saída de cada passo:

# 1) Enviar para o GitHub
rm -f .git/*.lock .git/refs/heads/*.lock
git add -A && (git commit -m "chore: sincroniza projeto" || echo "nada a commitar")
git remote add origin https://github.com/SEU_USUARIO/vaib.git 2>/dev/null || git remote set-url origin https://github.com/SEU_USUARIO/vaib.git
git push -u origin main

# 2) Configurar o ambiente (banco Docker + deps + migrate + seed)
bash setup.sh

# 3) Rodar loja + API + dashboard juntos
bash dev.sh

Ao final, confirme que respondem:
- Loja:      http://localhost:3000
- API:       http://localhost:3001/products
- Dashboard: http://localhost:3002

Se a autenticação do push for solicitada, me avise. Se algum passo falhar,
explique a causa e proponha a correção antes de continuar. Não altere a stack
nem a lógica de negócio — apenas configure e execute o ambiente existente.
```

> Alternativa de 1 comando (depois do push): `make setup && make dev`.

---

## PARTE 2 — Deploy em produção (opcional)

Depois que estiver no GitHub, cole este prompt para o Cursor te guiar no deploy:

```
O repositório já está no GitHub. Quero publicar em produção usando a stack definida.
Me guie, passo a passo, pedindo as informações quando necessário:

1) Banco — Supabase: criar projeto e copiar a connection string (DATABASE_URL).
2) API — Render: novo Web Service, Root Directory "backend",
   Build: npm install && npx prisma generate && npm run build
   Start: npm run start:prod
   Env: DATABASE_URL (Supabase), FRONTEND_URL, PORT=10000
   Após subir, rodar no Shell do Render: npx prisma migrate deploy && npx prisma db seed
3) Loja — Vercel: importar o repo, Root Directory "frontend",
   Env: NEXT_PUBLIC_API_URL = (URL pública da API no Render)
4) Dashboard — Vercel: novo projeto, mesmo repo, Root Directory "dashboard",
   Env: NEXT_PUBLIC_API_URL = (URL pública da API no Render)

Liste as URLs finais (loja, dashboard, API) ao concluir.
```

---

## Mapa rápido

| Quero… | Faça |
|---|---|
| Subir + rodar local | PARTE 1 (prompt) ou `make setup && make dev` |
| Só rodar (já configurado) | `make dev` |
| Publicar em produção | PARTE 2 (prompt) — detalhes no `README.md` |
| Entender a arquitetura/erros | `ANALISE_TECNICA.md` · `README.md` |

*Branch: `main` · 3 apps (loja, API, dashboard) + banco PostgreSQL.*
