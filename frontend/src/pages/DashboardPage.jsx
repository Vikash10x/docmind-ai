import { useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, Upload, RefreshCw, Inbox, TrendingUp, CheckCircle2, Loader, Search, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import UploadZone from '../components/UploadZone';
import DocumentCard from '../components/DocumentCard';
import SkeletonCard from '../components/SkeletonCard';
import { documentsAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'processing' | 'failed'

  const fetchDocuments = useCallback(async (silent = false) => {
    try {
      setError('');
      if (!silent) setRefreshing(true);
      const { data } = await documentsAPI.getAll();
      setDocuments(data.documents || []);
    } catch {
      setError('Failed to load documents. Please refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(() => {
      setDocuments((prev) => {
        const hasProcessing = prev.some((d) => d.status === 'processing');
        if (hasProcessing) fetchDocuments(true);
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchDocuments]);

  const handleUploadComplete = (newDoc) => {
    setDocuments((prev) => [{ ...newDoc, status: 'processing' }, ...prev]);
    setShowUpload(false);
    fetchDocuments(true);
  };

  const handleDocumentDelete = (deletedId) => {
    setDocuments((prev) => prev.filter((d) => d._id !== deletedId));
  };

  const completedCount = documents.filter((d) => d.status === 'completed').length;
  const processingCount = documents.filter((d) => d.status === 'processing').length;

  const stats = [
    {
      label: 'Total Documents',
      value: documents.length,
      icon: FileText,
      iconColor: '#a78bfa',
      iconBg: 'rgba(139,92,246,0.12)',
      iconBorder: 'rgba(139,92,246,0.2)',
      accent: '#7c3aed',
      description: 'All uploaded PDFs',
    },
    {
      label: 'Ready to Chat',
      value: completedCount,
      icon: CheckCircle2,
      iconColor: '#34d399',
      iconBg: 'rgba(52,211,153,0.1)',
      iconBorder: 'rgba(52,211,153,0.18)',
      accent: '#10b981',
      description: 'Processed & indexed',
    },
    {
      label: 'Processing',
      value: processingCount,
      icon: Loader,
      iconColor: '#fbbf24',
      iconBg: 'rgba(251,191,36,0.1)',
      iconBorder: 'rgba(251,191,36,0.18)',
      accent: '#f59e0b',
      description: 'Building embeddings',
      spinning: processingCount > 0,
    },
  ];

  const timeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = (doc.originalName || '').toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [documents, searchQuery, statusFilter]);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #07070e 0%, #06060a 60%, #09060f 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.08) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        {/* ── Welcome Header ── */}
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <TrendingUp size={11} />
              {timeOfDay()}
            </p>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {user?.name?.split(' ')[0]}{' '}
              <span className="animate-float inline-block">👋</span>
            </h1>
            <p className="text-zinc-500 mt-1.5 text-sm">
              Upload PDFs and have intelligent conversations with your documents.
            </p>
          </div>

          <button
            onClick={() => setShowUpload(!showUpload)}
            className="btn-primary text-sm py-2.5 px-5 rounded-xl"
          >
            <Upload size={15} />
            {showUpload ? 'Hide Upload' : 'New Upload'}
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map(({ label, value, icon: Icon, iconColor, iconBg, iconBorder, accent, description, spinning }) => (
            <div
              key={label}
              className="relative rounded-2xl p-px overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${accent}22 0%, rgba(255,255,255,0.05) 100%)`,
              }}
            >
              <div
                className="rounded-2xl px-5 py-4 flex items-center gap-4"
                style={{ background: 'rgba(10,10,16,0.95)' }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
                >
                  <Icon
                    size={22}
                    style={{ color: iconColor }}
                    className={spinning ? 'animate-spin-slow' : ''}
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white leading-none">{value}</p>
                  <p className="text-xs font-semibold text-zinc-300 mt-1">{label}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Upload Zone ── */}
        {(showUpload || documents.length === 0) && (
          <div className="mb-10 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-3">
                Upload Document
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <UploadZone onUploadComplete={handleUploadComplete} />
          </div>
        )}

        {/* ── Documents Section ── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-zinc-200 tracking-tight">Your Documents</h2>
              {documents.length > 0 && (
                <div
                  className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}
                >
                  {filteredDocuments.length} of {documents.length}
                </div>
              )}
            </div>

            {/* Search & Refresh bar */}
            {documents.length > 0 && (
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                {/* Search input */}
                <div className="relative flex-1 sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter tabs */}
                <div className="flex rounded-xl p-1 bg-white/[0.03] border border-white/[0.06] text-xs">
                  {['all', 'completed', 'processing'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors capitalize text-[11px] ${
                        statusFilter === st
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {st === 'completed' ? 'Ready' : st}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => fetchDocuments()}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            )}
          </div>

          {error && (
            <div
              className="rounded-xl p-4 text-sm text-red-400 mb-4 flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 animate-float"
                style={{
                  background: 'rgba(139,92,246,0.08)',
                  border: '1px solid rgba(139,92,246,0.15)',
                  boxShadow: '0 0 40px rgba(139,92,246,0.08)',
                }}
              >
                <Inbox size={36} className="text-zinc-600" />
              </div>
              <h3 className="text-zinc-300 font-semibold text-lg mb-2">No documents yet</h3>
              <p className="text-zinc-600 text-sm max-w-xs leading-relaxed">
                Upload your first PDF to get started. We'll process and index it for intelligent Q&A.
              </p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 bg-white/[0.03] border border-white/[0.06]">
                <Search size={22} className="text-zinc-600" />
              </div>
              <h4 className="text-zinc-300 font-medium text-sm mb-1">No matching documents</h4>
              <p className="text-zinc-600 text-xs mb-4">
                No documents match "{searchQuery}" with filter "{statusFilter}".
              </p>
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                className="text-xs text-violet-400 hover:underline font-semibold"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  document={doc}
                  onDelete={handleDocumentDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
