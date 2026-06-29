import Link from "next/link";
import Reveal from "./Reveal";

// "Explore por categoria" — cards com placeholder de cor da marca
const CATEGORIAS = [
  { nome: "Blusas", href: "/feminino", cor: "#FF7E67" },
  { nome: "Calças", href: "/feminino", cor: "#7FD8BE" },
  { nome: "Jalecos", href: "/jalecos", cor: "#8EC5E8" },
  { nome: "Kits", href: "/kits", cor: "#FFC857" },
];

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <Reveal>
        <h2 className="mb-2 font-display text-3xl font-bold text-grafite">
          Explore por categoria
        </h2>
        <p className="mb-8 text-grafite/60">
          Cada peça é leve por dentro e alegre por fora. Escolha por onde começar.
        </p>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {CATEGORIAS.map((c) => (
          <Reveal key={c.nome}>
            <Link
              href={c.href}
              className="group block overflow-hidden rounded-xl2 shadow-soft"
            >
              <div
                className="flex aspect-[4/5] items-end p-5 transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ backgroundColor: c.cor }}
              >
                <span className="rounded-full bg-white/90 px-4 py-1.5 font-display text-sm font-semibold text-grafite">
                  {c.nome}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
