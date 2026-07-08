"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Moeda pt-BR/BRL (inline, sem dependências)
const brlFmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const brl = (v: number | string) =>
  brlFmt.format(Number.isFinite(Number(v)) ? Number(v) : 0);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// Status permitidos (restrição do projeto) e ordem da máquina de estados.
const STATUS_ORDER = [
  "AGUARDANDO_PAGAMENTO",
  "EM_SEPARACAO",
  "ENVIADO",
] as const;
type Status = (typeof STATUS_ORDER)[number];

const LABEL: Record<Status, string> = {
  AGUARDANDO_PAGAMENTO: "Aguardando Pagamento",
  EM_SEPARACAO: "Em Separação",
  ENVIADO: "Enviado",
};

// Cor do selo de status (tokens da marca)
const BADGE: Record<Status, string> = {
  AGUARDANDO_PAGAMENTO: "bg-manha/20 text-grafite",
  EM_SEPARACAO: "bg-sereno/25 text-grafite",
  ENVIADO: "bg-brisa/25 text-grafite",
};

type ApiOrder = {
  id: string;
  numero: number;
  clienteNome: string;
  clienteEmail: string;
  status: Status;
  total: string;
  createdAt: string;
  items: {
    quantidade: number;
    variant: {
      sku: string;
      cor: string;
      tamanho: string;
      product: { nome: string };
    };
  }[];
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [erro, setErro] = useState(false);
  const [atualizando, setAtualizando] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/orders`)
      .then((r) => {
        if (!r.ok) throw new Error("falha");
        return r.json();
      })
      .then(setOrders)
      .catch(() => setErro(true));
  }, []);

  // Avança o status (linear: Aguardando → Em Separação → Enviado)
  async function avancar(order: ApiOrder, novo: Status) {
    const atualIdx = STATUS_ORDER.indexOf(order.status);
    const novoIdx = STATUS_ORDER.indexOf(novo);
    if (novoIdx !== atualIdx + 1) return; // só permite o próximo passo
    setAtualizando(order.id);
    try {
      const res = await fetch(`${API_URL}/orders/${order.id}/status`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("falha");
      const atualizado = (await res.json()) as { status: Status };
      setOrders((prev) =>
        prev
          ? prev.map((o) =>
              o.id === order.id ? { ...o, status: atualizado.status } : o,
            )
          : prev,
      );
    } catch {
      // mantém estado anterior em caso de erro
    } finally {
      setAtualizando(null);
    }
  }

  if (erro)
    return (
      <Card className="shadow-soft">
        <CardContent className="p-5 text-grafite/60">
          Não foi possível carregar os pedidos. Verifique se a API está no ar.
        </CardContent>
      </Card>
    );
  if (!orders)
    return (
      <Card className="shadow-soft">
        <CardContent className="p-5 text-grafite/60">
          Carregando pedidos…
        </CardContent>
      </Card>
    );
  if (orders.length === 0)
    return (
      <Card className="shadow-soft">
        <CardContent className="p-5 text-grafite/60">
          Nenhum pedido ainda. Os pedidos aparecem aqui assim que entram na loja.
        </CardContent>
      </Card>
    );

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-grafite">Pedidos</CardTitle>
        <CardDescription>
          Gestão de status — avanço linear conforme a regra do projeto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {["Pedido", "Cliente", "Itens", "Total", "Status"].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold uppercase tracking-wide text-grafite/50"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => {
              const atualIdx = STATUS_ORDER.indexOf(o.status);
              const totalItens = o.items.reduce((s, i) => s + i.quantidade, 0);
              const primeiro = o.items[0]?.variant.product.nome;
              const enviado = o.status === "ENVIADO";
              return (
                <TableRow key={o.id} className="hover:bg-creme/60">
                  <TableCell className="font-semibold text-grafite">
                    #{o.numero}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-grafite">
                      {o.clienteNome}
                    </div>
                    <div className="text-xs text-grafite/50">
                      {o.clienteEmail}
                    </div>
                  </TableCell>
                  <TableCell className="text-grafite/80">
                    {totalItens} un.
                    {primeiro && (
                      <span className="text-grafite/50">
                        {" "}
                        · {primeiro}
                        {o.items.length > 1 ? ` +${o.items.length - 1}` : ""}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-grafite">
                    {brl(o.total)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className={BADGE[o.status]}
                      >
                        {LABEL[o.status]}
                      </Badge>
                      <Select
                        value={o.status}
                        disabled={atualizando === o.id || enviado}
                        onValueChange={(v) => avancar(o, v as Status)}
                      >
                        <SelectTrigger className="h-9 w-[190px] border-grafite/20 bg-white text-grafite">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_ORDER.map((s, idx) => (
                            <SelectItem
                              key={s}
                              value={s}
                              disabled={idx !== atualIdx && idx !== atualIdx + 1}
                            >
                              {LABEL[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
