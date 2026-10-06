import type { ElementType, ComponentPropsWithoutRef } from "react";

export type GlassLevel = 1 | 2 | 3 | "flat";

type Props<T extends ElementType> = {
  as?: T;
  className?: string;
  /**
   * 1 sutil, 2 padrão, 3 denso. "flat" tem o mesmo visual sem backdrop-filter:
   * use quando já houver três painéis desfocados na tela.
   */
  level?: GlassLevel;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

/** Superfície de vidro. Base de nav, cards, oferta e acordeão. */
export default function GlassPanel<T extends ElementType = "div">({
  as,
  level = 2,
  className = "",
  ...rest
}: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const nivel = level === "flat" ? "glass-flat" : `glass-${level}`;
  return <Tag className={`${nivel} rounded-panel ${className}`} {...rest} />;
}
