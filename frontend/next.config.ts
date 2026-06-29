import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Domínios de imagens/CDN usados pela loja (ajuste conforme o storage real)
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  // A loja consome a API NestJS hospedada no Render
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
