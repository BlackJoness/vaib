import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-creme text-center">
      <h1 className="font-display text-4xl font-bold text-grafite">
        Página não encontrada
      </h1>
      <p className="text-grafite/60">Essa peça saiu da coleção.</p>
      <Link
        href="/"
        className="rounded-xl2 bg-coral px-6 py-3 font-semibold text-white shadow-soft"
      >
        Voltar à loja
      </Link>
    </main>
  );
}
