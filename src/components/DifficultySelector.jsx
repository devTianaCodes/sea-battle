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
  const [showKeyboardFocus, setShowKeyboardFocus] = useState(false);
  const optionRefs = useRef([]);
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
    const frameId = window.requestAnimationFrame(() => {
      optionRefs.current[focusedIndex]?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [focusedIndex]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (disabled) {
        return;
      }

      if (
        event.key === "Tab" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      ) {
        setShowKeyboardFocus(true);
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
        setShowKeyboardFocus(true);
        selectDifficulty(DIFFICULTY_LEVELS[focusedIndex].id);
      }
    }

    function handlePointerDown() {
      setShowKeyboardFocus(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
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
    <section
      aria-labelledby="difficulty-screen-title"
      className="mx-auto flex h-auto w-full min-w-0 max-w-6xl flex-col justify-start overflow-visible pt-0 pb-0.5 sm:h-full sm:justify-center sm:py-2"
    >
      <div className="mb-1.5 flex min-w-0 flex-wrap items-center justify-between gap-2 px-0.5 sm:mb-8 sm:gap-3 sm:px-0">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-cyan-100 sm:text-xs sm:tracking-[0.24em]">
            Difficulty
          </p>
          <h1
            id="difficulty-screen-title"
            className="mt-1 font-display text-[1.35rem] leading-tight text-foam sm:mt-3 sm:text-4xl"
          >
            Choose Difficulty
          </h1>
        </div>
        <IconButton onClick={onBack} className="hidden sm:inline-flex">
          Back
        </IconButton>
      </div>
      <p className="sr-only">
        Use arrow keys to move between difficulty options and press Enter or Space to confirm the selected difficulty.
      </p>

      <div className="grid min-w-0 w-full grid-cols-3 gap-1.5 px-2 py-2 sm:gap-4 sm:px-3 sm:py-3 md:grid-cols-3 lg:gap-5">
        {DIFFICULTY_LEVELS.map((level, index) => {
          const active = level.id === difficulty;
          const pending = level.id === selecting;
          const stats = getDifficultyStats(level.id);
          const focused = showKeyboardFocus && index === focusedIndex;

          return (
            <motion.button
              key={level.id}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              disabled={disabled}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.08 }}
              whileHover={disabled ? undefined : { scale: 1.015 }}
              whileTap={disabled ? undefined : { scale: 0.985 }}
              onClick={() => selectDifficulty(level.id)}
              className={clsx(
                "glass-light min-h-[8.75rem] w-full min-w-0 max-w-full rounded-[0.9rem] border px-2 py-2.5 text-left transition duration-200 focus:outline-none sm:min-h-[240px] sm:rounded-[1.4rem] sm:px-4 sm:py-5 md:min-h-[290px]",
                "!border-cyan/45 shadow-[0_0_18px_rgba(0,212,255,0.14)] hover:!border-cyan/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.28)]",
                "bg-white/[0.03]",
                focused && "ring-2 ring-cyan/70 ring-offset-2 ring-offset-[#061f19]",
                disabled && "cursor-not-allowed opacity-40"
              )}
              aria-pressed={active || pending}
              aria-current={active ? "true" : undefined}
              aria-label={`${level.name} difficulty. ${level.description}`}
              onFocus={() => setFocusedIndex(index)}
            >
              <div className="flex h-full flex-col items-center justify-between text-center">
                <div className="w-full">
                  <div className="text-2xl sm:text-5xl">{level.emoji}</div>
                  <div className="mt-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-foam sm:mt-4 sm:text-xl sm:tracking-[0.12em]">
                    {level.name}
                  </div>
                  <p className="mt-1.5 h-[2rem] overflow-hidden text-[0.64rem] leading-4 text-slate-200 sm:mt-3 sm:h-auto sm:text-sm sm:leading-6">
                    {level.description}
                  </p>
                  <p className="mt-1 text-[0.56rem] uppercase tracking-[0.04em] text-slate-300 sm:mt-3 sm:text-[0.72rem] sm:tracking-[0.1em]">
                    {stats.matches
                      ? `${stats.winRate}% win rate across ${stats.matches} runs`
                      : "No archive data yet"}
                  </p>
                </div>
                <div className="mt-2.5 w-full sm:mt-8">
                  <div className="flex justify-center gap-1 sm:gap-2">
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
                          className={`h-1 w-4 rounded-full sm:h-1.5 sm:w-10 ${
                            filled ? "bg-cyan/70" : "bg-white/[0.08]"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-2 text-[0.56rem] uppercase tracking-[0.08em] text-slate-300 sm:mt-4 sm:text-[0.68rem] sm:tracking-[0.14em]">
                    {pending ? `Starting ${level.name}...` : active ? "Current default" : "Select"}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-2 w-full sm:hidden">
        <IconButton onClick={onBack} className="w-full justify-center px-3 py-2 text-[0.72rem] tracking-[0.08em]">
          Back
        </IconButton>
      </div>
    </section>
  );
}
