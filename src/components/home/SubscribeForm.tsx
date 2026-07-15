'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setSending(true);
    try {
      await request('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      });
      setSubscribed(true);
      toast.success('Subscribed! Stay tuned for updates.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to subscribe');
    } finally {
      setSending(false);
    }
  };

  if (subscribed) {
    return (
      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
            <Check className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">You&apos;re Subscribed!</h3>
          <p className="text-white/60 text-sm">We&apos;ll send you the latest parts inventory and industry updates.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#0A1628] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[#818CF8] text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-6 h-px bg-[#818CF8]" /> Newsletter <span className="w-6 h-px bg-[#818CF8]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Stay Updated on New Inventory</h2>
          <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
            Get notified when new turbine parts and platforms are added to our inventory — no generic aerospace updates, just what's relevant to your fleet.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all"
              required
              suppressHydrationWarning
            />
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-xl transition-all disabled:opacity-60 whitespace-nowrap"
            >
              {sending ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
