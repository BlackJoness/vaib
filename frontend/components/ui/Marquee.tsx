/**
 * Faixa que rola sem parar. Pausa no hover; para com movimento reduzido.
 * O conteúdo é duplicado para o loop não ter emenda; a cópia fica oculta
 * para leitores de tela.
 */
export default function Marquee({
  items,
  duration = 30,
  className = "",
}: {
  items: string[];
  /** Segundos por volta. */
  duration?: number;
  className?: string;
}) {
  const faixa = (oculta: boolean) => (
    <ul aria-hidden={oculta || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((t, i) => (
        <li key={`${t}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
          <span>{t}</span>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] ${className}`}
    >
      <div className="marquee-track flex w-max" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {faixa(false)}
        {faixa(true)}
      </div>
    </div>
  );
}
