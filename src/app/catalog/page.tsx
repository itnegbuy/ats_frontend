'use client';

import { use, useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Search, SlidersHorizontal, X, Grid2X2, Grid3X3, LayoutList,
  ChevronLeft, ChevronRight, LayoutGrid, List, LayoutGrid as LayoutGridIcon,
  Flame, Plane, Settings, Wrench, Cpu, Radio, Zap,
  ShieldCheck, Clock,
} from 'lucide-react';
import type { Product, NavCategory, NavCategoryTree } from '@/types';
import { getProducts } from '@/services/productService';
import type { ProductFilters } from '@/services/productService';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PartCard from '@/components/catalog/PartCard';
import ListView from '@/components/catalog/ListView';
import CardView from '@/components/catalog/CardView';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { SchemaInjector } from '@/components/seo/SchemaInjector';
import { cn } from '@/lib/utils';
import { request } from '@/lib/api-client';

const CONDITION_OPTIONS = [
  { value: '', label: 'All Conditions' },
  { value: 'New', label: 'New' },
  { value: 'Used', label: 'Used' },
  { value: 'Refurbished', label: 'Refurbished' },
  { value: 'Overhauled', label: 'Overhauled' },
];

const STOCK_OPTIONS = [
  { value: '', label: 'All Stock Status' },
  { value: 'In Stock', label: 'In Stock' },
  { value: 'On Order', label: 'On Order' },
  { value: 'Obsolete', label: 'Obsolete' },
  { value: 'Limited', label: 'Limited' },
];

interface SelectOption { value: string; label: string; }

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

const QUICK_CATEGORIES = [
  { label: 'LM2500', icon: Plane, href: '/catalog?category=lm2500' },
  { label: 'LM6000', icon: Plane, href: '/catalog?category=lm6000' },
  { label: 'LM9000', icon: Plane, href: '/catalog?category=lm9000' },
  { label: 'LMS100', icon: Plane, href: '/catalog?category=lms100' },
  { label: 'GE Frame 5/6/7/9', icon: Settings, href: '/catalog?category=ge-frame' },
  { label: 'Siemens SGT', icon: Settings, href: '/catalog?category=siemens' },
  { label: 'Solar Turbines', icon: Settings, href: '/catalog?category=solar-turbines' },
  { label: 'Bently Nevada', icon: Radio, href: '/catalog?category=bently-nevada' },
  { label: 'GE Modules', icon: Cpu, href: '/catalog?category=ge-modules' },
  { label: 'Combustion Parts', icon: Flame, href: '/catalog?category=combustion' },
  { label: 'Control Systems', icon: Wrench, href: '/catalog?category=control-systems' },
  { label: 'Hot Stock', icon: Zap, href: '/catalog?category=hot-stock' },
];

const LIMITS_PER_VIEW: Record<string, number> = {
  grid2: 12,
  grid3: 12,
  grid4: 16,
  list: 20,
};

type ViewMode = 'grid2' | 'grid3' | 'grid4' | 'list' | 'listview' | 'cardview';

interface ActiveFilters {
  search: string;
  condition: string;
  stockStatus: string;
  cage: string;
  category: string;
  type: string;
  industry: string;
}

const EMPTY_FILTERS: ActiveFilters = {
  search: '', condition: '', stockStatus: '', cage: '', category: '', type: '', industry: '',
};

