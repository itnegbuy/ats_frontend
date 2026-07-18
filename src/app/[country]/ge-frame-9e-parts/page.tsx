import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Award, Zap, Globe, CheckCircle, Cpu, Thermometer, Wind, Cog, Gauge, Package, Wrench } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'GE Frame 9E Parts — MS9001E Hot Gas Path & Combustion Components',
  description: 'Source GE Frame 9E (MS9001E) gas turbine spare parts for 50Hz applications. Buckets, nozzles, transition pieces, combustion liners & fuel nozzles. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
  keywords: [
    'GE Frame 9E parts', 'MS9001E spare parts',
    '9E buckets', '9E nozzles', '9E transition pieces',
    '9E combustion liners', 'DLN 2.0 fuel nozzles',
    '9E hot gas path', 'GE 9E turbine components',
    '9E shrouds and seals',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/ge-frame-9e-parts',
    languages: buildHreflang('/ge-frame-9e-parts'),
  },
  openGraph: {
    title: 'GE Frame 9E Parts — MS9001E Hot Gas Path & Combustion Components',
    description: 'Source GE Frame 9E (MS9001E) gas turbine spare parts for 50Hz applications. Buckets, nozzles, transition pieces, combustion liners & fuel nozzles. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
    url: 'https://aeroturbinespare.com/ge-frame-9e-parts',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GE Frame 9E Parts — MS9001E Hot Gas Path & Combustion Components',
    description: 'Source GE Frame 9E (MS9001E) gas turbine spare parts. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

const PARTS_TABLE = [
  {
    category: 'Hot Gas Path — Buckets',
    items: [
      { part: 'Stage 1 Bucket', description: 'Directionally solidified superalloy, TBC-coated, fir tree root attachment. Available with advanced cooling configurations for 9E high-firing-temperature operation.' },
      { part: 'Stage 2 Bucket', description: 'DS or equiaxed material options, integral tip shroud, multi-pass serpentine cooling circuit for 50Hz extended life.' },
      { part: 'Stage 3 Bucket', description: 'Longer airfoil optimized for low-pressure extraction, corrosion-resistant coatings for Middle East and coastal environments.' },
    ],
  },
  {
    category: 'Hot Gas Path — Nozzles',
    items: [
      { part: 'Stage 1 Nozzle', description: 'Single-vane segment, film-cooled cobalt-base superalloy with TBC. Includes inner/outer sidewalls, rail seals, and anti-rotation hardware.' },
      { part: 'Stage 2 Nozzle', description: 'Two-vane segment design, convective and impingement cooling. Platform with angel wing seals per GEK specification.' },
      { part: 'Stage 3 Nozzle', description: 'Two-vane segment, heavy-duty convective cooling. Reinforced for extended HGP intervals on 50Hz duty cycles.' },
    ],
  },
  {
    category: 'Combustion Hardware',
    items: [
      { part: 'Transition Piece', description: 'One-piece, single-tube design with impingement cooling sleeve. Cross-fire tube connection compatible with DLN 2.0 and conventional combustion systems.' },
      { part: 'Combustion Liner (DLN 2.0)', description: 'Advanced can-annular liner for DLN 2.0 combustion system. Multi-hole primary and secondary zones for premixed flame stability and ultra-low NOx.' },
      { part: 'Fuel Nozzle (DLN 2.0)', description: 'Premixed fuel nozzle assembly with cartridge, tip, and flow divider. OEM-equivalent flow number and spray angle for MS9001E.' },
      { part: 'Cross-Fire Tubes', description: 'Flame propagation tubes with retention clips and seal rings. Inconel 625 construction per GE specification.' },
      { part: 'Spark Plug & Igniter', description: 'Ignition system including high-energy spark plugs, igniter tips, and flame detector assemblies.' },
    ],
  },
  {
    category: 'Shrouds, Seals & Hardware',
    items: [
      { part: 'Stage 1 Shroud', description: 'Turbine shroud block with honeycomb land, HGP compliant. Includes full feather seal set and pin hardware.' },
      { part: 'Stage 2 Shroud', description: 'Shroud segments with abradable coating system. Spring clips, retention pins, and full hardware kit included.' },
      { part: 'Stage 3 Shroud', description: 'Exhaust-end shroud blocks available in standard and oversized bore configurations for field rework.' },
      { part: 'Seal Kits', description: 'Complete retrofit kits including interstage, brush, labyrinth, and carbon ring seals per GEK specification.' },
      { part: 'Retention Hardware', description: 'Locking plates, pins, clips, bolts, and torque nuts per GE standard GEK-107121 and GEK-110472.' },
    ],
  },
  {
    category: 'Rotor & Compressor Hardware',
    items: [
      { part: 'Rotor Bolts & Nuts', description: 'Tie rod bolts, nuts, and washers for disc stack assembly. Heat-treated alloy steel per GE specification with full certs.' },
      { part: 'Compressor Blades', description: 'Stage 1-17 compressor rotor blades and stator vanes. Available in 403SS and 17-4PH materials.' },
      { part: 'Compressor Seals', description: 'Interstage labyrinth seals, tip seals, and diaphragm seals for 17-stage axial compressor.' },
      { part: 'Bearing Assemblies', description: 'Journal and thrust bearing assemblies including pads, shoes, and thermocouple hardware.' },
    ],
  },
  {
    category: 'Control System & Accessories',
    items: [
      { part: 'Speedtronic Mark V/VI Modules', description: 'IS215, IS230, IS200 series control boards, power supplies, and I/O modules for GE Speedtronic systems.' },
      { part: 'Servo Valves', description: 'Fuel and IGV servo valve assemblies including torque motors, spools, and LVDT feedback.' },
      { part: 'Temperature Probes', description: 'Exhaust gas thermocouples, RTDs, and flame detector assemblies for 9E monitoring and protection.' },
      { part: 'Lube Oil System', description: 'Pumps, filters, coolers, and regulators for the 9E tube oil skid. OEM-sourced components with full interchangeability.' },
    ],
  },
];

const WHY_US = [
  {
    icon: Package,
    title: 'Deep 9E Inventory',
    description: 'Over 4,000 unique 9E line items in stock across buckets, nozzles, combustion hardware, seals, and rotor components. Same-day dispatch for in-stock orders.',
  },
  {
    icon: Shield,
    title: 'Certified & Traceable',
    description: 'ISO 9001:2015 and AS9120 Rev B certified. Every 9E part ships with full chain-of-custody documentation, OEM cross-reference, and material certs.',
  },
  {
    icon: Zap,
    title: '24-Hour Quotes',
    description: 'Submit your RFQ and receive a binding quote within 24 hours. AOG emergency requests routed directly to our 9E product specialists.',
  },
  {
    icon: Cpu,
    title: 'Technical Matching',
    description: 'Our engineers cross-reference OEM part numbers against 9E build levels including 9E.03 and 9E.04 to ensure form-fit-function match.',
  },
  {
    icon: Award,
    title: 'OEM Equivalent Quality',
    description: 'All 9E hardware sourced from OEM-licensed manufacturers and NADCAP-approved coating houses. No grey-market or uncertified alternatives.',
  },
  {
    icon: Wrench,
    title: '50Hz Field Support',
    description: 'Backed by a team of former GE field engineers with hands-on 9E outage experience across Middle East, Asia, and European installations.',
  },
];

const FRAME_SPECS = [
  { label: 'Model', value: 'MS9001E (9E)' },
  { label: 'Power Output', value: '123–135 MW (ISO, simple cycle)' },
  { label: 'Frequency', value: '50 Hz' },
  { label: 'Heat Rate', value: '~10,400 Btu/kWh (LHV, simple cycle)' },
  { label: 'Combustor Type', value: 'DLN 2.0 / Conventional (can-annular, 14 burners)' },
  { label: 'Turbine Stages', value: '3' },
  { label: 'Compressor Stages', value: '17' },
  { label: 'Platform', value: '9E.03, 9E.04' },
  { label: 'Applications', value: 'Simple cycle, combined cycle, cogeneration, district cooling' },
];

export default async function GeFrame9ePartsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'GE Frame 9E (MS9001E) Gas Turbine Spare Parts',
    description: 'Complete range of GE Frame 9E hot gas path, combustion, and turbine components including buckets, nozzles, transition pieces, combustion liners, fuel nozzles, shrouds, seals, rotor hardware, and control system modules.',
    brand: { '@type': 'Brand', name: 'GE / General Electric' },
    category: 'Gas Turbine Spare Parts',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      offerCount: '4000+',
      offeredBy: {
        '@type': 'Organization',
        name: 'AeroTurbineSpare',
        url: 'https://aeroturbinespare.com',
      },
    },
    manufacturer: { '@type': 'Organization', name: 'General Electric' },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'GE Frame 9E Parts', url: `${prefix || ''}/ge-frame-9e-parts` },
      ]} />

      <main id="main-content" className="flex-1">
        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Gas Turbine Parts
              <span className="w-6 h-px bg-orange" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
              GE Frame 9E Parts — MS9001E Platform
            </h1>
            <p className="text-silver/80 text-xl max-w-3xl mx-auto leading-relaxed">
              Complete hot gas path, combustion, and turbine components for the
              123–135 MW class GE Frame 9E heavy-duty gas turbine. ISO 9001 &amp; AS9120 certified.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-orange" />
              Frame Overview
            </div>
            <h2 className="text-3xl font-black text-text mb-8">
              123–135 MW Class 50Hz Heavy-Duty Gas Turbine
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <p className="text-text-muted leading-relaxed mb-6">
                  The GE Frame 9E (MS9001E) is a 123–135 MW, 50 Hz heavy-duty gas turbine
                  widely deployed in simple cycle, combined cycle, cogeneration, and district
                  cooling plants across the Middle East, Asia, Europe, and Africa. With a
                  17-stage compressor and 3-stage turbine rated at 3,000 RPM, the 9E platform
                  delivers a heat rate of approximately 10,400 Btu/kWh (LHV) and supports
                  DLN 2.0 combustion for ultra-low NOx compliance.
                </p>
                <p className="text-text-muted leading-relaxed">
                  Common build levels include 9E.03 and 9E.04. The 9E is the 50 Hz equivalent
                  of the Frame 6B (MS6001B) with scaled-up aerodynamics and upgraded materials
                  for higher firing temperatures. Our inventory covers all major variants with
                  OEM-licensed and aftermarket-certified components backed by full traceability.
                </p>
              </div>
              <div className="lg:col-span-2 bg-bg border border-silver rounded-2xl p-6">
                <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                  <Cog className="w-5 h-5 text-orange" />
                  Specifications
                </h3>
                <dl className="space-y-3 text-sm">
                  {FRAME_SPECS.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-2">
                      <dt className="text-text-muted font-medium">{spec.label}</dt>
                      <dd className="text-text font-semibold text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
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
              <h2 className="text-3xl font-black text-text">
                Complete GE Frame 9E Parts Table
              </h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                Comprehensive inventory covering hot gas path, combustion, rotor,
                and control hardware for all 9E build levels.
              </p>
            </div>

            <div className="space-y-8">
              {PARTS_TABLE.map((group) => (
                <div key={group.category} className="bg-white border border-silver rounded-2xl overflow-hidden">
                  <div className="bg-navy text-white px-6 py-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Package className="w-5 h-5 text-orange" />
                      {group.category}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-silver bg-bg">
                          <th className="text-left px-6 py-3 font-semibold text-text w-1/4">Part</th>
                          <th className="text-left px-6 py-3 font-semibold text-text">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item, idx) => (
                          <tr key={item.part} className={`border-b border-silver/60 ${idx % 2 === 1 ? 'bg-bg/50' : ''}`}>
                            <td className="px-6 py-4 font-bold text-text whitespace-nowrap">{item.part}</td>
                            <td className="px-6 py-4 text-text-muted leading-relaxed">{item.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-orange" />
                Why Us
              </div>
              <h2 className="text-3xl font-black text-text">
                Why Choose Us for 9E Parts
              </h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                Certified quality, deep inventory, and engineering expertise
                purpose-built for the GE Frame 9E platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_US.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-bg border border-silver rounded-2xl p-6 hover:border-orange/30 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
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

        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-orange" />
              Get a Quote
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
              Need GE Frame 9E Parts?
            </h2>
            <p className="text-silver/80 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Submit your part numbers or NSNs for a competitive quote within 24 hours.
              AOG and emergency outage requirements handled same-day.
            </p>
            <a
              href={`${prefix || ''}/contact`}
              className="inline-block bg-orange text-white font-bold px-10 py-4 rounded-full hover:bg-orange/90 transition-colors text-base shadow-lg"
            >
              Request 24-Hour Quote
            </a>
          </div>
        </section>
      </main>

      <Footer />

      <SchemaInjector
        pageKey="ge-frame-9e-parts"
        staticSchemas={[productSchema]}
      />
    </div>
  );
}
