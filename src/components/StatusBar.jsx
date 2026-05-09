export default function StatusBar({
  turnLabel,
  announcement,
  shipsRemaining,
  onPause,
  onOpenGuide,
  onOpenSettings,
  isPaused,
}) {
  const isPlayerTurn = !isPaused && turnLabel.toLowerCase().includes("your");

  return (
    <header aria-label="Match status" className="status-bar glass-panel rounded-[1.1rem] border-b border-cyan/20 px-2.5 py-2 sm:rounded-[1.25rem] sm:px-4 sm:py-2.5">
      <div className="flex flex-col gap-1.5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
            <div className="text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-cyan-100 sm:text-[0.82rem] sm:tracking-[0.22em]">
              Sea Battle
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:mt-1.5 sm:gap-2.5">
            <ShipTrack label="Your Fleet" active={shipsRemaining.player} />
            <ShipTrack label="Enemy Fleet" active={shipsRemaining.opponent} dimmed />
          </div>
          <p className="mt-1 max-w-3xl break-words text-[0.8rem] leading-[1.2rem] text-slate-300 sm:mt-1.5 sm:text-[0.88rem] sm:leading-5" role="status" aria-live="polite">
            {announcement}
          </p>
      </div>

      <div className="status-actions flex shrink-0 flex-wrap items-center gap-1 lg:ml-3 lg:justify-end">
        <div className={`status-text status-turn ${isPlayerTurn ? "pulse text-cyan-100" : "text-slate-300"}`}>
          {isPaused ? "Paused" : turnLabel}
        </div>
        <button
          type="button"
          onClick={onOpenGuide}
          aria-label="Open instructions"
          title="Open instructions"
          className="status-action"
        >
          Guide
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Open settings"
          title="Open settings"
          className="status-action"
        >
          Settings
        </button>
        <button
          type="button"
          onClick={onPause}
          aria-label={isPaused ? "Resume game" : "Pause game"}
          title={isPaused ? "Resume game" : "Pause game"}
          className={`status-action ${isPaused ? "is-warm" : ""}`}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
      </div>
    </header>
  );
}

function ShipTrack({ label, active, dimmed = false }) {
  const totalShips = 10;

  return (
    <div className="flex items-center gap-1.5" title={`${label}: ${active} ships afloat`}>
      {Array.from({ length: totalShips }).map((_, index) => (
        <span
          key={`${label}-${index}`}
          className={`h-1.5 w-2 rounded-full border sm:w-3 ${
            index < active
              ? dimmed
                ? "border-white/25 bg-white/[0.18]"
                : "border-mint/50 bg-mint/[0.55]"
              : "border-cyan/20 bg-white/[0.04]"
          }`}
        />
      ))}
    </div>
  );
}
