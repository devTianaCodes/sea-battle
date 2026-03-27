import IconButton from "./IconButton";

export default function ShipPlacementPanel({
  phase,
  canConfirm,
  onConfirm,
  onRandomize,
  onClear,
  onRotate,
  selectedShipName,
}) {
  return (
    <div className="glass-light rounded-[1.5rem] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Action Bar</p>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">
          {phase === "setup" ? "Placement" : "Battle"}
        </div>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-300">
        {phase !== "setup"
          ? "Combat is live. Keep pressure on the enemy grid and use the header controls for pause, sound, and help."
          : selectedShipName
            ? `Place ${selectedShipName}. Use arrow keys to move, R to rotate, and Enter to confirm.`
            : "All ships are placed. Confirm deployment or click any placed ship to reposition it."}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <IconButton onClick={onRotate} tone="accent" disabled={phase !== "setup"} className="justify-center">
          Rotate (R)
        </IconButton>
        <IconButton onClick={onRandomize} disabled={phase !== "setup"} className="justify-center">
          Randomize
        </IconButton>
        <IconButton onClick={onClear} disabled={phase !== "setup"} className="justify-center">
          Clear All
        </IconButton>
        <IconButton
          onClick={onConfirm}
          tone="success"
          disabled={phase !== "setup" || !canConfirm}
          className="justify-center"
        >
          Confirm Fleet
        </IconButton>
      </div>
    </div>
  );
}
