import { useEffect, useState } from "react";
import { apiGet, NaoAutorizadoError } from "../src/api";

type Kpis = {
  produtoMaisVendido: { nome: string; unidades: number } | null;
  alertasEstoqueBaixo: {
    sku: string;
    produto: string;
    cor: string;
    tamanho: "P" | "M" | "G" | "GG";
    estoque: number;
  }[];
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 bg-white p-5 shadow-soft">{children}</div>
  );
}

export default function KpiCards({ onSessaoExpirada }: { onSessaoExpirada: () => void }) {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    apiGet<Kpis>("/dashboard/kpis")
      .then(setKpis)
      .catch((e) => (e instanceof NaoAutorizadoError ? onSessaoExpirada() : setErro(true)));
  }, [onSessaoExpirada]);

  if (erro) return <p className="text-grafite/60">Não foi possível carregar os KPIs.</p>;
  if (!kpis) return <p className="text-grafite/60">Carregando KPIs…</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <h2 className="mb-2 text-sm font-medium text-grafite/60">
          Produto mais vendido
        </h2>
        {kpis.produtoMaisVendido ? (
          <p className="text-2xl font-bold text-coral">
            {kpis.produtoMaisVendido.nome}{" "}
            <span className="text-base font-normal text-grafite/60">
              · {kpis.produtoMaisVendido.unidades} un.
            </span>
          </p>
        ) : (
          <p className="text-grafite/60">Sem vendas ainda</p>
        )}
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-medium text-grafite/60">
          Estoque baixo (por tamanho)
        </h2>
        {kpis.alertasEstoqueBaixo.length === 0 ? (
          <p className="text-grafite/60">Estoque saudável</p>
        ) : (
          <ul className="space-y-2">
            {kpis.alertasEstoqueBaixo.map((a) => (
              <li
                key={a.sku}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  {a.produto} · {a.cor} · <strong>{a.tamanho}</strong>
                </span>
                <span className="rounded-full bg-coral/15 px-2 py-0.5 font-semibold text-coral">
                  {a.estoque} restantes
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
