import { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2, CloudUpload, Sparkles } from 'lucide-react';
import { documentsAPI } from '../services/api';
import { formatFileSize } from '../utils/formatters';
import toast from 'react-hot-toast';

const MAX_SIZE_MB = 10;

const UploadZone = ({ onUploadComplete }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (f) => {
    if (!f) return 'No file selected.';
    if (f.type !== 'application/pdf') return 'Only PDF files are allowed.';
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File size exceeds ${MAX_SIZE_MB} MB limit.`;
    return null;
  };

  const handleFile = useCallback((f) => {
    const err = validateFile(f);
    if (err) { setErrorMsg(err); toast.error(err); return; }
    setFile(f); setErrorMsg(''); setUploadState('idle');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploadState('uploading'); setUploadProgress(0);
      const { data } = await documentsAPI.upload(formData, (progressEvent) => {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(pct);
        if (pct === 100) setUploadState('processing');
      });
      setUploadState('success');
      toast.success('Document uploaded! Processing in background...');
      onUploadComplete?.(data.document);
      setTimeout(() => { setFile(null); setUploadState('idle'); setUploadProgress(0); }, 3000);
    } catch (err) {
      const msg = err.response?.data?.error || 'Upload failed. Please try again.';
      setUploadState('error'); setErrorMsg(msg); toast.error(msg);
    }
  };

  const reset = () => { setFile(null); setUploadState('idle'); setErrorMsg(''); setUploadProgress(0); };

  return (
    <div className="w-full">
      {!file ? (
        <label
          htmlFor="pdf-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="flex flex-col items-center justify-center gap-5 w-full cursor-pointer rounded-2xl transition-all duration-300 relative overflow-hidden"
          style={{
            minHeight: '200px',
            background: dragging
              ? 'rgba(139,92,246,0.08)'
              : 'rgba(255,255,255,0.02)',
            border: dragging
              ? '2px dashed rgba(139,92,246,0.6)'
              : '2px dashed rgba(255,255,255,0.08)',
            boxShadow: dragging ? '0 0 40px rgba(139,92,246,0.1), inset 0 0 40px rgba(139,92,246,0.03)' : 'none',
          }}
        >
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Upload icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300"
              style={{
                background: dragging
                  ? 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(79,70,229,0.2) 100%)'
                  : 'rgba(255,255,255,0.04)',
                border: dragging
                  ? '1px solid rgba(139,92,246,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow: dragging ? '0 0 20px rgba(139,92,246,0.25)' : 'none',
                transform: dragging ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <CloudUpload
                size={28}
                style={{ color: dragging ? '#a78bfa' : 'rgb(113,113,122)' }}
                className="transition-colors duration-300"
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-200">
                {dragging ? 'Release to upload' : (
                  <>Drop your PDF here or{' '}
                    <span style={{ color: '#a78bfa' }}>browse files</span>
                  </>
                )}
              </p>
              <p className="text-xs text-zinc-600 mt-1.5">
                PDF only · Max {MAX_SIZE_MB} MB
              </p>
            </div>

            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
              style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: '#c4b5fd' }}
            >
              <Sparkles size={10} />
              AI-powered extraction & indexing
            </div>
          </div>

          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </label>
      ) : (
        <div
          className="rounded-2xl overflow-hidden animate-scale-in"
          style={{
            background: 'rgba(10,10,18,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Progress bar at top */}
          {(uploadState === 'uploading' || uploadState === 'processing') && (
            <div
              className="h-0.5 transition-all duration-300"
              style={{
                width: `${uploadProgress}%`,
                background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                boxShadow: '0 0 8px rgba(139,92,246,0.6)',
              }}
            />
          )}

          <div className="p-5 space-y-4">
            {/* File info */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                <FileText size={22} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-100 truncate">{file.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{formatFileSize(file.size)}</p>
              </div>
              {uploadState === 'idle' && (
                <button
                  onClick={reset}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Upload progress */}
            {uploadState === 'uploading' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={11} className="animate-spin" />
                    Uploading...
                  </span>
                  <span className="font-semibold text-violet-400">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                      background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                      boxShadow: '0 0 8px rgba(139,92,246,0.5)',
                    }}
                  />
                </div>
              </div>
            )}

            {uploadState === 'processing' && (
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
                style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.15)', color: '#fde68a' }}
              >
                <Loader2 size={14} className="animate-spin flex-shrink-0" />
                <span>Processing PDF & generating embeddings...</span>
              </div>
            )}

            {uploadState === 'success' && (
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
                style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)', color: '#6ee7b7' }}
              >
                <CheckCircle size={14} className="flex-shrink-0" />
                Upload complete! Processing continues in the background.
              </div>
            )}

            {uploadState === 'error' && (
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5' }}
              >
                <AlertCircle size={14} className="flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Action buttons */}
            {(uploadState === 'idle' || uploadState === 'error') && (
              <div className="flex gap-2 pt-1">
                <button onClick={handleUpload} className="btn-primary flex-1 py-2.5">
                  <Upload size={14} />
                  Upload PDF
                </button>
                <button onClick={reset} className="btn-secondary px-4 py-2.5">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
