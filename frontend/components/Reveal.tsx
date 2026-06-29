"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

// Envolve qualquer seção para revelá-la suavemente ao entrar na viewport
export default function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
