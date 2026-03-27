import IconButton from "./IconButton";

function ShortcutRow({ keys, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="flex flex-wrap gap-2">
        {keys.map((key) => (
          <kbd
            key={key}
            className="rounded-lg border border-white/10 bg-[#071120] px-2 py-1 text-xs font-semibold text-cyan-50"
          >
            {key}
          </kbd>
        ))}
      </div>
      <div className="text-sm text-slate-300">{description}</div>
    </div>
  );
}

export default function PauseModal({ open, onResume, onOpenInstructions, onMainMenu }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[57] flex items-center justify-center bg-[#020817]/80 px-4 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Paused</p>
        <h2 className="mt-3 font-display text-4xl text-foam">Battle on hold</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
          Resume when you are ready, open the instructions for a quick refresher, or return to the
          main menu without changing your saved archive.
        </p>

        <div className="mt-6 grid gap-3">
          <ShortcutRow keys={["P"]} description="Pause or resume the current session" />
          <ShortcutRow keys={["M"]} description="Toggle sound effects" />
          <ShortcutRow keys={["?"]} description="Open instructions and controls" />
          <ShortcutRow keys={["R"]} description="Rotate ship during setup" />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <IconButton onClick={onResume} tone="success">
            Resume
          </IconButton>
          <IconButton onClick={onOpenInstructions} tone="accent">
            Instructions
          </IconButton>
          <IconButton onClick={onMainMenu} tone="warm">
            Main Menu
          </IconButton>
        </div>
      </div>
    </div>
  );
}
