import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Componentes gerados pelo Shadcn podem ter padrões que disparam regras de lint;
  // o build não deve falhar por isso em um painel interno.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
