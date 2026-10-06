import SpotlightCard from "@/components/ui/SpotlightCard";
import RevealRow from "@/components/ui/RevealRow";
import type { SectionProps } from "./types";

export default function Beneficios({ produto }: SectionProps) {
  const itens = produto.content.beneficios;
  if (!itens?.length) return null;
  return (
    <section aria-labelledby="beneficios-titulo" className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <h2 id="beneficios-titulo" className="max-w-[20ch] text-3xl font-semibold tracking-display text-fg sm:text-4xl">
        Por que escolher {produto.nome}
      </h2>
      <RevealRow className="mt-10 grid gap-4 md:grid-cols-3">
        {itens.map((b) => (
          <SpotlightCard key={b.titulo} className="h-full p-7">
            <h3 className="text-lg font-semibold text-fg">{b.titulo}</h3>
            <p className="mt-2 leading-relaxed text-muted">{b.texto}</p>
          </SpotlightCard>
        ))}
      </RevealRow>
    </section>
  );
}
