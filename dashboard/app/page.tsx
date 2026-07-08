import KpiCards from "@/components/KpiCards";
import OrdersTable from "@/components/OrdersTable";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl p-8">
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold text-grafite">
          Vaib<span className="text-coral">~</span> · Dashboard
        </h1>
        <p className="text-grafite/60">Visão geral · gestão de pedidos</p>
      </header>

      <section className="mb-10">
        <KpiCards />
      </section>

      <section>
        <OrdersTable />
      </section>
    </div>
  );
}
