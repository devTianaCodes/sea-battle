import { useId } from "react";
import IconButton from "./IconButton";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import useDialogA11y from "../hooks/useDialogA11y";

function TipCard({ title, body }) {
  return (
    <div className="min-w-0 rounded-[1rem] border border-white/10 bg-white/[0.05] px-3 py-3 sm:rounded-3xl sm:px-4 sm:py-4">
      <div className="text-[0.82rem] font-medium text-foam sm:text-sm">{title}</div>
      <div className="mt-1 text-[0.76rem] leading-5 text-slate-300 sm:mt-1.5 sm:text-[0.82rem] sm:leading-6">{body}</div>
    </div>
  );
}

export default function OnboardingModal({ open, onClose }) {
  useBodyScrollLock(open);
  const titleId = useId();
  const descriptionId = useId();
  const { dialogRef, initialFocusRef } = useDialogA11y(open, onClose);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-[15px] z-[60] flex items-center justify-center rounded-[20px] bg-[#020817]/80 p-2 backdrop-blur-md animate-fade-in sm:p-3">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="glass-frosted animate-modal-in flex w-full max-w-2xl min-w-0 flex-col overflow-hidden rounded-[1.35rem] p-3 sm:rounded-[2rem] sm:p-6"
      >
        <p className="text-[0.62rem] uppercase tracking-[0.16em] text-cyan/70 sm:text-xs sm:tracking-[0.22em]">Welcome Aboard</p>
        <h2 id={titleId} className="mt-2 text-balance font-display text-[1.3rem] leading-tight text-foam sm:mt-3 sm:text-[2.4rem]">
          Three rules. Start fast.
        </h2>
        <p id={descriptionId} className="mt-2 max-w-xl text-[0.8rem] leading-5 text-slate-300 sm:mt-3 sm:text-[0.88rem] sm:leading-6">
          Place your fleet, fire one shot per turn, and sink every ship before yours goes under.
        </p>

        <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
          <TipCard
            title="Deploy"
            body="Pick a ship, rotate with R, then place it on your grid."
          />
          <TipCard
            title="Attack"
            body="Use the target grid to fire. Hits narrow the next choice."
          />
          <TipCard
            title="Controls"
            body="Arrow keys move focus. Enter confirms. Mobile keeps the active board first."
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
          <IconButton ref={initialFocusRef} onClick={onClose} tone="success" className="px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-sm">
            Start Battle
          </IconButton>
        </div>
      </div>
    </div>
  );
}
