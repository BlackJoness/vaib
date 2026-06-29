"use client";
import { motion } from "framer-motion";
import { stagger } from "@/lib/motion";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";

// Dados de exemplo — em produção viriam da API (GET /products)
const DESTAQUES = [
  { id: "1", nome: "Blusa Brisa", cor: "Coral Sol", preco: "R$ 159,90", img: "/produtos/brisa-coral.jpg" },
  { id: "2", nome: "Calça Fluxo", cor: "Verde Brisa", preco: "R$ 179,90", img: "/produtos/fluxo-verde.jpg" },
  { id: "3", nome: "Jaleco Aura", cor: "Azul Sereno", preco: "R$ 219,90", img: "/produtos/aura-azul.jpg" },
  { id: "4", nome: "Blusa Brisa", cor: "Amarelo Manhã", preco: "R$ 159,90", img: "/produtos/brisa-amarelo.jpg" },
];

export default function Home() {
  return (
    <main className="bg-creme">
      <Hero />

      <section className="px-8 py-16">
        <h2 className="mb-8 font-display text-3xl font-bold text-grafite">
          Mais queridos
        </h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {DESTAQUES.map((p) => (
            <ProductCard
              key={p.id}
              nome={p.nome}
              cor={p.cor}
              preco={p.preco}
              img={p.img}
            />
          ))}
        </motion.div>
      </section>
    </main>
  );
}
