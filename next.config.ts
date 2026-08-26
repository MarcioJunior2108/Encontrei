import type { NextConfig } from 'next';
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: true, // Desativado temporariamente para evitar tela em branco por cache do Service Worker
});

const nextConfig: NextConfig = {
  turbopack: {},
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'api.dicebear.com' },
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
      { protocol: 'https' as const, hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https' as const, hostname: '*.supabase.co' },
      { protocol: 'https' as const, hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default withPWA(nextConfig);
