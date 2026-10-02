import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  // Só admin (guard global). Produto mais vendido + alertas de estoque baixo por tamanho
  @Get("kpis")
  kpis() {
    return this.dashboard.getKpis();
  }
}
