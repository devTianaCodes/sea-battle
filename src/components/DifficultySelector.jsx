import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { DIFFICULTY_LEVELS } from "../data/constants";
import IconButton from "./IconButton";

export default function DifficultySelector({
  difficulty,
  onChange,
  historySummary,
  onBack,
  disabled = false,
}) {
  const [selecting, setSelecting] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(() =>
    Math.max(
      0,
      DIFFICULTY_LEVELS.findIndex((level) => level.id === difficulty)
    )
  );
  const selectionTimeoutRef = useRef(null);

  useEffect(() => {
    setFocusedIndex(
      Math.max(
        0,
        DIFFICULTY_LEVELS.findIndex((level) => level.id === difficulty)
      )
    );
  }, [difficulty]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (disabled) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onBack();
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedIndex((current) => (current - 1 + DIFFICULTY_LEVELS.length) % DIFFICULTY_LEVELS.length);
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedIndex((current) => (current + 1) % DIFFICULTY_LEVELS.length);
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectDifficulty(DIFFICULTY_LEVELS[focusedIndex].id);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (selectionTimeoutRef.current) {
        window.clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, [disabled, focusedIndex, onBack]);

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

  function selectDifficulty(levelId) {
    if (disabled || selecting) {
      return;
    }

    setSelecting(levelId);
    selectionTimeoutRef.current = window.setTimeout(() => {
      onChange(levelId);
      setSelecting(null);
    }, 200);
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center py-2">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan/70">Difficulty</p>
          <h1 className="mt-3 font-display text-3xl text-foam sm:text-4xl">Choose Difficulty</h1>
        </div>
        <IconButton onClick={onBack} className="hidden sm:inline-flex">
          Back
        </IconButton>
      </div>

      <div className="grid gap-4 lg:gap-5 md:grid-cols-3">
        {DIFFICULTY_LEVELS.map((level, index) => {
          const active = level.id === difficulty;
          const pending = level.id === selecting;
          const stats = getDifficultyStats(level.id);
          const focused = index === focusedIndex;
          const toneClass =
            level.accent === "mint"
              ? "border-mint/30 hover:border-mint/70 hover:shadow-[0_0_24px_rgba(74,222,128,0.2)]"
              : level.accent === "coral"
                ? "border-coral/30 hover:border-coral/70 hover:shadow-[0_0_24px_rgba(255,107,107,0.2)]"
                : "border-cyan/30 hover:border-cyan/70 hover:shadow-[0_0_24px_rgba(0,212,255,0.2)]";

          return (
            <motion.button
              key={level.id}
              type="button"
              disabled={disabled}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.08 }}
              whileHover={disabled ? undefined : { scale: 1.03 }}
              whileTap={disabled ? undefined : { scale: 0.985 }}
              onClick={() => selectDifficulty(level.id)}
              className={clsx(
                "glass-light min-h-[240px] rounded-[1.4rem] border px-5 py-6 text-left transition duration-200 md:min-h-[300px]",
                toneClass,
                active || pending
                  ? level.accent === "mint"
                    ? "border-mint/80 bg-mint/[0.09] shadow-[0_0_28px_rgba(74,222,128,0.22)]"
                    : level.accent === "coral"
                      ? "border-coral/80 bg-coral/[0.09] shadow-[0_0_28px_rgba(255,107,107,0.24)]"
                      : "border-cyan/80 bg-cyan/[0.09] shadow-[0_0_28px_rgba(0,212,255,0.22)]"
                  : "bg-white/[0.03]",
                focused && "ring-2 ring-cyan/70 ring-offset-2 ring-offset-[#071120]",
                disabled && "cursor-not-allowed opacity-40"
              )}
              aria-pressed={active || pending}
              onMouseEnter={() => setFocusedIndex(index)}
              onFocus={() => setFocusedIndex(index)}
            >
              <div className="flex h-full flex-col items-center justify-between text-center">
                <div>
                  <div className="text-5xl">{level.emoji}</div>
                  <div className="mt-4 text-xl font-semibold uppercase tracking-[0.12em] text-foam">
                    {level.name}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{level.description}</p>
                  <p className="mt-3 text-[0.72rem] uppercase tracking-[0.12em] text-slate-500">
                    {stats.matches
                      ? `${stats.winRate}% win rate across ${stats.matches} runs`
                      : "No archive data yet"}
                  </p>
                </div>
                <div className="mt-8 w-full">
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: 4 }).map((_, barIndex) => {
                      const filled =
                        level.id === "easy"
                          ? barIndex < 1
                          : level.id === "medium"
                            ? barIndex < 3
                            : true;

                      return (
                        <span
                          key={`${level.id}-${barIndex}`}
                          className={`h-1.5 w-10 rounded-full ${
                            filled ? "bg-cyan/70" : "bg-white/[0.08]"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-4 text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
                    {pending ? `Starting ${level.name}...` : active ? "Current default" : "Select"}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-5 sm:hidden">
        <IconButton onClick={onBack}>Back</IconButton>
      </div>
    </div>
  );
}
