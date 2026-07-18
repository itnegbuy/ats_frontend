import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Award, Zap, Globe, CheckCircle, Cpu, Thermometer, Wind, Cog, Gauge, Package, Wrench } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Siemens SGT-800 Parts — Combustion, Turbine & Compressor Components',
  description: 'Source Siemens SGT-800 gas turbine spare parts including combustion liners, burner modules, rotor blades, compressor vanes & fuel nozzles. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
  keywords: [
    'Siemens SGT-800 parts', 'SGT-800 gas turbine', 'SGT-800 combustion liners',
    'SGT-800 burner modules', 'SGT-800 rotor blades', 'SGT-800 fuel nozzles',
    'SGT-800 compressor vanes', 'SGT-800 turbine components',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/siemens-sgt800-parts',
    languages: buildHreflang('/siemens-sgt800-parts'),
  },
  openGraph: {
    title: 'Siemens SGT-800 Parts — Combustion, Turbine & Compressor Components',
    description: 'Source Siemens SGT-800 gas turbine spare parts including combustion liners, burner modules, rotor blades & compressor vanes. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
    url: 'https://aeroturbinespare.com/siemens-sgt800-parts',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Siemens SGT-800 Parts',
    description: 'Source Siemens SGT-800 gas turbine parts. 5M+ NSN/CAGE. ISO 9001 & AS9120. 24-hour quotes.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

const PARTS_TABLE = [
  {
    category: 'Combustion System',
    items: [
      { part: 'Burner Module', description: '33rd generation DLE burner assembly with pilot and main fuel stages. Pre-mixed combustion design for ultra-low NOx emissions.' },
      { part: 'Combustion Liner', description: 'High-temperature alloy liner with effusion cooling. Available for standard and extended inspection intervals.' },
      { part: 'Flame Tube', description: 'Inconel 617 flame tube with thermal barrier coating. Includes cross-fire tube connections.' },
      { part: 'Fuel Nozzle', description: 'Gas fuel nozzle with integrated pilot stage. Designed for DLE combustion system compatibility.' },
      { part: 'Ignitor & Flame Detector', description: 'High-energy spark ignitor and UV flame detector assembly. ATEX-certified for hazardous environments.' },
    ],
  },
  {
    category: 'Turbine Section',
    items: [
      { part: 'Stage 1 Rotor Blade', description: 'Investment cast superalloy blade with TBC and internal cooling. Fir tree root attachment for high-cycle durability.' },
      { part: 'Stage 2 Rotor Blade', description: 'Directionally solidified blade with optimized airfoil profile. Integral platform and tip shroud.' },
      { part: 'Stage 3 Rotor Blade', description: 'Equiaxed superalloy blade designed for lower temperature stages. Cost-effective replacement option.' },
      { part: 'Stage 1 Nozzle Guide Vane', description: 'Film-cooled vane segment with TBC. Single-vane design with inner and outer endwalls.' },
      { part: 'Stage 2 Nozzle Guide Vane', description: 'Two-vane segment with convective cooling. Platform with feather seal slots.' },
      { part: 'Turbine Shroud', description: 'Segmentally arranged shroud blocks with honeycomb seal lands. Abradable coating for minimum tip clearance.' },
    ],
  },
  {
    category: 'Compressor Section',
    items: [
      { part: 'Inlet Guide Vane', description: 'Variable IGV with bushing and lever arm assembly. Electronically actuated for precise air mass flow control.' },
      { part: 'Stage 1-4 Rotor Blade', description: 'Titanium alloy blades with dovetail root attachment. Contoured airfoil for high aerodynamic efficiency.' },
      { part: 'Stage 5-12 Rotor Blade', description: 'Steel alloy blades with fir tree root. Part-span shrouds on longer blades for vibration damping.' },
      { part: 'Stator Vane Segment', description: 'Two-vane per segment design. Variable geometry rows 1-4 with unison ring actuation.' },
      { part: 'Compressor Disc', description: 'Forged alloy steel disc with precision machined dovetail slots. MPI and ultrasonic inspection certified.' },
    ],
  },
  {
    category: 'Fuel System',
    items: [
      { part: 'Gas Control Valve', description: 'Modulating fuel gas control valve with linear position feedback. SIL-2 rated for safety-critical applications.' },
      { part: 'Fuel Manifold Assembly', description: 'Inconel 625 manifold with flex hose connections. Pre-assembled and pressure tested.' },
      { part: 'Fuel Gas Skid Components', description: 'Gas boost pump, heater, filter coalescer and metering section. Complete skid rebuild kits available.' },
    ],
  },
  {
    category: 'Bearings & Seals',
    items: [
      { part: 'Journal Bearing', description: 'Tilting pad journal bearing with babbit lining. Four-pad configuration for rotor dynamic stability.' },
      { part: 'Thrust Bearing', description: 'Double-acting thrust bearing with leveling plates. bi-directional load capability.' },
      { part: 'Labyrinth Seal', description: 'Interstage labyrinth seal with honeycomb lands. Retrofittable with brush seal upgrades.' },
      { part: 'Carbon Ring Seal', description: 'Segmented carbon ring seal for bearing oil containment. Spring-loaded for consistent contact pressure.' },
    ],
  },
  {
    category: 'Control System',
    items: [
      { part: 'TPM Control Module', description: 'Turbine Protection Module with redundant processor. Overspeed and over-temperature protection logic.' },
      { part: 'SPPA-T3000 I/O Card', description: 'Analog/digital I/O module for SPPA-T3000 DCS. Hot-swappable with LED status indication.' },
      { part: 'Vibration Monitor', description: 'Dual-channel vibration monitor with seismic and proximity probes. API 670 compliant.' },
      { part: 'Thermocouple Harness', description: 'Engine-mounted thermocouple harness with K-type elements. High-temperature silicone insulation.' },
    ],
  },
];

const WHY_US = [
  {
    icon: Shield,
    title: 'Zero Counterfeit Policy',
    description: 'Every SGT-800 part is verified against Siemens specifications with full chain-of-custody documentation.',
  },
  {
    icon: Zap,
    title: '24-Hour Quote Response',
    description: 'Submit an RFQ for any SGT-800 part and receive a competitive quote within 24 hours. Emergency requests get same-day turnaround.',
  },
  {
    icon: Award,
    title: 'ISO 9001 & AS9120 Certified',
    description: 'Dual-certified quality management system covering aerospace and defense-grade parts sourcing for gas turbine components.',
  },
  {
    icon: Globe,
    title: '5M+ Parts Inventory',
    description: 'Access to over 5 million line items including new, overhauled, and refurbished SGT-800 components. In-stock parts ship same day from our Doral, FL warehouse.',
  },
  {
    icon: CheckCircle,
    title: 'CAGE Code 8ATR9',
    description: 'US Department of Defense-registered supplier. Trusted by MROs, OEMs, and defense contractors for certified turbine parts.',
  },
  {
    icon: Cog,
    title: 'Direct Trader Access',
    description: 'Work with the same turbine parts specialist from quote to delivery. No account managers who do not know turbines.',
  },
];

export default async function SiemensSGT800Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const prefix = country ? `/${country}` : '';

  const siteUrl = 'https://aeroturbinespare.com';

  const pageSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Siemens SGT-800 Gas Turbine Spare Parts',
      description: 'Combustion liners, burner modules, rotor blades, compressor vanes, fuel nozzles, bearings, seals and control system parts for Siemens SGT-800 gas turbines.',
      category: 'Gas Turbine Spare Parts',
      brand: { '@type': 'Brand', name: 'AeroTurbineSpare' },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: 'AeroTurbineSpare' },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Siemens SGT-800 Parts',
      description: 'Source Siemens SGT-800 gas turbine spare parts including combustion liners, burner modules, rotor blades, compressor vanes & fuel nozzles.',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Siemens SGT-800 Parts', item: `${siteUrl}/siemens-sgt800-parts` },
        ],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Siemens SGT-800 Spare Parts Sourcing & Supply',
      serviceType: 'Siemens SGT-800 Gas Turbine Spare Parts Sourcing & Supply',
      provider: { '@type': 'Organization', name: 'AeroTurbineSpare' },
      areaServed: 'Worldwide',
      description: 'New, refurbished and serviceable SGT-800 parts sourcing with full traceability and quality certification.',
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: prefix || '/' },
          { name: 'Siemens SGT-800 Parts', url: `${prefix || ''}/siemens-sgt800-parts` },
        ]}
      />
      <SchemaInjector pageKey="siemens-sgt800-parts" staticSchemas={pageSchemas} />
      <Header />
      <main id="main-content" className="flex-1">

        <section className="py-20 bg-gradient-to-br from-[#0A1628] via-[#1E1B4B] to-[#312E81] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <pattern id="sgt800-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.8" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#sgt800-grid)" />
            </svg>
          </div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-[#4F46E5]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold text-white mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              Siemens SGT-800
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-6">
              Siemens SGT-800 <span className="gradient-text">Gas Turbine Parts</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-3xl mx-auto mb-10">
              Combustion liners, burner modules, rotor blades, compressor vanes, fuel nozzles and control system components for the Siemens SGT-800 industrial gas turbine. 5M+ NSN/CAGE-referenced parts in inventory. ISO 9001:2015 & AS9120 Rev B certified. CAGE 8ATR9.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={`${prefix}/rfq`} className="inline-flex items-center gap-2 px-8 py-3 bg-[#4F46E5] text-white font-semibold rounded-xl hover:bg-[#4338CA] transition-colors">
                Request a Quote
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <a href={`${prefix}/catalog`} className="inline-flex items-center gap-2 px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-colors">
                Browse Catalog
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-2">
                <span className="w-6 h-px bg-[#4F46E5]" /> SGT-800 Parts Overview
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-[#0A1628]">Complete SGT-800 Parts Catalog</h2>
              <p className="text-[#4A4A6A] mt-3 max-w-2xl mx-auto">
                The Siemens SGT-800 is a 50+ MW industrial gas turbine designed for power generation and CHP applications. We stock and source over 5,000 unique SGT-800 components.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PARTS_TABLE.map((section) => (
                <div key={section.category} className="bg-white border border-[#E8EDF2] rounded-2xl p-6 hover:shadow-lg hover:border-[#4F46E5]/20 transition-all duration-200">
                  <h3 className="text-lg font-bold text-[#0A1628] mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#4F46E5] rounded-full inline-block" />
                    {section.category}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item.part} className="text-sm">
                        <span className="font-semibold text-[#0A1628]">{item.part}</span>
                        <p className="text-[#4A4A6A] text-xs mt-0.5 leading-relaxed">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-2">
                <span className="w-6 h-px bg-[#4F46E5]" /> Why Choose Us
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-[#0A1628]">Trusted for Siemens SGT-800 Parts</h2>
              <p className="text-[#4A4A6A] mt-3 max-w-2xl mx-auto">
                Oil and gas, power generation, and CHP operators worldwide rely on us for certified SGT-800 components.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_US.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-white border border-[#E8EDF2] rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#4F46E5]" />
                    </div>
                    <h3 className="text-base font-bold text-[#0A1628] mb-2">{item.title}</h3>
                    <p className="text-sm text-[#4A4A6A] leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-[#0A1628] via-[#1E1B4B] to-[#312E81] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <pattern id="cta-grid-sgt800" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.8" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#cta-grid-sgt800)" />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">Need a Siemens SGT-800 Part?</h2>
            <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
              Submit your part number or component description. Our team will confirm availability and pricing within 24 hours — same day for emergency outage requests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`${prefix}/rfq`} className="inline-flex items-center gap-2 px-8 py-4 bg-[#4F46E5] text-white font-bold rounded-xl hover:bg-[#4338CA] transition-colors text-lg">
                Request a Quote
              </a>
              <a href={`${prefix}/catalog`} className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/50 transition-colors text-lg">
                Search Catalog
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
