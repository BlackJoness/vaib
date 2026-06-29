// Formatação de moeda centralizada (pt-BR / BRL)
const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRL(valor: number | string): string {
  const n = typeof valor === "string" ? Number(valor) : valor;
  return brl.format(Number.isFinite(n) ? n : 0);
}
