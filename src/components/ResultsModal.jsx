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
      <div className="glass-frosted animate-modal-in w-full max-w-2xl rounded-[2rem] p-6 sm:p-8">
        <div className="text-center">
          <div className="text-5xl">{winner === "player" ? "O" : "X"}</div>
          <p className="mt-3 text-xs uppercase tracking-[0.35em] text-cyan/70">Results</p>
          <h2 className={`mt-3 font-display text-4xl ${winner === "player" ? "text-mint" : "text-coral"}`}>
            {winner === "player" ? "Victory" : "Defeat"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {winner === "player"
              ? "Your targeting held under pressure and the opposing fleet went under."
              : "The AI found enough openings to sink your fleet. Reset and try a different deployment."}
          </p>
          <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
            {difficulty} difficulty
          </div>
          {stats?.performanceLabel ? (
            <div className="mt-3 block text-[0.68rem] uppercase tracking-[0.28em] text-cyan-100">
              {stats.performanceLabel}
            </div>
          ) : null}
        </div>

        {stats ? (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <StatCard label="Accuracy" value={`${stats.accuracy}%`} />
              <StatCard label="Total Moves" value={stats.playerShots} />
              <StatCard label="Hits" value={stats.playerHits} />
              <StatCard label="Misses" value={stats.playerMisses} />
              <StatCard label="Mission Time" value={formatDuration(stats.durationMs)} />
              <StatCard label="Best Streak" value={stats.playerBestStreak} />
              <StatCard label="Archive Wins" value={historySummary?.wins ?? 0} />
              <StatCard label="Archive Best Accuracy" value={`${historySummary?.bestAccuracy ?? 0}%`} />
            </div>
            <div className="mt-6">
              <div className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-slate-400">
                Enemy Fleet Reveal
              </div>
              <MiniBoard board={revealedBoard} />
            </div>
          </>
        ) : null}

        <div className="mt-8 flex flex-col gap-3">
          <IconButton onClick={onReplay} tone="success" className="w-full justify-center">
            Play Again
          </IconButton>
          <IconButton onClick={onChangeDifficulty} tone="accent" className="w-full justify-center">
            Change Difficulty
          </IconButton>
          <div className="grid gap-3 sm:grid-cols-2">
            <IconButton
              onClick={() => onReplayStep(-1)}
              disabled={difficulty === "easy"}
              className="justify-center"
            >
              Ease Down
            </IconButton>
            <IconButton
              onClick={() => onReplayStep(1)}
              disabled={difficulty === "hard"}
              className="justify-center"
            >
              Push Harder
            </IconButton>
          </div>
          <IconButton onClick={onMainMenu} className="justify-center">
            Main Menu
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-4 text-center">
      <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-foam">{value}</div>
    </div>
  );
}
