import Link from "next/link";
import { storeConfig } from "@/store.config";

export default function Footer() {
  const { brand, footer } = storeConfig;
  return (
    <footer className="bg-grafite text-creme">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-display text-2xl font-bold">{brand.name}</p>
          <p className="mt-2 text-sm text-creme/60">{brand.tagline}</p>
        </div>
        {footer.columns.map((c) => (
          <div key={c.title}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-creme/80">
              {c.title}
            </h3>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-creme/60 hover:text-coral">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-creme/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-creme/50 md:flex-row md:px-8">
          <span>© {new Date().getFullYear()} {brand.name}. Todos os direitos reservados.</span>
          <div className="flex gap-2">
            {footer.payments.map((p) => (
              <span
                key={p}
                className="rounded bg-creme/10 px-2 py-1 font-medium text-creme/70"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
