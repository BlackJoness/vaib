"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Aproxima a mídia conforme ela atravessa a tela (de `from` até 1).
 * O recorte fica no contêiner, então o layout não se mexe.
 */
export default function ZoomMedia({
  children,
  className = "",
  from = 1.15,
}: {
  children: React.ReactNode;
  className?: string;
  from?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [from, 1]);

  return (
    <div ref={ref} className={`overflow-hidden rounded-panel ${className}`}>
      <motion.div style={reduzir ? undefined : { scale }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
