import Hero from "@/components/Hero";
import ProductGrid, { type GridItem } from "@/components/ProductGrid";
import { getProducts } from "@/lib/api";

// Server Component: busca os produtos no servidor (SSR/ISR → bom para SEO).
// Se a API estiver fora, cai num conjunto de exemplo para não quebrar a página.
const FALLBACK: GridItem[] = [
  { id: "1", nome: "Blusa Brisa", cor: "Coral Sol", corHex: "#FF7E67", preco: 159.9 },
  { id: "2", nome: "Calça Fluxo", cor: "Verde Brisa", corHex: "#7FD8BE", preco: 179.9 },
  { id: "3", nome: "Jaleco Aura", cor: "Azul Sereno", corHex: "#8EC5E8", preco: 219.9 },
  { id: "4", nome: "Blusa Brisa", cor: "Amarelo Manhã", corHex: "#FFC857", preco: 159.9 },
];

export default async function Home() {
  const produtos = await getProducts();

  // Para a vitrine, usa a 1ª variante de cada produto como destaque
  const itens: GridItem[] =
    produtos.length > 0
      ? produtos.slice(0, 8).map((p) => {
          const v = p.variants[0];
          return {
            id: p.id,
            nome: p.nome,
            cor: v?.cor ?? "—",
            corHex: v?.corHex ?? "#FFC857",
            preco: v?.preco ?? p.precoBase,
          };
        })
      : FALLBACK;

  return (
    <main className="bg-creme">
      <Hero />
      <section className="px-8 py-16">
        <h2 className="mb-8 font-display text-3xl font-bold text-grafite">
          Mais queridos
        </h2>
        <ProductGrid itens={itens} />
      </section>
    </main>
  );
}
