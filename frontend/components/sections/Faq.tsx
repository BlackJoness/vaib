import Accordion from "@/components/ui/Accordion";
import type { SectionProps } from "./types";

export default function Faq({ produto }: SectionProps) {
  const faq = produto.content.faq;
  if (!faq?.length) return null;
  return (
    <section id="faq" aria-labelledby="faq-titulo" className="mx-auto grid max-w-7xl scroll-mt-28 gap-10 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-8">
      <h2 id="faq-titulo" className="text-3xl font-semibold tracking-display text-fg sm:text-4xl">
        Dúvidas
      </h2>
      <div className="glass-flat rounded-panel px-7">
        <Accordion items={faq} />
      </div>
    </section>
  );
}
