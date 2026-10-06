import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import {
  ProductContent,
  ProductMedia,
  ProductOption,
  VariantAttributes,
  descreverAtributos,
} from "./product-content.types";

// Campos da variante expostos na loja. O estoque exato fica de fora:
// a vitrine só precisa saber se há unidade disponível, e o número
// interessa a concorrentes, não a clientes.
const VARIANTE_PUBLICA = {
  id: true,
  sku: true,
  attributes: true,
  preco: true,
  estoque: true,
} as const;

type VarianteDoBanco = {
  id: string;
  sku: string;
  attributes: Prisma.JsonValue;
  preco: Prisma.Decimal;
  estoque: number | null;
};

type ProdutoDoBanco = Prisma.ProductGetPayload<{
  include: { variants: { select: typeof VARIANTE_PUBLICA } };
}>;

// `estoque === null` é serviço ou ilimitado: sempre disponível.
function variantePublica(options: ProductOption[], { estoque, ...v }: VarianteDoBanco) {
  const attributes = (v.attributes ?? {}) as VariantAttributes;
  return {
    ...v,
    attributes,
    descricao: descreverAtributos(options, attributes),
    disponivel: estoque === null || estoque > 0,
  };
}

function produtoPublico(p: ProdutoDoBanco) {
  const options = (p.options ?? []) as unknown as ProductOption[];
  return {
    ...p,
    options,
    media: (p.media ?? []) as unknown as ProductMedia[],
    content: (p.content ?? {}) as unknown as Partial<ProductContent>,
    variants: p.variants.map((v) => variantePublica(options, v)),
  };
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Lista produtos ativos com suas variantes
  async findAll() {
    const produtos = await this.prisma.product.findMany({
      where: { ativo: true },
      include: { variants: { select: VARIANTE_PUBLICA } },
      orderBy: { createdAt: "asc" },
    });
    return produtos.map(produtoPublico);
  }

  // O produto da home. Um só; o seed e o dashboard garantem isso.
  async findDestaque() {
    const product = await this.prisma.product.findFirst({
      where: { destaque: true, ativo: true },
      include: { variants: { select: VARIANTE_PUBLICA } },
      orderBy: { updatedAt: "desc" },
    });
    if (!product) throw new NotFoundException("Nenhum produto em destaque");
    return produtoPublico(product);
  }

  // Produto inativo responde 404, igual a um slug inexistente
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, ativo: true },
      include: { variants: { select: VARIANTE_PUBLICA } },
    });
    if (!product) throw new NotFoundException("Produto não encontrado");
    return produtoPublico(product);
  }
}
