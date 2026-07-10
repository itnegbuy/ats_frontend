'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Download, RefreshCw, Package } from 'lucide-react';
import { request } from '@/lib/api-client';
import type { InventorySubmission } from '@/types';
import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  Pending:    'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Complete:   'bg-emerald-100 text-emerald-800',
  Rejected:   'bg-red-100 text-red-800',
};

const STATUS_ACTIONS = ['Processing', 'Complete', 'Rejected'] as const;

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function DetailModal({
  submission, onClose, onUpdate,
}: {
  submission: InventorySubmission;
  onClose: () => void;
  onUpdate: (id: string, status: string, notes?: string) => Promise<void>;
}) {
  const [newStatus, setNewStatus] = useState<string>(submission.status);
  const [notes, setNotes] = useState(submission.notes || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Inventory Submission</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <Eye className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Company</label>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{submission.companyName}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{submission.contactEmail}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">File</label>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{submission.fileName}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Parts Count</label>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{submission.partCount ?? 'N/A'}</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
            <span className={cn('ml-2 text-xs font-semibold px-2.5 py-1 rounded-full', STATUS_COLORS[submission.status])}>
              {submission.status}
            </span>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Update Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value="Pending">Pending</option>
              {STATUS_ACTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Admin Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
              placeholder="Add internal notes..."
            />
          </div>
          <p className="text-xs text-gray-400">Submitted: {new Date(submission.submittedAt).toLocaleString()}</p>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
          <button
            onClick={async () => { await onUpdate(submission.id, newStatus, notes); onClose(); }}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminInventoryPage() {
  const [submissions, setSubmissions] = useState<InventorySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<InventorySubmission | null>(null);
  const limit = 15;

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await request<{ success: boolean; data: InventorySubmission[]; pagination: Pagination }>(
        `/admin/inventory?${params.toString()}`
      );
      setSubmissions(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleUpdate = useCallback(async (id: string, status: string, notes?: string) => {
    try {
      await request(`/inventory/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      });
      toast.success('Submission updated');
      fetchSubmissions();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    }
  }, [fetchSubmissions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            Inventory Submissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage parts inventory submissions from suppliers.</p>
        </div>
        <button onClick={fetchSubmissions} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by company or email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Complete">Complete</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No submissions yet</h3>
            <p className="text-sm text-gray-500">Inventory submissions will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase', STATUS_COLORS[sub.status])}>
                        {sub.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{sub.companyName}</span>
                      <span className="text-xs text-gray-400">{sub.contactEmail}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      File: {sub.fileName} &middot; Parts: {sub.partCount ?? 'N/A'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(sub.submittedAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => setSelected(sub)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors flex-shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => {
                const start = Math.max(1, Math.min(page - 2, pagination.totalPages - 4));
                const p = start + i;
                if (p > pagination.totalPages) return null;
                return (
                  <button key={p} onClick={() => setPage(p)} className={cn('w-7 h-7 rounded-lg text-xs font-medium', p === page ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100')}>
                    {p}
                  </button>
                );
              })}
              <button disabled={page >= (pagination?.totalPages || 1)} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <DetailModal submission={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />
      )}
    </div>
  );
}
