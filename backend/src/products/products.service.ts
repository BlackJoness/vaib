import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Lista produtos ativos com suas variantes (cor × tamanho × estoque)
  findAll() {
    return this.prisma.product.findMany({
      where: { ativo: true },
      include: { variants: true },
      orderBy: { createdAt: "asc" },
    });
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { variants: true },
    });
    if (!product) throw new NotFoundException("Produto não encontrado");
    return product;
  }
}
