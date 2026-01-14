/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shrswzchkqiobcikdfrn.supabase.co',
        pathname: '/**',
      },
    ],
    // Mantener domains por compatibilidad pero usar remotePatterns
    domains: [
      'shrswzchkqiobcikdfrn.supabase.co',
    ],
  },
  // Configuraciones críticas para evitar problemas de Server Actions
  experimental: {
    // Aumentar el tamaño máximo de payload para Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Configuración de headers para mejor caché y seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
  // i18n se maneja manualmente en App Router usando contexto React
};

module.exports = nextConfig;
