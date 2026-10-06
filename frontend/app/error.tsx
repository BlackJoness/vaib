"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-canvas text-center">
      <h1 className="font-display text-3xl font-semibold tracking-display text-fg">
        Algo deu errado
      </h1>
      <button
        onClick={reset}
        className="rounded-xl2 bg-accent px-6 py-3 font-semibold text-on-accent shadow-soft"
      >
        Tentar novamente
      </button>
    </main>
  );
}
