import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

// Campos da variante expostos na loja. O estoque exato fica de fora:
// a vitrine só precisa saber se há unidade disponível, e o número
// interessa a concorrentes, não a clientes.
const VARIANTE_PUBLICA = {
  id: true,
  sku: true,
  cor: true,
  corHex: true,
  tamanho: true,
  preco: true,
  estoque: true,
} as const;

type VarianteDoBanco = {
  id: string;
  sku: string;
  cor: string;
  corHex: string;
  tamanho: string;
  preco: unknown;
  estoque: number;
};

function paraPublica({ estoque, ...v }: VarianteDoBanco) {
  return { ...v, disponivel: estoque > 0 };
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Lista produtos ativos com suas variantes (cor × tamanho × disponibilidade)
  async findAll() {
    const produtos = await this.prisma.product.findMany({
      where: { ativo: true },
      include: { variants: { select: VARIANTE_PUBLICA } },
      orderBy: { createdAt: "asc" },
    });
    return produtos.map((p) => ({ ...p, variants: p.variants.map(paraPublica) }));
  }

  // Produto inativo responde 404, igual a um slug inexistente
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, ativo: true },
      include: { variants: { select: VARIANTE_PUBLICA } },
    });
    if (!product) throw new NotFoundException("Produto não encontrado");
    return { ...product, variants: product.variants.map(paraPublica) };
  }
}
