"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { storeConfig } from "@/store.config";
import ThemeToggle from "@/components/ui/ThemeToggle";

const LINKS = storeConfig.nav;

function Icon({ d }: { d: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="glass-2 sticky top-0 z-50 rounded-none border-x-0 border-t-0">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Mobile: botão menu */}
        <button
          className="md:hidden"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon d="M3 6h18M3 12h18M3 18h18" />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-display text-fg"
        >
          {storeConfig.brand.name}
        </Link>

        {/* Links (desktop) */}
        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-muted transition-colors hover:text-accent"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Ícones */}
        <div className="flex items-center gap-4 text-fg">
          <ThemeToggle />
          <button aria-label="Buscar" className="hover:text-accent">
            <Icon d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" />
          </button>
          <button aria-label="Favoritos" className="hidden hover:text-accent sm:block">
            <Icon d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </button>
          <button aria-label="Sacola" className="relative hover:text-accent">
            <Icon d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-on-accent">
              0
            </span>
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-fg/10 md:hidden"
          >
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-fg/5">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3 font-medium text-muted"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
