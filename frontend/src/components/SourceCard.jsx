import { FileText } from 'lucide-react';

const SourceCard = ({ source, index }) => (
  <a
    href={`#source-${index}`}
    title={`${source.fileName} — Page ${source.pageNumber}`}
    className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-left w-auto max-w-full group bg-white border border-[#e7e0d3] hover:border-amber-500/40 hover:bg-[#fef3c7]/40 shadow-2xs"
  >
    <div
      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-amber-50 border border-amber-200 text-amber-700"
    >
      <FileText size={12} />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold text-[#1c1917] truncate max-w-[160px] leading-snug">
        {source.fileName}
      </p>
      <p className="text-[10px] text-stone-500">Page {source.pageNumber}</p>
    </div>
    {source.score !== undefined && (
      <span
        className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 bg-[#fef3c7] text-[#b45309] border border-[#fde68a]"
      >
        {(source.score * 100).toFixed(0)}%
      </span>
    )}
  </a>
);

export default SourceCard;

