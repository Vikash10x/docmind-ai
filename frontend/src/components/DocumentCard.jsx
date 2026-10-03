import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Trash2, Clock, Layers, Sparkles, AlertTriangle } from 'lucide-react';
import { documentsAPI } from '../services/api';
import { formatFileSize, formatDate, getStatusConfig } from '../utils/formatters';
import toast from 'react-hot-toast';

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
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
      dot: '#059669',
      badge: { background: '#d1fae5', border: '1px solid #a7f3d0', color: '#047857' },
    },
    processing: {
      dot: '#d97706',
      badge: { background: '#fef3c7', border: '1px solid #fde68a', color: '#b45309' },
    },
    failed: {
      dot: '#dc2626',
      badge: { background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c' },
    },
  };

  const s = statusStyles[document.status] || statusStyles.processing;

  return (
    <div
      className="bg-white rounded-xl border border-[#e7e0d3] p-4 flex flex-col justify-between transition-all duration-200 hover:border-amber-600/40 hover:shadow-md"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
    >
      {/* ── Top Header ── */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <h3
                className="text-sm font-semibold text-[#1c1917] truncate leading-tight"
                title={document.originalName}
              >
                {document.originalName}
              </h3>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                {formatFileSize(document.fileSize)}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0"
            style={s.badge}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${document.status === 'processing' ? 'animate-pulse' : ''}`}
              style={{ background: s.dot }}
            />
            {statusConfig.label}
          </div>
        </div>

        {/* ── Metadata Row ── */}
        <div className="flex items-center gap-3 text-[11px] text-stone-500 mb-3 pt-1 border-t border-[#f4f0e6]">
          {document.totalPages > 0 && (
            <span className="flex items-center gap-1 font-medium">
              <Layers size={11} className="text-stone-400" />
              {document.totalPages} pages
            </span>
          )}
          {document.totalChunks > 0 && (
            <span className="flex items-center gap-1 font-medium">
              <Sparkles size={11} className="text-amber-600" />
              {document.totalChunks} vectors
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto font-medium">
            <Clock size={11} className="text-stone-400" />
            {formatDate(document.createdAt)}
          </span>
        </div>

        {/* ── Failure Alert ── */}
        {document.status === 'failed' && document.errorMessage && (
          <div className="flex items-start gap-2 rounded-lg p-2.5 text-xs bg-red-50 border border-red-200 text-red-700 mb-3">
            <AlertTriangle size={13} className="flex-shrink-0 mt-0.5 text-red-600" />
            <span className="text-[11px] leading-snug">{document.errorMessage}</span>
          </div>
        )}
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#f4f0e6]">
        <button
          onClick={handleChat}
          disabled={document.status !== 'completed'}
          className="btn-primary flex-1 text-xs py-2 rounded-lg gap-1.5 font-semibold"
        >
          <MessageSquare size={13} />
          Chat with PDF
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn-danger p-2 rounded-lg text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors"
          title="Delete document"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;

