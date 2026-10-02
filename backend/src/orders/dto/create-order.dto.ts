import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";

// Limites de pedido. Barram payloads abusivos (milhares de itens,
// quantidades absurdas) antes de qualquer acesso ao banco.
export const MAX_ITENS_POR_PEDIDO = 20;
export const MAX_QUANTIDADE_POR_ITEM = 10;

const aparar = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class OrderItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  variantId!: string;

  @IsInt()
  @Min(1)
  @Max(MAX_QUANTIDADE_POR_ITEM)
  quantidade!: number;
}

export class CreateOrderDto {
  @Transform(aparar)
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  clienteNome!: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MaxLength(254)
  clienteEmail!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_ITENS_POR_PEDIDO)
  // A mesma variante duas vezes no pedido é rejeitada: some as quantidades no cliente.
  @ArrayUnique((item: OrderItemDto) => item?.variantId)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
