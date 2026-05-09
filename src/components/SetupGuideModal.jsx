import { useId } from "react";
import IconButton from "./IconButton";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import useDialogA11y from "../hooks/useDialogA11y";

const FLEET_ROWS = [
  { count: 1, size: 4 },
  { count: 2, size: 3 },
  { count: 3, size: 2 },
  { count: 4, size: 1 },
];

function MiniShip({ size }) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {Array.from({ length: size }, (_, index) => (
        <span
          key={index}
          className="h-4 w-4 rounded-[0.28rem] border border-cyan/55 bg-cyan/20 shadow-[0_0_10px_rgba(0,212,255,0.2)] sm:h-5 sm:w-5"
        />
      ))}
    </div>
  );
}

function FleetRow({ count, size }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[0.85rem] border border-white/10 bg-white/[0.045] px-3 py-2.5">
      <div className="flex items-center gap-3 text-[0.82rem] font-semibold text-foam sm:text-sm">
        <span>{count} *</span>
        <MiniShip size={size} />
      </div>
      <span className="text-[0.68rem] uppercase tracking-[0.12em] text-cyan-100/70 sm:text-[0.72rem]">
        {size} {size === 1 ? "cell" : "cells"}
      </span>
    </div>
  );
}

export default function SetupGuideModal({ open, onClose }) {
  useBodyScrollLock(open);
  const titleId = useId();
  const descriptionId = useId();
  const { dialogRef, initialFocusRef } = useDialogA11y(open, onClose);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-[15px] z-[65] flex items-center justify-center rounded-[20px] bg-[#03110e]/82 p-2 backdrop-blur-md animate-fade-in sm:p-3">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="glass-frosted animate-modal-in flex w-full max-w-md min-w-0 flex-col overflow-hidden rounded-[1.35rem] p-4 sm:rounded-[1.7rem] sm:p-5"
      >
        <p className="text-[0.62rem] uppercase tracking-[0.16em] text-cyan/70 sm:text-xs sm:tracking-[0.2em]">
          How to play
        </p>
        <h2 id={titleId} className="mt-2 font-display text-[1.35rem] leading-tight text-foam sm:text-2xl">
          Build 10 ships
        </h2>
        <p id={descriptionId} className="mt-2 text-[0.8rem] leading-5 text-slate-300 sm:text-[0.88rem] sm:leading-6">
          Keep one empty square around every ship.
        </p>

        <div className="mt-4 grid gap-2">
          {FLEET_ROWS.map((row) => (
            <FleetRow key={row.size} count={row.count} size={row.size} />
          ))}
        </div>

        <IconButton
          ref={initialFocusRef}
          onClick={onClose}
          tone="success"
          className="mt-4 justify-center px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-sm"
        >
          Start
        </IconButton>
      </div>
    </div>
  );
}
