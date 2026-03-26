import { formatDuration } from "../utils/stats";
import IconButton from "./IconButton";

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 px-4 py-4">
      <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">{label}</div>
      <div className="mt-2 text-xl font-semibold text-foam">{value}</div>
    </div>
  );
}

export default function HistoryPanel({ history, summary, onClearHistory }) {
  return (
    <div className="glass-panel rounded-[2rem] p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Archive</p>
          <h2 className="font-display text-xl text-foam">Captain's Log</h2>
        </div>
        <IconButton
          onClick={onClearHistory}
          tone="warm"
          disabled={!history.length}
        >
          Clear History
        </IconButton>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SummaryCard label="Matches" value={summary.totalMatches} />
        <SummaryCard label="Win ratio" value={summary.totalMatches ? `${summary.wins}-${summary.losses}` : "0-0"} />
        <SummaryCard label="Best accuracy" value={`${summary.bestAccuracy}%`} />
        <SummaryCard label="Avg mission" value={formatDuration(summary.averageDurationMs)} />
      </div>

      <div className="mt-5">
        <h3 className="mb-3 text-sm font-medium text-foam">Recent Matches</h3>
        {history.length ? (
          <div className="space-y-2">
            {history.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div>
                  <div className="text-sm text-foam">
                    {match.winner === "player" ? "Victory" : "Defeat"} on{" "}
                    <span className="uppercase">{match.difficulty}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(match.playedAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-foam">{match.accuracy}% acc</div>
                  <div className="text-xs text-slate-400">
                    {formatDuration(match.durationMs)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-6 text-sm leading-6 text-slate-300">
            Complete a few battles and your recent missions will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
