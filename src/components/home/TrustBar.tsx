import { ShieldCheck, Award, Clock, Globe, Eye } from 'lucide-react';

const BADGES = [
  { icon: ShieldCheck, label: 'AS9100 & AS9120 Certified',   sub: 'Quality Management System' },
  { icon: Award,       label: 'Zero Counterfeit Policy',      sub: 'Verified Every Part' },
  { icon: Eye,         label: '100% Inspection',              sub: 'Full Traceability' },
  { icon: Clock,       label: '24-Hour Quote Response',       sub: 'Most Quotes Same Day' },
  { icon: Globe,       label: 'Ships to 150+ Countries',      sub: 'Global Logistics Network' },
];

export default function TrustBar() {
  return (
    <div className="bg-white border-y border-silver">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row flex-wrap items-center justify-between gap-3 sm:gap-4">
          {BADGES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
              <div className="w-9 h-9 rounded-lg bg-navy/8 flex items-center justify-center group-hover:bg-navy/15 transition-colors duration-300">
                <Icon className="w-4.5 h-4.5 text-navy group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <div className="text-xs font-semibold text-text">{label}</div>
                <div className="text-[10px] text-text-muted">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
