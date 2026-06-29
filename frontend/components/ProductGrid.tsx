"use client";
import { motion } from "framer-motion";
import { stagger } from "@/lib/motion";
import ProductCard from "./ProductCard";

export type GridItem = {
  id: string;
  nome: string;
  cor: string;
  corHex: string;
  preco: number | string;
  img?: string | null;
  cores?: number;
  novo?: boolean;
};

// Componente client (ilha de interatividade) — recebe dados já buscados no servidor
export default function ProductGrid({ itens }: { itens: GridItem[] }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      {itens.map((p) => (
        <ProductCard
          key={p.id}
          nome={p.nome}
          cor={p.cor}
          corHex={p.corHex}
          preco={p.preco}
          img={p.img}
          cores={p.cores}
          novo={p.novo}
        />
      ))}
    </motion.div>
  );
}
