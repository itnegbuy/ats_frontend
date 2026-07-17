'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Database, Cloud, Upload, RefreshCw,
  Server, HardDrive, CheckCircle2, AlertTriangle, FileSpreadsheet,
} from 'lucide-react';
import { useDataSource } from '@/lib/data-source';
import { getFallbackStats, seedFallbackData, importExcelData } from '@/lib/fallback-router';
import toast from 'react-hot-toast';

interface FallbackStats {
  products: number;
  categories: number;
  industries: number;
  users: number;
  testimonials: number;
  rfqs: number;
  orders: number;
}

export default function DataSourcePage() {
  const { mode, setMode } = useDataSource();
  const [stats, setStats] = useState<FallbackStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const s = await getFallbackStats();
      setStats(s);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === 'fallback') loadStats();
  }, [mode, loadStats]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedFallbackData();
      await loadStats();
      toast.success('Default fallback data loaded successfully');
    } catch {
      toast.error('Failed to seed data');
    } finally {
      setSeeding(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const XLSX = await import('xlsx');
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName]);

      if (rows.length === 0) {
        toast.error('No data found in file');
        return;
      }

      const result = await importExcelData(rows);
      await loadStats();
      toast.success(`Imported ${result.imported} products (${result.errors} errors)`);
    } catch {
      toast.error('Failed to parse file. Make sure it is a valid Excel file.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDownloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const headers = [
      'partNumber', 'nsn', 'cage', 'description', 'shortDescription',
      'manufacturer', 'category', 'fsg', 'fsc', 'condition',
      'stockStatus', 'quantityAvailable', 'unitPrice', 'currency',
    ];
    const sampleRow: Record<string, string> = {
      partNumber: 'PT6A-66A', nsn: '2840-01-123-4567', cage: '12345',
      description: 'Turbine Engine Assembly', shortDescription: 'PT6A-66A Engine',
      manufacturer: 'Pratt & Whitney', category: 'Turbine Engines',
      fsg: '2840', fsc: '2840', condition: 'New',
      stockStatus: 'In Stock', quantityAvailable: '5', unitPrice: '485000', currency: 'USD',
    };
    const ws = XLSX.utils.json_to_sheet([sampleRow], { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'aeroturbine-products-template.xlsx');
    toast.success('Template downloaded');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          Data Source Control
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Switch between live backend and local fallback data. Fallback uses IndexedDB (Dexie.js) in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setMode('backend')}
          className={`rounded-2xl border p-6 text-left transition-all ${
            mode === 'backend'
              ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30'
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-xl ${mode === 'backend' ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
              <Server className={`w-6 h-6 ${mode === 'backend' ? 'text-emerald-400' : 'text-white/40'}`} />
            </div>
            <div>
              <p className={`text-sm font-semibold ${mode === 'backend' ? 'text-emerald-300' : 'text-white'}`}>
                Backend
              </p>
              <p className="text-xs text-white/40">Express API + PostgreSQL</p>
            </div>
            {mode === 'backend' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
            )}
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            All API requests go to the Express backend server. Requires database connection.
          </p>
        </button>

        <button
          onClick={() => setMode('fallback')}
          className={`rounded-2xl border p-6 text-left transition-all ${
            mode === 'fallback'
              ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-xl ${mode === 'fallback' ? 'bg-amber-500/20' : 'bg-white/10'}`}>
              <HardDrive className={`w-6 h-6 ${mode === 'fallback' ? 'text-amber-400' : 'text-white/40'}`} />
            </div>
            <div>
              <p className={`text-sm font-semibold ${mode === 'fallback' ? 'text-amber-300' : 'text-white'}`}>
                Fallback (Local)
              </p>
              <p className="text-xs text-white/40">IndexedDB — Dexie.js</p>
            </div>
            {mode === 'fallback' && (
              <CheckCircle2 className="w-5 h-5 text-amber-400 ml-auto" />
            )}
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            All data served from browser&apos;s IndexedDB. No backend needed. Upload Excel data or use defaults.
          </p>
        </button>
      </div>

      {mode === 'fallback' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-400" />
              Fallback Data Management
            </h2>

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-white/40">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading stats...
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Products', value: stats.products, color: 'text-blue-400' },
                  { label: 'Categories', value: stats.categories, color: 'text-purple-400' },
                  { label: 'Industries', value: stats.industries, color: 'text-green-400' },
                  { label: 'Users', value: stats.users, color: 'text-rose-400' },
                  { label: 'Testimonials', value: stats.testimonials, color: 'text-yellow-400' },
                  { label: 'RFQs', value: stats.rfqs, color: 'text-orange-400' },
                  { label: 'Orders', value: stats.orders, color: 'text-cyan-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-white/40">{label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-red-400 flex items-center gap-2 mb-6">
                <AlertTriangle className="w-4 h-4" />
                Could not load stats. Seed data first.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
                {seeding ? 'Loading...' : 'Load Default Data'}
              </button>

              <label className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload Excel'}
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Download Template
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-400" />
              Excel Upload Format
            </h2>
            <p className="text-xs text-white/40 mb-3">
              Supported columns in your Excel/CSV file:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
              {[
                'partNumber*', 'description*', 'manufacturer*', 'nsn',
                'cage', 'category', 'fsg', 'fsc',
                'condition', 'stockStatus', 'quantityAvailable', 'unitPrice',
                'currency', 'shortDescription', 'tags',
              ].map((col) => (
                <div key={col} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 font-mono">
                  {col}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/30 mt-3">* Required fields</p>
          </div>
        </div>
      )}
    </div>
  );
}
