import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { formatDuration } from "../utils/stats";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import useDialogA11y from "../hooks/useDialogA11y";
import IconButton from "./IconButton";

function MiniBoard({ board }) {
  return (
    <div className="mx-auto grid w-full max-w-[11rem] grid-cols-10 gap-0.5 rounded-[1rem] border border-white/10 bg-white/[0.04] p-1.5 sm:max-w-[12.5rem] sm:gap-1 sm:rounded-[1.35rem] sm:p-2.5">
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
  history,
  historySummary,
  revealedBoard,
  onReplay,
  onReplayStep,
  onChangeDifficulty,
  onMainMenu,
}) {
  useBodyScrollLock(open);
  const animatedStats = useAnimatedStats(open, stats, historySummary);
  const titleId = useId();
  const descriptionId = useId();
  const { dialogRef, initialFocusRef } = useDialogA11y(open, onReplay);
  const isNewBestAccuracy = useMemo(() => {
    if (!stats || !history?.length) {
      return false;
    }

    const latestEntry = history[0];

    if (!latestEntry || latestEntry.endTime !== stats.endTime) {
      return false;
    }

    const previousBest = history.slice(1).reduce((best, match) => Math.max(best, match.accuracy ?? 0), 0);
    return stats.accuracy > previousBest;
  }, [history, stats]);

  if (!open) {
    return null;
  }

  return (
    <div className="animate-fade-in fixed inset-[15px] z-50 flex items-center justify-center rounded-[20px] bg-[#020817]/70 p-2 backdrop-blur-md sm:p-3">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="glass-frosted animate-modal relative flex max-h-full w-full max-w-4xl flex-col overflow-y-auto rounded-[1.35rem] p-3 sm:rounded-[1.7rem] sm:p-4"
      >
        {winner === "player" ? <VictoryParticles /> : null}
        <div className="grid gap-3 lg:grid-cols-[16rem,minmax(0,1fr)] lg:gap-4">
          <div className="flex flex-col justify-between gap-3">
            <div className="text-center lg:text-left">
              <div className="text-3xl sm:text-4xl">{winner === "player" ? "O" : "X"}</div>
              <p className="mt-1.5 text-[0.66rem] uppercase tracking-[0.16em] text-cyan-100 sm:mt-2 sm:text-xs sm:tracking-[0.2em]">
                Results
              </p>
              <h2
                id={titleId}
                className={`mt-1.5 font-display text-2xl sm:mt-2 sm:text-3xl ${winner === "player" ? "text-mint" : "text-coral"}`}
              >
                {winner === "player" ? "Victory" : "Defeat"}
              </h2>
              <p id={descriptionId} className="mt-1.5 text-[0.8rem] leading-5 text-slate-300 sm:mt-2 sm:text-sm sm:leading-6">
                {winner === "player"
                  ? "Your targeting held under pressure and the opposing fleet went under."
                  : "The enemy found enough openings to sink your fleet. Reset and try a different deployment."}
              </p>
              <div className="mt-2.5 flex flex-wrap justify-center gap-1.5 lg:justify-start sm:mt-3 sm:gap-2">
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.64rem] uppercase tracking-[0.1em] text-slate-200 sm:px-3 sm:text-[0.68rem] sm:tracking-[0.14em]">
                  {difficulty} difficulty
                </span>
                {stats?.performanceLabel ? (
                  <span className="inline-flex rounded-full border border-cyan/20 bg-cyan/[0.08] px-2.5 py-1 text-[0.64rem] uppercase tracking-[0.1em] text-cyan-50 sm:px-3 sm:text-[0.68rem] sm:tracking-[0.14em]">
                    {stats.performanceLabel}
                  </span>
                ) : null}
              </div>
              {isNewBestAccuracy ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.22 }}
                  className="mt-3 inline-flex rounded-full border border-mint/30 bg-mint/[0.12] px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-mint"
                >
                  New accuracy record
                </motion.div>
              ) : null}
            </div>

            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
              <IconButton
                ref={initialFocusRef}
                onClick={onReplay}
                tone="success"
                className="w-full justify-center px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-xs"
              >
                Play Again
              </IconButton>
              <IconButton
                onClick={onChangeDifficulty}
                tone="accent"
                className="w-full justify-center px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-xs"
              >
                Difficulty
              </IconButton>
              <IconButton
                onClick={() => onReplayStep(-1)}
                disabled={difficulty === "easy"}
                className="w-full justify-center px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-xs"
              >
                Ease Down
              </IconButton>
              <IconButton
                onClick={() => onReplayStep(1)}
                disabled={difficulty === "hard"}
                className="w-full justify-center px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-xs"
              >
                Push Harder
              </IconButton>
              <IconButton
                onClick={onMainMenu}
                className="w-full justify-center px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:col-span-2 sm:text-xs lg:col-span-1"
              >
                Main Menu
              </IconButton>
            </div>
          </div>

          {stats ? (
            <div className="grid gap-3">
              <div className="grid gap-1.5 grid-cols-2 xl:grid-cols-4 sm:gap-2">
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
                <div className="mb-1.5 text-center text-[0.64rem] uppercase tracking-[0.12em] text-slate-300 sm:mb-2 sm:text-[0.7rem] sm:tracking-[0.14em]">
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

function VictoryParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        id: index,
        left: 6 + ((index * 11) % 88),
        delay: (index % 5) * 0.12,
        duration: 2.6 + (index % 4) * 0.22,
        size: 4 + (index % 3) * 2,
      })),
    []
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-32 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          initial={{ opacity: 0, y: -8, x: 0 }}
          animate={{
            opacity: [0, 0.9, 0.85, 0],
            y: [0, 36, 88, 132],
            x: [0, particle.id % 2 === 0 ? -10 : 10, particle.id % 2 === 0 ? -18 : 18],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: "easeOut",
          }}
          className="absolute rounded-full"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size * 1.8}px`,
            background:
              particle.id % 3 === 0
                ? "linear-gradient(180deg, rgba(74,222,128,0.95), rgba(217,249,157,0.55))"
                : particle.id % 3 === 1
                  ? "linear-gradient(180deg, rgba(0,212,255,0.95), rgba(125,211,252,0.5))"
                  : "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(226,243,255,0.35))",
            boxShadow: "0 0 14px rgba(0,212,255,0.18)",
          }}
        />
      ))}
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
    <div className="animate-count rounded-[0.9rem] border border-white/10 bg-white/[0.06] px-2 py-2 text-center sm:rounded-[1.1rem] sm:px-3 sm:py-3">
      <div className="text-[0.58rem] uppercase tracking-[0.1em] text-slate-300 sm:text-[0.66rem] sm:tracking-[0.14em]">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-foam sm:mt-1.5 sm:text-xl">{value}</div>
    </div>
  );
}
