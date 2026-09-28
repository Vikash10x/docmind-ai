import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Trash2, Clock, Layers, Sparkles, AlertTriangle } from 'lucide-react';
import { documentsAPI } from '../services/api';
import { formatFileSize, formatDate, getStatusConfig } from '../utils/formatters';
import toast from 'react-hot-toast';

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [hovering, setHovering] = useState(false);
  const statusConfig = getStatusConfig(document.status);

  const handleChat = () => {
    if (document.status !== 'completed') {
      toast.error('Document is still processing. Please wait.');
      return;
    }
    navigate(`/chat/${document._id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${document.originalName}"? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      await documentsAPI.delete(document._id);
      toast.success('Document deleted.');
      onDelete?.(document._id);
    } catch {
      toast.error('Failed to delete document.');
    } finally {
      setDeleting(false);
    }
  };

  const statusStyles = {
    completed: {
      dot: '#34d399',
      badge: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#6ee7b7' },
    },
    processing: {
      dot: '#fbbf24',
      badge: { background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fde68a' },
    },
    failed: {
      dot: '#f87171',
      badge: { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5' },
    },
  };

  const s = statusStyles[document.status] || statusStyles.processing;

  return (
    <div
      className="relative rounded-2xl p-px overflow-hidden animate-fade-in transition-all duration-300 cursor-default"
      style={{
        background: hovering
          ? 'linear-gradient(135deg, rgba(139,92,246,0.4) 0%, rgba(79,70,229,0.2) 50%, rgba(255,255,255,0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
        transform: hovering ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovering
          ? '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.2)'
          : '0 4px 24px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="rounded-2xl p-4 flex flex-col gap-3 h-full"
        style={{ background: 'rgba(11,11,18,0.95)', backdropFilter: 'blur(12px)' }}
      >
        {/* ── Header ── */}
        <div className="flex items-start gap-3">
          {/* File Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              background: hovering
                ? 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(79,70,229,0.15) 100%)'
                : 'rgba(139,92,246,0.1)',
              border: hovering ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(139,92,246,0.18)',
              boxShadow: hovering ? '0 0 12px rgba(139,92,246,0.2)' : 'none',
            }}
          >
            <FileText size={20} className="text-violet-400" />
          </div>

          {/* Title + size */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h3
              className="text-sm font-semibold text-zinc-100 truncate leading-snug"
              title={document.originalName}
            >
              {document.originalName}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">{formatFileSize(document.fileSize)}</p>
          </div>

          {/* Status badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold flex-shrink-0"
            style={s.badge}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${document.status === 'processing' ? 'animate-pulse' : ''}`}
              style={{ background: s.dot, boxShadow: `0 0 4px ${s.dot}` }}
            />
            {statusConfig.label}
          </div>
        </div>

        {/* ── Meta stats ── */}
        <div
          className="flex items-center gap-3 text-[11px] text-zinc-500 px-1"
        >
          {document.totalPages > 0 && (
            <span className="flex items-center gap-1">
              <Layers size={10} className="text-zinc-600" />
              {document.totalPages} pages
            </span>
          )}
          {document.totalChunks > 0 && (
            <span className="flex items-center gap-1">
              <Sparkles size={10} className="text-zinc-600" />
              {document.totalChunks} chunks
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Clock size={10} className="text-zinc-600" />
            {formatDate(document.createdAt)}
          </span>
        </div>

        {/* ── Error ── */}
        {document.status === 'failed' && document.errorMessage && (
          <div
            className="flex items-start gap-2 rounded-xl p-2.5 text-xs"
            style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5' }}
          >
            <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
            {document.errorMessage}
          </div>
        )}

        {/* ── Divider ── */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

        {/* ── Actions ── */}
        <div className="flex gap-2">
          <button
            onClick={handleChat}
            disabled={document.status !== 'completed'}
            className="btn-primary flex-1 text-xs py-2.5 rounded-xl"
          >
            <MessageSquare size={13} />
            Chat with PDF
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-danger px-3 py-2.5 rounded-xl"
            title="Delete document"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
