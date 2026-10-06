import { getProdutoDestaque } from "@/lib/api";
import { PRODUTO_FALLBACK } from "@/lib/produto-fallback";
import { SECTIONS } from "@/lib/sections";
import { storeConfig } from "@/store.config";

// Loja de um produto: a home monta as seções do config com o produto em destaque.
export default async function Home() {
  const produto = (await getProdutoDestaque()) ?? PRODUTO_FALLBACK;
  return (
    <main>
      {storeConfig.sections.map((chave) => {
        const Secao = SECTIONS[chave];
        return <Secao key={chave} produto={produto} />;
      })}
    </main>
  );
}
