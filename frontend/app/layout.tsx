import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { storeConfig } from "@/store.config";
import { validateStoreConfig } from "@/lib/store-config.schema";
import { themeStyle } from "@/lib/theme";

// Valida a identidade da loja no servidor. Roda no `next build`:
// configuração inválida derruba o build, não a loja em produção.
const store = validateStoreConfig(storeConfig);

// Tipografia do Brandbook — variáveis consumidas pelo tailwind.config.ts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: store.seo.title,
  description: store.seo.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={store.seo.locale}
      className={`${poppins.variable} ${inter.variable}`}
      style={themeStyle(store.theme)}
    >
      <body className="bg-creme font-sans text-grafite">
        <TopBar />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
