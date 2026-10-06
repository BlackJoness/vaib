"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { storeConfig } from "@/store.config";
import NavItem from "@/components/ui/NavItem";
import ThemeToggle from "@/components/ui/ThemeToggle";

// Nav em pill de vidro, flutuando sobre a página. Links são âncoras das seções.
export default function Navbar() {
  const [aberto, setAberto] = useState(false);
  const links = storeConfig.nav;

  return (
    <header className="sticky top-3 z-50 px-3 sm:top-4 sm:px-6">
      <nav
        aria-label="Principal"
        className="glass-2 mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2"
      >
        <Link href="/" className="text-lg font-semibold tracking-display text-fg">
          {storeConfig.brand.name}
        </Link>

        <ul className="hidden items-center md:flex">
          {links.map((l, i) => (
            <li key={l.href}>
              <NavItem href={l.href} index={i + 1}>
                {l.label}
              </NavItem>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <a
            href="#oferta"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong sm:inline-flex"
          >
            Ver oferta
          </a>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-fg hover:bg-fg/10 md:hidden"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            onClick={() => setAberto((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              {aberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {aberto && (
          <motion.ul
            id="menu-mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-flat mx-auto mt-2 max-w-5xl rounded-panel p-3 md:hidden"
          >
            {links.map((l, i) => (
              <li key={l.href}>
                <NavItem href={l.href} index={i + 1} onClick={() => setAberto(false)}>
                  {l.label}
                </NavItem>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
