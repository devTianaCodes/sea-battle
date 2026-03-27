import clsx from "clsx";
import { motion } from "framer-motion";
import { memo } from "react";
import BattleEffects from "./BattleEffects";

function getCellState(cell) {
  if (cell.isHit && cell.isSunkReveal) {
    return "sunk";
  }

  if (cell.isHit) {
    return "hit";
  }

  if (cell.isMiss) {
    return "miss";
  }

  if (cell.preview === "valid") {
    return "ship";
  }

  if (cell.preview === "invalid") {
    return "invalid";
  }

  if (cell.shipId) {
    return "ship";
  }

  return "empty";
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
  const cellState = getCellState(cell);

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
      data-state={cellState}
      data-interactive={isInteractive ? "true" : "false"}
      className={clsx(
        "board-cell group focus:outline-none focus:ring-2 focus:ring-cyan/70 focus:ring-inset",
        cell.preview === "invalid" && "border-coral/50 bg-coral/20",
        cell.preview === "valid" && "border-cyan/[0.55] bg-cyan/[0.18]",
        cell.isRecentShot &&
          "after:absolute after:inset-1 after:rounded-[inherit] after:border after:border-cyan/40 after:content-['']",
        active && "ring-2 ring-cyan/80 ring-offset-1 ring-offset-[#071120]",
        !isInteractive && !cell.isHit && !cell.isMiss && "cursor-default"
      )}
    >
      <span className="pointer-events-none absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 rounded-full border border-white/10 bg-[#071120]/92 px-2 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-slate-300 shadow-lg group-hover:block group-focus-visible:block">
        {coordinateLabel}
      </span>
      {cell.isMiss ? <span className="absolute inset-0 ripple-dot rounded-[inherit]" /> : null}
      <BattleEffects cell={cell} />
      {getCellContents(cell)}
    </motion.button>
  );
}

export default memo(BoardCell);
