/**
 * Format a file size in bytes to a human-readable string.
 * @param {number} bytes
 * @returns {string} e.g. "2.4 MB"
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Format a date to a relative string or absolute date.
 * @param {string|Date} date
 * @returns {string} e.g. "2 hours ago" or "Sep 20, 2026"
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Get the status display config for a document status string.
 */
export const getStatusConfig = (status) => {
  const configs = {
    processing: { label: 'Processing', color: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400' },
    completed: { label: 'Ready', color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
    failed: { label: 'Failed', color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' },
  };
  return configs[status] || configs.processing;
};
