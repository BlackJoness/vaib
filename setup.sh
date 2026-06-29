#!/usr/bin/env bash
# Solê — Setup automático do ambiente local (front + back + banco)
# Uso: bash setup.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
LOCAL_DB="postgresql://sole:sole@localhost:5432/sole?schema=public"

echo "▸ 1/5  Subindo o banco PostgreSQL (Docker)..."
docker compose up -d db
echo "   aguardando o banco ficar pronto..."
until docker exec sole_db pg_isready -U sole -d sole >/dev/null 2>&1; do sleep 2; done
echo "   banco pronto ✔"

echo "▸ 2/5  Backend (NestJS + Prisma)..."
cd "$ROOT/backend"
[ -f .env ] || cp .env.example .env
# garante DATABASE_URL apontando para o Postgres local do Docker
if grep -q '^DATABASE_URL=' .env; then
  # macOS/BSD sed e GNU sed
  sed -i.bak "s#^DATABASE_URL=.*#DATABASE_URL=\"$LOCAL_DB\"#" .env && rm -f .env.bak
else
  echo "DATABASE_URL=\"$LOCAL_DB\"" >> .env
fi
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

echo "▸ 3/5  Frontend (Next.js)..."
cd "$ROOT/frontend"
[ -f .env.local ] || cp .env.example .env.local
npm install

echo "▸ 4/5  Dashboard (Vite + React)..."
cd "$ROOT/dashboard"
[ -f .env ] || cp .env.example .env
npm install

echo "▸ 5/5  Pronto!"
cat <<'MSG'

────────────────────────────────────────────────
Ambiente configurado. Para iniciar tudo, rode:

  bash dev.sh

Ou em 3 terminais separados:
  (1) cd backend   && npm run start:dev   # API   → http://localhost:3001
  (2) cd frontend  && npm run dev         # Loja  → http://localhost:3000
  (3) cd dashboard && npm run dev         # Admin → http://localhost:5173
────────────────────────────────────────────────
MSG
