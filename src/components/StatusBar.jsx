import DifficultySelector from "./DifficultySelector";
import IconButton from "./IconButton";

export default function StatusBar({
  difficulty,
  onDifficultyChange,
  phaseLabel,
  turnLabel,
  announcement,
  timerLabel,
  onRestart,
  onOpenGuide,
  soundEnabled,
  onToggleSound,
  difficultyLocked,
}) {
  return (
    <div className="glass-panel rounded-[2rem] p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Mission Feed</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl text-foam sm:text-4xl">Sea Battle</h1>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm text-slate-200">
              {phaseLabel}
            </span>
            <span className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-sm text-cyan-100">
              {turnLabel}
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm text-slate-200">
              {timerLabel}
            </span>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-slate-300" aria-live="polite">
            {announcement}
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <DifficultySelector
            difficulty={difficulty}
            onChange={onDifficultyChange}
            disabled={difficultyLocked}
          />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <IconButton onClick={onOpenGuide}>
              Guide
            </IconButton>
            <IconButton onClick={onToggleSound} tone={soundEnabled ? "accent" : "default"}>
              {soundEnabled ? "Sound On" : "Sound Off"}
            </IconButton>
            <IconButton onClick={onRestart} tone="warm">
              Restart Match
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
