import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  // Cria pedido → status inicial "Aguardando Pagamento"
  @Post()
  create(
    @Body()
    dto: {
      clienteNome: string;
      clienteEmail: string;
      items: { variantId: string; quantidade: number }[];
    },
  ) {
    return this.orders.create(dto);
  }

  // Avança status: Aguardando Pagamento → Em Separação → Enviado
  @Patch(":id/status")
  advance(@Param("id") id: string) {
    return this.orders.advanceStatus(id);
  }
}
