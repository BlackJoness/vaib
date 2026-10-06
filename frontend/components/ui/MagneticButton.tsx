"use client";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

type Variant = "primary" | "ghost";

const ESTILO: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong",
  ghost: "glass-flat text-fg hover:border-accent/60",
};

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  /** Com href vira link; sem href, botão. */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Quanto o botão acompanha o ponteiro, em fração da distância (0 a 0,5). */
  strength?: number;
};

/** Botão que é levemente atraído pelo ponteiro. Volta ao lugar ao sair. */
export default function MagneticButton({
  children,
  variant = "primary",
  className = "",
  href,
  onClick,
  type = "button",
  disabled,
  strength = 0.25,
}: Props) {
  const reduzir = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  function mover(e: PointerEvent<HTMLElement>) {
    if (reduzir || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  function soltar() {
    x.set(0);
    y.set(0);
  }

  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${ESTILO[variant]} ${className}`;
  const comum = { onPointerMove: mover, onPointerLeave: soltar, style: { x, y }, className: classes };

  if (href) {
    return (
      <motion.a href={href} {...comum}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} {...comum}>
      {children}
    </motion.button>
  );
}
