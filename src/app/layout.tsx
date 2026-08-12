import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://encontrei.app'),
  title: {
    default: 'Encontrei — O que você precisa?',
    template: '%s | Encontrei',
  },
  description:
    'A plataforma que transforma intenção em ação. Encontre profissionais, serviços e produtos com uma simples mensagem.',
  keywords: ['serviços', 'profissionais', 'marketplace', 'brasil', 'encontrar profissionais'],
  authors: [{ name: 'Encontrei' }],
  creator: 'Encontrei',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://encontrei.app',
    siteName: 'Encontrei',
    title: 'Encontrei — O que você precisa?',
    description: 'A plataforma que transforma intenção em ação.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Encontrei — O que você precisa?',
    description: 'A plataforma que transforma intenção em ação.',
    creator: '@encontreiapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090d1a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
