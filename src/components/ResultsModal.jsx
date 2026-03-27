import { useEffect, useState } from "react";
import { formatDuration } from "../utils/stats";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import IconButton from "./IconButton";

function MiniBoard({ board }) {
  return (
    <div className="grid grid-cols-10 gap-1 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-2.5">
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
  const animatedStats = useAnimatedStats(open, stats, historySummary);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/70 px-4 backdrop-blur-md animate-fade-in">
      <div className="glass-frosted animate-modal w-full max-w-5xl rounded-[2rem] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[20rem,minmax(0,1fr)]">
          <div className="flex flex-col justify-between gap-4">
            <div className="text-center lg:text-left">
              <div className="text-4xl">{winner === "player" ? "O" : "X"}</div>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-cyan/70">Results</p>
              <h2 className={`mt-2 font-display text-3xl ${winner === "player" ? "text-mint" : "text-coral"}`}>
                {winner === "player" ? "Victory" : "Defeat"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {winner === "player"
                  ? "Your targeting held under pressure and the opposing fleet went under."
                  : "The enemy found enough openings to sink your fleet. Reset and try a different deployment."}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-slate-300">
                  {difficulty} difficulty
                </span>
                {stats?.performanceLabel ? (
                  <span className="inline-flex rounded-full border border-cyan/20 bg-cyan/[0.08] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-cyan-100">
                    {stats.performanceLabel}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <IconButton onClick={onReplay} tone="success" className="w-full justify-center">
                Play Again
              </IconButton>
              <IconButton onClick={onChangeDifficulty} tone="accent" className="w-full justify-center">
                Difficulty
              </IconButton>
              <IconButton
                onClick={() => onReplayStep(-1)}
                disabled={difficulty === "easy"}
                className="w-full justify-center"
              >
                Ease Down
              </IconButton>
              <IconButton
                onClick={() => onReplayStep(1)}
                disabled={difficulty === "hard"}
                className="w-full justify-center"
              >
                Push Harder
              </IconButton>
              <IconButton onClick={onMainMenu} className="w-full justify-center sm:col-span-2 lg:col-span-1">
                Main Menu
              </IconButton>
            </div>
          </div>

          {stats ? (
            <div className="grid gap-4">
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Accuracy" value={`${animatedStats.accuracy}%`} />
                <StatCard label="Moves" value={animatedStats.playerShots} />
                <StatCard label="Hits" value={animatedStats.playerHits} />
                <StatCard label="Misses" value={animatedStats.playerMisses} />
                <StatCard label="Mission Time" value={formatDuration(animatedStats.durationMs)} />
                <StatCard label="Best Streak" value={animatedStats.playerBestStreak} />
                <StatCard label="Archive Wins" value={animatedStats.archiveWins} />
                <StatCard
                  label="Best Accuracy"
                  value={`${animatedStats.archiveBestAccuracy}%`}
                />
              </div>
              <div>
                <div className="mb-2 text-center text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
                  Enemy Fleet Reveal
                </div>
                <MiniBoard board={revealedBoard} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function useAnimatedStats(open, stats, historySummary) {
  const [animated, setAnimated] = useState({
    accuracy: 0,
    playerShots: 0,
    playerHits: 0,
    playerMisses: 0,
    durationMs: 0,
    playerBestStreak: 0,
    archiveWins: 0,
    archiveBestAccuracy: 0,
  });

  useEffect(() => {
    if (!open || !stats) {
      return;
    }

    const target = {
      accuracy: stats.accuracy ?? 0,
      playerShots: stats.playerShots ?? 0,
      playerHits: stats.playerHits ?? 0,
      playerMisses: stats.playerMisses ?? 0,
      durationMs: stats.durationMs ?? 0,
      playerBestStreak: stats.playerBestStreak ?? 0,
      archiveWins: historySummary?.wins ?? 0,
      archiveBestAccuracy: historySummary?.bestAccuracy ?? 0,
    };

    const startTime = performance.now();
    let frameId = 0;

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / 900, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimated({
        accuracy: Math.round(target.accuracy * eased),
        playerShots: Math.round(target.playerShots * eased),
        playerHits: Math.round(target.playerHits * eased),
        playerMisses: Math.round(target.playerMisses * eased),
        durationMs: Math.round(target.durationMs * eased),
        playerBestStreak: Math.round(target.playerBestStreak * eased),
        archiveWins: Math.round(target.archiveWins * eased),
        archiveBestAccuracy: Math.round(target.archiveBestAccuracy * eased),
      });

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    setAnimated({
      accuracy: 0,
      playerShots: 0,
      playerHits: 0,
      playerMisses: 0,
      durationMs: 0,
      playerBestStreak: 0,
      archiveWins: 0,
      archiveBestAccuracy: 0,
    });

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [historySummary, open, stats]);

  return animated;
}

function StatCard({ label, value }) {
  return (
    <div className="animate-count rounded-[1.1rem] border border-white/10 bg-white/[0.06] px-3 py-3 text-center">
      <div className="text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-1.5 text-xl font-semibold text-foam">{value}</div>
    </div>
  );
}
