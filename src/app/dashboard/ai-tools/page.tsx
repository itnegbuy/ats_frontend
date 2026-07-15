'use client';

import { useState } from 'react';
import { request } from '@/lib/api-client';
import { Sparkles, Search, Hash, FileText, Image, BookOpen, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'generate' | 'seo-meta' | 'keywords' | 'suggest' | 'alt-text' | 'summarize';

const PROVIDERS = ['openai', 'anthropic', 'gemini', 'deepseek', 'openrouter'];

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'generate', label: 'Content Generator', icon: Sparkles },
  { id: 'seo-meta', label: 'SEO Meta', icon: Search },
  { id: 'keywords', label: 'Keywords', icon: Hash },
  { id: 'suggest', label: 'Suggestions', icon: FileText },
  { id: 'alt-text', label: 'Alt Text', icon: Image },
  { id: 'summarize', label: 'Summarize', icon: BookOpen },
];

function ResultBox({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        <button onClick={handleCopy} className="p-1 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans">{text}</pre>
    </div>
  );
}

export default function ContentToolsPage() {
  const [tab, setTab] = useState<Tab>('generate');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<Record<string, unknown> | null>(null);

  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('openai');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('content');
  const [imageDescription, setImageDescription] = useState('');

  function reset() {
    setResult(null);
    setParsedResult(null);
  }

  async function handleGenerate() {
    if (!prompt.trim()) return;
    reset();
    setLoading(true);
    try {
      const res = await request<{ success: boolean; data: { text: string } }>('/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt, provider }),
      });
      setResult(res.data?.text || 'No response');
    } catch (e: unknown) {
      toast.error((e as Error).message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSEOMeta() {
    if (!content.trim()) return;
    reset();
    setLoading(true);
    try {
      const res = await request<{ success: boolean; data: { text: string } }>('/ai/seo-meta', {
        method: 'POST',
        body: JSON.stringify({ content, title: title || undefined }),
      });
      const text = res.data?.text || '';
      try {
        setParsedResult(JSON.parse(text) as Record<string, unknown>);
      } catch {
        setResult(text);
      }
    } catch (e: unknown) {
      toast.error((e as Error).message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleKeywords() {
    if (!content.trim()) return;
    reset();
    setLoading(true);
    try {
      const res = await request<{ success: boolean; data: { text: string } }>('/ai/keywords', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      const text = res.data?.text || '';
      try {
        const arr = JSON.parse(text) as string[];
        setParsedResult({ keywords: arr });
      } catch {
        setResult(text);
      }
    } catch (e: unknown) {
      toast.error((e as Error).message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSuggest() {
    if (!content.trim()) return;
    reset();
    setLoading(true);
    try {
      const res = await request<{ success: boolean; data: { text: string } }>('/ai/suggest', {
        method: 'POST',
        body: JSON.stringify({ content, type: contentType }),
      });
      const text = res.data?.text || '';
      try {
        setParsedResult(JSON.parse(text) as Record<string, unknown>);
      } catch {
        setResult(text);
      }
    } catch (e: unknown) {
      toast.error((e as Error).message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleAltText() {
    if (!imageDescription.trim()) return;
    reset();
    setLoading(true);
    try {
      const res = await request<{ success: boolean; data: { text: string } }>('/ai/alt-text', {
        method: 'POST',
        body: JSON.stringify({ imageDescription }),
      });
      setResult(res.data?.text || 'No response');
    } catch (e: unknown) {
      toast.error((e as Error).message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSummarize() {
    if (!content.trim()) return;
    reset();
    setLoading(true);
    try {
      const res = await request<{ success: boolean; data: { text: string } }>('/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      setResult(res.data?.text || 'No response');
    } catch (e: unknown) {
      toast.error((e as Error).message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  function renderTabContent() {
    switch (tab) {
      case 'generate':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 min-h-[120px] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              >
                {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        );

      case 'seo-meta':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title (optional)</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page title..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your content..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 min-h-[150px] resize-none"
              />
            </div>
            <button
              onClick={handleSEOMeta}
              disabled={!content.trim() || loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate SEO Meta'}
            </button>
          </div>
        );

      case 'keywords':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste content to extract keywords from..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 min-h-[150px] resize-none"
              />
            </div>
            <button
              onClick={handleKeywords}
              disabled={!content.trim() || loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Keywords'}
            </button>
          </div>
        );

      case 'suggest':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              >
                <option value="content">Content</option>
                <option value="blog">Blog Post</option>
                <option value="product">Product</option>
                <option value="landing">Landing Page</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your content for analysis..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 min-h-[150px] resize-none"
              />
            </div>
            <button
              onClick={handleSuggest}
              disabled={!content.trim() || loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Get Suggestions'}
            </button>
          </div>
        );

      case 'alt-text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Image Description</label>
              <textarea
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="Describe the image..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 min-h-[100px] resize-none"
              />
            </div>
            <button
              onClick={handleAltText}
              disabled={!imageDescription.trim() || loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Alt Text'}
            </button>
          </div>
        );

      case 'summarize':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste content to summarize..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 min-h-[200px] resize-none"
              />
            </div>
            <button
              onClick={handleSummarize}
              disabled={!content.trim() || loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Summarizing...' : 'Summarize'}
            </button>
          </div>
        );
    }
  }

  function renderResult() {
    if (!result && !parsedResult) return null;
    if (result) return <ResultBox text={result} label="Result" />;
    if (parsedResult) {
      return (
        <div className="space-y-2 mt-4">
          {Object.entries(parsedResult).map(([key, val]) => (
            <ResultBox
              key={key}
              text={Array.isArray(val) ? (val as string[]).map((v) => `- ${v}`).join('\n') : String(val)}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
            />
          ))}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-orange" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy">Content Tools</h1>
            <p className="text-sm text-text-muted">Content generation and optimization tools</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-silver pb-3">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); reset(); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === id
                  ? 'bg-navy text-white'
                  : 'text-text-muted hover:bg-silver hover:text-navy'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-silver shadow-sm p-6">
          {renderTabContent()}
          {renderResult()}
        </div>
      </div>
    </div>
  );
}
