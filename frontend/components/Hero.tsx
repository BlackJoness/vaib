"use client";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

export default function Hero() {
  return (
    <section className="relative flex h-[92vh] w-full items-end overflow-hidden">
      {/* Luz do acento vinda de cima; a etapa 4 troca este hero pelo novo */}
      <div className="absolute left-1/2 top-0 h-[55%] w-[60%] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-start gap-4 p-8 md:p-16"
      >
        <motion.h1
          variants={fadeUp}
          className="max-w-2xl font-display text-5xl font-semibold leading-[1.02] tracking-display text-fg md:text-7xl"
        >
          Vista o seu dia de leveza.
        </motion.h1>
        <motion.a
          variants={fadeUp}
          href="/colecao"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-accent px-7 py-3 font-sans font-semibold text-on-accent shadow-soft"
        >
          Ver coleção
        </motion.a>
      </motion.div>
    </section>
  );
}
