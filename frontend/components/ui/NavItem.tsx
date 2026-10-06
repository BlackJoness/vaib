import Link from "next/link";

/**
 * Item da nav em pill. O número indica a ordem das seções na página
 * (a nav aponta para âncoras da landing, que é uma sequência).
 */
export default function NavItem({
  href,
  index,
  children,
  onClick,
}: {
  href: string;
  index: number;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-baseline gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg"
    >
      <span className="text-[0.7rem] tabular-nums text-accent">{String(index).padStart(2, "0")}</span>
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
      </span>
    </Link>
  );
}
