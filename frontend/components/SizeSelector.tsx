"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const TAMANHOS = ["P", "M", "G", "GG"] as const; // grade fixa obrigatória

export default function SizeSelector({
  onChange,
}: {
  onChange?: (t: string) => void;
}) {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="flex gap-2">
      {TAMANHOS.map((t) => {
        const active = sel === t;
        return (
          <motion.button
            key={t}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSel(t);
              onChange?.(t);
            }}
            className={`h-11 w-11 rounded-xl2 border font-sans font-semibold transition-colors
              ${active ? "border-coral bg-coral text-white" : "border-grafite/20 text-grafite"}`}
          >
            {t}
          </motion.button>
        );
      })}
    </div>
  );
}
