"use client";
import { useState } from "react";
import { storeConfig } from "@/store.config";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const texto = storeConfig.newsletter;

  return (
    <section className="px-6 py-16 md:px-8">
      <div className="glass-2 mx-auto max-w-3xl rounded-panel px-6 py-14 text-center md:px-12">
        <h2 className="font-display text-2xl font-semibold tracking-display md:text-3xl">
          {texto.title}
        </h2>
        <p className="mt-2 text-muted">{texto.subtitle}</p>
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
            className="flex-1 rounded-full border border-fg/15 bg-canvas/70 px-5 py-3 text-fg placeholder:text-muted"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 font-semibold text-on-accent transition-transform hover:scale-[1.03]"
          >
            {texto.cta}
          </button>
        </form>
        {ok && (
          <p className="mt-3 text-sm text-accent">{texto.success}</p>
        )}
      </div>
    </section>
  );
}
