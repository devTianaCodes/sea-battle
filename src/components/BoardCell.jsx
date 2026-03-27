import clsx from "clsx";
import { motion } from "framer-motion";

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

function BoardCell({
  cell,
  active,
  isInteractive,
  onFocus,
  onActivate,
  tabIndex,
  ariaLabel,
  coordinateLabel,
  index,
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.003, 0.18) }}
      whileHover={isInteractive ? { scale: 1.04 } : undefined}
      whileTap={isInteractive ? { scale: 0.97 } : undefined}
      onMouseEnter={onFocus}
      onFocus={onFocus}
      onClick={onActivate}
      disabled={!isInteractive}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      title={coordinateLabel}
      className={clsx(
        "group relative aspect-square rounded-[0.9rem] border transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan/70",
        getCellClasses(cell, isInteractive),
        active && "ring-2 ring-cyan/80 ring-offset-2 ring-offset-[#071120]",
        !isInteractive && !cell.isHit && !cell.isMiss && "cursor-default"
      )}
    >
      <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-[#071120]/90 px-2 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-slate-300 shadow-lg group-hover:block">
        {coordinateLabel}
      </span>
      {cell.isMiss ? <span className="absolute inset-0 ripple-dot rounded-[inherit]" /> : null}
      {getCellContents(cell)}
    </motion.button>
  );
}

export default BoardCell;
