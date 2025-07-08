/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'shrswzchkqiobcikdfrn.supabase.co',
      // puedes agregar otros dominios aquí si los necesitas
    ],
  },
  // i18n se maneja manualmente en App Router usando contexto React
};

module.exports = nextConfig;
