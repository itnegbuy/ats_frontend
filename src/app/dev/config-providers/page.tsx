'use client';
import { useState, useEffect } from 'react';
import { request } from '@/lib/api-client';

const PROVIDER_GROUPS: Record<string, { label: string; providers: string[] }> = {
  storage: { label: 'Cloud Storage', providers: ['cloudinary', 's3', 'r2', 'supabase-storage', 'firebase-storage', 'backblaze', 'ftp'] },
  email: { label: 'Email Providers', providers: ['smtp', 'resend', 'brevo', 'mailgun', 'sendgrid', 'ses'] },
  auth: { label: 'Authentication', providers: ['google-oauth', 'github-oauth', 'microsoft-oauth', 'otp', 'magic-link', '2fa'] },
  search: { label: 'Search Engines', providers: ['algolia', 'typesense', 'elasticsearch', 'meilisearch'] },
  ai: { label: 'LLM Providers', providers: ['openai', 'anthropic', 'gemini', 'deepseek', 'openrouter'] },
  queue: { label: 'Queue & Cron', providers: ['redis', 'bullmq', 'rabbitmq'] },
};

export default function ConfigProvidersPage() {
  const [configs, setConfigs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [editProvider, setEditProvider] = useState<string | null>(null);
  const [editConfig, setEditConfig] = useState<Record<string, string>>({});

  useEffect(() => { loadConfigs(); }, []);

  async function loadConfigs() {
    setLoading(true);
    const res: any = await request('/dev/config-providers');
    if (res.success) setConfigs(res.data);
    setLoading(false);
  }

  async function toggleProvider(provider: string, enabled: boolean) {
    await request(`/dev/config-providers/${provider}/toggle`, { method: 'PATCH', body: JSON.stringify({ enabled }), headers: { 'Content-Type': 'application/json' } });
    loadConfigs();
  }

  async function testProvider(provider: string) {
    const res: any = await request(`/dev/config-providers/${provider}/test`, { method: 'POST' });
    alert(res.message || 'Test completed');
  }

  async function saveConfig(provider: string) {
    await request(`/dev/config-providers/${provider}`, { method: 'PUT', body: JSON.stringify({ config: editConfig, enabled: true }), headers: { 'Content-Type': 'application/json' } });
    setEditProvider(null);
    loadConfigs();
  }

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Service Provider Configuration</h1>
      {Object.entries(PROVIDER_GROUPS).map(([group, { label, providers }]) => (
        <div key={group} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">{label}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => {
              const cfg = configs[provider];
              const enabled = cfg?.enabled ?? false;
              return (
                <div key={provider} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium capitalize">{provider.replace('-', ' ')}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={enabled} onChange={(e) => toggleProvider(provider, e.target.checked)} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {cfg?.tested && (
                    <p className={`text-xs mb-2 ${cfg?.testResult?.includes('success') || cfg?.testResult?.includes('valid') || cfg?.testResult?.includes('present') ? 'text-green-400' : 'text-yellow-400'}`}>
                      {cfg.testResult}
                    </p>
                  )}
                  {editProvider === provider ? (
                    <div className="space-y-2">
                      {Object.entries(editConfig).map(([k, v]) => (
                        <input key={k} className="w-full bg-gray-700 rounded px-2 py-1 text-sm" placeholder={k} value={v} onChange={(e) => setEditConfig({ ...editConfig, [k]: e.target.value })} />
                      ))}
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => saveConfig(provider)} className="px-3 py-1 bg-blue-600 rounded text-sm">Save</button>
                        <button onClick={() => setEditProvider(null)} className="px-3 py-1 bg-gray-600 rounded text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditProvider(provider); setEditConfig(cfg?.config || {}); }} className="px-3 py-1 bg-gray-700 rounded text-sm">Configure</button>
                      <button onClick={() => testProvider(provider)} className="px-3 py-1 bg-green-700 rounded text-sm">Test</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
