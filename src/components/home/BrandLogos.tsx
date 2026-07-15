'use client';

import { useState, useEffect, useRef } from 'react';

const BRAND_LOGOS = [
  { name: 'General Electric', domain: 'ge.com' },
  { name: 'Pratt & Whitney', domain: 'prattwhitney.com' },
  { name: 'Rolls-Royce', domain: 'rolls-royce.com' },
  { name: 'Honeywell', domain: 'honeywell.com' },
  { name: 'Boeing', domain: 'boeing.com' },
  { name: 'Airbus', domain: 'airbus.com' },
  { name: 'Siemens', domain: 'siemens.com' },
  { name: 'Collins Aerospace', domain: 'collinsaerospace.com' },
];

export default function BrandLogos() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef(false);
  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      setMounted(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-12 bg-white border-y border-silver">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-brand text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-6 h-px bg-brand" /> Our Partners <span className="w-6 h-px bg-brand" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-text">Trusted by Global Manufacturers</h2>
          <p className="text-text-muted mt-3 max-w-3xl mx-auto text-sm">
            We work across every major turbine OEM platform in service today — supplying and supporting operators running General Electric, Siemens, Rolls-Royce, Solar Turbines, Alstom, Ansaldo Energia, and Pratt &amp; Whitney aeroderivative units.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {BRAND_LOGOS.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-silver hover:shadow-sm hover:border-orange/20 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={`https://logo.clearbit.com/${brand.domain}`}
                  alt={brand.name}
                  className="w-8 h-8 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-text whitespace-nowrap">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
