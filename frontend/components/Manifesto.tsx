import Reveal from "./Reveal";

export default function Manifesto() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center md:px-8">
        <Reveal>
          <p className="font-display text-2xl font-semibold leading-snug text-fg md:text-4xl md:leading-snug">
            Salvar o dia já é trabalho demais. A roupa devia ser a parte fácil.
            <span className="text-accent"> Vista o seu dia de leveza.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
