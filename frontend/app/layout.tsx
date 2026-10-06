import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { storeConfig } from "@/store.config";
import { validateStoreConfig } from "@/lib/store-config.schema";
import { serverTheme, themeInitScript, themeStyle } from "@/lib/theme";

// Valida a identidade da loja no servidor. Roda no `next build`:
// configuração inválida derruba o build, não a loja em produção.
const store = validateStoreConfig(storeConfig);

// Geist para texto e títulos; Instrument Serif itálica só para ênfase.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: store.seo.title,
  description: store.seo.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const inicial = serverTheme(store.theme);
  return (
    // suppressHydrationWarning: o script abaixo pode trocar data-theme antes
    // da hidratação; a diferença é esperada e só nesse atributo.
    <html
      lang={store.seo.locale}
      data-theme={inicial}
      className={`${geist.variable} ${instrument.variable}`}
      style={themeStyle(store.theme)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript(store.theme.defaultMode) }} />
      </head>
      <body className="font-sans text-fg">
        <ThemeProvider initial={inicial}>
          <TopBar />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
