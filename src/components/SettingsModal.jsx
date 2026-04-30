import { useEffect, useId, useState } from "react";
import { DIFFICULTY_LEVELS } from "../data/constants";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import useDialogA11y from "../hooks/useDialogA11y";
import IconButton from "./IconButton";

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-[0.78rem] transition sm:px-4 sm:py-2 sm:text-sm ${
        active
          ? "bg-cyan/15 text-foam shadow-[0_0_0_1px_rgba(0,212,255,0.3)]"
          : "bg-white/[0.05] text-slate-300 hover:bg-white/[0.08] hover:text-foam"
      }`}
    >
      {children}
    </button>
  );
}

function SettingRow({ label, description, control }) {
  return (
    <div className="flex flex-col gap-2 rounded-[1rem] border border-white/10 bg-white/[0.04] p-3 sm:rounded-3xl sm:p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-[0.85rem] font-medium text-foam sm:text-sm">{label}</div>
        <div className="mt-1 text-[0.8rem] leading-5 text-slate-300 sm:text-sm sm:leading-6">{description}</div>
      </div>
      <div>{control}</div>
    </div>
  );
}

function StatsCard({ label, value }) {
  return (
    <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3 sm:rounded-3xl sm:px-4 sm:py-4">
      <div className="text-[0.58rem] uppercase tracking-[0.16em] text-slate-400 sm:text-[0.65rem] sm:tracking-[0.3em]">{label}</div>
      <div className="mt-1.5 text-lg font-semibold text-foam sm:mt-2 sm:text-2xl">{value}</div>
    </div>
  );
}

export default function SettingsModal({
  open,
  defaultTab = "settings",
  onClose,
  soundEnabled,
  onToggleSound,
  backgroundEffectsEnabled,
  onToggleBackgroundEffects,
  difficulty,
  onDifficultyChange,
  historySummary,
  onClearStats,
  onResetToMenu,
}) {
  const [tab, setTab] = useState(defaultTab);
  useBodyScrollLock(open);
  const titleId = useId();
  const descriptionId = useId();
  const { dialogRef, initialFocusRef } = useDialogA11y(open, onClose);

  useEffect(() => {
    if (open) {
      setTab(defaultTab);
    }
  }, [defaultTab, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-[15px] z-[58] flex items-center justify-center rounded-[20px] bg-[#03110e]/80 p-2 backdrop-blur-md animate-fade-in sm:p-3">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="glass-frosted flex max-h-full w-full max-w-4xl flex-col overflow-y-auto rounded-[1.35rem] p-3 sm:rounded-[2rem] sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-cyan/70 sm:text-xs sm:tracking-[0.28em]">Control Room</p>
            <h2 id={titleId} className="mt-2 font-display text-[1.45rem] text-foam sm:mt-3 sm:text-3xl">Settings & Statistics</h2>
          </div>
          <IconButton ref={initialFocusRef} onClick={onClose} className="px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-sm">Close</IconButton>
        </div>

        <div id={descriptionId} className="mt-4 flex flex-wrap gap-2 sm:mt-6">
          <TabButton active={tab === "settings"} onClick={() => setTab("settings")}>
            Settings
          </TabButton>
          <TabButton active={tab === "statistics"} onClick={() => setTab("statistics")}>
            Statistics
          </TabButton>
        </div>

        {tab === "settings" ? (
          <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
            <SettingRow
              label="Sound Effects"
              description="Toggle battle and interface audio cues."
              control={
                <IconButton onClick={onToggleSound} tone={soundEnabled ? "accent" : "default"}>
                  {soundEnabled ? "Enabled" : "Muted"}
                </IconButton>
              }
            />
            <SettingRow
              label="Background Effects"
              description="Enable or mute animated atmospheric gradients in the background."
              control={
                <IconButton
                  onClick={onToggleBackgroundEffects}
                  tone={backgroundEffectsEnabled ? "accent" : "default"}
                >
                  {backgroundEffectsEnabled ? "Enabled" : "Disabled"}
                </IconButton>
              }
            />
            <SettingRow
              label="Default Difficulty"
              description="Choose the difficulty you want ready when a new run starts."
              control={
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <IconButton
                      key={level.id}
                      onClick={() => onDifficultyChange(level.id)}
                      tone={difficulty === level.id ? "success" : "default"}
                    >
                      {level.name}
                    </IconButton>
                  ))}
                </div>
              }
            />
            <SettingRow
              label="Session Controls"
              description="Return to the main menu without altering your stored archive."
              control={<IconButton onClick={onResetToMenu} tone="warm">Main Menu</IconButton>}
            />
          </div>
        ) : (
          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
              <StatsCard label="Matches" value={historySummary.totalMatches} />
              <StatsCard label="Wins" value={historySummary.wins} />
              <StatsCard label="Best Accuracy" value={`${historySummary.bestAccuracy}%`} />
              <StatsCard label="Avg Accuracy" value={`${historySummary.averageAccuracy}%`} />
            </div>

            <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] p-3 sm:rounded-3xl sm:p-4">
              <div className="text-[0.85rem] font-medium text-foam sm:text-sm">Win Rate By Difficulty</div>
              <div className="mt-3 space-y-3 sm:mt-4">
                {["easy", "medium", "hard"].map((level) => {
                  const data = historySummary.difficultyBreakdown?.[level] ?? {
                    matches: 0,
                    wins: 0,
                  };
                  const rate = data.matches ? Math.round((data.wins / data.matches) * 100) : 0;

                  return (
                    <div key={level}>
                      <div className="mb-1 flex items-center justify-between text-[0.8rem] text-slate-300 sm:text-sm">
                        <span className="uppercase">{level}</span>
                        <span>{rate}% ({data.wins}/{data.matches})</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.05]">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan to-mint"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <IconButton onClick={onClearStats} tone="warm" disabled={!historySummary.totalMatches}>
                Clear Stats
              </IconButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
