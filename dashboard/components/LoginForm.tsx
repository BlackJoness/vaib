import { FormEvent, useState } from "react";
import { login } from "../src/api";

export default function LoginForm({ onEntrar }: { onEntrar: () => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await login(email, senha);
      setSenha("");
      onEntrar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="mx-auto mt-24 max-w-sm space-y-4 rounded-xl2 bg-white p-8 shadow-soft">
      <h1 className="text-xl font-bold text-grafite">Entrar no dashboard</h1>
      <label className="block text-sm text-grafite/70">
        E-mail
        <input
          type="email" required autoComplete="username" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-grafite/20 px-3 py-2 text-grafite"
        />
      </label>
      <label className="block text-sm text-grafite/70">
        Senha
        <input
          type="password" required autoComplete="current-password" value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="mt-1 w-full rounded-lg border border-grafite/20 px-3 py-2 text-grafite"
        />
      </label>
      {erro && <p role="alert" className="text-sm text-coral">{erro}</p>}
      <button
        type="submit" disabled={enviando}
        className="w-full rounded-lg bg-grafite py-2 font-semibold text-white disabled:opacity-60"
      >
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
