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
  const statusText =
    phase !== "setup"
      ? "Battle live."
      : selectedShipName
        ? `Place ${selectedShipName}`
        : "Fleet ready";

  return (
    <div className="glass-light rounded-[1.35rem] p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan/70">Controls</p>
          <p className="mt-1 text-sm text-slate-300">{statusText}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.16em] text-slate-400">
          {phase === "setup" ? "Setup" : "Battle"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <IconButton
          onClick={onRotate}
          tone="accent"
          disabled={phase !== "setup"}
          className="justify-center px-3 py-2 text-xs tracking-[0.08em]"
          size="sm"
        >
          Rotate
        </IconButton>
        <IconButton
          onClick={onRandomize}
          disabled={phase !== "setup"}
          className="justify-center px-3 py-2 text-xs tracking-[0.08em]"
          size="sm"
        >
          Random
        </IconButton>
        <IconButton
          onClick={onClear}
          disabled={phase !== "setup"}
          className="justify-center px-3 py-2 text-xs tracking-[0.08em]"
          size="sm"
        >
          Clear
        </IconButton>
        <IconButton
          onClick={onConfirm}
          tone="success"
          disabled={phase !== "setup" || !canConfirm}
          className="justify-center px-3 py-2 text-xs tracking-[0.08em]"
          size="sm"
        >
          Confirm
        </IconButton>
      </div>
    </div>
  );
}
