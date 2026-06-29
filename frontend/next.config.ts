import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Domínios externos de imagem (ex.: storage do Supabase)
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  // NEXT_PUBLIC_API_URL já é exposta automaticamente pelo Next — sem bloco env redundante.
};

export default nextConfig;
