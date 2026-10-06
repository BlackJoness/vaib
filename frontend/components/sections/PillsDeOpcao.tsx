"use client";
import { EVENTO_ESCOLHER, type Escolha } from "@/lib/oferta";
import type { ProductOption } from "@/lib/types";

/**
 * Atalhos do hero: cada pill escolhe aquele valor na oferta e rola até ela.
 * A oferta escuta o evento; assim o hero continua sendo componente de servidor.
 */
export default function PillsDeOpcao({ opcao }: { opcao: ProductOption }) {
  function escolher(value: string) {
    window.dispatchEvent(new CustomEvent<Escolha>(EVENTO_ESCOLHER, { detail: { key: opcao.key, value } }));
    document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-muted">{opcao.label}:</span>
      {opcao.values.map((v) => (
        <button
          key={v.value}
          type="button"
          onClick={() => escolher(v.value)}
          className="rounded-full border border-fg/15 px-4 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
