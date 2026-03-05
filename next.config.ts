/**
 * Fix for Node.js 25: it exposes a global `localStorage` object that lacks
 * standard Web Storage API methods (getItem, setItem, removeItem).
 * This breaks @supabase/auth-js which checks `globalThis.localStorage`
 * and assumes the full API is available.
 */
if (typeof globalThis.localStorage === 'object' && typeof globalThis.localStorage.getItem !== 'function') {
  delete (globalThis as Record<string, unknown>).localStorage;
}

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
