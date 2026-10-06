"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type AccordionItem = { pergunta: string; resposta: string };

/**
 * Lista de perguntas que abre uma por vez. Botão com aria-expanded e
 * aria-controls; a resposta é uma região rotulada pela pergunta.
 */
export default function Accordion({ items, className = "" }: { items: AccordionItem[]; className?: string }) {
  const [aberto, setAberto] = useState<number | null>(0);
  const base = useId();
  const reduzir = useReducedMotion();

  return (
    <div className={`divide-y divide-fg/10 ${className}`}>
      {items.map((it, i) => {
        const ativo = aberto === i;
        const botaoId = `${base}-b${i}`;
        const painelId = `${base}-p${i}`;
        return (
          <div key={it.pergunta}>
            <h3>
              <button
                id={botaoId}
                type="button"
                aria-expanded={ativo}
                aria-controls={painelId}
                onClick={() => setAberto(ativo ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium text-fg"
              >
                {it.pergunta}
                <span
                  aria-hidden
                  className={`relative h-3 w-3 shrink-0 transition-transform duration-300 ${ativo ? "rotate-45" : ""}`}
                >
                  <span className="absolute left-0 top-1/2 h-px w-3 bg-accent" />
                  <span className="absolute left-1/2 top-0 h-3 w-px bg-accent" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {ativo && (
                <motion.div
                  id={painelId}
                  role="region"
                  aria-labelledby={botaoId}
                  initial={reduzir ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduzir ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-prose pb-5 text-muted">{it.resposta}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
