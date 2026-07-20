'use client'
import { useState, useEffect, useRef, useCallback, use, useTransition, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Search,
  ArrowRight,
  ChevronDown,
  Filter,
  X,
  ShieldCheck,
  Award,
  Clock,
  Truck,
  Zap,
} from 'lucide-react'
import type { Product, Category, Testimonial } from '@/types'
import HomeSeoContent from '@/components/seo/HomeSeoContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TrustBar from '@/components/home/TrustBar'
import GlowyBlobBg from '@/components/home/GlowyBlobBg'
import ZigZagDivider from '@/components/home/ZigZagDivider'
import { SchemaInjector } from '@/components/seo/SchemaInjector'
import { ReviewJsonLd } from '@/components/seo/JsonLd'
import PartCard from '@/components/catalog/PartCard'
import Button from '@/components/ui/Button'
import { request } from '@/lib/api-client'
import { useSiteConfig } from '@/hooks/useSiteConfig'
import BrandLogos from '@/components/home/BrandLogos'
import IndustriesGrid from '@/components/home/IndustriesGrid'
import CategoriesSection from '@/components/home/CategoriesSection'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import HowItWorks from '@/components/home/HowItWorks'
import StatsCounter from '@/components/home/StatsCounter'
import WhyUs from '@/components/home/WhyUs'
import dynamic from 'next/dynamic'
import ConicCard from '@/components/home/ConicCard'
import BlobButton from '@/components/home/BlobButton'
import QuickQuoteForm from '@/components/home/QuickQuoteForm'
import SubscribeForm from '@/components/home/SubscribeForm'

const TestimonialsCarousel = dynamic(() => import('@/components/home/TestimonialsCarousel'), { ssr: false, loading: () => <div className="h-64 bg-slate-100 animate-pulse" /> })
const ZigZagGallery = dynamic(() => import('@/components/home/ZigZagGallery'), { ssr: false, loading: () => <div className="h-64 bg-slate-100 animate-pulse" /> })
const BlogPreviewSection = dynamic(() => import('@/components/home/BlogPreviewSection'), { ssr: false, loading: () => <div className="h-64 bg-slate-100 animate-pulse" /> })
const FAQSection = dynamic(() => import('@/components/home/FAQSection'), { ssr: false, loading: () => <div className="h-64 bg-slate-100 animate-pulse" /> })

const SEARCH_TYPES = ['Part Number', 'NSN', 'CAGE Code', 'Description', 'Manufacturer']
const CONDITIONS = ['Any Condition', 'New', 'Overhauled', 'Refurbished', 'Used']
const CATEGORIES = ['All Categories', 'Turbines & Engines', 'Airframe', 'Bearings', 'Electronics', 'Hydraulics']
const STOCK_OPTS = ['Any Stock', 'In Stock', 'On Order', 'Limited']

