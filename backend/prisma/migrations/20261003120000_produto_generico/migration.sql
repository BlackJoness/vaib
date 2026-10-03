-- Produto genérico (etapa 2 do pivô, ADR 0002).
-- Escrita à mão para preservar os dados existentes: variantes cor+tamanho
-- viram attributes JSON e os status antigos são mapeados para o fluxo novo.

-- 1) Tipo do produto
CREATE TYPE "ProductKind" AS ENUM ('PHYSICAL', 'SERVICE');

ALTER TABLE "Product"
  ADD COLUMN "tagline"  TEXT,
  ADD COLUMN "kind"     "ProductKind" NOT NULL DEFAULT 'PHYSICAL',
  ADD COLUMN "destaque" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "options"  JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "media"    JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "content"  JSONB NOT NULL DEFAULT '{}';

CREATE INDEX "Product_destaque_idx" ON "Product"("destaque");

-- 2) Variante: cor + tamanho -> attributes
ALTER TABLE "Variant"
  ADD COLUMN "attributes"    JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN "attributesKey" TEXT;

UPDATE "Variant" SET
  "attributes"    = jsonb_build_object('cor', "cor", 'corHex', "corHex", 'tamanho', "tamanho"::text),
  "attributesKey" = 'cor=' || "cor" || ';tamanho=' || "tamanho"::text;

ALTER TABLE "Variant" ALTER COLUMN "attributesKey" SET NOT NULL;

ALTER TABLE "Variant" DROP CONSTRAINT IF EXISTS "Variant_productId_cor_tamanho_key";
DROP INDEX IF EXISTS "Variant_productId_cor_tamanho_key";
ALTER TABLE "Variant"
  DROP COLUMN "cor",
  DROP COLUMN "corHex",
  DROP COLUMN "tamanho";

ALTER TABLE "Variant" ALTER COLUMN "estoque" DROP NOT NULL;
ALTER TABLE "Variant" ALTER COLUMN "estoque" DROP DEFAULT;

CREATE UNIQUE INDEX "Variant_productId_attributesKey_key" ON "Variant"("productId", "attributesKey");

DROP TYPE "Tamanho";

-- 3) Pedido: contato, snapshot do tipo e descrição do item
ALTER TABLE "Order"
  ADD COLUMN "clienteWhatsapp" TEXT,
  ADD COLUMN "clienteMensagem" TEXT,
  ADD COLUMN "fulfillmentType" "ProductKind" NOT NULL DEFAULT 'PHYSICAL';

ALTER TABLE "OrderItem" ADD COLUMN "descricao" TEXT NOT NULL DEFAULT '';

-- 4) Status: AGUARDANDO_PAGAMENTO -> NOVO, EM_SEPARACAO -> CONFIRMADO, ENVIADO -> CONCLUIDO
CREATE TYPE "OrderStatus_new" AS ENUM ('NOVO', 'EM_CONTATO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO');

ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new"
  USING (
    CASE "status"::text
      WHEN 'AGUARDANDO_PAGAMENTO' THEN 'NOVO'
      WHEN 'EM_SEPARACAO'         THEN 'CONFIRMADO'
      WHEN 'ENVIADO'              THEN 'CONCLUIDO'
    END
  )::"OrderStatus_new";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'NOVO';

DROP TYPE "OrderStatus";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
