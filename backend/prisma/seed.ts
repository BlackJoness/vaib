import { PrismaClient, Tamanho } from "@prisma/client";
import * as bcrypt from "bcryptjs";

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

// Estoque de demonstração determinístico (0 a 24): o mesmo seed gera
// sempre o mesmo catálogo, o que deixa demo e testes reproduzíveis.
function estoqueDemo(sku: string): number {
  let h = 0;
  for (const ch of sku) h = (h * 31 + ch.charCodeAt(0)) % 1000;
  return h % 25;
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
            estoque: estoqueDemo(sku),
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
