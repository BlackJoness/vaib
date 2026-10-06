# ADR 0003: Design system de vidro, claro e escuro

**Data:** 05/10/2026 · **Status:** aceito · **Etapa:** 3 do pivô (CAR-7)

## Contexto

A loja tinha a paleta da marca antiga fixa no Tailwind (`creme`, `grafite`, `coral`, `manha`, `brisa`, `sereno`, `ameixa`) e um tema só. O pivô para loja de um produto pede uma identidade que troque por configuração, tema claro e escuro, e superfícies de vidro (glassmorphism) para o hero e a oferta.

## Decisão

| O quê | Como |
|---|---|
| Tokens | CSS variables em `app/globals.css`, em canais RGB, por tema: `--canvas`, `--raised`, `--fg`, `--muted`, `--accent`, `--accent-strong`, `--on-accent`, `--glass-1/2/3`, `--glass-edge`, `--glass-shadow`, `--glow` |
| Tailwind | Só cores semânticas (`canvas`, `raised`, `fg`, `muted`, `accent`, `on-accent`) lendo as variáveis. As cores da marca antiga saem |
| Acento | Vem do `store.config.ts` (`accent`, `accentStrong`, `accentDark`, `accentDarkStrong`); o layout grava os pares no `<html>` e cada tema escolhe o seu |
| Temas | Seletores `[data-theme="light"]` e `[data-theme="dark"]`, não `:root`, para funcionarem aninhados (a `/playground` mostra os dois lado a lado) |
| Sem flash | Script inline no `<head>` aplica `data-theme` antes do primeiro paint: escolha salva no `localStorage` > `theme.defaultMode` do config > preferência do sistema |
| Tipografia | Geist (texto e títulos, semibold com tracking negativo) e Instrument Serif itálica só para ênfase, via `next/font` |
| Vidro | Classes `.glass-1/2/3` (desfoque 8/16/24 px) e `.glass-flat` (mesmo visual, sem desfoque). Fallback sólido sem suporte a `backdrop-filter` |
| Componentes | `components/ui/`: `GlassPanel`, `SpotlightCard`, `TiltMedia`, `MagneticButton`, `NavItem`, `RevealRow`, `ZoomMedia`, `Marquee`, `Counter`, `Accordion`, `ThemeToggle`, `SerifEmphasis` |
| Documentação viva | `/playground`: cada componente nos dois temas, fora do índice de busca |

### Regras

- Nenhum componente usa hex fixo; cor nova entra como token.
- No máximo três `backdrop-filter` visíveis ao mesmo tempo (nav e dois painéis). O resto usa `.glass-flat`: o desfoque é caro em GPU fraca e em rolagem.
- Texto sobre o acento usa `on-accent` (escuro nos dois temas). O cobre não dá contraste AA com texto branco.
- Movimento reduzido desliga tilt, ímã, zoom, contagem e marquee; animações de CSS caem para 0,01 ms.
- Tilt e ímã só reagem a mouse; em toque não fazem nada.

## Alternativas descartadas

- **`darkMode: "class"` do Tailwind com variantes `dark:`.** Dobraria as classes em todo componente. Com tokens, o componente escreve `bg-canvas` uma vez e o tema troca o valor.
- **next-themes.** Resolve o mesmo com uma dependência e mexe no lockfile, que a entrega pelo navegador não comporta. O script próprio tem 1 linha útil e 30 de provider.
- **Desfoque em todo card.** Bonito em máquina boa, travado em celular médio. Daí o limite de três e o `.glass-flat`.

## Consequências

- Os componentes atuais (hero, benefícios, editorial, manifesto, newsletter, rodapé) já usam os tokens e respeitam o tema, mas mantêm o layout e os textos antigos. A etapa 4 os substitui pelas seções novas.
- Trocar a marca agora inclui escolher dois acentos (claro e escuro). O validador do config recusa hex inválido e `defaultMode` fora de `light`, `dark` ou `system`.
