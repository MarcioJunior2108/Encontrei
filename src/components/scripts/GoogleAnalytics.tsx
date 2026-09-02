'use client';

import Script from 'next/script';

export function GoogleAnalytics() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID; // Você vai colocar isso no .env
  const AW_TRACKING_ID = 'AW-18375086715'; // Google Ads

  if (!GA_TRACKING_ID && !AW_TRACKING_ID) return null;

  const mainId = GA_TRACKING_ID || AW_TRACKING_ID;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${mainId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${GA_TRACKING_ID ? `
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });` : ''}
            ${AW_TRACKING_ID ? `
            gtag('config', '${AW_TRACKING_ID}');` : ''}
          `,
        }}
      />
    </>
  );
}
