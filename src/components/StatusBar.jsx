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
    <header className="glass-panel rounded-[1.35rem] border-b border-cyan/20 px-4 py-3 sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            Sea Battle
            </div>
            <div className="hidden h-3 w-px bg-white/10 sm:block" />
            <div className={`status-text ${isPlayerTurn ? "pulse text-cyan-100" : "text-slate-300"}`}>
              {isPaused ? "Paused" : turnLabel}
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">
              {difficulty}
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">
              {timerLabel}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <ShipTrack label="Your Fleet" active={shipsRemaining.player} />
            <ShipTrack label="Enemy Fleet" active={shipsRemaining.opponent} dimmed />
          </div>
          {showStats ? (
          <div className="animate-fade-in-fast mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
            Hits {playerStats.hits} | Misses {playerStats.misses} | Accuracy {playerStats.accuracy}% | Turn {turnCount}
          </div>
        ) : (
          <p className="mt-2 max-w-3xl break-words text-sm leading-5 text-slate-400" aria-live="polite">
            {announcement}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 lg:ml-4 lg:justify-end">
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
          =
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
