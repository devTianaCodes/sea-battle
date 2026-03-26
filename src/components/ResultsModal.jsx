import { formatDuration } from "../utils/stats";
import IconButton from "./IconButton";

export default function ResultsModal({ open, winner, stats, onReplay }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/70 px-4 backdrop-blur-md animate-fade-in">
      <div className="glass-panel animate-modal-in w-full max-w-xl rounded-[2rem] p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Results</p>
        <h2 className="mt-3 font-display text-4xl text-foam">
          {winner === "player" ? "Victory" : "Defeat"}
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">
          {winner === "player"
            ? "Your targeting held under pressure and the opposing fleet went under."
            : "The AI found enough openings to sink your fleet. Reset and try a different deployment."}
        </p>
        {stats ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <StatCard label="Player accuracy" value={`${stats.accuracy}%`} />
            <StatCard label="Player shots" value={stats.playerShots} />
            <StatCard label="Opponent shots" value={stats.aiShots} />
            <StatCard label="Mission time" value={formatDuration(stats.durationMs)} />
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <IconButton onClick={onReplay} tone="success">
            Play Again
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 px-4 py-4">
      <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-foam">{value}</div>
    </div>
  );
}
