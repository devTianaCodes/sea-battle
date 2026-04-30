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

function shouldShowCoordinate(cell) {
  return !cell.isHit && !cell.isMiss;
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
      data-state={cellState}
      data-interactive={isInteractive ? "true" : "false"}
      style={{ animationDelay: `${Math.min(index * 12, 180)}ms` }}
      className={clsx(
        "board-cell animate-reveal-cell group focus:outline-none focus:ring-2 focus:ring-cyan/70 focus:ring-inset",
        cell.preview === "invalid" && "border-coral/50 bg-coral/20",
        cell.preview === "valid" && "border-cyan/[0.55] bg-cyan/[0.18]",
        cell.isRecentShot && cell.isHit && "animate-hit",
        cell.isRecentShot && cell.isMiss && "animate-miss",
        cell.isRecentShot &&
          "after:absolute after:inset-1 after:rounded-[inherit] after:border after:border-cyan/40 after:content-['']",
        active && "ring-2 ring-cyan/80 ring-offset-1 ring-offset-[#061f19]",
        !isInteractive && !cell.isHit && !cell.isMiss && "cursor-default"
      )}
    >
      {shouldShowCoordinate(cell) ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1 top-1 opacity-0 transition-opacity duration-150 group-hover:opacity-75 group-focus-visible:opacity-90"
        >
          <span className="board-cell-coordinate">{coordinateLabel}</span>
        </span>
      ) : null}
      {cell.isMiss ? <span className="absolute inset-0 ripple-dot rounded-[inherit]" /> : null}
      <BattleEffects cell={cell} />
      {getCellContents(cell)}
    </motion.button>
  );
}

export default memo(BoardCell);
