"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";

/**
 * Inclina o conteúdo em 3D conforme o ponteiro (no máximo `max` graus).
 * Sem efeito com movimento reduzido ou em toque.
 */
export default function TiltMedia({
  children,
  className = "",
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const reduzir = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const mola = { stiffness: 150, damping: 18, mass: 0.4 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), mola);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), mola);

  function mover(e: PointerEvent<HTMLDivElement>) {
    if (reduzir || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  function soltar() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div className={`[perspective:1200px] ${className}`} onPointerMove={mover} onPointerLeave={soltar}>
      <motion.div style={reduzir ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </div>
  );
}
