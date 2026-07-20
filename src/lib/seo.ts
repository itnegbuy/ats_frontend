import { COUNTRIES, COUNTRY_CODES, DEFAULT_COUNTRY, getCountry } from './countries'

const SITE_URL = 'https://aeroturbinespare.com';
const SITE_NAME = 'AeroTurbineSpare';
const DEFAULT_DESC = 'Source certified aerospace parts fast. NSN, CAGE, turbine components, MRO supplies. ISO 9001 & AS9120 certified. 100% inspection, 24-hour quotes. Trusted by OEMs & MRO facilities worldwide.';
const DEFAULT_OG_IMAGE = '/images/og-cover.jpg';

export function buildHreflang(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const code of COUNTRY_CODES) {
    const locale = COUNTRIES[code].locale.replace('_', '-').toLowerCase();
    languages[locale] = code === DEFAULT_COUNTRY ? `${SITE_URL}${path}` : `${SITE_URL}/${code}${path}`;
  }
  languages['x-default'] = `${SITE_URL}${path}`;
  return languages;
}

export const siteConfig = {
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESC,
  ogImage: DEFAULT_OG_IMAGE,
  twitterHandle: '@AeroTurbineSpare',
  locale: 'en_US',
  address: {
    street: '1360-1362 NW 78th Ave',
    city: 'Doral',
    state: 'FL',
    zip: '33126',
    country: 'US',
  },
  phone: '+31611879800',
  email: 'sales@aeroturbinespare.com',
  cageCode: '8ATR9',
  certifications: ['ISO 9001:2015', 'AS9120 Rev B'],
};

export function buildMetadata(overrides: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
  country?: string;
}) {
  const country = overrides.country || DEFAULT_COUNTRY;
  const cfg = getCountry(country);
  const isDefault = country === DEFAULT_COUNTRY;

  const title = overrides.title
    ? `${overrides.title} | AeroTurbineSpare`
    : 'AeroTurbineSpare — Precision Aerospace Parts Sourcing';
  const description = overrides.description || DEFAULT_DESC;
  const url = isDefault
    ? (overrides.path ? `${SITE_URL}${overrides.path}` : SITE_URL)
    : (overrides.path ? `${SITE_URL}/${country}${overrides.path}` : `${SITE_URL}/${country}`);
  const image = overrides.ogImage || DEFAULT_OG_IMAGE;

  const languages: Record<string, string> = {};
  for (const code of COUNTRY_CODES) {
    const c = COUNTRIES[code];
    const locale = c.locale.replace('_', '-').toLowerCase();
    languages[locale] = code === DEFAULT_COUNTRY
      ? `${SITE_URL}${overrides.path || ''}`
      : `${SITE_URL}/${code}${overrides.path || ''}`;
  }
  languages['x-default'] = `${SITE_URL}${overrides.path || ''}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website' as const,
      locale: cfg.locale,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [image],
    },
    robots: overrides.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    keywords: (overrides.keywords || []).join(', '),
  };
}

export function jsonLdOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESC,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: siteConfig.address.country,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        contactType: 'sales',
        email: siteConfig.email,
        hoursAvailable: 'Mo-Fr 07:00-19:00',
      },
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        contactType: 'emergency',
        description: 'AOG Emergency Line (24/7)',
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/aeroturbinespare',
    ],
  };
}

export function jsonLdWebsite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESC,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/catalog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function jsonLdBreadcrumb(items: { name: string; url: string }[], country?: string) {
  const prefix = country ? `/${country}` : '';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${prefix}${item.url}`,
    })),
  };
}

export function jsonLdProduct(product: {
  name: string;
  description: string;
  sku: string;
  mpn: string;
  brand: string;
  image?: string;
  offers: {
    price: number;
    currency?: string;
    availability: 'InStock' | 'LimitedAvailability' | 'OutOfStock';
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    mpn: product.mpn,
    image: product.image,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      price: product.offers.price,
      priceCurrency: product.offers.currency || 'USD',
      availability: `https://schema.org/${product.offers.availability}`,
    },
  };
}

export function jsonLdFAQ(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export const HOMEPAGE_FAQ = [
  {
    question: 'How do I request a quote for aerospace parts?',
    answer: 'Simply use our search bar to find your part by NSN, CAGE code, or part number, or submit a detailed RFQ directly through our website. Our team reviews every request and responds within 24 hours with a competitive, certified quote — no account required.',
  },
  {
    question: 'What certifications does AeroTurbineSpare hold?',
    answer: 'We are ISO 9001:2015 and AS9120 Rev B certified, with CAGE code 8ATR9. Every part is inspected, documented, and traced to its original source. Our quality management system is audited annually by accredited third-party certification bodies.',
  },
  {
    question: 'Do you ship to my country?',
    answer: 'We ship to over 150 countries worldwide through our global logistics network. We handle all export compliance and ITAR documentation. Whether you are in Europe, the Middle East, Asia, Africa, or North America, we can deliver to your facility.',
  },
  {
    question: 'What is your AOG (Aircraft on Ground) response time?',
    answer: 'Our AOG priority response team is available 24/7. Flag your RFQ as urgent, and we escalate to our rapid-response team for a 4-hour turnaround. Call our AOG emergency line at +31611879800 for immediate assistance.',
  },
  {
    question: 'Do you provide traceability documentation with parts?',
    answer: 'Yes. Every shipment includes a Certificate of Conformance (CoC), traceability documentation back to the OEM or approved supplier, and airworthiness approval tags (8130-3, EASA Form 1, or equivalent) where applicable. Full documentation is non-negotiable.',
  },
  {
    question: 'Can you source hard-to-find or obsolete parts?',
    answer: 'Absolutely. We specialize in sourcing parts that other distributors cannot locate — legacy military components, obsolete part numbers, and hard-to-find commercial aviation parts. Our global supplier network of over 1,200 certified OEM manufacturers makes this possible.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept wire transfers, letters of credit (LC), and credit cards for qualified orders. Net terms may be available for established customers with approved credit. Contact our sales team for specific payment arrangements.',
  },
  {
    question: 'How do I sell my excess inventory to AeroTurbineSpare?',
    answer: 'Use our Sell Inventory page to submit your excess stock. Upload your inventory list, and our procurement team will review it and respond with a competitive offer. We purchase certified aerospace parts from quality suppliers worldwide.',
  },
];
