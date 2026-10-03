import type { Product } from "@/lib/types";
import OptionSelector from "./OptionSelector";
import Reveal from "./Reveal";

// Oferta do produto único: nome, descrição, seletor de opções e preço.
// Versão mínima da etapa 2; vira a seção `oferta` do design novo na etapa 4,
// e o botão passa a criar o pedido na etapa 5.
export default function OfertaBasica({ produto }: { produto: Product }) {
  return (
    <section id="oferta" className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <Reveal>
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-coral">
              {produto.kind === "SERVICE" ? "Serviço" : "Produto"}
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold text-grafite">{produto.nome}</h2>
            {produto.tagline && <p className="mt-3 text-lg text-grafite/80">{produto.tagline}</p>}
            {produto.descricao && <p className="mt-4 text-grafite/70">{produto.descricao}</p>}
          </div>
          <div className="rounded-xl2 bg-white p-6 shadow-soft">
            <OptionSelector produto={produto} />
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-coral px-6 py-3 font-semibold text-white transition-colors hover:bg-coral-600"
            >
              {produto.kind === "SERVICE" ? "Quero este projeto" : "Comprar"}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
