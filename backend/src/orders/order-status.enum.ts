import { OrderStatus } from "@prisma/client";

// Rótulos exibidos (restrição do projeto)
export const STATUS_LABEL: Record<OrderStatus, string> = {
  AGUARDANDO_PAGAMENTO: "Aguardando Pagamento",
  EM_SEPARACAO: "Em Separação",
  ENVIADO: "Enviado",
};

// Transições válidas (avanço linear, sem pulos nem retrocesso)
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  AGUARDANDO_PAGAMENTO: OrderStatus.EM_SEPARACAO,
  EM_SEPARACAO: OrderStatus.ENVIADO,
};
