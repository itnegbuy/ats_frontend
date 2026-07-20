import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/providers/QueryProvider';
import DataRefreshProvider from '@/providers/DataRefreshProvider';
import ChatProvider from '@/components/chat/ChatProvider';
import { NotificationProvider } from '@/hooks/useNotifications';
import NotificationToastHandler from '@/components/notifications/NotificationToastHandler';
import QuickContactDrawer from '@/components/ui/QuickContactDrawer';
import { OrganizationJsonLd, WebsiteJsonLd, FAQJsonLd, LocalBusinessJsonLd, ServiceJsonLd, SpeakableJsonLd } from '@/components/seo/JsonLd';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'optional',
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'optional',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aeroturbinespare.com'),
  title: {
    default: 'Gas Turbine Spare Parts Supplier | GE, Siemens & Rolls-Royce',
    template: '%s | AeroTurbineSpare',
  },
  description:
    'Source gas turbine spare parts for GE, Siemens & Rolls-Royce. New, refurbished & serviceable blades, nozzles & combustion parts. Get a quote today.',
  keywords: [
    'gas turbine spare parts', 'turbine services', 'GE turbines', 'Siemens turbines',
    'Rolls-Royce turbines', 'Solar Turbines', 'NSN parts', 'CAGE code',
    'aerospace parts', 'turbine components', 'MRO supplies', 'aircraft parts',
    'aerospace procurement', 'military parts', 'jet engine parts',
    'aircraft components', 'aviation parts', 'defense parts',
    'AS9120', 'ISO 9001', 'aerospace distributor',
    'turbine blades', 'landing gear', 'avionics',
    'AOG parts', 'aircraft on ground', 'FAA certified parts',
    'EASA parts', 'CAGE 8ATR9',
  ],
  authors: [{ name: 'AeroTurbineSpare' }],
  publisher: 'AeroTurbineSpare',
  category: 'aerospace',
  openGraph: {
    type: 'website',
    siteName: 'Aero Turbine Spares',
    title: 'Gas Turbine Spare Parts Supplier | GE, Siemens & Rolls-Royce',
    description:
      'Source gas turbine parts for GE, Siemens & Rolls-Royce. 24-hr quotes, worldwide shipping.',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gas Turbine Spare Parts Supplier',
    description:
      'GE, Siemens & Rolls-Royce parts. 24-hr quotes. Worldwide shipping.',
    images: ['/images/og-cover.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png?v=2', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png?v=2',
    apple: '/apple-touch-icon.png?v=2',
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'Ukz08W_xKDohmTpZtp7l4D0zSfCOqIGrW3kL8RVe3OM',
  },
  other: {
    'google-site-verification': 'Ukz08W_xKDohmTpZtp7l4D0zSfCOqIGrW3kL8RVe3OM',
    'geo.region': 'US',
    'geo.placename': 'United States',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A1628',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://api.aeroturbinespare.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://api.aeroturbinespare.com" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#4F46E5] focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <FAQJsonLd />
        <LocalBusinessJsonLd />
        <ServiceJsonLd />
        <SpeakableJsonLd />
        <QueryProvider>
          <DataRefreshProvider>
            <NotificationProvider>
              {children}
              <NotificationToastHandler />
              <ChatProvider />
              <QuickContactDrawer />
            </NotificationProvider>
          </DataRefreshProvider>
        </QueryProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0A1628',
              color: '#E8EDF2',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#00A651', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#E8751A', secondary: '#fff' } },
          }}
        />

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-QH0HYG18PL" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QH0HYG18PL');
          `}
        </Script>
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `}</Script>
      </body>
    </html>
  );
}
