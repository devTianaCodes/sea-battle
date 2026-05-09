import { useId } from "react";
import FleetCompositionCard from "./FleetCompositionCard";
import IconButton from "./IconButton";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import useDialogA11y from "../hooks/useDialogA11y";

export default function SetupGuideModal({ open, onClose }) {
  useBodyScrollLock(open);
  const titleId = useId();
  const descriptionId = useId();
  const { dialogRef, initialFocusRef } = useDialogA11y(open, onClose);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-[15px] z-[65] flex items-center justify-center rounded-[20px] bg-[#03110e]/94 p-2 backdrop-blur-xl animate-fade-in sm:p-3">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="glass-frosted animate-modal-in flex w-full max-w-md min-w-0 flex-col overflow-hidden rounded-[1.35rem] !bg-[#061f19]/98 p-4 sm:rounded-[1.7rem] sm:p-5"
      >
        <p className="text-[0.62rem] uppercase tracking-[0.16em] text-cyan/70 sm:text-xs sm:tracking-[0.2em]">
          How to play
        </p>
        <h2 id={titleId} className="sr-only">Build 10 ships</h2>
        <div className="mt-3">
          <FleetCompositionCard descriptionId={descriptionId} />
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
