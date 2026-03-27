import { useMemo, useState } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { DIFFICULTY_LEVELS } from "../data/constants";
import IconButton from "./IconButton";

export default function DifficultySelector({
  difficulty,
  onChange,
  historySummary,
  disabled = false,
}) {
  const [pendingDifficulty, setPendingDifficulty] = useState(null);

  const selectedLevel = useMemo(
    () => DIFFICULTY_LEVELS.find((level) => level.id === (pendingDifficulty ?? difficulty)),
    [difficulty, pendingDifficulty]
  );

  function getDifficultyStats(levelId) {
    const data = historySummary?.difficultyBreakdown?.[levelId];

    if (!data || !data.matches) {
      return {
        matches: 0,
        winRate: 0,
      };
    }

    return {
      matches: data.matches,
      winRate: Math.round((data.wins / data.matches) * 100),
    };
  }

  function confirmSelection() {
    if (!pendingDifficulty || pendingDifficulty === difficulty) {
      setPendingDifficulty(null);
      return;
    }

    onChange(pendingDifficulty);
    setPendingDifficulty(null);
  }

  return (
    <div className="glass-panel rounded-[2rem] p-3">
      <div className="grid gap-2 md:grid-cols-3">
        {DIFFICULTY_LEVELS.map((level, index) => {
          const active = level.id === difficulty;
          const pending = level.id === pendingDifficulty;
          const stats = getDifficultyStats(level.id);

          return (
            <motion.button
              key={level.id}
              type="button"
              disabled={disabled}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.05 }}
              whileHover={disabled ? undefined : { scale: 1.03 }}
              whileTap={disabled ? undefined : { scale: 0.985 }}
              onClick={() => setPendingDifficulty(level.id)}
              className={clsx(
                "rounded-[1.4rem] border px-4 py-4 text-left transition duration-200",
                active || pending
                  ? level.accent === "mint"
                    ? "border-mint/50 bg-mint/10 shadow-[0_0_22px_rgba(74,222,128,0.12)]"
                    : level.accent === "coral"
                      ? "border-coral/50 bg-coral/10 shadow-[0_0_22px_rgba(255,107,107,0.14)]"
                      : "border-cyan/50 bg-cyan/10 shadow-[0_0_22px_rgba(0,212,255,0.14)]"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]",
                disabled && "cursor-not-allowed opacity-45"
              )}
              aria-pressed={active || pending}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-2xl">{level.emoji}</div>
                  <div className="mt-2 text-lg font-semibold text-foam">{level.name}</div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-slate-300">
                  {active ? "Active" : pending ? "Selected" : "Ready"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">{level.description}</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">{level.detail}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>{stats.matches} archived runs</span>
                <span>{stats.winRate}% win rate</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {pendingDifficulty && selectedLevel ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.2 }}
            className="mt-3 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                  Confirm Difficulty
                </div>
                <div className="mt-2 text-lg font-semibold text-foam">
                  Start game with {selectedLevel.name} {selectedLevel.emoji}?
                </div>
                <div className="mt-1 text-sm text-slate-300">
                  {selectedLevel.detail}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <IconButton onClick={() => setPendingDifficulty(null)}>
                  Cancel
                </IconButton>
                <IconButton
                  onClick={confirmSelection}
                  tone={selectedLevel.accent === "coral" ? "warm" : "success"}
                >
                  {selectedLevel.id === difficulty ? "Keep Current" : "Start Game"}
                </IconButton>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
