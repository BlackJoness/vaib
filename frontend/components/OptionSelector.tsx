"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Product, Variant, VariantAttributes } from "@/lib/types";
import { formatBRL } from "@/lib/format";

// Seletor genérico: um grupo de botões por opção do produto. A variante
// escolhida é a que casa com todos os atributos selecionados; o preço vem dela.
// Substitui o SizeSelector (grade P/M/G/GG fixa).
export default function OptionSelector({
  produto,
  onChange,
}: {
  produto: Product;
  onChange?: (variante: Variant | null) => void;
}) {
  const inicial = useMemo<VariantAttributes>(
    () => Object.fromEntries(produto.options.map((o) => [o.key, o.values[0]?.value ?? ""])),
    [produto.options],
  );
  const [sel, setSel] = useState<VariantAttributes>(inicial);

  const variante = useMemo(
    () =>
      produto.variants.find((v) => produto.options.every((o) => v.attributes[o.key] === sel[o.key])) ?? null,
    [produto, sel],
  );

  function escolher(key: string, value: string) {
    const proximo = { ...sel, [key]: value };
    setSel(proximo);
    onChange?.(
      produto.variants.find((v) => produto.options.every((o) => v.attributes[o.key] === proximo[o.key])) ?? null,
    );
  }

  return (
    <div className="space-y-5">
      {produto.options.map((o) => (
        <fieldset key={o.key}>
          <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-grafite/70">
            {o.label}
          </legend>
          <div className="flex flex-wrap gap-2">
            {o.values.map((v) => {
              const ativo = sel[o.key] === v.value;
              return (
                <motion.button
                  key={v.value}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={ativo}
                  onClick={() => escolher(o.key, v.value)}
                  className={`rounded-xl2 border px-4 py-2 font-sans font-semibold transition-colors
                    ${ativo ? "border-coral bg-coral text-white" : "border-grafite/20 text-grafite hover:border-grafite/50"}`}
                >
                  {v.label}
                </motion.button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <p className="font-display text-3xl font-bold text-grafite" aria-live="polite">
        {variante ? formatBRL(variante.preco) : "Combinação indisponível"}
        {variante && !variante.disponivel && (
          <span className="ml-3 text-base font-sans font-medium text-grafite/60">esgotado</span>
        )}
      </p>
    </div>
  );
}
