function getCellClasses(cell, isInteractive) {
  const recentShotClass = cell.isRecentShot
    ? "after:absolute after:inset-1 after:rounded-[0.7rem] after:border after:border-cyan/55 after:shadow-[0_0_18px_rgba(0,212,255,0.35)] after:content-['']"
    : "";

  if (cell.isHit && cell.isSunkReveal) {
    return `border-coral/70 bg-gradient-to-br from-coral/80 to-orange-400/70 shadow-[0_0_25px_rgba(255,107,107,0.35)] ${recentShotClass}`;
  }

  if (cell.isHit) {
    return `border-coral/70 bg-gradient-to-br from-coral/80 to-pink-400/70 shadow-[0_0_24px_rgba(255,107,107,0.25)] ${recentShotClass}`;
  }

  if (cell.isMiss) {
    return `border-cyan/25 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.22),rgba(0,212,255,0.02)_48%,transparent_64%)] ${recentShotClass}`;
  }

  if (cell.preview === "valid") {
    return `border-cyan/60 bg-cyan/20 ${recentShotClass}`;
  }

  if (cell.preview === "invalid") {
    return `border-coral/50 bg-coral/15 ${recentShotClass}`;
  }

  if (cell.shipId) {
    return `border-white/20 bg-gradient-to-br from-white/14 to-white/8 ${recentShotClass}`;
  }

  return isInteractive
    ? `border-white/10 bg-white/5 hover:border-cyan/40 hover:bg-cyan/10 ${recentShotClass}`
    : `border-white/8 bg-white/[0.03] ${recentShotClass}`;
}

function getCellContents(cell) {
  if (cell.isHit && cell.isSunkReveal) {
    return <span className="text-sm font-semibold text-white">X</span>;
  }

  if (cell.isHit) {
    return <span className="text-sm font-semibold text-white">X</span>;
  }

  if (cell.isMiss) {
    return <span className="text-xs text-cyan-100">o</span>;
  }

  return null;
}

export default function BoardCell({
  cell,
  active,
  isInteractive,
  onFocus,
  onActivate,
  tabIndex,
  ariaLabel,
}) {
  return (
    <button
      type="button"
      onMouseEnter={onFocus}
      onFocus={onFocus}
      onClick={onActivate}
      disabled={!isInteractive}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      className={`relative aspect-square rounded-[0.9rem] border transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan/70 ${
        getCellClasses(cell, isInteractive)
      } ${active ? "ring-2 ring-cyan/80 ring-offset-2 ring-offset-[#071120]" : ""} ${
        !isInteractive && !cell.isHit && !cell.isMiss ? "cursor-default" : ""
      }`}
    >
      {cell.isMiss ? <span className="absolute inset-0 ripple-dot rounded-[inherit]" /> : null}
      {getCellContents(cell)}
    </button>
  );
}
