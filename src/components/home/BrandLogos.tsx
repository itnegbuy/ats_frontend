'use client';

import { useState, useEffect, useRef } from 'react';

const BRAND_LOGOS = [
  { name: 'General Electric', file: 'ge.png' },
  { name: 'Pratt & Whitney', file: 'pratt-whitney.png' },
  { name: 'Rolls-Royce', file: 'rolls-royce.png' },
  { name: 'Honeywell', file: 'honeywell.png' },
  { name: 'Boeing', file: 'boeing.png' },
  { name: 'Airbus', file: 'airbus.png' },
  { name: 'Siemens', file: 'siemens.png' },
  { name: 'Collins Aerospace', file: 'collins-aerospace.png' },
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
            We supply parts for every major turbine OEM in service today. General Electric, Siemens, Rolls-Royce, Solar Turbines, Alstom, Ansaldo Energia, and Pratt &amp; Whitney aeroderivative units. If it spins, we probably have parts for it.
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
                  src={`/images/brands/${brand.file}`}
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
