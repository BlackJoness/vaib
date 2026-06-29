import Link from "next/link";
import Reveal from "./Reveal";

// Bloco editorial split (texto + visual) — destaca o tecido
export default function Editorial() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 md:grid-cols-2 md:px-8">
        <Reveal>
          <div className="aspect-[4/3] rounded-xl2 bg-gradient-to-br from-brisa via-sereno to-manha shadow-soft" />
        </Reveal>
        <Reveal>
          <div className="md:pl-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-coral">
              O tecido certo
            </p>
            <h2 className="mb-4 font-display text-3xl font-bold text-grafite md:text-4xl">
              Respira com você no plantão inteiro.
            </h2>
            <p className="mb-6 text-grafite/70">
              Malha leve, com toque macio e secagem rápida. Modelagem que abraça
              sem apertar — pensada para 12 horas em pé sem pesar.
            </p>
            <Link
              href="/tecido"
              className="inline-block rounded-xl2 bg-grafite px-6 py-3 font-semibold text-creme transition-transform hover:scale-[1.03]"
            >
              Conhecer o tecido
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
