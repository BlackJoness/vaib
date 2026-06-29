"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { formatBRL } from "@/lib/format";

type Props = {
  nome: string;
  cor: string;
  corHex: string;
  preco: number | string;
  img?: string | null;
};

export default function ProductCard({ nome, cor, corHex, preco, img }: Props) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="group cursor-pointer rounded-xl2 bg-white p-3 shadow-soft"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl2">
        {img ? (
          <Image
            src={img}
            alt={`${nome} — ${cor}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Placeholder de cor enquanto não há foto do produto (sem 404)
          <div
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundColor: corHex }}
            aria-label={`${nome} — ${cor}`}
          />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-grafite">{nome}</h3>
          <span className="text-sm text-grafite/60">{cor}</span>
        </div>
        <span className="font-sans font-semibold text-coral">
          {formatBRL(preco)}
        </span>
      </div>
    </motion.article>
  );
}
