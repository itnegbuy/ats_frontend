'use client';

import { useState } from 'react';
import { Send, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuickQuoteForm() {
  const [partNumber, setPartNumber] = useState('');
  const [quantity, setQuantity] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partNumber.trim() || !quantity.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
    toast.success('Quote request submitted! Our team will respond within 24 hours.');
  };

  if (submitted) {
    return (
      <section className="py-20 bg-gradient-to-r from-[#0A1628] via-[#1E1B4B] to-[#312E81] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <pattern id="quote-success-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#quote-success-grid)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Quote Request Received!</h3>
          <p className="text-white/70 max-w-md mx-auto">
            We&apos;ll come back with pricing and availability, usually the same day.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#0A1628] via-[#1E1B4B] to-[#312E81] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <pattern id="quote-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#quote-grid)" />
        </svg>
      </div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#4F46E5]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[#818CF8] text-sm font-semibold uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-[#818CF8]" /> Quick Quote <span className="w-6 h-px bg-[#818CF8]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
              Get an Instant<br />
              <span className="gradient-text">Parts Quote</span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-md">
              Give us your part number and quantity — we'll come back with pricing and availability, usually the same day.
            </p>
            <div className="mt-8 space-y-3">
              {[
                'Response within 24 hours guaranteed',
                'Pricing from verified OEM & aftermarket suppliers',
                'No minimum order quantities',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Part Number *</label>
                <input type="text" value={partNumber} onChange={(e) => setPartNumber(e.target.value)} placeholder="e.g. 1234-5678-90" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all" required />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Quantity *</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 10" min="1" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all" required />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Email Address *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all" required suppressHydrationWarning />
              </div>
              <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3.5 px-6 rounded-xl transition-all disabled:opacity-60">
                {sending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <>Request Quote <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
