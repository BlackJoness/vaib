import MagneticButton from "@/components/ui/MagneticButton";
import { formatBRL } from "@/lib/format";
import { linkAvisoPedido, type PedidoCriado } from "@/lib/pedido";

/** Passo 3 da oferta: o pedido foi registrado. */
export default function PedidoConfirmado({
  pedido,
  whatsappLoja,
  onNovo,
}: {
  pedido: PedidoCriado;
  whatsappLoja?: string;
  onNovo: () => void;
}) {
  return (
    <div className="space-y-6">
      <ul className="space-y-1 rounded-2xl bg-fg/5 px-4 py-3 text-sm">
        {pedido.items.map((i) => (
          <li key={i.descricao} className="text-fg">
            {i.quantidade > 1 && `${i.quantidade}x `}
            {i.descricao}
          </li>
        ))}
        <li className="pt-1 text-muted">
          Total <span className="font-semibold tabular-nums text-fg">{formatBRL(pedido.total)}</span>
        </li>
      </ul>
      <p className="max-w-[48ch] text-muted">
        {whatsappLoja
          ? "Para agilizar, avise a loja pelo WhatsApp: a mensagem já vai com o número do pedido."
          : "A loja vai entrar em contato pelos dados que você informou."}
      </p>
      <div className="flex flex-wrap gap-3">
        {whatsappLoja && (
          <MagneticButton href={linkAvisoPedido(whatsappLoja, pedido)}>Avisar no WhatsApp</MagneticButton>
        )}
        <MagneticButton variant="ghost" onClick={onNovo}>
          Fazer outro pedido
        </MagneticButton>
      </div>
    </div>
  );
}
