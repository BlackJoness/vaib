import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import OfertaBasica from "@/components/OfertaBasica";
import Editorial from "@/components/Editorial";
import Manifesto from "@/components/Manifesto";
import Newsletter from "@/components/Newsletter";
import { getProdutoDestaque } from "@/lib/api";
import { PRODUTO_FALLBACK } from "@/lib/produto-fallback";

// Loja de um produto: a home exibe o produto em destaque da API.
// Visual provisório até a etapa 4 (design novo e seções por conteúdo).
export default async function Home() {
  const produto = (await getProdutoDestaque()) ?? PRODUTO_FALLBACK;

  return (
    <>
      <Hero />
      <Benefits />
      <OfertaBasica produto={produto} />
      <Editorial />
      <Manifesto />
      <Newsletter />
    </>
  );
}
