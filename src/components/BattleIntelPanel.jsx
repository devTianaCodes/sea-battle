function MetricCard({ label, value, accent = "text-foam" }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-4">
      <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${accent}`}>{value}</div>
    </div>
  );
}

function FleetRow({ label, ships, tone }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foam">{label}</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
          {ships.filter((ship) => !ship.isSunk).length} afloat
        </span>
      </div>
      <div className="space-y-2">
        {ships.map((ship) => (
          <div
            key={`${label}-${ship.id}`}
            className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2"
          >
            <div>
              <div className="text-sm text-foam">{ship.name}</div>
              <div className="text-xs text-slate-400">
                {ship.hits}/{ship.size} hits
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                ship.isSunk
                  ? "bg-coral/15 text-coral-100"
                  : tone === "player"
                    ? "bg-mint/15 text-mint"
                    : "bg-cyan/15 text-cyan-100"
              }`}
            >
              {ship.isSunk ? "Sunk" : "Active"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionItem({ event }) {
  const toneClasses = {
    player: "border-cyan/20 bg-cyan/[0.08] text-cyan-50",
    enemy: "border-coral/20 bg-coral/10 text-coral-50",
    system: "border-white/10 bg-white/[0.04] text-slate-200",
  };

  return (
    <li
      className={`rounded-2xl border px-3 py-3 text-sm leading-6 ${
        toneClasses[event.tone] ?? toneClasses.system
      }`}
    >
      {event.message}
    </li>
  );
}

export default function BattleIntelPanel({
  playerMetrics,
  enemyMetrics,
  playerFleetStatus,
  enemyFleetStatus,
  eventLog,
}) {
  return (
    <div className="glass-panel rounded-[2rem] p-5">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Mission Intel</p>
        <h2 className="font-display text-xl text-foam">Battle Snapshot</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MetricCard label="Your accuracy" value={`${playerMetrics.accuracy}%`} accent="text-cyan-50" />
        <MetricCard label="Opponent accuracy" value={`${enemyMetrics.accuracy}%`} accent="text-coral-50" />
        <MetricCard label="Best streak" value={playerMetrics.bestStreak} />
        <MetricCard label="Enemy best streak" value={enemyMetrics.bestStreak} />
        <MetricCard label="Ships sunk" value={playerMetrics.sinks} />
        <MetricCard label="First hit on shot" value={playerMetrics.firstHitShot ?? "-"} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <FleetRow label="Your fleet" ships={playerFleetStatus} tone="player" />
        <FleetRow label="Enemy fleet" ships={enemyFleetStatus} tone="enemy" />
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foam">Recent Action</h3>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Live feed</span>
        </div>
        <ul className="space-y-2">
          {eventLog.map((event) => (
            <ActionItem key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  );
}
