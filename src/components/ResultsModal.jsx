import { useEffect, useState } from "react";
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
  const animatedStats = useAnimatedStats(open, stats, historySummary);

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
              <StatCard label="Accuracy" value={`${animatedStats.accuracy}%`} />
              <StatCard label="Total Moves" value={animatedStats.playerShots} />
              <StatCard label="Hits" value={animatedStats.playerHits} />
              <StatCard label="Misses" value={animatedStats.playerMisses} />
              <StatCard label="Mission Time" value={formatDuration(animatedStats.durationMs)} />
              <StatCard label="Best Streak" value={animatedStats.playerBestStreak} />
              <StatCard label="Archive Wins" value={animatedStats.archiveWins} />
              <StatCard
                label="Archive Best Accuracy"
                value={`${animatedStats.archiveBestAccuracy}%`}
              />
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
    <div className="animate-fade-in-fast rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-4 text-center">
      <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-foam">{value}</div>
    </div>
  );
}
