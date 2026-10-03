import { OrderStatus } from "@prisma/client";

// Rótulos exibidos no dashboard
export const STATUS_LABEL: Record<OrderStatus, string> = {
  NOVO: "Novo",
  EM_CONTATO: "Em contato",
  CONFIRMADO: "Confirmado",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
};

// Avanço linear, sem pulos nem retrocesso. Estados finais não têm próximo.
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  NOVO: OrderStatus.EM_CONTATO,
  EM_CONTATO: OrderStatus.CONFIRMADO,
  CONFIRMADO: OrderStatus.CONCLUIDO,
};

export const STATUS_FINAIS: ReadonlySet<OrderStatus> = new Set([
  OrderStatus.CONCLUIDO,
  OrderStatus.CANCELADO,
]);
