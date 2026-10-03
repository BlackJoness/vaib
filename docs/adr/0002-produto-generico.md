# ADR 0002: Produto genérico, físico ou serviço

**Data:** 03/10/2026 · **Status:** aceito · **Etapa:** 2 do pivô (CAR-7)

## Contexto

O modelo original era de loja de roupa: `Variant` tinha `cor`, `corHex` e `tamanho` (enum `P/M/G/GG`), todo produto tinha estoque e o pedido seguia `AGUARDANDO_PAGAMENTO → EM_SEPARACAO → ENVIADO`. O vaib passa a ser uma loja de um produto só, que pode ser físico ou serviço, com a troca de nicho feita por dados e não por código.

## Decisão

| O quê | Como |
|---|---|
| Tipo do produto | `Product.kind` (`PHYSICAL` ou `SERVICE`), copiado para `Order.fulfillmentType` no pedido |
| Opções | `Product.options` JSON: `[{ key, label, values: [{ value, label, meta? }] }]`. É o que a loja renderiza como seletores |
| Variante | `Variant.attributes` JSON (`{ "escopo": "casa", "entrega": "express" }`) + `attributesKey` (forma canônica, chaves ordenadas) com `@@unique([productId, attributesKey])`, porque o Postgres não garante unicidade sobre JSON |
| Estoque | `Variant.estoque` nullable: `null` é serviço ou ilimitado. O pedido só decrementa quando há número; a disponibilidade pública é `estoque === null || estoque > 0` |
| Conteúdo de venda | `Product.content` JSON (headline, benefícios, passos, FAQ, prova social) e `Product.media`. Tipos em `src/products/product-content.types.ts`, espelhados em `frontend/lib/types.ts` |
| Produto da home | `Product.destaque`; `GET /products/destaque`. O seed e, na etapa 6, o dashboard garantem no máximo um |
| Pedido | `clienteWhatsapp` e `clienteMensagem` (fechamento por contato, ADR 0001); `OrderItem.descricao` guarda "XPTO · Casa completa · 15 dias" como snapshot |
| Status | `NOVO → EM_CONTATO → CONFIRMADO → CONCLUIDO`, e `CANCELADO` de qualquer estado não final (`PATCH /orders/:id/cancel`). Cancelar não devolve estoque: decisão do lojista |
| Migração | Escrita à mão, preserva dados: `cor`+`tamanho` viram `attributes`, status antigos são mapeados (`AGUARDANDO_PAGAMENTO→NOVO`, `EM_SEPARACAO→CONFIRMADO`, `ENVIADO→CONCLUIDO`) |

### Garantias

- Preço e total continuam vindo do banco; o cliente só manda `variantId` e `quantidade`.
- Físico e serviço não se misturam num pedido (400).
- Oversell segue impossível: decremento condicional dentro da transação, só para variantes com estoque.
- A API nunca expõe o número do estoque; a loja recebe `disponivel`.

## Alternativas descartadas

- **Tabelas `OptionGroup` / `OptionValue`.** Mais duas tabelas e dois CRUDs para uma loja de um produto. JSON tipado cobre; se virar catálogo com filtros por atributo, migra.
- **Validar os JSON com zod na API.** Adicionaria dependência e lockfile numa etapa entregue pelo navegador. Quem escreve hoje é o seed, tipado em TypeScript; os DTOs aninhados do `class-validator` entram com a edição pelo dashboard (etapa 6).
- **Reseed em vez de migração.** Mais simples, mas apagaria pedidos reais. A migração manual custa 40 linhas de SQL e mostra cuidado com dados.

## Consequências

- O seed passa a criar o XPTO (serviço de design e decoração) com 2 opções × 2 valores = 4 variantes. Os scrubs saem.
- A loja mostra o produto em destaque com um seletor genérico de opções; o visual continua o antigo até a etapa 4.
- O dashboard mostra alertas de estoque por descrição de variante; serviço não gera alerta.
- Validação dos JSON na escrita fica em dívida até a etapa 6.
