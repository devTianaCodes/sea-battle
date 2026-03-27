import { useState } from "react";
import { DIFFICULTY_LEVELS } from "../data/constants";
import IconButton from "./IconButton";

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition ${
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
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-sm font-medium text-foam">{label}</div>
        <div className="mt-1 text-sm leading-6 text-slate-300">{description}</div>
      </div>
      <div>{control}</div>
    </div>
  );
}

function StatsCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-4">
      <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-foam">{value}</div>
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

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[58] flex items-center justify-center bg-[#020817]/80 px-4 py-6 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Control Room</p>
            <h2 className="mt-3 font-display text-3xl text-foam">Settings & Statistics</h2>
          </div>
          <IconButton onClick={onClose}>Close</IconButton>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <TabButton active={tab === "settings"} onClick={() => setTab("settings")}>
            Settings
          </TabButton>
          <TabButton active={tab === "statistics"} onClick={() => setTab("statistics")}>
            Statistics
          </TabButton>
        </div>

        {tab === "settings" ? (
          <div className="mt-6 space-y-4">
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
          <div className="mt-6 space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard label="Matches" value={historySummary.totalMatches} />
              <StatsCard label="Wins" value={historySummary.wins} />
              <StatsCard label="Best Accuracy" value={`${historySummary.bestAccuracy}%`} />
              <StatsCard label="Avg Accuracy" value={`${historySummary.averageAccuracy}%`} />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm font-medium text-foam">Win Rate By Difficulty</div>
              <div className="mt-4 space-y-3">
                {["easy", "medium", "hard"].map((level) => {
                  const data = historySummary.difficultyBreakdown?.[level] ?? {
                    matches: 0,
                    wins: 0,
                  };
                  const rate = data.matches ? Math.round((data.wins / data.matches) * 100) : 0;

                  return (
                    <div key={level}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
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
