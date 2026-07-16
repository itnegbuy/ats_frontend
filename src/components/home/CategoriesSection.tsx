'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plane, Settings, Flame, Fuel, Activity, Cpu, Radio,
  Thermometer, Shield, Zap, Package, Hash, BadgeCheck, Search,
  Anchor, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import siteCategories from '@/data/site-categories.json';

const ICON_MAP: Record<string, React.ElementType> = {
  plane: Plane, settings: Settings, flame: Flame, fuel: Fuel,
  activity: Activity, cpu: Cpu, radio: Radio, thermometer: Thermometer,
  shield: Shield, zap: Zap, package: Package, hash: Hash,
  badgecheck: BadgeCheck, search: Search, anchor: Anchor,
};

const GROUP_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Aero-Derivative Gas Turbines': {
    bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500',
  },
  'Heavy-Duty Gas Turbines': {
    bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500',
  },
  'Turbine Hot Gas Path': {
    bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500',
  },
  'Control & Monitoring': {
    bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500',
  },
  'Rotating & Support Components': {
    bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500',
  },
  'Power Generation & Auxiliary': {
    bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500',
  },
  'Procurement Services': {
    bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500',
  },
};

function getGroupColor(group: string) {
  return GROUP_COLORS[group] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' };
}

function groupSlug(name: string) {
  return name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

export default function CategoriesSection() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const groups = [...new Set(siteCategories.map((c) => c.group))];

  const filtered = activeGroup
    ? siteCategories.filter((c) => c.group === activeGroup)
    : siteCategories;

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#F0F4F8] via-white to-[#F8F9FF] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-brand text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-6 h-px bg-brand" /> Categories <span className="w-6 h-px bg-brand" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] mb-3">
            Browse by Product Category
          </h2>
          <p className="text-[#4A4A6A] max-w-2xl mx-auto text-base">
            Browse by turbine platform, component type, or procurement method. Whatever works for you.
          </p>
        </div>

        {/* Group filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveGroup(null)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all border',
              !activeGroup
                ? 'bg-navy text-white border-navy shadow-md'
                : 'bg-white text-[#4A4A6A] border-silver hover:border-navy/30 hover:text-navy'
            )}
          >
            All Categories
          </button>
          {groups.map((g) => {
            const colors = getGroupColor(g);
            return (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                  activeGroup === g
                    ? `${colors.bg} ${colors.text} ${colors.border} shadow-sm`
                    : 'bg-white text-[#4A4A6A] border-silver hover:border-navy/30 hover:text-navy'
                )}
              >
                <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle', getGroupColor(g).dot)} />
                {g}
              </button>
            );
          })}
        </div>

        {/* Active group banner */}
        {activeGroup && (
          <div className="relative mb-10 rounded-2xl overflow-hidden h-48 sm:h-56">
            <img
              src={`/images/categories/banner-${groupSlug(activeGroup)}.jpg`}
              alt={activeGroup}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent flex items-center px-8">
              <div>
                <div className={cn(
                  'inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3',
                  getGroupColor(activeGroup).bg,
                  getGroupColor(activeGroup).text
                )}>
                  {activeGroup}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {activeGroup}
                </h3>
                <p className="text-white/70 text-sm max-w-lg">
                  {filtered.length} categories &middot; {filtered.reduce((s, c) => s + c.partCount, 0).toLocaleString()} parts
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.slice(0, 12).map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Package;
            const colors = getGroupColor(cat.group);
            return (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="group relative bg-white rounded-2xl border border-silver/80 hover:border-brand/30 transition-all duration-300 hover:shadow-[0_8px_30px_-12px_rgba(79,70,229,0.15)] hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Category image as card header */}
                <div className="relative h-36 overflow-hidden bg-silver/30">
                  <img
                    src={cat.image || `/images/categories/banner-${groupSlug(cat.group)}.jpg`}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm', colors.bg, colors.text)}>
                      {cat.group}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-sm text-[#0A1628] group-hover:text-brand transition-colors leading-snug mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#4A4A6A]/70 leading-relaxed line-clamp-2 mb-3">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-silver/60">
                    <span className="text-[11px] font-semibold text-emerald-600">
                      {cat.partCount.toLocaleString()} parts
                    </span>
                    <span className="text-brand/60 group-hover:text-brand transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-navy-dark transition-all shadow-lg hover:shadow-xl group"
          >
            View All Categories
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
