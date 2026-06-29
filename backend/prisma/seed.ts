import { PrismaClient, Tamanho } from "@prisma/client";

const prisma = new PrismaClient();

const TAMANHOS: Tamanho[] = [
  Tamanho.P,
  Tamanho.M,
  Tamanho.G,
  Tamanho.GG,
];

const CORES = [
  { nome: "Coral Sol", cod: "COR", hex: "#FF7E67" },
  { nome: "Amarelo Manhã", cod: "AMA", hex: "#FFC857" },
  { nome: "Verde Brisa", cod: "VBR", hex: "#7FD8BE" },
  { nome: "Azul Sereno", cod: "AZS", hex: "#8EC5E8" },
  { nome: "Grafite Suave", cod: "GRF", hex: "#33303E" },
  { nome: "Creme Algodão", cod: "CRM", hex: "#FFF8F0" },
];

const MODELOS = [
  { cod: "BRISA", slug: "blusa-brisa", nome: "Blusa Scrub Brisa", preco: 159.9 },
  { cod: "FLUXO", slug: "calca-fluxo", nome: "Calça Scrub Fluxo", preco: 179.9 },
  { cod: "AURA", slug: "jaleco-aura", nome: "Jaleco Aura", preco: 219.9 },
];

async function main() {
  for (const m of MODELOS) {
    const product = await prisma.product.upsert({
      where: { slug: m.slug },
      update: {},
      create: {
        slug: m.slug,
        nome: m.nome,
        descricao: `${m.nome} — leve, respirável e alegre.`,
        precoBase: m.preco,
      },
    });

    for (const c of CORES) {
      for (const t of TAMANHOS) {
        const sku = `SOLE-${m.cod}-${c.cod}-${t}`;
        await prisma.variant.upsert({
          where: { sku },
          update: {},
          create: {
            sku,
            cor: c.nome,
            corHex: c.hex,
            tamanho: t,
            estoque: Math.floor(Math.random() * 25), // estoque demo
            preco: m.preco,
            productId: product.id,
          },
        });
      }
    }
  }
  console.log("Seed concluído: 3 modelos × 6 cores × 4 tamanhos = 72 variantes.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
