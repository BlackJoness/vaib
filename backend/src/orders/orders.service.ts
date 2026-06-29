import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { OrderStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NEXT_STATUS } from "./order-status.enum";
import { CreateOrderDto } from "./dto/create-order.dto";

type ItemData = {
  variantId: string;
  quantidade: number;
  precoUnitario: Prisma.Decimal;
};

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Cria pedido: baixa estoque de forma segura (sem oversell) e nasce
  // "Aguardando Pagamento". Tudo numa única transação.
  async create(dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      let total = new Prisma.Decimal(0);
      const itemsData: ItemData[] = [];

      for (const it of dto.items) {
        const variant = await tx.variant.findUnique({
          where: { id: it.variantId },
        });
        if (!variant) {
          throw new NotFoundException(`Variante ${it.variantId} inexistente`);
        }

        // Decremento condicional: só baixa se ainda houver estoque suficiente.
        // Evita corrida entre pedidos simultâneos (oversell).
        const baixa = await tx.variant.updateMany({
          where: { id: variant.id, estoque: { gte: it.quantidade } },
          data: { estoque: { decrement: it.quantidade } },
        });
        if (baixa.count === 0) {
          throw new ConflictException(
            `Estoque insuficiente para SKU ${variant.sku}`,
          );
        }

        total = total.add(variant.preco.mul(it.quantidade));
        itemsData.push({
          variantId: variant.id,
          quantidade: it.quantidade,
          precoUnitario: variant.preco,
        });
      }

      return tx.order.create({
        data: {
          clienteNome: dto.clienteNome,
          clienteEmail: dto.clienteEmail,
          status: OrderStatus.AGUARDANDO_PAGAMENTO, // status inicial fixo
          total,
          items: { create: itemsData },
        },
        include: { items: true },
      });
    });
  }

  // Avança status respeitando a máquina de estados
  async advanceStatus(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException("Pedido não encontrado");

    const proximo = NEXT_STATUS[order.status];
    if (!proximo) {
      throw new BadRequestException(
        `Pedido já está em "${order.status}" (estado final)`,
      );
    }
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: proximo },
    });
  }
}
