"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);

  return (
    <section className="bg-ameixa text-creme">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center md:px-8">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          Entre para a Vaib
        </h2>
        <p className="mt-2 text-creme/80">
          Receba lançamentos e 10% na primeira compra.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setOk(true);
          }}
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="flex-1 rounded-xl2 px-4 py-3 text-grafite outline-none"
          />
          <button
            type="submit"
            className="rounded-xl2 bg-coral px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Quero entrar
          </button>
        </form>
        {ok && (
          <p className="mt-3 text-sm text-manha">Pronto! Bem-vinda à leveza. ☀</p>
        )}
      </div>
    </section>
  );
}