export default function HomePage({ params }: { params: Promise<{ country?: string }> }) {
  const router = useRouter()
  const { country = '' } = use(params)
  const c = (p: string) => country ? `/${country}${p}` : p
  const { config: site } = useSiteConfig()

  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState('')
  const [searchType, setSearchType] = useState('Part Number')
  const [condition, setCondition] = useState('Any Condition')
  const [category, setCategory] = useState('All Categories')
  const [stock, setStock] = useState('Any Stock')
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  const fetchHomeData = useCallback(async () => {
    const [prods, cats, tests] = await Promise.all([
      request<{ success: boolean; data: Product[]; pagination: unknown }>('/products?limit=8')
        .catch(async () => {
          const mod = await import('@/data/products.json');
          return { success: false, data: (mod.default as unknown as Product[]).slice(0, 8), pagination: null };
        }),
      request<{ success: boolean; data: Category[] }>('/categories')
        .catch(async () => {
          const mod = await import('@/data/categories.json');
          const raw = mod.default as unknown as { fsgCategories: Category[] };
          return { success: false, data: raw.fsgCategories?.slice(0, 6) ?? (raw as unknown as Category[]).slice(0, 6) };
        }),
      request<{ success: boolean; data: Testimonial[] }>('/testimonials')
        .catch(async () => {
          const mod = await import('@/data/testimonials.json');
          return { success: false, data: mod.default as unknown as Testimonial[], pagination: null };
        }),
    ])
    setProducts(prods.data)
    setCategories(cats.data)
    setTestimonials(tests.data)
  }, [])

  useEffect(() => {
    fetchHomeData()
    const interval = setInterval(fetchHomeData, 60_000)
    return () => clearInterval(interval)
  }, [fetchHomeData])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (searchType !== 'Part Number') params.set('filterType', searchType)
    if (condition !== 'Any Condition') params.set('condition', condition)
    if (category !== 'All Categories') params.set('category', category)
    if (stock !== 'Any Stock') params.set('stock', stock)
    router.push(`${c('/catalog')}?${params.toString()}`)
  }

  const hasFilters = condition !== 'Any Condition' || category !== 'All Categories' || stock !== 'Any Stock'

  // Compute hero background
  const heroBg =
    site.heroBgType === 'solid'
      ? site.heroBgValue
      : site.heroBgType === 'image'
      ? `url(${site.heroBgValue}) center/cover`
      : undefined

  const homepageSchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Global Gas Turbine Services & Spare Parts Supplier | AeroTurbineSpare',
      description:
        'Global supplier of gas turbine spare parts and services for GE, Siemens, Rolls-Royce & Solar Turbines platforms. NSN/CAGE-referenced parts, 24-hr quotes, worldwide shipping.',
      url: 'https://aeroturbinespare.com',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aeroturbinespare.com' },
        ],
      },
    },
  ]

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <HomeSeoContent />
      <SchemaInjector pageKey="homepage" staticSchemas={homepageSchemas} />
      {testimonials.length > 0 && (
        <ReviewJsonLd
          aggregateRating={{
            ratingValue: Math.round((testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) * 10) / 10,
            reviewCount: testimonials.length,
          }}
          reviews={testimonials.map((t) => ({
            author: t.name,
            rating: t.rating,
            body: t.quote,
            date: '2024-01-01',
          }))}
        />
      )}
      <Header />

      <main id="main-content">

      {/* ── HERO ── Blue/Indigo theme, dynamic from SiteConfig ── */}
      <section
        className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center overflow-hidden"
        style={heroBg ? { background: heroBg } : undefined}
      >
        {/* Glowy blob background effect */}
        <GlowyBlobBg />

        {/* Gradient when type = gradient or no override */}
        {site.heroBgType !== 'solid' && site.heroBgType !== 'image' && (
          <div className="absolute inset-0 hero-gradient" />
        )}

        {/* Background image overlay for hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/hero-bg.jpg"
            alt="Industrial gas turbine engine components and parts"
            fill
            sizes="100vw"
            className="object-cover opacity-20"
            preload
            fetchPriority="high"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* Ambient glow blobs - responsive sizing */}
        <div className="absolute top-1/3 right-[15%] w-[20rem] sm:w-[28rem] h-[20rem] sm:h-[28rem] bg-[#4F46E5]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-[10%] w-[14rem] sm:w-[20rem] h-[14rem] sm:h-[20rem] bg-[#1D4ED8]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-1/2 w-[12rem] sm:w-[18rem] h-[12rem] sm:h-[18rem] bg-[#818CF8]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative image - right side on large screens */}
        <div className="hidden xl:block absolute right-0 bottom-0 w-[50%] h-full pointer-events-none opacity-30">
          <Image
            src="/images/hero-turbine.jpg"
            alt="Gas turbine engine rotor and blade assembly"
            fill
            sizes="50vw"
            className="object-contain object-right-bottom"
            loading="lazy"
            unoptimized
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-semibold text-white mb-6 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse flex-shrink-0" />
              {site.heroBadgeText || 'Gas Turbine Parts & Services. Global Inventory.'}
            </div>

            {/* Heading */}
            <h1 className="seo-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              <span className="gradient-text">Gas Turbine</span> Parts &amp; Services<br />
              When You Need Them Most
            </h1>

            {/* Sub-heading */}
            <p className="seo-description text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10 max-w-2xl">
              Power plants, offshore platforms, pipelines. Wherever a turbine is running, we supply the parts to keep it going. GE, Siemens, Rolls-Royce, Solar Turbines, Alstom, Ansaldo. Search by part number, NSN, or CAGE code. Most quotes come back the same day.
            </p>

            {/* ── Advanced Search Bar ── */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
              {/* Main search row */}
              <div className="flex items-stretch">
                {/* Filter type selector */}
                <div className="relative border-r border-[#E8EDF2] flex-shrink-0">
                  <select
                    value={searchType}
                    onChange={(e) => { const v = e.target.value; startTransition(() => { setSearchType(v) }) }}
                    className="appearance-none h-full pl-4 pr-8 text-xs font-semibold text-[#0A1628] bg-[#F5F7FA] focus:outline-none focus:bg-[#EEF2FF] cursor-pointer min-w-[120px]"
                    aria-label="Search type"
                  >
                    {SEARCH_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4A4A6A] pointer-events-none" />
                </div>

                {/* Text input */}
                <input
                  type="search"
                  value={search}
                  onChange={(e) => { const v = e.target.value; startTransition(() => { setSearch(v) }) }}
                  placeholder={`Search by ${searchType}...`}
                  className="flex-1 text-sm text-[#0A1628] px-5 py-4 focus:outline-none placeholder:text-[#4A4A6A]/50 min-w-0"
                  autoComplete="off"
                  aria-label={`Search by ${searchType}`}
                />

                {/* Filter toggle */}
                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  aria-label="Toggle search filters"
                  aria-expanded={showFilters}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 text-sm font-medium border-l border-[#E8EDF2] transition-colors flex-shrink-0 ${
                    showFilters || hasFilters
                      ? 'bg-[#EEF2FF] text-[#4F46E5]'
                      : 'text-[#4A4A6A] hover:bg-[#F5F7FA]'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasFilters && (
                    <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center">
                      {[condition !== 'Any Condition', category !== 'All Categories', stock !== 'Any Stock'].filter(Boolean).length}
                    </span>
                  )}
                </button>

                {/* Search button */}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 sm:px-6 bg-[#4F46E5] text-white text-sm font-semibold hover:bg-[#4338CA] transition-colors flex-shrink-0"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>

              {/* Expandable filter row */}
              <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-40 border-t border-[#E8EDF2]' : 'max-h-0'}`}>
                <div className="flex flex-wrap gap-2 sm:gap-3 px-4 sm:px-5 py-3 bg-[#F8F9FF]">
                  {/* Condition */}
                  <div className="relative">
                    <select
                      value={condition}
                      onChange={(e) => { const v = e.target.value; startTransition(() => { setCondition(v) }) }}
                      className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium text-[#0A1628] bg-white border border-[#E8EDF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 cursor-pointer"
                      aria-label="Part condition"
                    >
                      {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#4A4A6A] pointer-events-none" />
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => { const v = e.target.value; startTransition(() => { setCategory(v) }) }}
                      className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium text-[#0A1628] bg-white border border-[#E8EDF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 cursor-pointer"
                      aria-label="Part category"
                    >
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#4A4A6A] pointer-events-none" />
                  </div>

                  {/* Stock */}
                  <div className="relative">
                    <select
                      value={stock}
                      onChange={(e) => { const v = e.target.value; startTransition(() => { setStock(v) }) }}
                      className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium text-[#0A1628] bg-white border border-[#E8EDF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 cursor-pointer"
                      aria-label="Stock availability"
                    >
                      {STOCK_OPTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#4A4A6A] pointer-events-none" />
                  </div>

                  {/* Clear filters */}
                  {hasFilters && (
                    <button
                      type="button"
                      onClick={() => { startTransition(() => { setCondition('Any Condition'); setCategory('All Categories'); setStock('Any Stock') }) }}
                      className="flex items-center gap-1 pl-2 pr-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Quick-search tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['GE Frame 7 Parts', 'Siemens SGT Blades', 'LM2500 Components', 'Speedtronic Mark VI'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { setSearch(tag); router.push(`${c('/catalog')}?search=${encodeURIComponent(tag)}`) }}
                  className="px-3 py-1 text-xs font-medium text-white/70 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap gap-3">
              <Link href={c(site.heroCta1Href || '/rfq')}>
                <Button variant="blue" size="lg">
                  {site.heroCta1Label || 'Request a Quote'} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href={c(site.heroCta2Href || '/catalog')}>
                <Button
                  variant="outline" size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50"
                >
                  {site.heroCta2Label || 'Browse Catalog'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust chips — inline on mobile/tablet */}
          <div className="xl:hidden grid grid-cols-2 sm:grid-cols-3 gap-3 mt-10 max-w-3xl">
            {[
              { icon: ShieldCheck, label: 'AS9100 & AS9120 Certified', sub: 'Quality Management' },
              { icon: Clock,       label: '24-Hour Quote Response', sub: 'Most Quotes Same Day' },
              { icon: Award,       label: 'Zero Counterfeit Policy', sub: 'Verified Every Part' },
              { icon: Truck,       label: '150+ Countries Served', sub: 'Global Logistics Network' },
              { icon: Zap,         label: 'Turbine Outage Support', sub: 'Priority Response' },
            ].slice(0, 3).map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5 bg-white/8 border border-white/12 rounded-xl px-3.5 py-2.5 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#818CF8]" />
                </div>
                <div className="min-w-0">
                  <div className="text-white text-[11px] font-semibold leading-tight truncate">{label}</div>
                  <div className="text-white/50 text-[10px] mt-0.5 truncate">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust chips — desktop right panel */}
          <div className="hidden xl:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 w-64">
            {[
              { icon: ShieldCheck, label: 'AS9100 & AS9120 Certified', sub: 'Quality Management' },
              { icon: Clock,       label: '24-Hour Quote Response', sub: 'Most Quotes Same Day' },
              { icon: Award,       label: 'Zero Counterfeit Policy', sub: 'Verified Every Part' },
              { icon: Truck,       label: '150+ Countries Served', sub: 'Global Logistics Network' },
              { icon: Zap,         label: 'Turbine Outage Support', sub: 'Priority Response' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 bg-white/8 border border-white/12 rounded-xl px-4 py-3 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-lg bg-[#4F46E5]/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-[#818CF8]" />
                </div>
                <div>
                  <div className="text-white text-xs font-semibold leading-tight">{label}</div>
                  <div className="text-white/50 text-[10px] mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBar />
      <BrandLogos />
      <IndustriesGrid />
      <CategoriesSection />
      {/* <ZigZagDivider text="   " /> */}
      <FeaturedCategories categories={categories} />
      <HowItWorks />
      <ZigZagDivider />
      <StatsCounter />

      <Suspense fallback={
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 space-y-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      }>
        <WhyUs />

        {/* LATEST PARTS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-2">
                  <span className="w-6 h-px bg-[#4F46E5]" /> Latest Inventory
                </div>
                <h2 className="text-3xl font-bold text-[#0A1628]">Recently Added Turbine Parts</h2>
              </div>
              <Link href={c('/catalog')} className="text-sm font-medium text-[#4F46E5] hover:underline">
                View all →
              </Link>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['All', 'LM2500', 'LM6000', 'GE Frame', 'Siemens', 'Combustion', 'Controls', 'Bearings', 'Bently Nevada'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (cat === 'All') router.push(c('/catalog'));
                    else router.push(`${c('/catalog')}?category=${cat.toLowerCase().replace(/\s+/g, '-')}`);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-full border border-silver bg-white text-[#4A4A6A] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {products.slice(0, 8).map((p) => <PartCard key={p.id} product={p} />)}
              </div>
          </div>
        </section>

        <TestimonialsCarousel testimonials={testimonials} />

        {/* WHY US — ZigZag Divider + Conic Card */}
        <ZigZagDivider text="WHY US" />
        <section className="py-20 bg-[#0A1628]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ConicCard
                title="Why Top MROs & OEMs Choose AeroTurbineSpare"
                badge="Our Advantage"
                className="p-8 lg:p-10"
                cta={
                  <Link
                    href={c('/quality')}
                    className="inline-flex items-center gap-2 text-[#818CF8] text-sm font-semibold hover:text-white transition-colors group"
                  >
                    View Quality Certifications
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                }
              >
                <div className="space-y-4">
                  {[
                    { title: 'Full Traceability on Every Part', desc: 'A documentation trail that doesn\'t have gaps, whether it\'s a new part or a repaired one.' },
                    { title: 'Direct Access to Your Trader', desc: 'Talk to the same person every time, someone who already knows what platform you run.' },
                    { title: 'Hard-to-Find & Obsolete Parts', desc: 'If your usual supplier said no, that\'s usually when we start. Legacy Mark V cards, discontinued combustion parts — we find them.' },
                    { title: 'Zero Counterfeit Policy', desc: 'Verified sourcing on every single part, no shortcuts taken to hit a deadline.' },
                  ].map(({ title, desc }) => (
                    <div key={title} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 16 16">
                          <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{title}</div>
                        <div className="text-[#C0C9D5]/70 text-xs mt-0.5">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ConicCard>
              <div className="space-y-6">
                <ZigZagGallery
                  images={[
                    { src: '/images/part-engine-1.jpg', alt: 'Jet engine turbine fan blades - high precision aerospace component' },
                    { src: '/images/part-cockpit.jpg', alt: 'Aircraft cockpit instrument panel and avionics' },
                  ]}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { val: '100%', label: 'Certified on Every Part' },
                    { val: '< 24h', label: 'Quote Turnaround' },
                    { val: 'AS9120', label: 'Quality Certification' },
                    { val: 'Zero', label: 'Counterfeit Policy' },
                  ].map(({ val, label }) => (
                    <div key={label} className="bg-white/8 border border-white/12 rounded-2xl p-4 sm:p-6 text-center">
                      <div className="text-xl sm:text-3xl font-black text-[#818CF8] mb-1">{val}</div>
                      <div className="text-[#C0C9D5]/80 text-xs sm:text-sm">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* URGENT CTA with Blob Button */}
        <section className="py-20 bg-gradient-to-r from-[#0A1628] via-[#1E1B4B] to-[#312E81] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <pattern id="cta-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.8" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">Need a Part Urgently?</h2>
            <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
              An unplanned outage doesn't wait for business hours. Our team is on standby around the clock to help you locate, confirm, and ship critical turbine parts — day or night.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link href={c('/rfq?urgency=urgent')} className="inline-block">
                <BlobButton label="URGENT RFQ" />
              </Link>
              <a href="tel:+31611879800" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/10 hover:border-white/50 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +31611879800
              </a>
            </div>
          </div>
        </section>

        <QuickQuoteForm />
        <BlogPreviewSection />
        <SubscribeForm />
        <FAQSection />
      </Suspense>
      </main>
      <Footer />
    </div>
  )
}