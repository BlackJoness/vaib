"use client";
import { useRef } from "react";
import type { PointerEvent } from "react";

/**
 * Card de vidro com um halo do acento que segue o ponteiro.
 * A posição vai em CSS variables (sem re-render do React por movimento).
 */
export default function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function mover(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={mover}
      className={`group glass-flat relative overflow-hidden rounded-panel ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(22rem circle at var(--mx, 50%) var(--my, 50%), rgb(var(--accent) / 0.18), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
