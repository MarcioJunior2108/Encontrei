import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/providers';
import { SplashScreen } from '@/components/SplashScreen';
import { GlobalChatWidget } from '@/components/chat/GlobalChatWidget';
import { getCurrentProfile } from '@/app/actions/user';
import { GoogleAnalytics } from '@/components/scripts/GoogleAnalytics';
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
  metadataBase: new URL('https://acheiyou.app'),
  title: {
    default: 'AcheiYou — O que você precisa?',
    template: '%s | AcheiYou',
  },
  description:
    'A plataforma que transforma intenção em ação. Encontre profissionais, serviços e produtos com uma simples mensagem.',
  keywords: ['serviços', 'profissionais', 'marketplace', 'brasil', 'encontrar profissionais'],
  authors: [{ name: 'AcheiYou' }],
  creator: 'AcheiYou',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://acheiyou.app',
    siteName: 'AcheiYou',
    title: 'AcheiYou — O que você precisa?',
    description: 'A plataforma que transforma intenção em ação.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AcheiYou — O que você precisa?',
    description: 'A plataforma que transforma intenção em ação.',
    creator: '@acheiyouapp',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <SplashScreen />
        <GoogleAnalytics />
        <Providers>{children}</Providers>
        
        {/* Chat Flutuante Global para usuários logados */}
        {profile && <GlobalChatWidget currentUserId={profile.id} />}
        
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
