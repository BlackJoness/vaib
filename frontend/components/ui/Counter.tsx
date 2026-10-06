"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Conta até o número quando entra na tela. Aceita valores como "120+",
 * "4.9" ou "15": o número anima e o resto do texto fica como está.
 * Se não houver número, mostra o texto puro.
 */
export default function Counter({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visivel = useInView(ref, { once: true, amount: 0.6 });
  const reduzir = useReducedMotion();

  const m = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  const prefixo = m?.[1] ?? "";
  const alvo = m ? parseFloat(m[2].replace(",", ".")) : 0;
  const sufixo = m?.[3] ?? "";
  const separador = m?.[2].includes(",") ? "," : ".";
  const casas = m?.[2].split(/[.,]/)[1]?.length ?? 0;

  const [atual, setAtual] = useState(m && !reduzir ? 0 : alvo);

  useEffect(() => {
    if (!m || !visivel || reduzir) return;
    const ctrl = animate(0, alvo, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: setAtual });
    return () => ctrl.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visivel, reduzir, alvo]);

  if (!m) return <span className={className}>{value}</span>;

  const texto = atual.toFixed(casas).replace(".", separador);
  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-label={value}>
      <span aria-hidden>
        {prefixo}
        {texto}
        {sufixo}
      </span>
    </span>
  );
}
