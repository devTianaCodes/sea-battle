import IconButton from "./IconButton";

export default function ShipPlacementPanel({
  phase,
  canConfirm,
  onConfirm,
  onRandomize,
  onClear,
  onRotate,
  selectedShipName,
  selectedShipSize,
  orientation,
}) {
  const statusText =
    phase !== "setup"
      ? "Battle live."
      : selectedShipName
        ? `Place ${selectedShipName} · ${selectedShipSize} cells`
        : canConfirm
          ? "All ships placed"
          : "Select a ship to begin";

  return (
    <div className="glass-light min-w-0 w-full max-w-full rounded-[1.1rem] p-3 sm:rounded-[1.3rem] sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-2 sm:mb-2.5">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.14em] text-cyan-100 sm:text-[0.68rem] sm:tracking-[0.16em]">
            Controls
          </p>
          <p className="mt-0.5 text-[0.88rem] text-slate-200 sm:text-[0.98rem]">{statusText}</p>
        </div>
        <IconButton
          onClick={onRotate}
          tone="accent"
          disabled={phase !== "setup"}
          size="sm"
          className="min-h-0 gap-1 px-2.5 py-1.5 text-[0.62rem] tracking-[0.08em] sm:px-3 sm:text-[0.68rem]"
          ariaLabel="Rotate selected ship"
          title="Rotate selected ship"
        >
          {orientation === "horizontal" ? "H" : "V"}
        </IconButton>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        <IconButton
          onClick={onRandomize}
          disabled={phase !== "setup"}
          className="min-h-0 justify-center px-2 py-2 text-[0.68rem] tracking-[0.04em] sm:px-3 sm:text-[0.76rem]"
          size="sm"
        >
          Random
        </IconButton>
        <IconButton
          onClick={onClear}
          disabled={phase !== "setup"}
          className="min-h-0 justify-center px-2 py-2 text-[0.68rem] tracking-[0.04em] sm:px-3 sm:text-[0.76rem]"
          size="sm"
        >
          Clear
        </IconButton>
        <IconButton
          onClick={onConfirm}
          tone="success"
          disabled={phase !== "setup" || !canConfirm}
          className="min-h-0 justify-center px-2 py-2 text-[0.68rem] tracking-[0.04em] sm:px-3 sm:text-[0.76rem]"
          size="sm"
        >
          Confirm
        </IconButton>
      </div>
    </div>
  );
}
