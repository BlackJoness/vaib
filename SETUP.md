# ⚙️ SETUP — Rodar o projeto Solê no Cursor AI

Abra **este arquivo** no Cursor. Ele orquestra a instalação e a execução de **frontend + backend + banco** num único fluxo.

---

## Pré-requisitos (na sua máquina)
- **Node.js 20+** e **npm**
- **Docker Desktop** (para o banco PostgreSQL local — sobe sozinho)
- **Git**

---

## Como o ambiente está montado
- `setup.sh` → instala dependências dos 3 apps, sobe o Postgres (Docker), cria os `.env` e roda migrations + seed.
- `dev.sh` → liga os 3 serviços ao mesmo tempo.
- `docker-compose.yml` → banco PostgreSQL local (sem precisar de Supabase para rodar localmente).

| Serviço | URL local |
|---|---|
| Loja (Next.js) | http://localhost:3000 |
| API (NestJS) | http://localhost:3001 |
| Dashboard (Vite) | http://localhost:5173 |

---

## 📋 PROMPT PARA COLAR NO CURSOR AI

```
Este repositório é um monorepo com 3 aplicações: frontend/ (Next.js), backend/ (NestJS + Prisma)
e dashboard/ (Vite + React), além de docker-compose.yml (Postgres) e os scripts setup.sh e dev.sh.

Quero rodar tudo localmente. Faça, no terminal integrado, exatamente nesta ordem e me mostrando a saída:

1. Verifique os pré-requisitos:
   node -v && npm -v && docker -v

2. Garanta que o Docker Desktop está rodando. Em seguida, configure todo o ambiente:
   bash setup.sh
   (Isso sobe o Postgres, instala dependências dos 3 apps, cria os .env, e roda
    prisma generate + migrate + seed.)

3. Suba os 3 serviços ao mesmo tempo:
   bash dev.sh

4. Confirme que respondem:
   - Loja:      http://localhost:3000
   - API:       http://localhost:3001/products
   - Dashboard: http://localhost:5173

Se algum comando falhar, leia o erro, me explique a causa e proponha a correção antes de prosseguir.
Não altere a lógica de negócio nem a stack; foque em configurar e executar o ambiente existente.
```

---

## Se preferir banco na nuvem (Supabase) em vez de Docker
No `backend/.env`, troque `DATABASE_URL` pela connection string do Supabase e rode:
```bash
cd backend && npx prisma migrate deploy && npx prisma db seed
```

## Deploy (produção)
Fluxo completo (Supabase → Render → Vercel) no `README.md`.
