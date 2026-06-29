import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NEXT_STATUS } from "./order-status.enum";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Cria pedido: valida estoque, baixa estoque e nasce "Aguardando Pagamento"
  async create(dto: {
    clienteNome: string;
    clienteEmail: string;
    items: { variantId: string; quantidade: number }[];
  }) {
    return this.prisma.$transaction(async (tx) => {
      let total = 0;
      const itemsData = [];

      for (const it of dto.items) {
        const variant = await tx.variant.findUnique({
          where: { id: it.variantId },
        });
        if (!variant)
          throw new NotFoundException(`Variante ${it.variantId} inexistente`);
        if (variant.estoque < it.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para SKU ${variant.sku}`,
          );
        }
        await tx.variant.update({
          where: { id: variant.id },
          data: { estoque: { decrement: it.quantidade } },
        });
        total += Number(variant.preco) * it.quantidade;
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
