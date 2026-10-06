"use client";
import { useEffect, useMemo, useState } from "react";
import OptionSelector from "@/components/OptionSelector";
import MagneticButton from "@/components/ui/MagneticButton";
import LightField from "@/components/ui/LightField";
import { formatBRL } from "@/lib/format";
import { EVENTO_ESCOLHER, linkWhatsApp, selecaoInicial, varianteDe, type Escolha } from "@/lib/oferta";
import { storeConfig } from "@/store.config";
import type { SectionProps } from "./types";

/**
 * Oferta: escolha das opções, preço da combinação e o botão de fechamento.
 * Com WhatsApp no config, o botão abre a conversa com o pedido escrito;
 * sem ele, leva ao contato. O carrinho e o pedido entram na etapa 5.
 */
export default function Oferta({ produto }: SectionProps) {
  const [sel, setSel] = useState(() => selecaoInicial(produto));
  const variante = useMemo(() => varianteDe(produto, sel), [produto, sel]);
  const whatsapp = (storeConfig.contact as { whatsapp?: string }).whatsapp;

  // Pills do hero escolhem uma opção aqui.
  useEffect(() => {
    const ouvir = (e: Event) => {
      const { key, value } = (e as CustomEvent<Escolha>).detail;
      setSel((s) => ({ ...s, [key]: value }));
    };
    window.addEventListener(EVENTO_ESCOLHER, ouvir);
    return () => window.removeEventListener(EVENTO_ESCOLHER, ouvir);
  }, []);

  const pronto = variante?.disponivel === true;
  const rotulo = produto.kind === "SERVICE" ? "Quero este projeto" : "Quero este";

  return (
    <section id="oferta" aria-labelledby="oferta-titulo" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16 md:px-8">
      <div className="relative overflow-hidden rounded-[2rem] p-3 ring-1 ring-fg/10 sm:p-6">
        <LightField />
        <div className="glass-2 relative grid gap-10 rounded-panel p-7 sm:p-10 md:grid-cols-[1fr_1fr]">
          <div>
            <h2 id="oferta-titulo" className="text-3xl font-semibold tracking-display text-fg sm:text-4xl">
              Monte o seu {produto.nome}
            </h2>
            {produto.tagline && <p className="mt-3 max-w-[40ch] text-muted">{produto.tagline}</p>}
            <div className="mt-8">
              <OptionSelector produto={produto} sel={sel} onChange={(k, v) => setSel((s) => ({ ...s, [k]: v }))} />
            </div>
          </div>

          <div className="flex flex-col justify-end gap-6 border-t border-fg/10 pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <div aria-live="polite">
              <p className="text-sm text-muted">{variante ? variante.descricao : "Combinação indisponível"}</p>
              <p className="mt-1 text-5xl font-semibold tabular-nums tracking-display text-fg">
                {variante ? formatBRL(variante.preco) : "—"}
              </p>
              {variante && !variante.disponivel && <p className="mt-2 text-sm text-muted">Esgotado nesta combinação.</p>}
            </div>
            {pronto && whatsapp && variante ? (
              <MagneticButton href={linkWhatsApp(whatsapp, produto, variante)} className="w-full sm:w-auto">
                {rotulo} pelo WhatsApp
              </MagneticButton>
            ) : (
              <MagneticButton href="#contato" disabled={!pronto} className="w-full sm:w-auto">
                {rotulo}
              </MagneticButton>
            )}
            <p className="text-xs text-muted">
              A gente responde para combinar os detalhes. Nada é cobrado antes disso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
