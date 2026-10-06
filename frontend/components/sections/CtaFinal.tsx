import MagneticButton from "@/components/ui/MagneticButton";
import { storeConfig } from "@/store.config";
import type { SectionProps } from "./types";

// Fecho da página e ponto de contato (âncora #contato).
export default function CtaFinal({ produto }: SectionProps) {
  const contato = storeConfig.contact as { whatsapp?: string; email?: string; instagram?: string };
  return (
    <section id="contato" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-24 text-center md:px-8">
      <h2 className="mx-auto max-w-[18ch] text-4xl font-semibold leading-tight tracking-display text-fg sm:text-6xl">
        {produto.tagline ?? `Pronto para o seu ${produto.nome}?`}
      </h2>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <MagneticButton href="#oferta">Escolher meu plano</MagneticButton>
        {contato.whatsapp && (
          <MagneticButton href={`https://wa.me/${contato.whatsapp}`} variant="ghost">
            Conversar no WhatsApp
          </MagneticButton>
        )}
        {contato.email && (
          <MagneticButton href={`mailto:${contato.email}`} variant="ghost">
            Escrever um e-mail
          </MagneticButton>
        )}
      </div>
    </section>
  );
}
