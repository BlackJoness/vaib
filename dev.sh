#!/usr/bin/env bash
# Vaib~ — sobe os 3 serviços de desenvolvimento ao mesmo tempo
# Uso: bash dev.sh   (Ctrl+C encerra todos)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"

docker compose up -d db

cleanup() { echo "Encerrando..."; kill 0; }
trap cleanup EXIT INT TERM

( cd "$ROOT/backend"   && npm run start:dev ) &
( cd "$ROOT/frontend"  && npm run dev ) &
( cd "$ROOT/dashboard" && npm run dev ) &

echo "API → http://localhost:3001 | Loja → http://localhost:3000 | Admin → http://localhost:3002"
wait
