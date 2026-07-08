import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Controller("orders")
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  // Lista pedidos para o dashboard
  @Get()
  findAll() {
    return this.orders.findAll();
  }

  // Cria pedido → status inicial "Aguardando Pagamento"
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }

  // Avança status: Aguardando Pagamento → Em Separação → Enviado
  @Patch(":id/status")
  advance(@Param("id") id: string) {
    return this.orders.advanceStatus(id);
  }
}
