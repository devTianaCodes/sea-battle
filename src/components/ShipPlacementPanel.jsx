import IconButton from "./IconButton";

export default function ShipPlacementPanel({
  phase,
  canConfirm,
  onConfirm,
  onRandomize,
  onRotate,
  selectedShipName,
}) {
  return (
    <div className="glass-panel rounded-[2rem] p-5">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Controls</p>
        <h2 className="font-display text-xl text-foam">
          {phase === "setup" ? "Placement Console" : "Battle Console"}
        </h2>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-300">
        {phase !== "setup"
          ? "Track the live intel, watch the enemy rhythm, and restart when you want a fresh tactical puzzle."
          : selectedShipName
          ? `Selected ship: ${selectedShipName}. Move across the grid with the mouse or arrow keys, then press Enter to place.`
          : "All ships are placed. Confirm deployment to begin the match, or click any placed ship to reposition it."}
      </p>
      <div className="flex flex-wrap gap-3">
        <IconButton onClick={onRotate} tone="accent" disabled={phase !== "setup"}>
          Rotate (R)
        </IconButton>
        <IconButton onClick={onRandomize} disabled={phase !== "setup"}>
          Randomize
        </IconButton>
        <IconButton
          onClick={onConfirm}
          tone="success"
          disabled={phase !== "setup" || !canConfirm}
        >
          Confirm Fleet
        </IconButton>
      </div>
    </div>
  );
}
