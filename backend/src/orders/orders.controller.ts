import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Public } from "../auth/public.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  // Público (checkout sem conta), mas com limite baixo por IP:
  // cada pedido reserva estoque, então criar em massa esvaziaria a loja.
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }

  // Só admin: Aguardando Pagamento → Em Separação → Enviado
  @Patch(":id/status")
  advance(@Param("id") id: string) {
    return this.orders.advanceStatus(id);
  }
}
