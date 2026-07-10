'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, RefreshCw, Trash2, Mail, Users, CheckCircle, XCircle } from 'lucide-react';
import { request } from '@/lib/api-client';
import Skeleton from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subsRes, statsRes] = await Promise.all([
        request<{ success: boolean; data: Subscriber[] }>('/admin/newsletter'),
        request<{ success: boolean; data: Stats }>('/admin/newsletter/stats'),
      ]);
      setSubscribers(subsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Delete this subscriber?')) return;
    try {
      await request(`/admin/newsletter/${id}`, { method: 'DELETE' });
      toast.success('Subscriber deleted');
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  }, [fetchData]);

  const filtered = subscribers.filter((s) =>
    search ? s.email.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-600" />
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage email subscribers.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                <div className="text-xs text-gray-500">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.inactive}</div>
                <div className="text-xs text-gray-500">Inactive</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No subscribers yet</h3>
            <p className="text-sm text-gray-500">Newsletter subscribers will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900">{sub.email}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sub.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                        {sub.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-[10px] text-gray-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
