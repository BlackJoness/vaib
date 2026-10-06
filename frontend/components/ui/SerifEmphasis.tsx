/**
 * Escreve `text` com o trecho `emphasis` em Instrument Serif itálica.
 * Se o trecho não estiver no texto, devolve o texto puro (o conteúdo vem da
 * API e pode ser editado sem acompanhar a ênfase).
 */
export default function SerifEmphasis({ text, emphasis }: { text: string; emphasis?: string }) {
  if (!emphasis) return <>{text}</>;
  const i = text.toLowerCase().indexOf(emphasis.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <em className="font-serif font-normal italic tracking-normal text-accent">{text.slice(i, i + emphasis.length)}</em>
      {text.slice(i + emphasis.length)}
    </>
  );
}
