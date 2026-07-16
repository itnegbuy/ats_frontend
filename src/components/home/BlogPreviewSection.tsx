'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { request } from '@/lib/api-client';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  author?: string;
  publishedAt: string;
  readingTime?: string;
  category?: string;
};

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 'blog-fallback-1',
    coverImage: '/images/part-controls.jpg',
    title: 'Understanding NSN & CAGE Codes for Gas Turbine Parts Procurement',
    slug: 'understanding-nsn-cage-codes-gas-turbine-parts',
    excerpt: 'Learn how NATO Stock Numbers and CAGE codes work for gas turbine parts procurement. A practical guide for power generation and oil & gas buyers.',
    author: 'AeroTurbineSpare Team',
    publishedAt: '2026-06-15',
    readingTime: '8 min read',
    category: 'Procurement Guide',
  },
  {
    id: 'blog-fallback-2',
    coverImage: '/images/part-fuselage.jpg',
    title: 'GE Mark VI vs Mark VIe: What Changes When You Upgrade Your Control System',
    slug: 'ge-mark-vi-vs-mark-vie-control-system-upgrade',
    excerpt: 'Understand the key differences between GE Speedtronic Mark VI and Mark VIe control platforms and what to consider before upgrading your turbine control system.',
    author: 'AeroTurbineSpare Team',
    publishedAt: '2026-05-28',
    readingTime: '6 min read',
    category: 'Control Systems',
  },
  {
    id: 'blog-fallback-3',
    coverImage: '/images/part-engine-1.jpg',
    title: 'Planning a Turbine Outage: How to Avoid Last-Minute Parts Delays',
    slug: 'planning-turbine-outage-avoid-parts-delays',
    excerpt: 'Best practices for planning gas turbine outages and ensuring critical parts arrive on time. Learn how to avoid common procurement pitfalls that delay restarts.',
    author: 'AeroTurbineSpare Team',
    publishedAt: '2026-04-10',
    readingTime: '5 min read',
    category: 'Outage Planning',
  },
];

export default function BlogPreviewSection() {
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);

  useEffect(() => {
    request<{ success: boolean; data: BlogPost[] }>('/blog?limit=3')
      .then((res) => {
        if (res?.success && res?.data?.length) setPosts(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-brand text-sm font-semibold uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-brand" /> Resources <span className="w-6 h-px bg-brand" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-text">
              Gas Turbine Industry Insights
            </h2>
            <p className="text-text-muted mt-2 max-w-xl">
              Practical guides on turbine sourcing, control systems, and outage planning. Written by people who have actually worked on these platforms.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange hover:underline flex-shrink-0"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white border border-silver rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange/20 transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              <div className="h-44 bg-gradient-to-br from-navy to-navy-light flex items-center justify-center relative overflow-hidden">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 rounded-xl bg-orange/20 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-orange" />
                    </div>
                    <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                      {post.category || 'Aerospace Insights'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                {post.category && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange mb-2">
                    {post.category}
                  </span>
                )}
                <h3 className="text-base font-bold text-text leading-snug mb-2 group-hover:text-orange transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-4 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-text-muted mt-auto pt-3 border-t border-silver">
                  {post.readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readingTime}
                    </span>
                  )}
                  {post.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

