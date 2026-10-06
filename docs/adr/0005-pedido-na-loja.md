# ADR 0005: Pedido criado pela loja, com contato por WhatsApp

**Data:** 05/10/2026 · **Status:** aceito · **Etapa:** 5 do pivô (CAR-7)

## Contexto

A API aceita pedidos desde a etapa 2 (`POST /orders`, público, 5 por minuto por IP, preço calculado no servidor), mas a loja ainda não criava pedido: o botão da oferta só levava ao contato. O fechamento é por contato (ADR 0001), então o pedido precisa chegar com um jeito de falar com o cliente.

## Decisão

| O quê | Como |
|---|---|
| Fluxo | A oferta tem três passos no mesmo painel: escolha, dados e confirmação. Nada de modal: sem armadilha de foco, e funciona igual no celular |
| Dados | Nome, e-mail, WhatsApp e mensagem opcional; quantidade só para produto físico (1 a 10) |
| Envio | O navegador chama a API direto (`NEXT_PUBLIC_API_URL`). Um proxy no servidor da loja faria todos os clientes saírem pelo IP da Vercel, e o limite de 5 por minuto valeria para a loja inteira |
| Validação | `lib/pedido.ts` repete as regras da API antes de enviar; erros 400 da API voltam para o campo certo, com texto em português |
| Erros | 409 (esgotou), 404 (opção sumiu), 429 (muitas tentativas) e rede fora têm mensagem própria; sem rede, oferece o WhatsApp da loja |
| WhatsApp | Número brasileiro digitado sem DDI ganha o 55. **Obrigatório em pedido de serviço, validado na API** (`OrdersService.create`), antes de qualquer escrita |
| Confirmação | Mostra o número do pedido e, se a loja tiver WhatsApp no config, um botão que avisa a loja com o número já na mensagem |
| Acessibilidade | A cada passo o foco vai para o título do painel; campos com `aria-invalid` e `aria-describedby`; alerta com `role="alert"` |

## Alternativas descartadas

- **Server Action ou rota da loja como proxy.** Esconderia a URL da API, mas quebraria o limite por IP (ver acima).
- **Biblioteca de formulário (react-hook-form) e de teste na loja.** Mexeriam no lockfile, que a entrega pelo navegador não comporta. O formulário tem quatro campos; o fluxo foi testado de ponta a ponta no Chromium contra uma API falsa (sucesso, 400, 404, 409, 429 e rede fora).

## Consequências

- O pedido chega ao banco, mas o dashboard ainda não lista pedidos: isso é a etapa 6. Até lá, o aviso por WhatsApp na confirmação é o que leva o pedido até o lojista, por isso vale preencher `contact.whatsapp` no `store.config.ts`.
- Com a API fora, a loja mostra o produto do fallback, cujas variantes não existem no banco; um pedido feito nesse estado volta 404 e a loja pede para recarregar.
- Não há notificação por e-mail ao lojista; fica para depois do dashboard.
