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
    <div className="glass-light min-w-0 w-full max-w-full rounded-[1.1rem] p-3 sm:rounded-[1.3rem] sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-2 sm:mb-2.5">
        <div>
          <p className="text-[0.58rem] uppercase tracking-[0.16em] text-cyan/70 sm:text-[0.64rem] sm:tracking-[0.18em]">
            Controls
          </p>
          <p className="mt-0.5 text-[0.84rem] text-slate-300 sm:text-[0.95rem]">{statusText}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[0.54rem] uppercase tracking-[0.1em] text-slate-400 sm:px-2.5 sm:text-[0.58rem] sm:tracking-[0.12em]">
          {phase === "setup" ? "Setup" : "Battle"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        <IconButton
          onClick={onRotate}
          tone="accent"
          disabled={phase !== "setup"}
          className="min-h-0 justify-center px-2.5 py-2 text-[0.72rem] tracking-[0.03em] sm:px-3 sm:text-[0.78rem] sm:tracking-[0.04em]"
          size="sm"
        >
          Rotate
        </IconButton>
        <IconButton
          onClick={onRandomize}
          disabled={phase !== "setup"}
          className="min-h-0 justify-center px-2.5 py-2 text-[0.72rem] tracking-[0.03em] sm:px-3 sm:text-[0.78rem] sm:tracking-[0.04em]"
          size="sm"
        >
          Random
        </IconButton>
        <IconButton
          onClick={onClear}
          disabled={phase !== "setup"}
          className="min-h-0 justify-center px-2.5 py-2 text-[0.72rem] tracking-[0.03em] sm:px-3 sm:text-[0.78rem] sm:tracking-[0.04em]"
          size="sm"
        >
          Clear
        </IconButton>
        <IconButton
          onClick={onConfirm}
          tone="success"
          disabled={phase !== "setup" || !canConfirm}
          className="min-h-0 justify-center px-2.5 py-2 text-[0.72rem] tracking-[0.03em] sm:px-3 sm:text-[0.78rem] sm:tracking-[0.04em]"
          size="sm"
        >
          Confirm
        </IconButton>
      </div>
    </div>
  );
}
