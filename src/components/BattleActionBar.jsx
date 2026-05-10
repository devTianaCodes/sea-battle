function StatPair({ label, playerLabel, playerValue, opponentLabel, opponentValue }) {
  return (
    <div className="battle-stat-pair">
      <span className="battle-stat-title">{label}</span>
      <span className="battle-stat-values">
        <span>
          {playerLabel} <strong>{playerValue}</strong>
        </span>
        <span>
          {opponentLabel} <strong>{opponentValue}</strong>
        </span>
      </span>
    </div>
  );
}

export default function BattleActionBar({
  latestEvent,
  playerAccuracy,
  opponentAccuracy,
  shipsRemaining,
}) {
  return (
    <footer
      aria-label="Battle controls and latest action"
      className="battle-action-bar glass-light viewport-footer animate-footer-rise rounded-[1rem] border border-cyan/25 px-2.5 py-2 sm:rounded-[1.2rem] sm:px-3 sm:py-2.5"
    >
      <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[0.62rem] uppercase tracking-[0.12em] text-cyan-100">Action Bar</span>
          </div>
          <p
            className="mt-1 text-[0.82rem] leading-5 text-slate-200 sm:text-[0.88rem]"
            role="status"
            aria-live="polite"
          >
            {latestEvent}
          </p>
        </div>

        <div className="battle-stat-grid">
          <StatPair
            label="Accuracy"
            playerLabel="You"
            playerValue={`${playerAccuracy}%`}
            opponentLabel="Enemy"
            opponentValue={`${opponentAccuracy}%`}
          />
          <StatPair
            label="Fleet"
            playerLabel="You"
            playerValue={shipsRemaining.player}
            opponentLabel="Enemy"
            opponentValue={shipsRemaining.opponent}
          />
        </div>
      </div>
    </footer>
  );
}
