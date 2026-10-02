import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import ProductGrid, { type GridItem } from "@/components/ProductGrid";
import CategoryGrid from "@/components/CategoryGrid";
import Editorial from "@/components/Editorial";
import Manifesto from "@/components/Manifesto";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import { getProducts } from "@/lib/api";

// Vitrine de exemplo (usada se a API estiver fora). Substituída pelo produto único na etapa 2.
const FALLBACK: GridItem[] = [
  { id: "1", nome: "Blusa Brisa", cor: "Coral Sol", corHex: "#FF7E67", preco: 159.9, cores: 6, novo: true },
  { id: "2", nome: "Calça Fluxo", cor: "Verde Brisa", corHex: "#7FD8BE", preco: 179.9, cores: 6 },
  { id: "3", nome: "Jaleco Aura", cor: "Azul Sereno", corHex: "#8EC5E8", preco: 219.9, cores: 4 },
  { id: "4", nome: "Blusa Brisa", cor: "Amarelo Manhã", corHex: "#FFC857", preco: 159.9, cores: 6, novo: true },
];

export default async function Home() {
  const produtos = await getProducts();

  const itens: GridItem[] =
    produtos.length > 0
      ? produtos.slice(0, 8).map((p) => {
          const v = p.variants[0];
          const cores = new Set(p.variants.map((x) => x.cor)).size;
          return {
            id: p.id,
            nome: p.nome,
            cor: v?.cor ?? "—",
            corHex: v?.corHex ?? "#FFC857",
            preco: v?.preco ?? p.precoBase,
            cores,
          };
        })
      : FALLBACK;

  return (
    <>
      <Hero />
      <Benefits />

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <Reveal>
          <h2 className="mb-8 font-display text-3xl font-bold text-grafite">
            Mais queridos
          </h2>
        </Reveal>
        <ProductGrid itens={itens} />
      </section>

      <Editorial />
      <CategoryGrid />
      <Manifesto />
      <Newsletter />
    </>
  );
}
