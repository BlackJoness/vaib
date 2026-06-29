import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { OrdersModule } from "./orders/orders.module";
import { DashboardModule } from "./dashboard/dashboard.module";

@Module({
  imports: [PrismaModule, OrdersModule, DashboardModule],
})
export class AppModule {}
