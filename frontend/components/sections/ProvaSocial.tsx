import Counter from "@/components/ui/Counter";
import type { SectionProps } from "./types";

export default function ProvaSocial({ produto }: SectionProps) {
  const p = produto.content.provaSocial;
  if (!p || (!p.numeros?.length && !p.depoimentos?.length)) return null;
  return (
    <section aria-label="O que dizem os clientes" className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      {p.numeros?.length > 0 && (
        <dl className="grid gap-8 border-y border-fg/10 py-10 sm:grid-cols-3">
          {p.numeros.map((n) => (
            <div key={n.rotulo}>
              <dt className="sr-only">{n.rotulo}</dt>
              <dd className="text-5xl font-semibold tracking-display text-fg">
                <Counter value={n.valor} />
              </dd>
              <dd className="mt-1 text-muted">{n.rotulo}</dd>
            </div>
          ))}
        </dl>
      )}
      {p.depoimentos?.length > 0 && (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {p.depoimentos.map((d) => (
            <figure key={d.autor} className="glass-flat rounded-panel p-8">
              <blockquote className="font-serif text-2xl italic leading-snug text-fg sm:text-3xl">“{d.texto}”</blockquote>
              <figcaption className="mt-5 text-sm text-muted">{d.autor}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
