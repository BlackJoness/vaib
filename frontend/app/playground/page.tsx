import type { Metadata } from "next";
import GlassPanel from "@/components/ui/GlassPanel";
import SpotlightCard from "@/components/ui/SpotlightCard";
import TiltMedia from "@/components/ui/TiltMedia";
import MagneticButton from "@/components/ui/MagneticButton";
import NavItem from "@/components/ui/NavItem";
import RevealRow from "@/components/ui/RevealRow";
import ZoomMedia from "@/components/ui/ZoomMedia";
import Marquee from "@/components/ui/Marquee";
import Counter from "@/components/ui/Counter";
import Accordion from "@/components/ui/Accordion";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SerifEmphasis from "@/components/ui/SerifEmphasis";

// Documentação viva do design system: cada componente nos dois temas.
// Fora do índice de busca; é página de trabalho, não de venda.
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

/** Bloco de vidro com luz de cima: a mídia provisória do produto. */
function BlocoDeVidro() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-panel bg-gradient-to-b from-accent/30 via-raised/40 to-canvas">
      <div className="absolute left-1/2 top-0 h-2/3 w-2/3 -translate-x-1/2 rounded-full bg-accent/40 blur-3xl" />
      <div className="glass-flat absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[1.25rem]" />
    </div>
  );
}

function Amostra({ nome, uso, children }: { nome: string; uso: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t border-fg/10 pt-8">
      <div>
        <h2 className="text-lg font-semibold text-fg">{nome}</h2>
        <p className="max-w-prose text-sm text-muted">{uso}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(["light", "dark"] as const).map((t) => (
          <div key={t} data-theme={t} className="rounded-panel bg-canvas p-6 text-fg ring-1 ring-fg/10">
            <p className="mb-4 text-xs text-muted">Tema {t === "light" ? "claro" : "escuro"}</p>
            {children}
          </div>
        ))}
      </div>
    </section>
  );
}

const FAQ = [
  { pergunta: "Atende fora da minha cidade?", resposta: "Sim. O projeto é remoto; a montagem conta com parceiros locais." },
  { pergunta: "Como funciona o pagamento?", resposta: "Depois do pedido, a gente entra em contato para alinhar e fechar." },
];

export default function Playground() {
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-6 py-16 md:px-8">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-display md:text-5xl">
            <SerifEmphasis text="Design system de vidro" emphasis="vidro" />
          </h1>
          <p className="mt-3 max-w-prose text-muted">
            Tokens em app/globals.css, componentes em components/ui. O botão ao lado troca o tema da página
            inteira; as amostras abaixo mostram os dois temas fixos.
          </p>
        </div>
        <ThemeToggle className="glass-flat" />
      </header>

      <Amostra nome="GlassPanel" uso="Superfície base. Níveis 1, 2 e 3 desfocam o fundo; flat tem o visual sem o custo do desfoque.">
        <div className="grid grid-cols-2 gap-3">
          {([1, 2, 3, "flat"] as const).map((l) => (
            <GlassPanel key={l} level={l} className="p-4 text-sm">
              Nível {l}
            </GlassPanel>
          ))}
        </div>
      </Amostra>

      <Amostra nome="SpotlightCard" uso="Card com halo do acento seguindo o ponteiro. Para benefícios e passos.">
        <SpotlightCard className="p-6">
          <p className="font-semibold">Orçamento fechado</p>
          <p className="mt-1 text-sm text-muted">Preço definido antes de começar.</p>
        </SpotlightCard>
      </Amostra>

      <Amostra nome="TiltMedia" uso="Inclina a mídia do produto com o mouse. Desligado em toque e com movimento reduzido.">
        <TiltMedia>
          <BlocoDeVidro />
        </TiltMedia>
      </Amostra>

      <Amostra nome="MagneticButton" uso="Ação principal (primary) e secundária (ghost). Vira link quando recebe href.">
        <div className="flex flex-wrap gap-3">
          <MagneticButton>Quero este projeto</MagneticButton>
          <MagneticButton variant="ghost">Ver como funciona</MagneticButton>
        </div>
      </Amostra>

      <Amostra nome="NavItem" uso="Link da nav em pill. O número é a ordem da seção na página.">
        <nav className="glass-flat flex w-fit gap-1 rounded-full p-1">
          <NavItem href="#" index={1}>Projeto</NavItem>
          <NavItem href="#" index={2}>Como funciona</NavItem>
          <NavItem href="#" index={3}>Oferta</NavItem>
        </nav>
      </Amostra>

      <Amostra nome="Counter" uso="Números da prova social. Anima só a parte numérica; o resto do texto fica.">
        <div className="flex gap-8 text-3xl font-semibold">
          <Counter value="120+" />
          <Counter value="4.9" />
          <Counter value="15" />
        </div>
      </Amostra>

      <Amostra nome="Accordion" uso="FAQ. Uma resposta aberta por vez, navegável por teclado.">
        <Accordion items={FAQ} />
      </Amostra>

      <Amostra nome="Marquee" uso="Faixa contínua para avisos ou depoimentos curtos. Pausa no hover.">
        <Marquee items={["Projeto autoral", "Orçamento fechado", "Entrega em 15 dias"]} duration={18} className="text-sm" />
      </Amostra>

      <Amostra nome="SerifEmphasis" uso="Destaque em serifa itálica dentro de um título. O trecho vem de content.enfase.">
        <p className="text-3xl font-semibold tracking-display">
          <SerifEmphasis text="Um espaço com a sua cara" emphasis="sua cara" />
        </p>
      </Amostra>

      <section className="space-y-4 border-t border-fg/10 pt-8">
        <h2 className="text-lg font-semibold">RevealRow e ZoomMedia</h2>
        <p className="max-w-prose text-sm text-muted">
          Entrada em sequência ao rolar e aproximação da mídia. Mostrados uma vez, no tema da página.
        </p>
        <RevealRow className="grid gap-4 md:grid-cols-3">
          {["Briefing", "Proposta", "Execução"].map((t) => (
            <GlassPanel key={t} level="flat" className="p-6">
              {t}
            </GlassPanel>
          ))}
        </RevealRow>
        <ZoomMedia className="aspect-[16/7]">
          <BlocoDeVidro />
        </ZoomMedia>
      </section>
    </main>
  );
}
