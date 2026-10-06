import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { OrderStatus, Prisma, ProductKind } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NEXT_STATUS, STATUS_FINAIS } from "./order-status.enum";
import { CreateOrderDto } from "./dto/create-order.dto";
import {
  ProductOption,
  VariantAttributes,
  descreverAtributos,
} from "../products/product-content.types";

type ItemData = {
  variantId: string;
  descricao: string;
  quantidade: number;
  precoUnitario: Prisma.Decimal;
};

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Cria pedido numa única transação. Preço e total vêm do banco, nunca do
  // cliente. Variante com estoque é baixada sem oversell; variante sem estoque
  // (serviço ou ilimitado) não é tocada. O tipo do produto vira snapshot no pedido.
  async create(dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      let total = new Prisma.Decimal(0);
      let fulfillmentType: ProductKind | null = null;
      const itemsData: ItemData[] = [];

      for (const it of dto.items) {
        const variant = await tx.variant.findUnique({
          where: { id: it.variantId },
          include: { product: { select: { nome: true, kind: true, options: true } } },
        });
        if (!variant) {
          throw new NotFoundException(`Variante ${it.variantId} inexistente`);
        }

        // Um pedido, um tipo de atendimento: físico e serviço não se misturam.
        if (fulfillmentType && fulfillmentType !== variant.product.kind) {
          throw new BadRequestException(
            "Itens de produto físico e de serviço não podem ir no mesmo pedido",
          );
        }
        fulfillmentType = variant.product.kind;

        if (variant.estoque !== null) {
          // Decremento condicional: só baixa se ainda houver estoque suficiente.
          // Evita corrida entre pedidos simultâneos (oversell).
          const baixa = await tx.variant.updateMany({
            where: { id: variant.id, estoque: { gte: it.quantidade } },
            data: { estoque: { decrement: it.quantidade } },
          });
          if (baixa.count === 0) {
            throw new ConflictException(`Estoque insuficiente para SKU ${variant.sku}`);
          }
        }

        const options = (variant.product.options ?? []) as unknown as ProductOption[];
        const attributes = (variant.attributes ?? {}) as VariantAttributes;
        const detalhe = descreverAtributos(options, attributes);

        total = total.add(variant.preco.mul(it.quantidade));
        itemsData.push({
          variantId: variant.id,
          descricao: detalhe ? `${variant.product.nome} · ${detalhe}` : variant.product.nome,
          quantidade: it.quantidade,
          precoUnitario: variant.preco,
        });
      }

      return tx.order.create({
        data: {
          clienteNome: dto.clienteNome,
          clienteEmail: dto.clienteEmail,
          clienteWhatsapp: dto.clienteWhatsapp ?? null,
          clienteMensagem: dto.clienteMensagem ?? null,
          fulfillmentType: fulfillmentType ?? ProductKind.PHYSICAL,
          status: OrderStatus.NOVO, // status inicial fixo
          total,
          items: { create: itemsData },
        },
        include: { items: true },
      });
    });
  }

  // Avança status respeitando a máquina de estados.
  // A atualização só acontece se o status ainda for o que foi lido:
  // dois cliques simultâneos não avançam o pedido duas vezes.
  async advanceStatus(orderId: string) {
    const order = await this.buscar(orderId);

    const proximo = NEXT_STATUS[order.status];
    if (!proximo) {
      throw new BadRequestException(`Pedido já está em "${order.status}" (estado final)`);
    }
    return this.mudarStatus(order, proximo);
  }

  // Cancela de qualquer estado não final. Não devolve estoque: o lojista decide
  // isso no dashboard, porque um cancelamento tardio pode ser de item já enviado.
  async cancel(orderId: string) {
    const order = await this.buscar(orderId);
    if (STATUS_FINAIS.has(order.status)) {
      throw new BadRequestException(`Pedido já está em "${order.status}" (estado final)`);
    }
    return this.mudarStatus(order, OrderStatus.CANCELADO);
  }

  private async buscar(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException("Pedido não encontrado");
    return order;
  }

  private async mudarStatus(order: { id: string; status: OrderStatus }, proximo: OrderStatus) {
    const { count } = await this.prisma.order.updateMany({
      where: { id: order.id, status: order.status },
      data: { status: proximo },
    });
    if (count === 0) {
      throw new ConflictException(
        "O status do pedido mudou durante a operação. Recarregue e tente de novo.",
      );
    }
    return { ...order, status: proximo };
  }
}
