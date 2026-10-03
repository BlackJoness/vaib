#!/bin/sh
# Falha se o nome da marca aparecer fixo no código da loja.
# A marca mora só em store.config.ts; componentes leem de lá.
set -eu
MARCA='sol[eê]'
if grep -rniE "$MARCA" app components lib --include='*.ts' --include='*.tsx'; then
  echo "Nome de marca fixo no código. Mova para store.config.ts." >&2
  exit 1
fi
echo "ok: nenhum nome de marca fixo em app/, components/ ou lib/."
