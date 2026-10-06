import SerifEmphasis from "@/components/ui/SerifEmphasis";
import MagneticButton from "@/components/ui/MagneticButton";
import { precoMinimo } from "@/lib/oferta";
import VidroProduto from "./VidroProduto";
import PillsDeOpcao from "./PillsDeOpcao";
import type { SectionProps } from "./types";

// Primeira dobra: a promessa do produto em texto e o bloco de vidro ao lado.
export default function Hero({ produto }: SectionProps) {
  const c = produto.content;
  const primeiraOpcao = produto.options[0];
  const imagem = produto.media.find((m) => m.kind === "image");

  return (
    <section className="mx-auto grid min-h-[86svh] max-w-7xl items-center gap-12 px-6 pb-16 pt-10 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h1 className="max-w-[14ch] text-5xl font-semibold leading-[0.98] tracking-display text-fg sm:text-6xl lg:text-7xl">
          <SerifEmphasis text={c.headline ?? produto.nome} emphasis={c.enfase} />
        </h1>
        {(c.subtitulo ?? produto.tagline) && (
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">{c.subtitulo ?? produto.tagline}</p>
        )}
        <div className="mt-9 flex flex-wrap gap-3">
          <MagneticButton href="#oferta">Escolher meu plano</MagneticButton>
          <MagneticButton href="#como-funciona" variant="ghost">
            Como funciona
          </MagneticButton>
        </div>
        {primeiraOpcao && (
          <div className="mt-10">
            <PillsDeOpcao opcao={primeiraOpcao} />
          </div>
        )}
      </div>

      <VidroProduto
        imagem={imagem}
        precoDesde={precoMinimo(produto)}
        destaque={c.provaSocial?.numeros?.[0]}
      />
    </section>
  );
}
