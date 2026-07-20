'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Check, ChevronLeft, MessageCircle, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuickContactDrawer() {
  const [mode, setMode] = useState<'closed' | 'center' | 'side'>('closed');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const lastActionRef = useRef(Date.now());
  const manuallyOpenedRef = useRef(false);

  // Auto-open after 1 min (only if never manually opened)
  useEffect(() => {
    if (manuallyOpenedRef.current) return;

    const timer = setTimeout(() => {
      setMode('center');
      lastActionRef.current = Date.now();
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  // Inactivity close (10 min) — works for both modes
  useEffect(() => {
    if (mode === 'closed') return;
    const check = () => {
      if (Date.now() - lastActionRef.current > 600000) {
        setMode('closed');
      }
    };
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [mode]);

  const resetInactivity = () => { lastActionRef.current = Date.now(); };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resetInactivity();
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and Email are required');
      return;
    }
    setSending(true);
    try {
      await fetch('/api/lead/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quick-contact',
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message || 'Quick contact inquiry',
          source: mode === 'center' ? 'quick-contact-auto' : 'quick-contact-manual',
        }),
      });
    } catch {}
    setSending(false);
    setSubmitted(true);
    toast.success('Message sent! We will respond within 24 hours.');
    setTimeout(() => { setMode('closed'); setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }, 3000);
  };

  const handleClose = () => { setMode('closed'); };

  const openManual = () => {
    manuallyOpenedRef.current = true;
    setMode('side');
    resetInactivity();
    setSubmitted(false);
  };

  // ── Form content (shared between both modes) ──

  const formContent = submitted ? (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-400" />
      </div>
      <p className="text-lg font-bold text-white mb-1">Thank You!</p>
      <p className="text-sm text-white/60 mb-6">We have received your message and will respond within 24 hours.</p>
      <p className="text-xs text-white/40">
        Meanwhile, call us at <a href="tel:+919354764587" className="text-[#818CF8] hover:underline">+91 9354764587</a>
      </p>
    </div>
  ) : (
    <div>
      <p className="text-white/50 text-[11px] mb-5 leading-relaxed">
        Need a part urgently? Drop your details and we&apos;ll call you back.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Your Name *" required
            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all" />
          <input type="tel" value={form.phone} onChange={handleChange('phone')} placeholder="Phone"
            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all" />
        </div>
        <input type="email" value={form.email} onChange={handleChange('email')} placeholder="Email Address *" required
          className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all" />
        <textarea value={form.message} onChange={handleChange('message')} placeholder="Part number or details..."
          rows={3}
          className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] transition-all resize-none" />
        <button type="submit" disabled={sending}
          className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs py-3 rounded-xl transition-all disabled:opacity-60">
          {sending ? 'Sending...' : 'Send Message'}
          {!sending && <Send className="w-3 h-3" />}
        </button>
      </form>
      <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-white/40">
        <a href="tel:+919354764587" className="flex items-center gap-1 hover:text-white/60 transition-colors">
          <Phone className="w-3 h-3" /> Call
        </a>
        <a href="mailto:sales@aeroturbinespare.com" className="flex items-center gap-1 hover:text-white/60 transition-colors">
          <Mail className="w-3 h-3" /> Email
        </a>
        <a href="https://wa.me/919354764587?text=Hi%20AeroTurbineSpare!%20I%20need%20a%20quote%20for%20gas%20turbine%20parts." target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white/60 transition-colors">
          <MessageCircle className="w-3 h-3 text-[#25D366]" /> WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Tab trigger — always visible */}
      <button
        onClick={openManual}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[9997] flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold px-3 py-4 rounded-l-xl shadow-xl transition-all hover:pr-4 group"
        aria-label="Quick Contact"
      >
        <span className="text-[10px] uppercase tracking-widest [writing-mode:vertical-rl]">
          Quick Contact
        </span>
        <ChevronLeft className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Auto-open: centered popup */}
      {mode === 'center' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleClose}>
          <div
            className="relative w-full max-w-md bg-gradient-to-br from-[#0A1628] via-[#1E1B4B] to-[#312E81] rounded-2xl shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-semibold text-white text-sm">Quick Contact</span>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Close">
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            <div className="px-5 py-6">{formContent}</div>
          </div>
        </div>
      )}

      {/* Manual: side drawer */}
      {mode === 'side' && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
          <div
            className="relative w-full max-w-sm bg-gradient-to-br from-[#0A1628] via-[#1E1B4B] to-[#312E81] shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-semibold text-white text-sm">Quick Contact</span>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Close">
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{formContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
