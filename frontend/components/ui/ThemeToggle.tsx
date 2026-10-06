"use client";
import { useTheme } from "@/components/ThemeProvider";

/** Alterna claro/escuro. O rótulo diz o que o clique faz. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const escuro = theme === "dark";
  const rotulo = escuro ? "Usar tema claro" : "Usar tema escuro";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={rotulo}
      title={rotulo}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-fg/10 ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
        {escuro ? (
          <>
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />
        )}
      </svg>
    </button>
  );
}
