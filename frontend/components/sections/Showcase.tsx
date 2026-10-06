import ZoomMedia from "@/components/ui/ZoomMedia";
import type { SectionProps } from "./types";

// O produto em tamanho grande, com a descrição sobre um painel de vidro.
export default function Showcase({ produto }: SectionProps) {
  const imagem = produto.media.find((m) => m.kind === "image");
  return (
    <section id="showcase" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16 md:px-8">
      <ZoomMedia className="relative aspect-[4/5] sm:aspect-[16/8]">
        <div className="relative h-full w-full bg-raised/50">
          {imagem ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagem.url} alt={imagem.alt} className="h-full w-full object-cover" />
          ) : (
            // Composição provisória em escala de vitrine; a foto real entra no lugar
            <div aria-hidden className="absolute inset-0">
              <div className="absolute left-[8%] top-[10%] aspect-square w-[34%] rounded-full bg-gradient-to-br from-accent to-accent-strong sm:w-[26%]" />
              <div className="absolute bottom-[-10%] right-[12%] aspect-square w-[40%] rounded-[3rem] bg-gradient-to-tr from-[#4F6BD8] to-[#9DB1F4] sm:w-[30%]" />
              <div className="absolute left-[52%] top-0 h-full w-12 -skew-x-12 bg-fg/15" />
              <div className="glass-flat absolute right-[30%] top-[18%] aspect-[4/3] w-[36%] rounded-[1.5rem] sm:w-[28%]" />
            </div>
          )}
        </div>
      </ZoomMedia>
      <div className="glass-1 relative mx-4 -mt-24 max-w-xl rounded-panel p-7 sm:mx-10 sm:-mt-32">
        <h2 className="text-2xl font-semibold tracking-display text-fg sm:text-3xl">{produto.nome}</h2>
        {produto.descricao && <p className="mt-3 leading-relaxed text-muted">{produto.descricao}</p>}
      </div>
    </section>
  );
}
