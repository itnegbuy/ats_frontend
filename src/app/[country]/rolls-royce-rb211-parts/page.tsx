import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Award, Zap, Globe, CheckCircle, Cpu, Thermometer, Wind, Cog, Gauge, Package, Wrench, Fuel } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import { buildHreflang } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Rolls-Royce RB211 Parts — Gas Generator, Power Turbine & Hot Section Components',
  description: 'Source Rolls-Royce RB211 gas turbine spare parts for industrial, pipeline & power generation applications. Gas generator modules, power turbine blades & fuel system parts. 5M+ NSN/CAGE. ISO 9001 & AS9120. 24-hour quotes.',
  keywords: [
    'Rolls-Royce RB211 parts', 'RB211 gas turbine',
    'RB211 gas generator', 'RB211 power turbine',
    'RB211 compressor blades', 'RB211 combustor liners',
    'RB211 turbine nozzles', 'RB211 fuel metering unit',
    'RB211 bearings and seals', 'RB211 FADEC',
    'RB211 lube oil system', 'RB211 spare parts',
  ],
  alternates: {
    canonical: 'https://aeroturbinespare.com/rolls-royce-rb211-parts',
    languages: buildHreflang('/rolls-royce-rb211-parts'),
  },
  openGraph: {
    title: 'Rolls-Royce RB211 Parts — Gas Generator, Power Turbine & Hot Section Components',
    description: 'Source Rolls-Royce RB211 gas turbine spare parts for industrial, pipeline & power generation applications. Gas generator modules, power turbine blades & fuel system parts. 5M+ NSN/CAGE. ISO 9001 & AS9120. 24-hour quotes.',
    url: 'https://aeroturbinespare.com/rolls-royce-rb211-parts',
    siteName: 'AeroTurbineSpare',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rolls-Royce RB211 Parts — Gas Generator, Power Turbine & Hot Section Components',
    description: 'Source Rolls-Royce RB211 gas turbine spare parts. 5M+ NSN/CAGE parts. ISO 9001 & AS9120. 24-hour quotes.',
    images: ['/images/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
};

const PARTS_TABLE = [
  {
    category: 'Gas Generator Module',
    items: [
      { part: 'Compressor Blades (LP & HP)', description: 'Titanium and nickel-alloy compressor blades for all RB211 gas generator stages. Includes variable inlet guide vane assemblies and stator vanes.' },
      { part: 'Combustor Liners', description: 'Annular combustion chamber liners with thermal barrier coating. Includes primary and secondary zone cooling hole patterns for low-emissions operation.' },
      { part: 'HP Turbine Nozzles', description: 'Stage 1 and stage 2 nozzle guide vanes in cobalt-base superalloy with film cooling. Full set with shrouds and seal pins.' },
      { part: 'HP Turbine Blades', description: 'Single-crystal and directionally solidified HP turbine blades with TBC and internal cooling geometry for extended hot section life.' },
    ],
  },
  {
    category: 'Power Turbine Section',
    items: [
      { part: 'Power Turbine Blades', description: 'Free-power turbine rotor blades, stage 1 through stage 3. Designed for optimum aerodynamic efficiency at variable speed operation.' },
      { part: 'Nozzle Guide Vanes (PT)', description: 'Power turbine nozzle guide vane segments with integral tip shrouds and sealing rails. Available with erosion-resistant coatings.' },
      { part: 'Exhaust Diffuser', description: 'Annular exhaust diffuser assembly with struts and fairings. Reduces exit velocity for downstream ducting and heat recovery equipment.' },
      { part: 'Power Turbine Discs', description: 'Nickel-alloy turbine discs for free-power rotor assembly. Supplied with balance documentation and life-cycle tracking data.' },
    ],
  },
  {
    category: 'Fuel System',
    items: [
      { part: 'Fuel Metering Unit (FMU)', description: 'Electro-hydraulic fuel metering unit controlling flow to combustor. Includes servo valve, pressure regulator, and shut-off functions.' },
      { part: 'Fuel Manifolds', description: 'Circumferential fuel distribution manifolds with equal-flow divider design. Available for liquid and dual-fuel configurations.' },
      { part: 'Fuel Nozzles', description: 'Atomizing fuel nozzles for both liquid and gas fuel operation. Flow-tested and flow-matched per RB211 fuel system specification.' },
      { part: 'Fuel Pump Assembly', description: 'Main fuel pump driven by the accessory gearbox. Includes boost stage, high-pressure stage, and relief valve.' },
    ],
  },
  {
    category: 'Bearings & Seals',
    items: [
      { part: 'Journal Bearings', description: 'Tilting-pad and fixed-profile journal bearings for main rotor support. Babbitt-lined with temperature monitoring provisions.' },
      { part: 'Thrust Bearings', description: 'Tapered-land and self-leveling thrust bearings for axial load absorption. Sized for gas generator and power turbine rotor stacks.' },
      { part: 'Carbon Seals', description: 'High-performance carbon face seals for oil sump and bearing compartment sealing. Replacement segments and complete seal assemblies.' },
      { part: 'Labyrinth Seals', description: 'Interstage and inter-shaft labyrinth seals with abradable lands. Includes knife-edge and straight-through configurations.' },
    ],
  },
  {
    category: 'Control System',
    items: [
      { part: 'FADEC Unit', description: 'Full-authority digital engine control unit for RB211 variant. Includes software and configuration data specific to industrial/mechanical drive application.' },
      { part: 'Electronic Controls', description: 'Speed sensors, thermocouples, vibration probes, and pressure transmitters. Redundant sensor architectures for high availability.' },
      { part: 'Actuators', description: 'Fuel metering valve actuator, variable geometry actuators, and bleed valve actuators. Linear and rotary configurations with LVDT feedback.' },
      { part: 'Control Harness', description: 'Complete wiring harness assemblies with Mil-spec connectors. Includes thermocouple extension wire and shielded signal cables.' },
    ],
  },
  {
    category: 'Lube Oil System',
    items: [
      { part: 'Lube Oil Pumps', description: 'Main and auxiliary lube oil pumps, gear-type and centrifugal. Direct-driven and motor-driven configurations with relief valves.' },
      { part: 'Oil Filters', description: 'Full-flow and duplex oil filter assemblies with replaceable cartridges. Micron-rated for RB211 bearing and gearbox protection.' },
      { part: 'Oil Coolers', description: 'Shell-and-tube and plate-type oil coolers for bearing and gearbox lubrication circuits. Includes thermostatic bypass valves.' },
      { part: 'Oil Tanks & Deaerators', description: 'Lube oil reservoir tanks with deaeration baffles, breathers, and level indication. Includes scavenge pump and vent system components.' },
    ],
  },
];

const WHY_US = [
  {
    icon: Package,
    title: 'Deep RB211 Inventory',
    description: 'Over 3,000 unique RB211 line items in stock across gas generator, power turbine, fuel system, and rotating hardware. Same-day dispatch for in-stock orders.',
  },
  {
    icon: Shield,
    title: 'Certified & Traceable',
    description: 'ISO 9001:2015 and AS9120 Rev B certified. Every RB211 part ships with full chain-of-custody documentation, OEM cross-reference, and material certs.',
  },
  {
    icon: Zap,
    title: '24-Hour Quotes',
    description: 'Submit your RFQ and receive a binding quote within 24 hours. AOG emergency requests routed directly to our RB211 product specialists.',
  },
  {
    icon: Cpu,
    title: 'Technical Matching',
    description: 'Our engineers cross-reference OEM part numbers against all RB211 variants — 251, 524, and Trent-derivative — ensuring form-fit-function match.',
  },
  {
    icon: Award,
    title: 'OEM Equivalent Quality',
    description: 'All RB211 hardware sourced from OEM-licensed manufacturers and NADCAP-approved coating houses. No grey-market or uncertified alternatives.',
  },
  {
    icon: Wrench,
    title: 'Field Support',
    description: 'Backed by a team of former Rolls-Royce field engineers who understand gas turbine overhaul schedules, assembly procedures, and commissioning sequences.',
  },
];

const RB211_SPECS = [
  { label: 'Model', value: 'RB211 (Industrial Aeroderivative)' },
  { label: 'Power Output', value: '25–32 MW (ISO, simple cycle)' },
  { label: 'Engine Core', value: 'Derived from RB211-535 / RB211-524 aero engine' },
  { label: 'Configuration', value: 'Gas generator + free power turbine' },
  { label: 'Compressor Stages', value: '7 LP + 6 HP (axial flow)' },
  { label: 'Turbine Stages', value: '2 HP + 2 IP + 3 PT (power turbine)' },
  { label: 'Applications', value: 'Pipeline compression, power generation, mechanical drive' },
  { label: 'Fuel Types', value: 'Natural gas, liquid fuel, dual-fuel' },
];

export default async function RollsRoyceRb211PartsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const prefix = country ? `/${country}` : ''

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Rolls-Royce RB211 Gas Turbine Spare Parts',
    description: 'Complete range of Rolls-Royce RB211 industrial gas turbine components including gas generator modules, power turbine sections, fuel system parts, bearings and seals, control systems, and lube oil system components.',
    brand: { '@type': 'Brand', name: 'Rolls-Royce' },
    category: 'Gas Turbine Spare Parts',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      offerCount: '3000+',
      offeredBy: {
        '@type': 'Organization',
        name: 'AeroTurbineSpare',
        url: 'https://aeroturbinespare.com',
      },
    },
    manufacturer: { '@type': 'Organization', name: 'Rolls-Royce' },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: prefix || '/' },
        { name: 'Rolls-Royce RB211 Parts', url: `${prefix || ''}/rolls-royce-rb211-parts` },
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
              Rolls-Royce RB211 Parts
            </h1>
            <p className="text-silver/80 text-xl max-w-3xl mx-auto leading-relaxed">
              Gas generator modules, power turbine components, fuel systems, and rotating hardware
              for the 25–32 MW class Rolls-Royce RB211 industrial gas turbine. ISO 9001 &amp; AS9120 certified.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-orange" />
              Engine Overview
            </div>
            <h2 className="text-3xl font-black text-text mb-8">
              25–32 MW Aeroderivative Gas Turbine
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <p className="text-text-muted leading-relaxed mb-6">
                  The Rolls-Royce RB211 is a 25–32 MW aeroderivative gas turbine derived from
                  the RB211 aircraft engine family (RB211-524 / RB211-535). It is widely deployed
                  in pipeline compression, power generation, and mechanical drive applications
                  across North America, Europe, the Middle East, and Asia-Pacific. The engine
                  features a twin-spool gas generator with a 7-stage LP compressor and 6-stage
                  HP compressor, driven by a 2-stage HP turbine and a 2-stage IP turbine. A separate
                  3-stage free power turbine extracts shaft power.
                </p>
                <p className="text-text-muted leading-relaxed">
                  Key RB211 variants include the 251 series (pipeline compression), the 524 series
                  (power generation), and Trent-derivative upgraded versions. Our inventory covers
                  all major RB211 configurations with OEM-licensed and aftermarket-certified
                  components backed by full traceability and life-cycle documentation.
                </p>
              </div>
              <div className="lg:col-span-2 bg-bg border border-silver rounded-2xl p-6">
                <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                  <Cog className="w-5 h-5 text-orange" />
                  Specifications
                </h3>
                <dl className="space-y-3 text-sm">
                  {RB211_SPECS.map((spec) => (
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
                Complete Rolls-Royce RB211 Parts Table
              </h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                Comprehensive inventory covering gas generator, power turbine, fuel, bearing,
                control, and lubrication systems for all RB211 variants.
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
                Why Choose Us for RB211 Parts
              </h2>
              <p className="text-text-muted mt-2 max-w-2xl mx-auto">
                Certified quality, deep inventory, and engineering expertise
                purpose-built for the Rolls-Royce RB211 platform.
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
              Need Rolls-Royce RB211 Parts?
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
        pageKey="rolls-royce-rb211-parts"
        staticSchemas={[productSchema]}
      />
    </div>
  );
}
