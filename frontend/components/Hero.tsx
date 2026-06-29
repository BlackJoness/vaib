"use client";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

export default function Hero() {
  return (
    <section className="relative h-[92vh] w-full overflow-hidden bg-creme">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        src="/hero.mp4"
      />
      <div className="absolute inset-0 bg-grafite/20" />
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex h-full flex-col items-start justify-end gap-4 p-8 md:p-16"
      >
        <motion.h1
          variants={fadeUp}
          className="max-w-2xl font-display text-5xl font-bold leading-tight text-creme md:text-7xl"
        >
          Vista o seu dia de leveza.
        </motion.h1>
        <motion.a
          variants={fadeUp}
          href="/colecao"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl2 bg-coral px-7 py-3 font-sans font-semibold text-white shadow-soft"
        >
          Ver coleção
        </motion.a>
      </motion.div>
    </section>
  );
}
