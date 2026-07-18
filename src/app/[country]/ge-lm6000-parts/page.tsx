import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Award, Zap, Globe, Box, Wind, Flame, Gauge, Cog, Activity, Cpu } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import CountriesWeServe from '@/components/country/CountriesWeServe';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'GE LM6000 Parts — Hot Section, Power Turbine & Combustion Components',
  description: 'Source GE LM6000, LM6000 PC & LM6000 PD gas turbine parts including power turbine blades, combustor liners, fuel nozzles & control system components. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
  keywords: [
    'GE LM6000 parts', 'LM6000 PC parts', 'LM6000 PD parts',
    'LM6000 gas turbine parts', 'power turbine blades LM6000', 'combustor liners LM6000',
    'fuel nozzles GE LM6000', 'LM6000 control system parts', 'aeroderivative turbine parts',
    'LM6000 hot section components', 'CF6-80C2 derived turbine parts',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/ge-lm6000-parts',
    languages: buildHreflang('/ge-lm6000-parts'),
  },
  openGraph: {
    title: 'GE LM6000 Parts — Hot Section, Power Turbine & Combustion Components',
    description: 'Source GE LM6000, LM6000 PC & LM6000 PD gas turbine parts including power turbine blades, combustor liners, fuel nozzles & control system components. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
    url: 'https://aeroturbinespare.com/ge-lm6000-parts',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GE LM6000 Parts — Hot Section, Power Turbine & Combustion Components',
    description: 'Source GE LM6000, LM6000 PC & LM6000 PD gas turbine parts including power turbine blades, combustor liners, fuel nozzles & control system components. ISO 9001 & AS9120. 24-hour quotes.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

const VARIANTS = [
  { name: 'LM6000 PC', power: '50 MW', efficiency: '42%', applications: 'Simple-cycle power generation, peaking plants, combined heat & power' },
  { name: 'LM6000 PD', power: '52 MW', efficiency: '43%', applications: 'Base-load power generation, district heating, industrial cogeneration' },
  { name: 'LM6000 PH', power: '48 MW', efficiency: '41%', applications: 'Mechanical drive for gas compression, pipeline & process applications' },
  { name: 'LM6000 PF', power: '56 MW', efficiency: '44%', applications: 'High-output power generation, combined-cycle, offshore platforms' },
];

const PARTS_CATEGORIES = [
  {
    icon: Wind,
    title: 'Power Turbine Blades & Nozzles',
    items: ['Stage 1-4 power turbine blades single crystal & directionally solidified', 'Power turbine nozzle assemblies & vane segments', 'Turbine exhaust diffuser & strut fairings', 'Tip seals, honeycomb seals & abradable coatings', 'Turbine disk & shaft assemblies'],
  },
  {
    icon: Flame,
    title: 'Combustor Liners & Hardware',
    items: ['Annular combustor liner assemblies — PC & PD variants', 'Combustion casing & support rings', 'Cross-fire tubes, igniter tips & spark plugs', 'Dome assemblies, heat shields & baffle plates', 'Combustor cooling panels & grommets'],
  },
  {
    icon: Gauge,
    title: 'Fuel Nozzles & Manifolds',
    items: ['Gas & liquid fuel nozzle assemblies', 'Dual-fuel nozzle assemblies for DLE configurations', 'Fuel manifold & distribution tube assemblies', 'Atomizer, check valve & purge components', 'Fuel system adapters & mounting hardware'],
  },
  {
    icon: Box,
    title: 'Compressor Blades & Vanes',
    items: ['Compressor rotor blades stage 1-14', 'Stator vane assemblies & variable geometry vanes', 'Inlet guide vanes & variable bleed valves', 'Compressor disk & spacer assemblies', 'Blade locks, retainers & damping hardware'],
  },
  {
    icon: Cog,
    title: 'Bearings & Seals',
    items: ['Thrust & journal bearing assemblies', 'Carbon face seals & labyrinth seals', 'Squeeze film damper bearings', 'Bearing housings, supports & sump hardware', 'Oil seals, buffer seals & vent hardware'],
  },
  {
    icon: Cpu,
    title: 'Control System Components',
    items: ['Speedtronic Mark V & Mark VI control modules for LM6000', 'Servo valves, actuators & LVDT position sensors', 'I/O cards, power supplies & backplane assemblies', 'HMI panels & operator interface stations', 'Fire protection detector & suppression system parts'],
  },
  {
    icon: Activity,
    title: 'Fuel System Parts',
    items: ['Fuel pump & metering assemblies', 'Fuel control valves & shutoff valves', 'Gas fuel manifold & skid components', 'Liquid fuel purge & drain hardware', 'Fuel filter elements, housings & pressure regulators'],
  },
  {
    icon: Globe,
    title: 'Sensors & Instrumentation',
    items: ['Gas path thermocouples & exhaust gas temperature sensors', 'Vibration accelerometers & proximity probes', 'Speed pickups, magnetic sensors & tachometers', 'Pressure transmitters, RTDs & flow sensors', 'Flame detectors, torque meters & oil debris monitors'],
  },
];

const WHY_US = [
  {
    icon: Shield,
    title: 'Zero Counterfeit Guarantee',
    description: 'Every LM6000 part is sourced from verified OEM, OER, and approved aftermarket channels. Full traceability with documentation packages. ISO 9001:2015 & AS9120 Rev B certified.',
  },
  {
    icon: Zap,
    title: '24-Hour Quote Turnaround',
    description: 'Submit an RFQ and receive a competitive quote within 24 hours — same day for AOG, emergency outages, and mission-critical fleet support. Our LM6000 team averages 15+ years in gas turbine supply.',
  },
  {
    icon: Award,
    title: '5M+ Parts in Network',
    description: 'Direct access to 5M+ line items across NSN, CAGE, and OEM part numbers. Dedicated LM6000 inventory covers hot section, rotating components, fuel system, control, and instrumentation.',
  },
  {
    icon: Globe,
    title: 'Direct Trader + Global Reach',
    description: 'CAGE 8ATR9. ITAR, EAR, and dual-use export compliance managed in-house. Ship to 150+ countries from our Doral, FL facility — overnight reach to Miami International Airport.',
  },
];

export default async function GeLm6000PartsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'GE LM6000 Parts', url: `${prefix || ''}/ge-lm6000-parts` },
      ]} />
      <SchemaInjector
        pageKey="ge-lm6000-parts"
        staticSchemas={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'GE LM6000 Gas Turbine Parts',
            description: 'New, refurbished, and serviceable GE LM6000, LM6000 PC, LM6000 PD, LM6000 PH, and LM6000 PF gas turbine parts. Power turbine blades, combustor liners, fuel nozzles, compressor blades, bearings, seals, control system components, fuel system parts, and sensors.',
            brand: { '@type': 'Brand', name: 'GE Aerospace' },
            manufacturer: { '@type': 'Organization', name: 'General Electric' },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              areaServed: 'Worldwide',
            },
          },
        ]}
      />

      <main id="main-content" className="flex-1">
        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              GE LM6000 Series
              <span className="w-6 h-px bg-orange" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
              GE LM6000 Parts — Hot Section, Power Turbine & Combustion Components
            </h1>
            <p className="text-silver/80 text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              Certified power turbine blades, combustor liners, fuel nozzles, compressor blades, bearings, seals, control system components, and sensors for LM6000, LM6000 PC, LM6000 PD, LM6000 PH, and LM6000 PF. New, refurbished, and serviceable parts sourced from verified OEM and aftermarket supply chains.
            </p>
            <a
              href={`${prefix || ''}/rfq`}
              className="inline-block bg-orange text-white font-bold px-8 py-3 rounded-lg hover:bg-orange/90 transition-colors"
            >
              Request a Quote
            </a>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Platform Overview
              </div>
              <h2 className="text-3xl font-black text-text">The GE LM6000 Aeroderivative Family</h2>
              <p className="text-text-muted mt-3 max-w-2xl mx-auto">
                Derived from the CF6-80C2 high-bypass aircraft engine, the LM6000 is GE&apos;s most powerful aeroderivative gas turbine — spanning 48-56 MW with class-leading efficiency and proven reliability across power generation, marine propulsion, and mechanical drive applications.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VARIANTS.map((v) => (
                <div key={v.name} className="bg-bg border border-silver rounded-2xl p-6 hover:border-orange/30 transition-colors">
                  <h3 className="text-xl font-black text-text mb-3">{v.name}</h3>
                  <div className="space-y-2 text-sm text-text-muted mb-4">
                    <div className="flex justify-between">
                      <span>Power Output</span>
                      <span className="font-semibold text-text">{v.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Efficiency</span>
                      <span className="font-semibold text-text">{v.efficiency}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{v.applications}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-bg py-16 px-4 border-y border-silver">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Parts Catalog
              </div>
              <h2 className="text-3xl font-black text-text">LM6000 Parts We Supply</h2>
              <p className="text-text-muted mt-3 max-w-2xl mx-auto">
                Full coverage across all LM6000 variants. Every part is traceable to OEM standards and backed by our ISO 9001 / AS9120 quality system.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PARTS_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.title} className="bg-white border border-silver rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="text-lg font-bold text-text mb-3">{cat.title}</h3>
                    <ul className="space-y-2">
                      {cat.items.map((item) => (
                        <li key={item} className="text-sm text-text-muted flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Why AeroTurbineSpare
              </div>
              <h2 className="text-3xl font-black text-text">Why Choose Us for LM6000 Parts</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_US.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-bg border border-silver rounded-2xl p-6 text-center hover:border-orange/30 hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-orange" />
                    </div>
                    <h3 className="text-base font-bold text-text mb-2">{item.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CountriesWeServe />

        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Get Started
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Need LM6000 Parts? Let&apos;s Talk.</h2>
            <p className="text-silver/80 text-lg mb-8 leading-relaxed">
              Whether you need a single power turbine blade or a full hot section kit, our team can source it. 24-hour quote turnaround. No minimum order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`${prefix || ''}/rfq`}
                className="inline-block bg-orange text-white font-bold px-8 py-3 rounded-lg hover:bg-orange/90 transition-colors"
              >
                Request a Quote
              </a>
              <a
                href={`${prefix || ''}/contact`}
                className="inline-block border border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
