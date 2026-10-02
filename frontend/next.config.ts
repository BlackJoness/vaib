import type { NextConfig } from "next";

// Cabeçalhos de segurança aplicados a todas as páginas da loja.
// Sem CSP de scripts aqui: o Next injeta scripts inline e uma CSP estrita
// exige nonce por requisição; fica registrado como próximo passo.
const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Domínios externos de imagem (ex.: storage do Supabase)
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // NEXT_PUBLIC_API_URL já é exposta automaticamente pelo Next — sem bloco env redundante.
};

export default nextConfig;
