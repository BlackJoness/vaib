"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

type Props = { nome: string; preco: string; cor: string; img: string };

export default function ProductCard({ nome, preco, cor, img }: Props) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -6 }}
      className="group cursor-pointer rounded-xl2 bg-white p-3 shadow-soft"
    >
      <div className="overflow-hidden rounded-xl2">
        <motion.img
          src={img}
          alt={nome}
          className="aspect-[3/4] w-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-grafite">{nome}</h3>
          <span className="text-sm text-grafite/60">{cor}</span>
        </div>
        <span className="font-sans font-semibold text-coral">{preco}</span>
      </div>
    </motion.article>
  );
}
