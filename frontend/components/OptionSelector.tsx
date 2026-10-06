"use client";
import type { Product, VariantAttributes } from "@/lib/types";

/**
 * Seletor de opções controlado: um grupo por opção do produto, cada valor
 * um botão de rádio. Quem guarda a seleção é a seção de oferta, porque o
 * hero também pode escolher (pills de opção).
 */
export default function OptionSelector({
  produto,
  sel,
  onChange,
}: {
  produto: Product;
  sel: VariantAttributes;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      {produto.options.map((o) => (
        <fieldset key={o.key}>
          <legend className="mb-3 text-sm text-muted">{o.label}</legend>
          <div role="radiogroup" className="flex flex-wrap gap-2">
            {o.values.map((v) => {
              const ativo = sel[o.key] === v.value;
              return (
                <button
                  key={v.value}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  onClick={() => onChange(o.key, v.value)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                    ativo
                      ? "border-accent bg-accent text-on-accent"
                      : "border-fg/15 text-fg hover:border-fg/40"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
