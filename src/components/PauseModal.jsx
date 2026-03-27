import { useId } from "react";
import IconButton from "./IconButton";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import useDialogA11y from "../hooks/useDialogA11y";

function ShortcutRow({ keys, description }) {
  return (
    <div className="flex flex-col items-start justify-between gap-2 rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:rounded-2xl sm:px-4">
      <div className="flex flex-wrap gap-2">
        {keys.map((key) => (
          <kbd
            key={key}
            className="rounded-lg border border-white/10 bg-[#071120] px-2 py-1 text-[0.68rem] font-semibold text-cyan-50 sm:text-xs"
          >
            {key}
          </kbd>
        ))}
      </div>
      <div className="text-[0.8rem] text-slate-300 sm:text-sm">{description}</div>
    </div>
  );
}

export default function PauseModal({ open, onResume, onOpenInstructions, onMainMenu }) {
  useBodyScrollLock(open);
  const titleId = useId();
  const descriptionId = useId();
  const { dialogRef, initialFocusRef } = useDialogA11y(open, onResume);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-[15px] z-[57] flex items-center justify-center rounded-[20px] bg-[#020817]/80 p-2 backdrop-blur-md animate-fade-in sm:p-3">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="glass-frosted flex max-h-full w-full max-w-2xl flex-col overflow-y-auto rounded-[1.35rem] p-3 sm:rounded-[2rem] sm:p-8"
      >
        <p className="text-[0.62rem] uppercase tracking-[0.18em] text-cyan/70 sm:text-xs sm:tracking-[0.28em]">Paused</p>
        <h2 id={titleId} className="mt-2 font-display text-[1.6rem] text-foam sm:mt-3 sm:text-4xl">Battle on hold</h2>
        <p id={descriptionId} className="mt-2 max-w-xl text-[0.82rem] leading-6 text-slate-300 sm:mt-3 sm:text-sm sm:leading-7">
          Resume when you are ready, open the instructions for a quick refresher, or return to the
          main menu without changing your saved archive.
        </p>

        <div className="mt-4 grid gap-2 sm:mt-6 sm:gap-3">
          <ShortcutRow keys={["P"]} description="Pause or resume the current session" />
          <ShortcutRow keys={["M"]} description="Toggle sound effects" />
          <ShortcutRow keys={["?"]} description="Open instructions and controls" />
          <ShortcutRow keys={["R"]} description="Rotate ship during setup" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
          <IconButton ref={initialFocusRef} onClick={onResume} tone="success" className="px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-sm">
            Resume
          </IconButton>
          <IconButton onClick={onOpenInstructions} tone="accent" className="px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-sm">
            Instructions
          </IconButton>
          <IconButton onClick={onMainMenu} tone="warm" className="px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-sm">
            Main Menu
          </IconButton>
        </div>
      </div>
    </div>
  );
}
