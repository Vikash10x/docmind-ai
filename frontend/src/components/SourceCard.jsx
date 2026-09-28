import { FileText } from 'lucide-react';

const SourceCard = ({ source, index }) => (
  <a
    href={`#source-${index}`}
    title={`${source.fileName} — Page ${source.pageNumber}`}
    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 text-left w-auto max-w-full group"
    style={{
      background: 'rgba(139,92,246,0.06)',
      border: '1px solid rgba(139,92,246,0.15)',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'rgba(139,92,246,0.12)';
      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(109,40,217,0.2)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'rgba(139,92,246,0.06)';
      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)';
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = '';
    }}
  >
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}
    >
      <FileText size={12} className="text-violet-400" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold text-zinc-300 truncate max-w-[160px] leading-snug">
        {source.fileName}
      </p>
      <p className="text-[10px] text-zinc-600 mt-0.5">Page {source.pageNumber}</p>
    </div>
    {source.score !== undefined && (
      <span
        className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
        style={{ background: 'rgba(139,92,246,0.12)', color: '#c4b5fd' }}
      >
        {(source.score * 100).toFixed(0)}%
      </span>
    )}
  </a>
);

export default SourceCard;
