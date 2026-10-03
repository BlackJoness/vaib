#!/bin/sh
# Falha se o nome da marca aparecer fixo no código do dashboard.
# O nome vem da API (GET /store); o painel não conhece a marca.
set -eu
MARCA='sol[eê]'
if grep -rniE "$MARCA" src components index.html --include='*.ts' --include='*.tsx' --include='*.html'; then
  echo "Nome de marca fixo no código. O dashboard lê o nome em GET /store." >&2
  exit 1
fi
echo "ok: nenhum nome de marca fixo no dashboard."
