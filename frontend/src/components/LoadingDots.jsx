// Animated typing indicator — three glowing pulsing dots
const LoadingDots = () => (
  <div className="flex items-center gap-1.5 py-1 px-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
          boxShadow: '0 0 6px rgba(139,92,246,0.6)',
          animation: `pulseDot 1.4s ease-in-out ${i * 0.18}s infinite`,
        }}
      />
    ))}
  </div>
);

export default LoadingDots;
