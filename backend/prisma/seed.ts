import { PrismaClient, ProductKind } from "@prisma/client";
import {
  ProductContent,
  ProductMedia,
  ProductOption,
  VariantAttributes,
  attributesKey,
} from "../src/products/product-content.types";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Produto placeholder da loja: um serviço de design e decoração.
// O conteúdo é genérico de propósito; troca-se pelo dashboard (etapa 6)
// ou editando aqui e rodando o seed de novo.
const XPTO = {
  slug: "xpto",
  nome: "XPTO",
  tagline: "Design e decoração sob medida, do briefing à entrega.",
  descricao:
    "Projeto de interiores completo para um ambiente ou para a casa inteira, com acompanhamento até a montagem.",
  kind: ProductKind.SERVICE,
  precoBase: 2900,
  options: [
    {
      key: "escopo",
      label: "Escopo",
      values: [
        { value: "ambiente", label: "Um ambiente" },
        { value: "casa", label: "Casa completa" },
      ],
    },
    {
      key: "entrega",
      label: "Entrega",
      values: [
        { value: "padrao", label: "30 dias" },
        { value: "express", label: "15 dias" },
      ],
    },
  ] satisfies ProductOption[],
  media: [] satisfies ProductMedia[],
  content: {
    headline: "Um espaço com a sua cara",
    enfase: "sua cara",
    subtitulo:
      "Projeto completo de interiores, do briefing ao último detalhe. Você escolhe o escopo e o prazo; a gente cuida do resto.",
    beneficios: [
      { titulo: "Projeto autoral", texto: "Nada de catálogo: cada ambiente nasce da sua rotina e do que você gosta." },
      { titulo: "Orçamento fechado", texto: "Preço definido antes de começar. Sem surpresa no fim." },
      { titulo: "Acompanhamento", texto: "Da compra à montagem, com alguém respondendo no WhatsApp." },
    ],
    passos: [
      { titulo: "Briefing", texto: "Uma conversa de 40 minutos sobre o espaço, a rotina e as referências." },
      { titulo: "Proposta", texto: "Plantas, paleta e moodboard em até 7 dias, com uma rodada de ajustes." },
      { titulo: "Execução", texto: "Lista de compras, fornecedores e acompanhamento da montagem." },
    ],
    faq: [
      { pergunta: "Atende fora da minha cidade?", resposta: "Sim. O projeto é remoto; a montagem conta com parceiros locais." },
      { pergunta: "Posso contratar só a consultoria?", resposta: "Pode. O escopo \"Um ambiente\" cobre uma consultoria completa." },
      { pergunta: "Como funciona o pagamento?", resposta: "Depois do pedido, a gente entra em contato para alinhar e fechar." },
    ],
    provaSocial: {
      numeros: [
        { valor: "120+", rotulo: "projetos entregues" },
        { valor: "4.9", rotulo: "avaliação média" },
        { valor: "15", rotulo: "dias no plano express" },
      ],
      depoimentos: [
        { texto: "Entregaram exatamente o que eu não sabia descrever.", autor: "Marina, Recife" },
        { texto: "Prazo cumprido e zero dor de cabeça com fornecedor.", autor: "Caio, São Paulo" },
      ],
    },
  } satisfies ProductContent,
};

// Preço por combinação: casa completa custa mais; express tem acréscimo.
const PRECOS: Record<string, number> = {
  "entrega=express;escopo=ambiente": 3600,
  "entrega=express;escopo=casa": 8400,
  "entrega=padrao;escopo=ambiente": 2900,
  "entrega=padrao;escopo=casa": 6900,
};

// Toda combinação das opções do produto: [{ escopo, entrega }, ...]
function combinacoes(options: ProductOption[]): VariantAttributes[] {
  return options.reduce<VariantAttributes[]>(
    (acc, o) => acc.flatMap((parcial) => o.values.map((v) => ({ ...parcial, [o.key]: v.value }))),
    [{}],
  );
}

// Cria o primeiro admin a partir do ambiente. Não existe cadastro público.
// Se o admin já existir, a senha NÃO é sobrescrita.
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_PASSWORD;
  if (!email || !senha) {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD ausentes: nenhum admin criado.");
    return;
  }
  if (senha.length < 12) {
    throw new Error("ADMIN_PASSWORD precisa ter ao menos 12 caracteres.");
  }
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, senhaHash: await bcrypt.hash(senha, 12) },
  });
  console.log(`Admin garantido: ${email}`);
}

async function main() {
  await seedAdmin();

  // Só um produto em destaque: desmarca os outros antes de garantir o XPTO.
  await prisma.product.updateMany({ where: { slug: { not: XPTO.slug } }, data: { destaque: false } });

  const { options, media, content, ...dados } = XPTO;
  const product = await prisma.product.upsert({
    where: { slug: XPTO.slug },
    update: { ...dados, destaque: true, options, media, content },
    create: { ...dados, destaque: true, options, media, content },
  });

  let n = 0;
  for (const attributes of combinacoes(options)) {
    const chave = attributesKey(attributes);
    const preco = PRECOS[chave] ?? XPTO.precoBase;
    const sku = `${XPTO.nome}-${Object.values(attributes).join("-")}`.toUpperCase();
    await prisma.variant.upsert({
      where: { productId_attributesKey: { productId: product.id, attributesKey: chave } },
      update: { sku, preco },
      create: {
        sku,
        attributes,
        attributesKey: chave,
        estoque: XPTO.kind === ProductKind.SERVICE ? null : 0, // serviço: sem estoque
        preco,
        productId: product.id,
      },
    });
    n++;
  }
  console.log(`Seed concluído: ${XPTO.nome} em destaque com ${n} variantes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
