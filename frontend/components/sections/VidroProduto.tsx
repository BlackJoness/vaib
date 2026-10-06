import { formatBRL } from "@/lib/format";
import TiltMedia from "@/components/ui/TiltMedia";

/**
 * Mídia provisória do produto, toda em CSS: um bloco de vidro iluminado de
 * cima, sobre formas nítidas que o vidro desfoca. Quando o produto tiver foto
 * (Product.media), a foto entra no lugar das formas e o vidro continua.
 *
 * Usa dois backdrop-filter (bloco e um selo); com a nav, são os três
 * permitidos na primeira dobra.
 */
export default function VidroProduto({
  imagem,
  precoDesde,
  destaque,
}: {
  imagem?: { url: string; alt: string };
  precoDesde: number;
  destaque?: { valor: string; rotulo: string };
}) {
  return (
    <TiltMedia className="w-full">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-raised/50 ring-1 ring-fg/10 sm:aspect-square lg:aspect-[4/5]">
        {imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagem.url} alt={imagem.alt} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div aria-hidden className="absolute inset-0">
            {/* Feixe de luz vindo de cima */}
            <div className="absolute left-1/2 top-[-20%] h-[70%] w-[55%] -translate-x-1/2 rounded-full bg-accent/50 blur-3xl" />
            {/* Formas nítidas que o vidro vai desfocar */}
            <div className="absolute left-[14%] top-[22%] aspect-square w-[38%] rounded-full bg-gradient-to-br from-accent to-accent-strong" />
            <div className="absolute bottom-[12%] right-[10%] aspect-square w-[34%] rounded-[2rem] bg-gradient-to-tr from-[#4F6BD8] to-[#9DB1F4]" />
            <div className="absolute left-[46%] top-0 h-full w-8 -skew-x-12 bg-fg/15" />
          </div>
        )}

        {/* O bloco de vidro: o "produto" */}
        <div className="glass-3 absolute left-1/2 top-1/2 h-[46%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem]">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        </div>

        {/* Selo de preço */}
        <div className="glass-1 absolute bottom-5 left-5 rounded-2xl px-4 py-3">
          <p className="text-xs text-muted">a partir de</p>
          <p className="text-lg font-semibold tabular-nums text-fg">{formatBRL(precoDesde)}</p>
        </div>

        {destaque && (
          <div className="glass-flat absolute right-5 top-5 rounded-2xl px-4 py-3 text-right">
            <p className="text-lg font-semibold tabular-nums text-fg">{destaque.valor}</p>
            <p className="text-xs text-muted">{destaque.rotulo}</p>
          </div>
        )}
      </div>
    </TiltMedia>
  );
}
