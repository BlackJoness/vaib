/**
 * Formas nítidas de luz para ficar ATRÁS do vidro. O backdrop-filter desfoca
 * o que está por trás; sobre fundo liso não há o que desfocar e o vidro some.
 * Coloque dentro de um contêiner `relative overflow-hidden`; o conteúdo de
 * vidro vai por cima com `relative`.
 */
export default function LightField({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Esfera do acento, borda definida */}
      <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-accent to-accent-strong" />
      {/* Esfera fria, para o vidro ter duas cores a misturar */}
      <div className="absolute -bottom-20 left-[12%] h-48 w-48 rounded-full bg-gradient-to-tr from-[#4F6BD8] to-[#8FA6F0] opacity-80" />
      {/* Faixa diagonal: dá uma aresta reta para o desfoque revelar */}
      <div className="absolute left-[40%] top-0 h-full w-10 -skew-x-12 bg-fg/15" />
    </div>
  );
}
