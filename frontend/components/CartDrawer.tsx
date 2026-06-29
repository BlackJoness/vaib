"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/format";
import { createOrder } from "@/lib/api";

function Icon({ d }: { d: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export default function CartDrawer() {
  const { items, open, closeCart, remove, setQtd, total, count, clear } =
    useCart();
  const [enviando, setEnviando] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function finalizar() {
    setErro(null);
    setOkMsg(null);
    setEnviando(true);
    try {
      const pedido = await createOrder({
        clienteNome: "Cliente Demo",
        clienteEmail: "cliente@vaib.com",
        items: items.map((i) => ({ variantId: i.variantId, quantidade: i.qtd })),
      });
      clear();
      setOkMsg(`Pedido #${pedido?.numero ?? ""} criado — Aguardando Pagamento.`);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao finalizar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[60] bg-grafite/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Painel lateral (slide-over) */}
          <motion.aside
            role="dialog"
            aria-label="Sacola de compras"
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-creme shadow-soft"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-grafite/10 px-5 py-4">
              <h2 className="font-display text-lg font-bold text-grafite">
                Sua sacola{" "}
                <span className="text-grafite/50">({count})</span>
              </h2>
              <button
                aria-label="Fechar"
                onClick={closeCart}
                className="text-grafite/70 hover:text-coral"
              >
                <Icon d="M18 6 6 18M6 6l12 12" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="mt-16 text-center text-grafite/60">
                  <p className="font-display text-lg">Sua sacola está vazia</p>
                  <p className="mt-1 text-sm">Vista a sua vibe. ☀</p>
                  {okMsg && (
                    <p className="mt-6 rounded-xl2 bg-brisa/20 px-4 py-3 text-sm text-grafite">
                      {okMsg}
                    </p>
                  )}
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li
                        key={i.variantId}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-3 rounded-xl2 bg-white p-3 shadow-soft"
                      >
                        <div
                          className="h-20 w-16 shrink-0 rounded-lg"
                          style={{ backgroundColor: i.corHex }}
                          aria-hidden
                        />
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <div>
                              <p className="font-display text-sm font-semibold text-grafite">
                                {i.nome}
                              </p>
                              <p className="text-xs text-grafite/60">
                                {i.cor} · Tam. {i.tamanho}
                              </p>
                            </div>
                            <button
                              aria-label="Remover"
                              onClick={() => remove(i.variantId)}
                              className="text-grafite/40 hover:text-coral"
                            >
                              <Icon d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                aria-label="Diminuir"
                                onClick={() => setQtd(i.variantId, i.qtd - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-grafite/20 text-grafite hover:border-coral"
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-sm font-semibold">
                                {i.qtd}
                              </span>
                              <button
                                aria-label="Aumentar"
                                onClick={() => setQtd(i.variantId, i.qtd + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-grafite/20 text-grafite hover:border-coral"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-semibold text-coral">
                              {formatBRL(i.preco * i.qtd)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-grafite/10 px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-grafite/70">Total</span>
                  <span className="font-display text-xl font-bold text-grafite">
                    {formatBRL(total)}
                  </span>
                </div>
                {erro && (
                  <p className="mb-2 text-sm text-coral">{erro}</p>
                )}
                <button
                  disabled={enviando}
                  onClick={finalizar}
                  className="w-full rounded-xl2 bg-coral py-3 font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {enviando ? "Finalizando…" : "Finalizar compra"}
                </button>
                <p className="mt-2 text-center text-xs text-grafite/50">
                  Frete e pagamento na próxima etapa.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
