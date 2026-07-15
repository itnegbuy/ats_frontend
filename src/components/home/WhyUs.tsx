import {
  ShieldCheck, Clock, Award, Truck, FileCheck,
  HeadphonesIcon, Search, Globe,
} from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'AS9100 & AS9120 Certified',
    desc: 'Certified quality systems on every part we ship, with documentation that holds up to audit.',
  },
  {
    icon: Clock,
    title: '24-Hour Quote Response',
    desc: 'When a unit\'s down, waiting three days for a quote isn\'t an option. Most quotes go out within 24 hours.',
  },
  {
    icon: Award,
    title: 'Zero Counterfeit Policy',
    desc: 'Every part verified before it ships. No exceptions, even on hard-to-find components.',
  },
  {
    icon: Truck,
    title: 'Global Shipping Network',
    desc: 'Delivery to 150+ countries, handled by logistics partners who understand turbine parts aren\'t something you can delay.',
  },
  {
    icon: Search,
    title: 'Hard-to-Find Parts Specialists',
    desc: 'Obsolete Mark V cards, discontinued combustion parts, legacy components — this is where we actually earn our keep.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Account Manager',
    desc: 'One point of contact who already knows your fleet and your platforms, not a rotating support queue.',
  },
  {
    icon: Globe,
    title: '1,200+ Certified Manufacturers',
    desc: 'A sourcing network built specifically around turbine OEMs and certified distributors.',
  },
  {
    icon: FileCheck,
    title: 'Full Traceability',
    desc: 'Complete chain-of-custody paperwork on every part, every time.',
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-brand text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-6 h-px bg-brand" /> Why AeroTurbineSpare <span className="w-6 h-px bg-brand" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-text">
            Built for Turbine Procurement Professionals
          </h2>
          <p className="text-text-muted mt-3 max-w-2xl mx-auto">
            We built this around what turbine buyers actually deal with — long lead times, obsolete parts, and the pressure of an outage clock running.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group bg-bg border border-silver rounded-2xl p-6 hover:bg-white hover:border-orange/20 hover:shadow-xl card-lift transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-orange/10 flex items-center justify-center mb-4 group-hover:bg-orange group-hover:text-white transition-all duration-300 icon-glow-hover">
                  <Icon className="w-5.5 h-5.5 text-orange group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-text mb-2">{f.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
