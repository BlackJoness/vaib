# Segurança

Este documento registra o modelo de acesso da Solê, os controles aplicados e o que ficou de fora de propósito. Foi escrito a partir da auditoria de 01/10/2026, que encontrou a API sem nenhuma autenticação, o deploy de produção quebrado e dependências com vulnerabilidades críticas.

## Modelo de acesso

| Rota | Quem acessa | Limite por IP |
|---|---|---|
| `GET /products`, `GET /products/:slug` | Público | 100/min |
| `POST /orders` | Público (checkout sem conta) | 5/min |
| `POST /auth/login` | Público | 5/min |
| `GET /health` | Público | sem limite |
| `GET /dashboard/kpis` | Admin | 100/min |
| `PATCH /orders/:id/status` | Admin | 100/min |

**Fechado por padrão.** A checagem de token é um guard global: toda rota nova nasce protegida e só fica aberta se for marcada com `@Public()`. Esquecer o decorator gera 401, não uma rota exposta.

**O limite roda antes do token.** Tentativas em rotas protegidas também contam no limite de requisições.

## Decisões

### Admin único, sem cadastro público
Só existe um papel (admin). O primeiro admin é criado pelo seed a partir de `ADMIN_EMAIL` e `ADMIN_PASSWORD` (12+ caracteres). O seed nunca sobrescreve a senha de um admin existente. Papéis adicionais ficam para quando houver mais de um tipo de operador.

### JWT de 1 hora, sem refresh token
HS256 com algoritmo fixado na verificação (tokens com `alg: none` ou outro algoritmo são recusados). Expira em 1h; o operador faz login de novo. Refresh token foi descartado pelo mesmo motivo do projeto Indústrias Wayne: complexidade sem ganho para um painel interno de uso esporádico.

### A API não sobe com segredo fraco
`JWT_SECRET` ausente ou com menos de 32 caracteres derruba a subida com mensagem explícita. `DATABASE_URL` também é obrigatória.

### Login sem vazamento de informação
E-mail inexistente e senha errada devolvem a mesma mensagem, no mesmo tempo (a senha é comparada com um hash falso quando o e-mail não existe). Senhas com bcrypt, custo 12. O e-mail é normalizado (espaços e maiúsculas).

### Token do dashboard em sessionStorage
Some ao fechar a aba. O risco de XSS é reduzido por uma CSP estrita no dashboard (`script-src 'self'`, sem scripts inline) definida em `dashboard/vercel.json`. Cookie httpOnly seria mais forte, mas exigiria API e dashboard no mesmo domínio ou cookies de terceiros; fica como evolução se o projeto ganhar domínio próprio.

### Pedido validado antes de tocar no banco
Campos extras são recusados (o cliente não consegue mandar `total`). Máximo de 20 itens por pedido e 10 unidades por item; a mesma variante não pode aparecer duas vezes. O total é sempre calculado no servidor a partir do preço da variante.

### Concorrência
A baixa de estoque e a troca de status de pedido usam atualização condicional (`WHERE estoque >= qtd` e `WHERE status = atual`). Dois pedidos simultâneos não vendem a mesma unidade; dois cliques simultâneos não avançam o pedido duas vezes.

### O que a API pública não expõe
O estoque exato. A loja recebe só `disponivel: true/false`. Produtos inativos respondem 404, igual a um slug inexistente. Erros de banco não vazam nomes de tabela ou query.

### Cabeçalhos
- API: `helmet` (HSTS, nosniff, frame-ancestors e outros), sem `x-powered-by`, CORS só para as origens de `FRONTEND_URL`, métodos e cabeçalhos explícitos.
- Loja: HSTS, nosniff, `X-Frame-Options: DENY`, Referrer-Policy e Permissions-Policy em `next.config.ts`.
- Dashboard: os mesmos, mais CSP estrita.

## Deploy: o que mudou

A API agora exige variáveis novas no Render. Sem `JWT_SECRET`, ela não sobe (de propósito).

| Variável | Onde | Valor |
|---|---|---|
| `JWT_SECRET` | Render (API) | 48+ caracteres aleatórios: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `JWT_EXPIRES_IN` | Render (API) | `1h` (opcional, é o padrão) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Render (API) | E-mail e senha (12+ caracteres) do primeiro admin. Depois do seed, a senha pode sair do ambiente |
| `FRONTEND_URL` | Render (API) | URLs da loja **e do dashboard**, separadas por vírgula |
| `VITE_API_URL` | Vercel (dashboard) | URL pública da API |

Depois do deploy: `npx prisma migrate deploy && npx prisma db seed` (cria a tabela de admin e o primeiro admin). No Render, configure **Health Check Path** como `/health`.

O comando de start continua `npm run start:prod`; o build agora gera `dist/main.js`, que é o arquivo que ele executa.

## Testes

`backend/test/security.spec.ts` sobe a aplicação real (guards, validação, helmet, limites, CORS) com o banco simulado e verifica: 401 sem token, com token de outro segredo, expirado, sem papel de admin e com `alg: none`; 200 com token válido; 429 no 6º login e no 6º pedido do minuto; 400 para cada payload abusivo sem tocar no banco; ausência de estoque exato na resposta pública; cabeçalhos; CORS; e que erros do banco não vazam detalhes.

O CI (`.github/workflows/ci.yml`) roda typecheck, testes, build e `npm audit` das três partes a cada push e pull request. O Dependabot abre PRs semanais de atualização.

## Riscos conhecidos e próximos passos

| Risco | Por que ficou | Próximo passo |
|---|---|---|
| Pedido não pago segura estoque para sempre | Resolver exige um status novo (cancelado/expirado), e o modelo atual tem três status fixos | Expirar pedidos `AGUARDANDO_PAGAMENTO` após N minutos devolvendo o estoque, junto com a definição do produto novo |
| Limite de requisições em memória | Com uma instância no Render, é suficiente | Redis como storage do throttler se a API escalar horizontalmente |
| Loja sem CSP de scripts | O Next injeta scripts inline; CSP estrita exige nonce por requisição via middleware | Middleware com nonce |
| Sem bloqueio de conta após falhas de login | O limite de 5/min por IP cobre o caso de um painel com um admin | Contador por conta se houver mais admins |
