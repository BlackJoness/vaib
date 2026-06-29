// Barra de avisos no topo (estilo e-commerce): frete, pix, parcelamento
const AVISOS = [
  "Frete grátis acima de R$ 279",
  "5% off no Pix",
  "Até 4x sem juros",
  "10% na primeira compra: BEMVINDO",
];

export default function TopBar() {
  return (
    <div className="bg-grafite text-creme">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-center text-xs font-medium">
        {AVISOS.map((a) => (
          <span key={a}>{a}</span>
        ))}
      </div>
    </div>
  );
}
