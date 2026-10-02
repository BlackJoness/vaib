import { storeConfig } from "@/store.config";

// Barra de avisos no topo (frete, pix, parcelamento). Some se não houver avisos.
export default function TopBar() {
  const avisos = storeConfig.announcements;
  if (avisos.length === 0) return null;

  return (
    <div className="bg-grafite text-creme">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-center text-xs font-medium">
        {avisos.map((a) => (
          <span key={a}>{a}</span>
        ))}
      </div>
    </div>
  );
}
