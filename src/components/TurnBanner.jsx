export default function TurnBanner({ visible, label }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-1/2 top-5 z-40 -translate-x-1/2 animate-banner-in">
      <div className="glass-light glass-glow-cyan banner-sheen flex items-center gap-2 rounded-full px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-cyan-100">
        <span className="thinking-dot" />
        <span className="thinking-dot" />
        <span className="thinking-dot" />
        {label}
      </div>
    </div>
  );
}
