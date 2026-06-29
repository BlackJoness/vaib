import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const LIMITE_ESTOQUE_BAIXO = 5;

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKpis() {
    // 1) Produto mais vendido (soma de quantidades por produto)
    const porVariante = await this.prisma.orderItem.groupBy({
      by: ["variantId"],
      _sum: { quantidade: true },
      orderBy: { _sum: { quantidade: "desc" } },
    });

    const agregadoPorProduto = new Map<string, number>();
    for (const linha of porVariante) {
      const v = await this.prisma.variant.findUnique({
        where: { id: linha.variantId },
        include: { product: true },
      });
      if (!v) continue;
      const atual = agregadoPorProduto.get(v.product.nome) ?? 0;
      agregadoPorProduto.set(
        v.product.nome,
        atual + (linha._sum.quantidade ?? 0),
      );
    }
    const maisVendido =
      [...agregadoPorProduto.entries()].sort((a, b) => b[1] - a[1])[0] ?? null;

    // 2) Alerta de estoque baixo por tamanho
    const estoqueBaixo = await this.prisma.variant.findMany({
      where: { estoque: { lte: LIMITE_ESTOQUE_BAIXO } },
      include: { product: true },
      orderBy: { estoque: "asc" },
    });

    return {
      produtoMaisVendido: maisVendido
        ? { nome: maisVendido[0], unidades: maisVendido[1] }
        : null,
      alertasEstoqueBaixo: estoqueBaixo.map((v) => ({
        sku: v.sku,
        produto: v.product.nome,
        cor: v.cor,
        tamanho: v.tamanho, // P | M | G | GG
        estoque: v.estoque,
      })),
    };
  }
}
