import { Controller, Get } from "@nestjs/common";
import { Public } from "../auth/public.decorator";
import { StoreService } from "./store.service";

// Público: o dashboard mostra o nome da loja antes do login,
// e a loja pode consumir os contatos no fluxo de pedido.
@Public()
@Controller("store")
export class StoreController {
  constructor(private readonly store: StoreService) {}

  @Get()
  info() {
    return this.store.info();
  }
}
