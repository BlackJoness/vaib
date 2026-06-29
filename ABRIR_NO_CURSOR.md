# 🚀 ABRA ESTE ARQUIVO NO CURSOR

Este é o arquivo que você abre no Cursor para subir **front-end e back-end** para o GitHub.

---

## Como fazer (2 minutos)

1. No Cursor: **File → Open Folder** → selecione a pasta **`codigo`** (esta pasta).
2. Crie um repositório **vazio** no GitHub (sem README): https://github.com/new
   - Nome sugerido: `sole`
   - Copie a URL que ele te dá, algo como: `https://github.com/SEU_USUARIO/sole.git`
3. Abra o chat de IA do Cursor (`Ctrl+L` / `Cmd+L`) e **cole o prompt abaixo**, trocando a URL.

---

## 📋 PROMPT PARA COLAR NO CURSOR

```
Você está na pasta "codigo", que já é um repositório Git com o primeiro commit feito.
Suba todo o conteúdo (frontend, backend e dashboard) para o meu GitHub.

Faça, no terminal integrado, exatamente isto:

1. Limpe travas antigas do Git, se existirem:
   rm -f .git/*.lock .git/refs/heads/*.lock

2. Renomeie a branch para main:
   git branch -M main

3. Confirme que tudo está commitado:
   git add -A
   git commit -m "chore: ajustes" || echo "nada novo para commitar"

4. Conecte ao meu repositório remoto (troque pela MINHA url):
   git remote add origin https://github.com/SEU_USUARIO/sole.git

5. Envie para o GitHub:
   git push -u origin main

Se o push pedir autenticação, me avise para eu autorizar pelo navegador.
No final, me confirme que frontend/, backend/ e dashboard/ apareceram no GitHub.
```

---

## ⚠️ Observações importantes

- **Branch atual:** `master`. O prompt acima a renomeia para `main` (padrão do GitHub).
- **Segredos não vão junto:** os arquivos `.env` estão no `.gitignore`. Só sobem os `.env.example` (modelos sem senha). Isso é o correto.
- **`node_modules` não sobe** — é reinstalado automaticamente no deploy. Normal.
- Se o Cursor disser *"Another git process seems to be running"*, é a trava antiga: o comando do passo 1 (`rm -f .git/*.lock`) resolve.

---

## Depois do push — deploy (resumo)

Detalhes completos no `README.md` (mesma pasta).

| Onde | O quê | Root Directory |
|---|---|---|
| Supabase | Banco PostgreSQL → pega `DATABASE_URL` | — |
| Render | API NestJS | `backend` |
| Vercel | Loja | `frontend` |
| Vercel | Dashboard | `dashboard` |
