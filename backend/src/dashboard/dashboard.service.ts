import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  ProductOption,
  VariantAttributes,
  descreverAtributos,
} from "../products/product-content.types";

const LIMITE_ESTOQUE_BAIXO = 5;

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKpis() {
    // 1) Produto mais vendido — sem N+1:
    //    agrega por variante e resolve todas as variantes em UMA query.
    const porVariante = await this.prisma.orderItem.groupBy({
      by: ["variantId"],
      _sum: { quantidade: true },
    });

    let produtoMaisVendido: { nome: string; unidades: number } | null = null;

    if (porVariante.length > 0) {
      const variants = await this.prisma.variant.findMany({
        where: { id: { in: porVariante.map((v) => v.variantId) } },
        include: { product: true },
      });
      const nomePorVariante = new Map(
        variants.map((v) => [v.id, v.product.nome]),
      );

      const totalPorProduto = new Map<string, number>();
      for (const linha of porVariante) {
        const nome = nomePorVariante.get(linha.variantId);
        if (!nome) continue;
        totalPorProduto.set(
          nome,
          (totalPorProduto.get(nome) ?? 0) + (linha._sum.quantidade ?? 0),
        );
      }
      const top = [...totalPorProduto.entries()].sort((a, b) => b[1] - a[1])[0];
      if (top) produtoMaisVendido = { nome: top[0], unidades: top[1] };
    }

    // 2) Alerta de estoque baixo. Variantes sem controle de estoque
    //    (estoque null: serviço ou ilimitado) ficam de fora.
    const estoqueBaixo = await this.prisma.variant.findMany({
      where: { estoque: { not: null, lte: LIMITE_ESTOQUE_BAIXO } },
      include: { product: true },
      orderBy: { estoque: "asc" },
    });

    return {
      produtoMaisVendido,
      alertasEstoqueBaixo: estoqueBaixo.map((v) => ({
        sku: v.sku,
        produto: v.product.nome,
        variante: descreverAtributos(
          (v.product.options ?? []) as unknown as ProductOption[],
          (v.attributes ?? {}) as VariantAttributes,
        ),
        estoque: v.estoque as number,
      })),
    };
  }
}
