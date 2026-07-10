import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/providers/QueryProvider';
import DataRefreshProvider from '@/providers/DataRefreshProvider';
import ChatProvider from '@/components/chat/ChatProvider';
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/seo/JsonLd';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aeroturbinespare.com'),
  title: {
    default: 'AeroTurbineSpare — Precision Aerospace Parts Sourcing',
    template: '%s | AeroTurbineSpare',
  },
  description:
    'Source certified aerospace parts fast. NSN, CAGE, turbine components, MRO supplies. ISO 9001 & AS9120 certified. 100% inspection, 24-hour quotes. Trusted by OEMs & MRO facilities worldwide. Global inventory of 32,000+ parts.',
  keywords: [
    'aerospace parts', 'NSN parts', 'CAGE code', 'turbine components',
    'MRO supplies', 'aircraft parts', 'aerospace procurement',
    'military parts', 'gas turbine', 'jet engine parts',
    'aircraft components', 'aviation parts', 'defense parts',
    'AS9120', 'ISO 9001', 'aerospace distributor',
    'turbine blades', 'landing gear', 'avionics',
    'AOG parts', 'aircraft on ground', 'FAA certified parts',
    'EASA parts', 'NSN 2840', 'CAGE 8ATR9',
  ],
  authors: [{ name: 'AeroTurbineSpare' }],
  publisher: 'AeroTurbineSpare',
  category: 'aerospace',
  openGraph: {
    type: 'website',
    siteName: 'AeroTurbineSpare',
    title: 'AeroTurbineSpare — Precision Aerospace Parts Sourcing',
    description: 'Fast, certified aerospace parts sourcing. ISO 9001, AS9120 certified. 100% inspection on every order. 32,000+ parts in catalog.',
    url: 'https://aeroturbinespare.com',
    locale: 'en_US',
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
  },
  twitter: { 
    card: 'summary_large_image',
    title: 'AeroTurbineSpare',
    description: 'Precision Aerospace Parts Sourcing — Fast, Certified, Global. ISO 9001 & AS9120 Certified.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'Ukz08W_xKDohmTpZtp7l4D0zSfCOqIGrW3kL8RVe3OM',
  },
  other: {
    'google-site-verification': 'Ukz08W_xKDohmTpZtp7l4D0zSfCOqIGrW3kL8RVe3OM',
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
      <body className="min-h-full flex flex-col antialiased">
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <QueryProvider>
          <DataRefreshProvider>
            {children}
            <ChatProvider />
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
      </body>
    </html>
  );
}
