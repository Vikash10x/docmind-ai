// Premium skeleton with shimmer animation
const SkeletonCard = () => (
  <div
    className="relative rounded-2xl p-4 flex flex-col gap-3 overflow-hidden"
    style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    {/* Shimmer overlay */}
    <div
      className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite]"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
      }}
    />

    {/* Header */}
    <div className="flex items-start gap-3">
      <div
        className="w-11 h-11 rounded-xl flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3.5 rounded-lg w-3/4" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="h-2.5 rounded-lg w-1/3" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>
      <div className="h-6 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
    </div>

    {/* Meta row */}
    <div className="flex gap-3 px-1">
      <div className="h-2.5 rounded-lg w-16" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="h-2.5 rounded-lg w-20" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="h-2.5 rounded-lg w-16 ml-auto" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>

    {/* Divider */}
    <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }} />

    {/* Button */}
    <div className="h-9 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }} />
  </div>
);

export default SkeletonCard;
