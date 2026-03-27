import IconButton from "./IconButton";

function StatChip({ label, value, accent = "text-slate-200" }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
      <span className="text-[0.54rem] uppercase tracking-[0.12em] text-slate-500">{label}</span>
      <span className={`ml-1.5 text-[0.74rem] font-medium ${accent}`}>{value}</span>
    </div>
  );
}

export default function BattleActionBar({
  latestEvent,
  playerAccuracy,
  opponentAccuracy,
  shipsRemaining,
  currentTurnLabel,
  onPause,
  onOpenGuide,
  onRestart,
}) {
  return (
    <footer
      aria-label="Battle controls and latest action"
      className="glass-light viewport-footer animate-footer-rise rounded-[1rem] border border-white/10 px-2.5 py-2 sm:rounded-[1.2rem] sm:px-3 sm:py-2.5"
    >
      <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[0.58rem] uppercase tracking-[0.14em] text-cyan/70">Action Bar</span>
            <span className="rounded-full border border-cyan/15 bg-cyan/[0.06] px-2 py-0.5 text-[0.54rem] uppercase tracking-[0.12em] text-cyan-100">
              {currentTurnLabel}
            </span>
          </div>
          <p
            className="mt-1 truncate text-[0.78rem] leading-5 text-slate-300 sm:text-[0.84rem]"
            role="status"
            aria-live="polite"
          >
            {latestEvent}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <StatChip label="Your Acc" value={`${playerAccuracy}%`} accent="text-cyan-100" />
          <StatChip label="Enemy Acc" value={`${opponentAccuracy}%`} accent="text-coral-100" />
          <StatChip label="Your Fleet" value={shipsRemaining.player} accent="text-mint" />
          <StatChip label="Enemy Fleet" value={shipsRemaining.opponent} accent="text-slate-100" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <IconButton
            onClick={onPause}
            shape="circle"
            size="sm"
            ariaLabel="Pause battle"
            title="Pause battle"
          >
            P
          </IconButton>
          <IconButton
            onClick={onOpenGuide}
            shape="circle"
            size="sm"
            ariaLabel="Open instructions"
            title="Open instructions"
          >
            ?
          </IconButton>
          <IconButton
            onClick={onRestart}
            shape="circle"
            size="sm"
            tone="warm"
            ariaLabel="Restart match"
            title="Restart match"
          >
            R
          </IconButton>
        </div>
      </div>
    </footer>
  );
}
