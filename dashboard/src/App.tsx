import KpiCards from "../components/KpiCards";

export default function App() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-grafite">Solê · Dashboard</h1>
        <p className="text-grafite/60">Gestão de produtos e pedidos</p>
      </header>
      <KpiCards />
    </div>
  );
}