// ─── Component ─────────────────────────────────────────────────────────────
export default function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = use(searchParams);

  // Initialise from URL on first render
  const [filters, setFilters] = useState<ActiveFilters>(() => ({
    search:      String(resolvedParams.search      || ''),
    condition:   String(resolvedParams.condition   || ''),
    stockStatus: String(resolvedParams.stockStatus || ''),
    cage:        String(resolvedParams.cage        || ''),
    category:    String(resolvedParams.category    || ''),
    type:        String(resolvedParams.type        || ''),
    industry:    String(resolvedParams.industry    || ''),
  }));

  // Debounced search input value (separate so we can debounce it)
  const [searchInput, setSearchInput] = useState(filters.search);

  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([{ value: '', label: 'All Categories' }]);
  const [products, setProducts]   = useState<Product[]>([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]           = useState(Number(resolvedParams.page) || 1);
  const [sort, setSort]           = useState(String(resolvedParams.sort || 'relevance'));
  const [view, setView]           = useState<ViewMode>(() => {
    const v = resolvedParams.view;
    if (v === 'grid') return 'grid3';
    if (v === 'card') return 'cardview';
    return 'listview';
  });
  const [loading, setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Fetch part categories ───────────────────────────────────
  useEffect(() => {
    request<{ success: boolean; data: NavCategoryTree }>('/nav-categories').then((res) => {
      const cats = res.data?.partCategories;
      if (Array.isArray(cats) && cats.length) {
        setCategoryOptions([
          { value: '', label: 'All Categories' },
          ...cats.map((c: NavCategory) => ({ value: c.slug, label: c.name })),
        ]);
      }
    }).catch(() => {});
  }, []);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch products whenever filters/page/sort change ─────────────────────
  const fetchProducts = useCallback(async (f: ActiveFilters, pg: number) => {
    setLoading(true);
    try {
      const limit = LIMITS_PER_VIEW[view];
      const apiFilters: ProductFilters = {
        page: pg,
        limit,
        ...(f.search      && { search: f.search }),
        ...(f.condition   && { condition: f.condition }),
        ...(f.stockStatus && { stockStatus: f.stockStatus }),
        ...(f.cage        && { cage: f.cage }),
        ...(f.category    && { category: f.category }),
        ...(f.type        && { type: f.type }),
        ...(f.industry    && { industry: f.industry }),
      };
      const res = await getProducts(apiFilters);
      setProducts(res.data);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch {
      setProducts([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [view]);

  // Re-fetch when filters, page, or sort change
  useEffect(() => {
    fetchProducts(filters, page);
  }, [filters, page, sort, fetchProducts]);

  // ── Sync URL params WITHOUT causing a page remount ──────────────────────
  // router.push() in App Router causes full remount → input loses focus.
  // window.history.replaceState keeps the URL in sync without remounting.
  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.search)       p.set('search', filters.search);
    if (filters.condition)    p.set('condition', filters.condition);
    if (filters.stockStatus)  p.set('stockStatus', filters.stockStatus);
    if (filters.cage)         p.set('cage', filters.cage);
    if (filters.category)     p.set('category', filters.category);
    if (filters.type)         p.set('type', filters.type);
    if (filters.industry)     p.set('industry', filters.industry);
    if (page > 1)             p.set('page', String(page));
    if (sort !== 'relevance') p.set('sort', sort);
    if (view === 'grid3') p.set('view', 'grid');
    else if (view === 'cardview') p.set('view', 'card');
    const url = `/catalog${p.toString() ? '?' + p.toString() : ''}`;
    window.history.replaceState(null, '', url);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, sort]);

  // ── Debounce search input → update filters ────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPage(1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const updateFilter = (key: keyof ActiveFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchInput('');
    setPage(1);
  };

  const activeChips = Object.entries(filters)
    .filter(([k, v]) => v && k !== 'search')
    .map(([k, v]) => {
      const labelMap: Record<string, string> = {
        condition: `Condition: ${v}`,
        stockStatus: `Stock: ${v}`,
        cage: `CAGE: ${v}`,
        category: `Category: ${categoryOptions.find((o) => o.value === v)?.label ?? v}`,
        type: `Type: ${v}`,
        industry: `Industry: ${v}`,
      };
      return { key: k as keyof ActiveFilters, label: labelMap[k] ?? v };
    });

  const hasFilters = Object.values(filters).some(Boolean);

  const gridClass: Record<ViewMode, string> = {
    grid2: 'grid-cols-1 sm:grid-cols-2',
    grid3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    grid4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
    list:  'grid-cols-1',
    listview: 'grid-cols-1',
    cardview: 'grid-cols-1',
  };

  // ── Pagination helper ─────────────────────────────────────────────────────
  const pageNumbers = (() => {
    const delta = 2;
    const range: (number | '...')[] = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      range.push(i);
    }
    if ((range[0] as number) > 1) {
      if ((range[0] as number) > 2) range.unshift('...');
      range.unshift(1);
    }
    if ((range[range.length - 1] as number) < totalPages) {
      if ((range[range.length - 1] as number) < totalPages - 1) range.push('...');
      range.push(totalPages);
    }
    return range;
  })();

  // ── Sidebar content (reused in both mobile drawer and desktop column) ──────
  const SidebarContent = () => (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <Input
          label="Search Parts"
          placeholder="Part number, NSN, description…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          rightIcon={searchInput ? (
            <button onClick={() => setSearchInput('')} className="pointer-events-auto">
              <X className="w-3.5 h-3.5" />
            </button>
          ) : undefined}
        />
      </div>

      {/* Category */}
      <Select
        label="Category"
        options={categoryOptions}
        value={filters.category}
        onChange={(e) => updateFilter('category', e.target.value)}
        placeholder="All Categories"
      />

      {/* Condition */}
      <Select
        label="Condition"
        options={CONDITION_OPTIONS}
        value={filters.condition}
        onChange={(e) => updateFilter('condition', e.target.value)}
        placeholder="All Conditions"
      />

      {/* Stock Status */}
      <Select
        label="Stock Status"
        options={STOCK_OPTIONS}
        value={filters.stockStatus}
        onChange={(e) => updateFilter('stockStatus', e.target.value)}
        placeholder="All Stock Status"
      />

      {/* CAGE Code */}
      <Input
        label="CAGE Code"
        placeholder="e.g. 81205"
        value={filters.cage}
        onChange={(e) => updateFilter('cage', e.target.value)}
      />

      {/* Clear */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-text-muted">
          <X className="w-3.5 h-3.5" /> Clear All Filters
        </Button>
      )}
    </div>
  );

  const catalogSchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Parts Catalog | AeroTurbineSpare',
      description: 'Browse our extensive catalog of aerospace parts, NSN components, turbine spares, and MRO supplies.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SchemaInjector pageKey="catalog" staticSchemas={catalogSchemas} />
      <Header />

      <main className="flex-1 bg-bg">
        {/* Page header */}
        <div className="bg-gradient-to-br from-navy via-[#0B1A33] to-[#0D2247] py-12">
          <div className="max-w-7xl mx-auto px-4">
            <Breadcrumb
              items={[{ label: 'Home', href: '/' }, { label: 'Product Catalog' }]}
              className="mb-4 [&_a]:text-silver/60 [&_a:hover]:text-orange [&_.text-text]:text-silver/90"
            />
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                  Product Catalog
                </h1>
                <p className="text-silver/70 text-sm sm:text-base">
                  {loading ? 'Loading…' : `${total.toLocaleString()} turbine parts & components`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-silver font-medium">AS9120 Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 border border-white/10">
                  <Clock className="w-4 h-4 text-orange" />
                  <span className="text-xs text-silver font-medium">24-Hr Quote</span>
                </div>
              </div>
            </div>

            {/* Quick category links */}
            <div className="mt-6 flex flex-wrap gap-2">
              {QUICK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 rounded-lg text-white text-xs font-medium transition-all"
                >
                  <cat.icon className="w-3.5 h-3.5 text-orange/80" />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-7">
            {/* ── Desktop sidebar ─────────────────────────────────────── */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-silver p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-text flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-orange" /> Filters
                  </h2>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-xs text-text-muted hover:text-orange transition-colors">
                      Clear all
                    </button>
                  )}
                </div>
                <SidebarContent />
              </div>
            </aside>

            {/* ── Mobile sidebar overlay ──────────────────────────────── */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                <div className="absolute left-0 top-0 h-full w-80 max-w-full bg-white shadow-2xl flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-silver">
                    <h2 className="font-semibold text-text">Filters</h2>
                    <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-silver">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5">
                    <SidebarContent />
                  </div>
                  <div className="p-4 border-t border-silver">
                    <Button variant="orange" size="md" className="w-full" onClick={() => setSidebarOpen(false)}>
                      View {total.toLocaleString()} Results
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Main content ──────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                {/* Mobile filter button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm font-medium text-text border border-silver-dark rounded-lg px-4 py-3 bg-white hover:border-orange/40 transition-colors min-h-[44px]"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters {hasFilters && <span className="bg-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeChips.length + (filters.search ? 1 : 0)}</span>}
                </button>

                {/* Result count */}
                <div className="text-sm text-text-muted flex-1">
                  {!loading && (
                    <span>
                      <span className="font-semibold text-text">{total.toLocaleString()}</span> results
                      {filters.search && <span> for &ldquo;<span className="text-orange">{filters.search}</span>&rdquo;</span>}
                    </span>
                  )}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-text-muted whitespace-nowrap">Sort by</label>
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="text-sm border border-silver-dark rounded-lg px-3 py-2 bg-white text-text focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange"
                  >
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* View toggle */}
                <div className="flex items-center bg-white border border-silver rounded-lg overflow-hidden flex-shrink-0">
                  {([
                    ['grid2', <Grid2X2 key="g2" className="w-3.5 sm:w-4 h-3.5 sm:h-4" />],
                    ['grid3', <LayoutGrid key="g3" className="w-3.5 sm:w-4 h-3.5 sm:h-4" />],
                    ['grid4', <Grid3X3 key="g4" className="w-3.5 sm:w-4 h-3.5 sm:h-4" />],
                    ['list',  <LayoutList key="li" className="w-3.5 sm:w-4 h-3.5 sm:h-4" />],
                  ] as [ViewMode, React.ReactNode][]).map(([mode, icon]) => (
                    <button
                      key={mode}
                      onClick={() => setView(mode)}
                      className={cn(
                        'p-2 sm:p-2.5 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center',
                        view === mode ? 'bg-navy text-white' : 'text-text-muted hover:bg-silver'
                      )}
                      aria-label={mode}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active filter chips */}
              {(activeChips.length > 0 || filters.search) && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {filters.search && (
                    <span className="inline-flex items-center gap-1.5 bg-orange/10 text-orange border border-orange/20 rounded-full px-3 py-1 text-xs font-medium">
                      Search: {filters.search}
                      <button onClick={() => { setSearchInput(''); setFilters((p) => ({ ...p, search: '' })); }} className="hover:text-orange-light">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {activeChips.map(({ key, label }) => (
                    <span key={key} className="inline-flex items-center gap-1.5 bg-navy/8 text-navy border border-navy/15 rounded-full px-3 py-1 text-xs font-medium">
                      {label}
                      <button onClick={() => updateFilter(key, '')} className="hover:text-orange">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(activeChips.length > 1 || (activeChips.length > 0 && filters.search)) && (
                    <button onClick={clearFilters} className="text-xs text-text-muted hover:text-orange underline">
                      Clear all
                    </button>
                  )}
                </div>
              )}

              {/* Products grid/list */}
              {loading ? (
                <div className={cn('grid gap-5', gridClass[view])}>
                  {Array.from({ length: LIMITS_PER_VIEW[view] }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-full bg-silver flex items-center justify-center mb-5">
                    <Search className="w-8 h-8 text-text-muted" />
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-2">No parts found</h3>
                  <p className="text-text-muted text-sm mb-6 max-w-sm">
                    We couldn&apos;t find any parts matching your current filters. Try adjusting your search or clearing some filters.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : view === 'listview' ? (
                <ListView
                  items={products.map((p) => ({
                    id: p.id,
                    title: `${p.partNumber} — ${p.shortDescription}`,
                    slug: p.id,
                    description: p.description,
                    data: {
                      nsn: p.nsn,
                      cage: p.cage,
                      manufacturer: p.manufacturer,
                      condition: p.condition,
                      stockStatus: p.stockStatus,
                      quantity: p.quantityAvailable,
                    },
                  }))}
                />
              ) : view === 'cardview' ? (
                <CardView
                  items={products.map((p) => ({
                    id: p.id,
                    title: `${p.partNumber} — ${p.shortDescription}`,
                    slug: p.id,
                    description: p.description,
                    data: {
                      nsn: p.nsn,
                      cage: p.cage,
                      manufacturer: p.manufacturer,
                      condition: p.condition,
                      stockStatus: p.stockStatus,
                    },
                  }))}
                />
              ) : (
                <div className={cn('grid gap-5', gridClass[view])}>
                  {products.map((p) => (
                    <PartCard key={p.id} product={p} view={view === 'list' ? 'list' : 'grid'} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-10 flex-wrap">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-silver bg-white hover:border-orange/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[36px]"
                  >
                    <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Prev</span>
                  </button>

                  {pageNumbers.map((n, i) =>
                    n === '...' ? (
                      <span key={`dots-${i}`} className="px-2 text-text-muted text-sm select-none">…</span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => setPage(n as number)}
                        className={cn(
                          'w-8 sm:w-9 h-8 sm:h-9 rounded-lg text-sm font-semibold transition-colors',
                          page === n
                            ? 'bg-navy text-white'
                            : 'bg-white border border-silver hover:border-orange/40 text-text'
                        )}
                      >
                        {n}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-silver bg-white hover:border-orange/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[36px]"
                  >
                    <span className="hidden sm:inline">Next</span> <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
