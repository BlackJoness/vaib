"use client";
import { Children } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Revela os filhos em sequência quando a linha entra na tela.
 * Uma vez só; com movimento reduzido, aparece direto.
 */
export default function RevealRow({
  children,
  className = "",
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduzir = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduzir ? 0 : stagger } } }}
    >
      {Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: reduzir ? { opacity: 1 } : { opacity: 0, y: 24 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
