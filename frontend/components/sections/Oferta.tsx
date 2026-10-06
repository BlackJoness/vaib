"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import OptionSelector from "@/components/OptionSelector";
import MagneticButton from "@/components/ui/MagneticButton";
import LightField from "@/components/ui/LightField";
import { formatBRL } from "@/lib/format";
import { EVENTO_ESCOLHER, linkWhatsApp, selecaoInicial, varianteDe, type Escolha } from "@/lib/oferta";
import type { PedidoCriado } from "@/lib/pedido";
import { storeConfig } from "@/store.config";
import FormPedido from "./FormPedido";
import PedidoConfirmado from "./PedidoConfirmado";
import type { SectionProps } from "./types";

type Passo = "escolha" | "dados" | "confirmado";

/**
 * Oferta em três passos no mesmo painel de vidro: escolher as opções,
 * informar o contato e ver o pedido confirmado (ADR 0005).
 */
export default function Oferta({ produto }: SectionProps) {
  const [sel, setSel] = useState(() => selecaoInicial(produto));
  const [passo, setPasso] = useState<Passo>("escolha");
  const [pedido, setPedido] = useState<PedidoCriado | null>(null);
  const variante = useMemo(() => varianteDe(produto, sel), [produto, sel]);
  const whatsapp = (storeConfig.contact as { whatsapp?: string }).whatsapp;
  const titulo = useRef<HTMLHeadingElement>(null);
  const primeiraRenderizacao = useRef(true);

  // Pills do hero escolhem uma opção e trazem de volta ao passo de escolha.
  useEffect(() => {
    const ouvir = (e: Event) => {
      const { key, value } = (e as CustomEvent<Escolha>).detail;
      setSel((s) => ({ ...s, [key]: value }));
      setPasso((p) => (p === "confirmado" ? p : "escolha"));
    };
    window.addEventListener(EVENTO_ESCOLHER, ouvir);
    return () => window.removeEventListener(EVENTO_ESCOLHER, ouvir);
  }, []);

  // A cada troca de passo, o foco vai para o título: leitor de tela anuncia onde está.
  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }
    titulo.current?.focus();
  }, [passo]);

  const pronto = variante?.disponivel === true;
  const rotulo = produto.kind === "SERVICE" ? "Quero este projeto" : "Quero este";
  const textoTitulo =
    passo === "escolha" ? `Monte o seu ${produto.nome}` : passo === "dados" ? "Seus dados" : `Pedido #${pedido?.numero} recebido`;

  return (
    <section id="oferta" aria-labelledby="oferta-titulo" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16 md:px-8">
      <div className="relative overflow-hidden rounded-[2rem] p-3 ring-1 ring-fg/10 sm:p-6">
        <LightField />
        <div className={`glass-2 relative rounded-panel p-7 sm:p-10 ${passo === "escolha" ? "" : "mx-auto max-w-3xl"}`}>
          <h2
            id="oferta-titulo"
            ref={titulo}
            tabIndex={-1}
            className="text-3xl font-semibold tracking-display text-fg outline-none sm:text-4xl"
          >
            {textoTitulo}
          </h2>

          {passo === "escolha" && (
            <div className="mt-3 grid gap-10 md:grid-cols-2">
              <div>
                {produto.tagline && <p className="max-w-[40ch] text-muted">{produto.tagline}</p>}
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
                <MagneticButton onClick={() => setPasso("dados")} disabled={!pronto} className="w-full sm:w-auto">
                  {rotulo}
                </MagneticButton>
                <p className="text-xs text-muted">Nada é cobrado agora. A loja entra em contato para combinar.</p>
              </div>
            </div>
          )}

          {passo === "dados" && variante && (
            <div className="mt-6">
              <FormPedido
                produto={produto}
                variante={variante}
                onVoltar={() => setPasso("escolha")}
                onCriado={(p) => {
                  setPedido(p);
                  setPasso("confirmado");
                }}
                linkContato={whatsapp ? linkWhatsApp(whatsapp, produto, variante) : undefined}
              />
            </div>
          )}

          {passo === "confirmado" && pedido && (
            <div className="mt-6">
              <PedidoConfirmado
                pedido={pedido}
                whatsappLoja={whatsapp}
                onNovo={() => {
                  setPedido(null);
                  setSel(selecaoInicial(produto));
                  setPasso("escolha");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
