import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
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

  // Só dígitos, com DDI e DDD. É por aqui que o lojista responde (ADR 0001).
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.replace(/\D/g, "") : value))
  @IsString()
  @Matches(/^\d{10,15}$/, { message: "clienteWhatsapp precisa ter de 10 a 15 dígitos, com DDI e DDD" })
  clienteWhatsapp?: string;

  // Preferência de horário, endereço, observação do cliente.
  @IsOptional()
  @Transform(aparar)
  @IsString()
  @MaxLength(500)
  clienteMensagem?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_ITENS_POR_PEDIDO)
  // A mesma variante duas vezes no pedido é rejeitada: some as quantidades no cliente.
  @ArrayUnique((item: OrderItemDto) => item?.variantId)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
