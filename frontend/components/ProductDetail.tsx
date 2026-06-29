"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { formatBRL } from "@/lib/format";
import { useCart } from "@/lib/cart";
import type { Product, Tamanho } from "@/lib/types";

const ORDEM_TAM: Tamanho[] = ["P", "M", "G", "GG"]; // grade fixa

export default function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();

  // Cores únicas (na ordem em que aparecem nas variantes)
  const cores = useMemo(() => {
    const map = new Map<string, string>();
    for (const v of product.variants) {
      if (!map.has(v.cor)) map.set(v.cor, v.corHex);
    }
    return [...map.entries()].map(([cor, corHex]) => ({ cor, corHex }));
  }, [product.variants]);

  const [cor, setCor] = useState(cores[0]?.cor ?? "");
  const [tamanho, setTamanho] = useState<Tamanho | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const corHex = cores.find((c) => c.cor === cor)?.corHex ?? "#FFC857";

  // Variantes da cor selecionada, indexadas por tamanho
  const variantesDaCor = useMemo(
    () => product.variants.filter((v) => v.cor === cor),
    [product.variants, cor],
  );

  const variante = useMemo(
    () => variantesDaCor.find((v) => v.tamanho === tamanho) ?? null,
    [variantesDaCor, tamanho],
  );

  const preco = Number(variante?.preco ?? product.precoBase);
  const semEstoque = variante ? variante.estoque <= 0 : false;

  function adicionar() {
    if (!variante) {
      setAviso("Selecione um tamanho.");
      return;
    }
    if (variante.estoque <= 0) {
      setAviso("Tamanho esgotado nesta cor.");
      return;
    }
    setAviso(null);
    add({
      variantId: variante.id,
      sku: variante.sku,
      nome: product.nome,
      slug: product.slug,
      cor: variante.cor,
      corHex: variante.corHex,
      tamanho: variante.tamanho,
      preco: Number(variante.preco),
    });
  }

  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2 md:px-8"
    >
      {/* Galeria (placeholder de cor — troca conforme a cor escolhida) */}
      <motion.div variants={fadeUp} className="md:sticky md:top-24 md:self-start">
        <div
          className="aspect-[4/5] w-full rounded-xl2 shadow-soft transition-colors duration-500"
          style={{ backgroundColor: corHex }}
          aria-label={`${product.nome} — ${cor}`}
        />
        <div className="mt-3 grid grid-cols-4 gap-3">
          {cores.slice(0, 4).map((c) => (
            <button
              key={c.cor}
              onClick={() => setCor(c.cor)}
              className="aspect-square rounded-lg ring-offset-2 transition"
              style={{
                backgroundColor: c.corHex,
                outline: c.cor === cor ? "2px solid #FF7E67" : "none",
              }}
              aria-label={c.cor}
            />
          ))}
        </div>
      </motion.div>

      {/* Informações + seletores */}
      <motion.div variants={fadeUp}>
        <nav className="mb-3 text-sm text-grafite/50">
          <a href="/" className="hover:text-coral">
            Início
          </a>{" "}
          / <span className="text-grafite/70">{product.nome}</span>
        </nav>

        <h1 className="font-display text-3xl font-bold text-grafite md:text-4xl">
          {product.nome}
        </h1>
        <p className="mt-3 font-display text-2xl font-semibold text-coral">
          {formatBRL(preco)}
        </p>
        {product.descricao && (
          <p className="mt-4 text-grafite/70">{product.descricao}</p>
        )}

        {/* Seletor de cor */}
        <div className="mt-8">
          <p className="mb-2 text-sm font-semibold text-grafite">
            Cor: <span className="font-normal text-grafite/70">{cor}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {cores.map((c) => {
              const active = c.cor === cor;
              return (
                <motion.button
                  key={c.cor}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setCor(c.cor);
                    setAviso(null);
                  }}
                  title={c.cor}
                  className="h-9 w-9 rounded-full transition"
                  style={{
                    backgroundColor: c.corHex,
                    boxShadow: active
                      ? "0 0 0 2px #FFF8F0, 0 0 0 4px #FF7E67"
                      : "0 0 0 1px rgba(51,48,62,0.15)",
                  }}
                  aria-label={`Cor ${c.cor}`}
                  aria-pressed={active}
                />
              );
            })}
          </div>
        </div>

        {/* Seletor de tamanho (P, M, G, GG) — desabilita esgotados */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-grafite">Tamanho</p>
          <div className="flex gap-2">
            {ORDEM_TAM.map((t) => {
              const v = variantesDaCor.find((x) => x.tamanho === t);
              const indisponivel = !v || v.estoque <= 0;
              const active = tamanho === t;
              return (
                <motion.button
                  key={t}
                  whileTap={{ scale: indisponivel ? 1 : 0.9 }}
                  disabled={indisponivel}
                  onClick={() => {
                    setTamanho(t);
                    setAviso(null);
                  }}
                  className={`relative h-11 w-11 rounded-xl2 border font-semibold transition-colors
                    ${
                      active
                        ? "border-coral bg-coral text-white"
                        : "border-grafite/20 text-grafite hover:border-coral"
                    }
                    ${indisponivel ? "cursor-not-allowed opacity-40" : ""}`}
                  title={indisponivel ? "Esgotado" : `Tamanho ${t}`}
                >
                  {t}
                </motion.button>
              );
            })}
          </div>
          {variante && !semEstoque && (
            <p className="mt-2 text-xs text-brisa">
              {variante.estoque} em estoque · SKU {variante.sku}
            </p>
          )}
        </div>

        {/* Ação */}
        <div className="mt-8">
          <motion.button
            whileHover={{ scale: semEstoque ? 1 : 1.02 }}
            whileTap={{ scale: semEstoque ? 1 : 0.98 }}
            onClick={adicionar}
            disabled={semEstoque}
            className="w-full rounded-xl2 bg-grafite py-4 font-semibold text-creme transition-colors hover:bg-coral disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-10"
          >
            {semEstoque ? "Esgotado" : "Adicionar à sacola"}
          </motion.button>
          {aviso && <p className="mt-3 text-sm text-coral">{aviso}</p>}
        </div>

        <ul className="mt-8 space-y-2 border-t border-grafite/10 pt-6 text-sm text-grafite/70">
          <li>• Tecido leve e respirável — feito pro plantão.</li>
          <li>• Grade P, M, G e GG.</li>
          <li>• Trocas em até 30 dias.</li>
        </ul>
      </motion.div>
    </motion.section>
  );
}
