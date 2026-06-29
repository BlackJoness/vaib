"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-creme text-center">
      <h1 className="font-display text-3xl font-bold text-grafite">
        Algo deu errado
      </h1>
      <button
        onClick={reset}
        className="rounded-xl2 bg-coral px-6 py-3 font-semibold text-white shadow-soft"
      >
        Tentar novamente
      </button>
    </main>
  );
}
