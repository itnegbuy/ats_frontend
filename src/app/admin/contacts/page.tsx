'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle, RefreshCw, Mail, Trash2 } from 'lucide-react';
import { request } from '@/lib/api-client';
import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Unread', 'Read', 'Replied'] as const;

const STATUS_COLORS: Record<string, string> = {
  Unread:  'bg-red-100 text-red-800',
  Read:    'bg-blue-100 text-blue-800',
  Replied: 'bg-emerald-100 text-emerald-800',
};

const SUBJECT_LABELS: Record<string, string> = {
  general:   'General Inquiry',
  rfq:       'RFQ / Quote Request',
  technical: 'Technical Support',
  quality:   'Quality / Certificate Issue',
  other:     'Other',
};

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  adminNotes?: string;
  repliedBy?: { id: string; fullName: string; email: string } | null;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function ContactDetailModal({
  submission, onClose, onUpdateStatus, onDelete,
}: {
  submission: ContactSubmission;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Contact Details</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</label>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{submission.name}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
              <a href={`mailto:${submission.email}`} className="text-sm font-semibold text-indigo-600 hover:underline mt-0.5 block">
                {submission.email}
              </a>
            </div>
            {submission.phone && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                <a href={`tel:${submission.phone}`} className="text-sm font-semibold text-gray-900 mt-0.5 block">{submission.phone}</a>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</label>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{SUBJECT_LABELS[submission.subject] || submission.subject}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', STATUS_COLORS[submission.status])}>
                {submission.status}
              </span>
              {submission.repliedBy && (
                <span className="text-xs text-gray-400">
                  by {submission.repliedBy.fullName} {submission.repliedAt ? `at ${new Date(submission.repliedAt).toLocaleString()}` : ''}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Message</label>
            <div className="mt-1 p-4 bg-gray-50 rounded-xl text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {submission.message}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</label>
            <p className="text-sm text-gray-600 mt-0.5">{new Date(submission.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button
            onClick={async () => { if (confirm('Delete this submission?')) { setDeleting(true); await onDelete(submission.id); setDeleting(false); } }}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
          <div className="flex items-center gap-2">
            {submission.status !== 'Read' && (
              <button
                onClick={() => onUpdateStatus(submission.id, 'Read')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Mark as Read
              </button>
            )}
            {submission.status !== 'Replied' && (
              <button
                onClick={() => onUpdateStatus(submission.id, 'Replied')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Mark as Replied
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const limit = 15;

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await request<{ success: boolean; data: ContactSubmission[]; pagination: Pagination }>(
        `/admin/contacts?${params.toString()}`
      );
      setSubmissions(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleUpdateStatus = useCallback(async (id: string, status: string) => {
    try {
      await request(`/admin/contacts/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      toast.success(`Marked as ${status}`);
      setSelected(null);
      fetchSubmissions();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  }, [fetchSubmissions]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await request(`/admin/contacts/${id}`, { method: 'DELETE' });
      toast.success('Submission deleted');
      setSelected(null);
      fetchSubmissions();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  }, [fetchSubmissions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-600" />
            Contact Submissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage messages from the contact form.</p>
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
            placeholder="Search by name, email, subject or message..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
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
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No submissions yet</h3>
            <p className="text-sm text-gray-500">Contact form submissions will appear here.</p>
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
                      <span className="text-xs text-gray-400">{SUBJECT_LABELS[sub.subject] || sub.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{sub.name}</span>
                      <span className="text-xs text-gray-400">{sub.email}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{sub.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(sub.createdAt).toLocaleString()}</p>
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
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => {
                const start = Math.max(1, Math.min(page - 2, pagination.totalPages - 4));
                const p = start + i;
                if (p > pagination.totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn('w-7 h-7 rounded-lg text-xs font-medium', p === page ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100')}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                disabled={page >= (pagination?.totalPages || 1)}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <ContactDetailModal
          submission={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
