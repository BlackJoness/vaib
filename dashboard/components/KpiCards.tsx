"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Moeda pt-BR/BRL (inline, sem dependências)
const brlFmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const brl = (v: number | string) =>
  brlFmt.format(Number.isFinite(Number(v)) ? Number(v) : 0);

type Kpis = {
  totalVendas: number;
  totalPedidos: number;
  produtoMaisVendido: { nome: string; unidades: number } | null;
  alertasEstoqueBaixo: {
    sku: string;
    produto: string;
    cor: string;
    tamanho: "P" | "M" | "G" | "GG";
    estoque: number;
  }[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function KpiCards() {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/dashboard/kpis`)
      .then((r) => {
        if (!r.ok) throw new Error("falha");
        return r.json();
      })
      .then(setKpis)
      .catch(() => setErro(true));
  }, []);

  if (erro)
    return (
      <Card className="shadow-soft">
        <CardContent className="p-5 text-grafite/60">
          Não foi possível carregar os KPIs.
        </CardContent>
      </Card>
    );
  if (!kpis)
    return (
      <Card className="shadow-soft">
        <CardContent className="p-5 text-grafite/60">
          Carregando KPIs…
        </CardContent>
      </Card>
    );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* KPI 1 — Total de vendas */}
      <Card className="shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-grafite/60">
            Total de vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-grafite">
            {brl(kpis.totalVendas)}
          </p>
          <p className="mt-1 text-sm text-grafite/60">
            {kpis.totalPedidos} pedido{kpis.totalPedidos === 1 ? "" : "s"}
          </p>
        </CardContent>
      </Card>

      {/* KPI 2 — Produto mais vendido */}
      <Card className="shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-grafite/60">
            Produto mais vendido
          </CardTitle>
        </CardHeader>
        <CardContent>
          {kpis.produtoMaisVendido ? (
            <>
              <p className="text-2xl font-bold text-coral">
                {kpis.produtoMaisVendido.nome}
              </p>
              <p className="mt-1 text-sm text-grafite/60">
                {kpis.produtoMaisVendido.unidades} unidades
              </p>
            </>
          ) : (
            <p className="text-grafite/60">Sem vendas ainda</p>
          )}
        </CardContent>
      </Card>

      {/* KPI 3 — Alerta de estoque baixo */}
      <Card className="shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-grafite/60">
            Estoque baixo (por tamanho)
          </CardTitle>
          <CardDescription className="sr-only">
            Variantes com estoque crítico
          </CardDescription>
        </CardHeader>
        <CardContent>
          {kpis.alertasEstoqueBaixo.length === 0 ? (
            <p className="text-grafite/60">Estoque saudável</p>
          ) : (
            <ul className="space-y-2">
              {kpis.alertasEstoqueBaixo.slice(0, 4).map((a) => (
                <li
                  key={a.sku}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-grafite/80">
                    {a.produto} · {a.cor} · <strong>{a.tamanho}</strong>
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-manha/20 text-grafite"
                  >
                    {a.estoque} un.
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
