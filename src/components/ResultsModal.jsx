import { formatDuration } from "../utils/stats";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import IconButton from "./IconButton";

function MiniBoard({ board }) {
  return (
    <div className="grid grid-cols-10 gap-1 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
      {board.flat().map((cell) => {
        const classes = cell.isHit
          ? cell.isSunkReveal
            ? "bg-gradient-to-br from-coral to-orange-400"
            : "bg-gradient-to-br from-coral to-pink-400"
          : cell.isMiss
            ? "bg-cyan/25"
            : cell.shipId
              ? "bg-white/20"
              : "bg-white/[0.04]";

        return (
          <div
            key={`mini-${cell.x}-${cell.y}`}
            className={`aspect-square rounded-[0.35rem] ${classes}`}
          />
        );
      })}
    </div>
  );
}

export default function ResultsModal({
  open,
  winner,
  stats,
  difficulty,
  historySummary,
  revealedBoard,
  onReplay,
  onReplayStep,
  onChangeDifficulty,
  onMainMenu,
}) {
  useBodyScrollLock(open);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/70 px-4 backdrop-blur-md animate-fade-in">
      <div className="glass-frosted animate-modal-in w-full max-w-xl rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Results</p>
        <h2 className="mt-3 font-display text-4xl text-foam">
          {winner === "player" ? "Victory" : "Defeat"}
        </h2>
        <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
          {difficulty} difficulty
        </div>
        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">
          {winner === "player"
            ? "Your targeting held under pressure and the opposing fleet went under."
            : "The AI found enough openings to sink your fleet. Reset and try a different deployment."}
        </p>
        {stats?.performanceLabel ? (
          <div className="mt-4 inline-flex rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-50">
            {stats.performanceLabel}
          </div>
        ) : null}
        {stats ? (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <StatCard label="Player accuracy" value={`${stats.accuracy}%`} />
              <StatCard label="Player shots" value={stats.playerShots} />
              <StatCard label="Opponent shots" value={stats.aiShots} />
              <StatCard label="Mission time" value={formatDuration(stats.durationMs)} />
              <StatCard label="Ships sunk" value={stats.playerSinks} />
              <StatCard label="Best streak" value={stats.playerBestStreak} />
              <StatCard label="First hit" value={stats.playerFirstHitShot ? `Shot ${stats.playerFirstHitShot}` : "-"} />
              <StatCard label="Archive wins" value={historySummary?.wins ?? 0} />
              <StatCard label="Archive best acc" value={`${historySummary?.bestAccuracy ?? 0}%`} />
            </div>
            <div className="mt-6">
              <div className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                Enemy Fleet Reveal
              </div>
              <MiniBoard board={revealedBoard} />
            </div>
          </>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <IconButton onClick={onReplay} tone="success">
            Play Again
          </IconButton>
          <IconButton onClick={onChangeDifficulty} tone="accent">
            Change Difficulty
          </IconButton>
          <IconButton onClick={() => onReplayStep(-1)} disabled={difficulty === "easy"}>
            Ease Down
          </IconButton>
          <IconButton onClick={() => onReplayStep(1)} disabled={difficulty === "hard"}>
            Push Harder
          </IconButton>
          <IconButton onClick={onMainMenu}>
            Main Menu
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
