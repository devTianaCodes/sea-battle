export default function TurnBanner({ visible, label }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-40 -translate-x-1/2 animate-banner-in">
      <div className="glass-panel rounded-full px-5 py-3 text-sm font-medium tracking-[0.3em] text-cyan-100 shadow-glow">
        {label}
      </div>
    </div>
  );
}
