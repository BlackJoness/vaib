import { useCallback, useEffect, useState } from "react";
import KpiCards from "../components/KpiCards";
import LoginForm from "../components/LoginForm";
import { getLoja, sessao } from "./api";

export default function App() {
  const [logado, setLogado] = useState(() => Boolean(sessao.token()));
  const [nomeLoja, setNomeLoja] = useState<string | null>(null);

  useEffect(() => {
    getLoja().then((loja) => {
      if (!loja) return;
      setNomeLoja(loja.nome);
      document.title = `${loja.nome} · Dashboard`;
    });
  }, []);

  const sair = useCallback(() => {
    sessao.limpar();
    setLogado(false);
  }, []);

  if (!logado) return <LoginForm onEntrar={() => setLogado(true)} />;

  return (
    <div className="mx-auto max-w-5xl p-8">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite">
            {nomeLoja ? `${nomeLoja} · Dashboard` : "Dashboard"}
          </h1>
          <p className="text-grafite/60">Gestão de produtos e pedidos</p>
        </div>
        <button onClick={sair} className="text-sm text-grafite/60 underline">
          Sair
        </button>
      </header>
      <KpiCards onSessaoExpirada={sair} />
    </div>
  );
}
