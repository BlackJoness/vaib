import { storeConfig } from "@/store.config";
import Marquee from "@/components/ui/Marquee";

// Avisos do topo, em faixa contínua. Some se não houver avisos.
export default function TopBar() {
  const avisos = storeConfig.announcements;
  if (avisos.length === 0) return null;
  return (
    <div className="border-b border-fg/10 py-2 text-xs text-muted">
      <Marquee items={avisos} duration={40} />
    </div>
  );
}
