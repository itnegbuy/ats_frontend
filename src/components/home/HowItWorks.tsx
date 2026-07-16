import { Search, FileText, CheckCircle, Package } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Search or Submit RFQ',
    desc: 'Share your part number, NSN, CAGE code, or just tell us the platform. GE Mark VIe, LM2500, Frame 7, whatever you are working with.',
  },
  {
    icon: FileText,
    step: '02',
    title: 'Receive Your Quote',
    desc: 'Our team gets back to you with pricing, availability, and documentation. Usually within 24 hours, sometimes the same day.',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Review & Accept',
    desc: 'Confirm pricing and certification paperwork upfront. No surprises once the part is on its way.',
  },
  {
    icon: Package,
    step: '04',
    title: 'Delivery Worldwide',
    desc: 'We ship to 150+ countries with tracking, so you know exactly when your part lands.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-bg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-brand text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-6 h-px bg-brand" /> Simple Process <span className="w-6 h-px bg-brand" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-text">How It Works</h2>
          <p className="text-text-muted mt-3 max-w-2xl mx-auto">
            No account managers who don't know turbines, no back-and-forth over what platform you're running. Here's how sourcing works with us.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
            <div key={step} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-24px)] w-12 h-px bg-silver-dark z-0" />
              )}
              <div className="relative bg-white rounded-2xl p-6 border border-silver hover:shadow-lg hover:-translate-y-1 hover:border-orange/30 transition-all duration-300 card-lift">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange transition-colors duration-300">
                    <Icon className="w-5.5 h-5.5 text-orange" />
                  </div>
                  <span className="text-4xl font-black text-silver-dark/50 leading-none">{step}</span>
                </div>
                <h3 className="font-bold text-text mt-4 mb-2">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
