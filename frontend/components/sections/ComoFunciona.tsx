import RevealRow from "@/components/ui/RevealRow";
import type { SectionProps } from "./types";

// Passos em sequência: aqui a numeração é informação, não enfeite.
export default function ComoFunciona({ produto }: SectionProps) {
  const passos = produto.content.passos;
  if (!passos?.length) return null;
  const titulo = produto.kind === "SERVICE" ? "Como funciona" : "Especificações";
  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16 md:px-8">
      <h2 id="como-titulo" className="text-3xl font-semibold tracking-display text-fg sm:text-4xl">
        {titulo}
      </h2>
      <RevealRow className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
        {passos.map((p, i) => (
          <div key={p.titulo} className="border-t border-fg/15 pt-6">
            <span className="font-serif text-5xl italic leading-none text-accent">{i + 1}</span>
            <h3 className="mt-4 text-lg font-semibold text-fg">{p.titulo}</h3>
            <p className="mt-2 max-w-[38ch] leading-relaxed text-muted">{p.texto}</p>
          </div>
        ))}
      </RevealRow>
    </section>
  );
}
