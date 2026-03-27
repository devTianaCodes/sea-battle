import { useEffect, useState } from "react";
import IconButton from "./IconButton";

export default function StatusBar({
  difficulty,
  turnLabel,
  announcement,
  timerLabel,
  turnCount,
  playerStats,
  shipsRemaining,
  onRestart,
  onPause,
  onOpenGuide,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
  isPaused,
}) {
  const [showStats, setShowStats] = useState(false);
  const isPlayerTurn = !isPaused && turnLabel.toLowerCase().includes("your");

  useEffect(() => {
    if (!showStats) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShowStats(false);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [showStats]);

  return (
    <header className="glass-panel rounded-[1.1rem] border-b border-cyan/20 px-2.5 py-2 sm:rounded-[1.2rem] sm:px-4 sm:py-2.5">
      <div className="flex flex-col gap-1.5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-200 sm:text-xs sm:tracking-[0.28em]">
            Sea Battle
            </div>
            <div className="hidden h-3 w-px bg-white/10 sm:block" />
            <div className={`status-text ${isPlayerTurn ? "pulse text-cyan-100" : "text-slate-300"}`}>
              {isPaused ? "Paused" : turnLabel}
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[0.52rem] uppercase tracking-[0.1em] text-slate-400 sm:px-2 sm:py-1 sm:text-[0.56rem] sm:tracking-[0.12em]">
              {difficulty}
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[0.52rem] uppercase tracking-[0.1em] text-slate-400 sm:px-2 sm:py-1 sm:text-[0.56rem] sm:tracking-[0.12em]">
              {timerLabel}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:mt-1.5 sm:gap-2.5">
            <ShipTrack label="Your Fleet" active={shipsRemaining.player} />
            <ShipTrack label="Enemy Fleet" active={shipsRemaining.opponent} dimmed />
          </div>
          {showStats ? (
          <div className="animate-fade-in-fast mt-1 text-[0.58rem] uppercase tracking-[0.1em] text-slate-400 sm:mt-1.5 sm:text-[0.62rem] sm:tracking-[0.12em]">
            Hits {playerStats.hits} | Misses {playerStats.misses} | Accuracy {playerStats.accuracy}% | Turn {turnCount}
          </div>
        ) : (
          <p className="mt-1 max-w-3xl break-words text-[0.72rem] leading-[1.1rem] text-slate-400 sm:mt-1.5 sm:text-xs sm:leading-5" aria-live="polite">
            {announcement}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1 lg:ml-3 lg:justify-end">
        <IconButton
          onClick={() => setShowStats((current) => !current)}
          ariaLabel="Toggle match stats"
          title="Toggle match stats"
          shape="circle"
          size="sm"
        >
          i
        </IconButton>
        <IconButton
          onClick={onToggleSound}
          tone={soundEnabled ? "accent" : "default"}
          ariaLabel={soundEnabled ? "Mute sound" : "Enable sound"}
          title={soundEnabled ? "Mute sound" : "Enable sound"}
          shape="circle"
          size="sm"
        >
          S
        </IconButton>
        <IconButton
          onClick={onPause}
          tone={isPaused ? "warm" : "default"}
          ariaLabel={isPaused ? "Resume game" : "Pause game"}
          title={isPaused ? "Resume game" : "Pause game"}
          shape="circle"
          size="sm"
        >
          P
        </IconButton>
        <IconButton
          onClick={onOpenGuide}
          ariaLabel="Open instructions"
          title="Open instructions"
          shape="circle"
          size="sm"
        >
          ?
        </IconButton>
        <IconButton
          onClick={onOpenSettings}
          ariaLabel="Open settings"
          title="Open settings"
          shape="circle"
          size="sm"
        >
          ⚙
        </IconButton>
        <IconButton
          onClick={onRestart}
          tone="warm"
          ariaLabel="Restart match"
          title="Restart match"
          shape="circle"
          size="sm"
          className="hidden sm:inline-flex"
        >
          R
        </IconButton>
      </div>
      </div>
    </header>
  );
}

function ShipTrack({ label, active, dimmed = false }) {
  return (
    <div className="flex items-center gap-1.5" title={`${label}: ${active} ships afloat`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={`${label}-${index}`}
          className={`h-1.5 w-4 rounded-full border ${
            index < active
              ? dimmed
                ? "border-white/25 bg-white/[0.18]"
                : "border-mint/50 bg-mint/[0.55]"
              : "border-white/10 bg-white/[0.04]"
          }`}
        />
      ))}
    </div>
  );
}
