"use client";
import { useId, useState } from "react";
import type { FormEvent } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { formatBRL } from "@/lib/format";
import { criarPedido, validar, type Campo, type DadosCliente, type FalhaPedido, type PedidoCriado } from "@/lib/pedido";
import type { Product, Variant } from "@/lib/types";

const INICIAL: DadosCliente = { nome: "", email: "", whatsapp: "", mensagem: "", quantidade: 1 };

/**
 * Passo 2 da oferta: dados de contato e envio do pedido. Valida antes de
 * enviar com as mesmas regras da API; o que a API recusar volta para o campo.
 */
export default function FormPedido({
  produto,
  variante,
  onVoltar,
  onCriado,
  linkContato,
}: {
  produto: Product;
  variante: Variant;
  onVoltar: () => void;
  onCriado: (pedido: PedidoCriado) => void;
  /** Saída pelo WhatsApp da loja quando a API não responde. */
  linkContato?: string;
}) {
  const id = useId();
  const servico = produto.kind === "SERVICE";
  const [dados, setDados] = useState<DadosCliente>(INICIAL);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [falha, setFalha] = useState<FalhaPedido | null>(null);
  const [enviando, setEnviando] = useState(false);

  const total = Number(variante.preco) * dados.quantidade;

  function mudar<K extends keyof DadosCliente>(campo: K, valor: DadosCliente[K]) {
    setDados((d) => ({ ...d, [campo]: valor }));
    if (campo in erros) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setFalha(null);
    const locais = validar(dados, servico);
    setErros(locais);
    if (Object.keys(locais).length > 0) {
      document.getElementById(`${id}-${Object.keys(locais)[0]}`)?.focus();
      return;
    }
    setEnviando(true);
    const r = await criarPedido(variante.id, dados);
    setEnviando(false);
    if (r.ok) return onCriado(r.pedido);
    setFalha(r.falha);
    if (r.falha.campos) setErros(r.falha.campos);
  }

  const campo = (nome: Campo) => ({
    id: `${id}-${nome}`,
    "aria-invalid": Boolean(erros[nome]) || undefined,
    "aria-describedby": erros[nome] ? `${id}-${nome}-erro` : undefined,
  });
  const classeInput =
    "w-full rounded-2xl border border-fg/15 bg-canvas/60 px-4 py-3 text-fg placeholder:text-muted/70 aria-[invalid=true]:border-danger";
  const Erro = ({ nome }: { nome: Campo }) =>
    erros[nome] ? (
      <p id={`${id}-${nome}-erro`} className="mt-1.5 text-sm text-danger">
        {erros[nome]}
      </p>
    ) : null;

  return (
    <form onSubmit={enviar} noValidate className="space-y-5">
      <div className="flex items-start justify-between gap-4 rounded-2xl bg-fg/5 px-4 py-3 text-sm">
        <div>
          <p className="font-medium text-fg">{produto.nome}</p>
          <p className="text-muted">{variante.descricao}</p>
        </div>
        <button type="button" onClick={onVoltar} className="shrink-0 text-accent underline-offset-4 hover:underline">
          Trocar opções
        </button>
      </div>

      <div>
        <label htmlFor={`${id}-nome`} className="mb-1.5 block text-sm text-fg">Nome</label>
        <input {...campo("nome")} autoComplete="name" value={dados.nome} onChange={(e) => mudar("nome", e.target.value)} className={classeInput} />
        <Erro nome="nome" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm text-fg">E-mail</label>
          <input {...campo("email")} type="email" inputMode="email" autoComplete="email" value={dados.email} onChange={(e) => mudar("email", e.target.value)} className={classeInput} />
          <Erro nome="email" />
        </div>
        <div>
          <label htmlFor={`${id}-whatsapp`} className="mb-1.5 block text-sm text-fg">
            WhatsApp {!servico && <span className="text-muted">(opcional)</span>}
          </label>
          <input {...campo("whatsapp")} type="tel" inputMode="tel" autoComplete="tel" placeholder="81 99999-0000" value={dados.whatsapp} onChange={(e) => mudar("whatsapp", e.target.value)} className={classeInput} />
          <Erro nome="whatsapp" />
        </div>
      </div>
      {!servico && (
        <div>
          <label htmlFor={`${id}-qtd`} className="mb-1.5 block text-sm text-fg">Quantidade</label>
          <input id={`${id}-qtd`} type="number" min={1} max={10} value={dados.quantidade}
            onChange={(e) => mudar("quantidade", Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
            className={`${classeInput} max-w-[8rem]`} />
        </div>
      )}
      <div>
        <label htmlFor={`${id}-mensagem`} className="mb-1.5 block text-sm text-fg">
          Mensagem <span className="text-muted">(opcional)</span>
        </label>
        <textarea {...campo("mensagem")} rows={3} maxLength={500}
          placeholder={servico ? "Melhor horário para conversar, cidade, o que você imagina…" : "Endereço de entrega, observações…"}
          value={dados.mensagem} onChange={(e) => mudar("mensagem", e.target.value)} className={classeInput} />
        <Erro nome="mensagem" />
      </div>

      {falha && (
        <div role="alert" className="rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-fg">
          <p>{falha.mensagem}</p>
          {falha.tipo === "rede" && linkContato && (
            <a href={linkContato} className="mt-1 inline-block font-medium text-accent underline-offset-4 hover:underline">
              Falar com a loja no WhatsApp
            </a>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fg/10 pt-5">
        <p className="text-sm text-muted">
          Total <span className="ml-1 text-xl font-semibold tabular-nums text-fg">{formatBRL(total)}</span>
        </p>
        <MagneticButton type="submit" disabled={enviando}>
          {enviando ? "Enviando…" : "Enviar pedido"}
        </MagneticButton>
      </div>
      <p className="text-xs text-muted">Nada é cobrado agora. A loja entra em contato para combinar e fechar.</p>
    </form>
  );
}
