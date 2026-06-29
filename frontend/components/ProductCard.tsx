"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { formatBRL } from "@/lib/format";

type Props = {
  nome: string;
  cor: string;
  corHex: string;
  preco: number | string;
  slug?: string;
  img?: string | null;
  cores?: number; // qtd. de cores disponíveis (selo)
  novo?: boolean;
};

export default function ProductCard({
  nome,
  cor,
  corHex,
  preco,
  slug,
  img,
  cores,
  novo,
}: Props) {
  const card = (
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
        {novo && (
          <span className="absolute left-2 top-2 rounded-full bg-grafite px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-creme">
            Novo
          </span>
        )}
        {cores && cores > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-grafite">
            {cores} cores
          </span>
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

  // Se houver slug, o card vira link para a página de produto (PDP)
  return slug ? (
    <Link href={`/produto/${slug}`} aria-label={nome}>
      {card}
    </Link>
  ) : (
    card
  );
}
