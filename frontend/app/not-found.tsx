import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-canvas text-center">
      <h1 className="font-display text-4xl font-semibold tracking-display text-fg">
        Página não encontrada
      </h1>
      <p className="text-muted">Essa peça saiu da coleção.</p>
      <Link
        href="/"
        className="rounded-xl2 bg-accent px-6 py-3 font-semibold text-on-accent shadow-soft"
      >
        Voltar à loja
      </Link>
    </main>
  );
}
