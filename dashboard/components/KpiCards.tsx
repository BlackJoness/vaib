"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export default function KpiCards() {
  const [kpis, setKpis] = useState<Kpis | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/kpis`)
      .then((r) => r.json())
      .then(setKpis);
  }, []);

  if (!kpis) return <p className="text-grafite/60">Carregando KPIs…</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Produto mais vendido</CardTitle>
        </CardHeader>
        <CardContent>
          {kpis.produtoMaisVendido ? (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">
                {kpis.produtoMaisVendido.nome}
              </span>
              <span className="text-grafite/60">
                {kpis.produtoMaisVendido.unidades} un.
              </span>
            </div>
          ) : (
            <span className="text-grafite/60">Sem vendas ainda</span>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alerta de estoque baixo (por tamanho)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {kpis.alertasEstoqueBaixo.length === 0 ? (
            <span className="text-grafite/60">Estoque saudável</span>
          ) : (
            kpis.alertasEstoqueBaixo.map((a) => (
              <div
                key={a.sku}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  {a.produto} · {a.cor} · <strong>{a.tamanho}</strong>
                </span>
                <Badge variant="destructive">{a.estoque} restantes</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
