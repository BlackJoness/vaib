import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  title: "Solê — Vista o seu dia de leveza",
  description: "Scrubs leves e alegres.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable}`}>
      <body className="bg-creme font-sans text-grafite">
        <TopBar />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
