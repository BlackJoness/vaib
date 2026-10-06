// Régua de vantagens (padrão de e-commerce)
const ITENS = [
  { titulo: "Frete grátis", sub: "acima de R$ 279", d: "M3 13h13V6H3zM16 8h4l1 5h-5zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { titulo: "5% off no Pix", sub: "pagamento à vista", d: "M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { titulo: "Até 4x sem juros", sub: "no cartão", d: "M2 7h20v10H2zM2 11h20" },
  { titulo: "Troca fácil", sub: "30 dias", d: "M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="border-y border-fg/10 bg-raised/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4 md:px-8">
        {ITENS.map((i) => (
          <div key={i.titulo} className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Icon d={i.d} />
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-fg">{i.titulo}</p>
              <p className="text-xs text-muted">{i.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
