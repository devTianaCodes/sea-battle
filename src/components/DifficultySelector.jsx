import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { DIFFICULTY_LEVELS } from "../data/constants";

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
      className="difficulty-screen mx-auto flex h-full w-full min-w-0 max-w-4xl flex-col justify-center overflow-visible pt-0 pb-0.5 sm:py-2"
    >
      <div className="mb-6 flex min-w-0 flex-wrap items-center justify-center gap-2 px-0.5 text-center sm:mb-10 sm:justify-between sm:gap-3 sm:px-0 sm:text-left">
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
      </div>
      <p className="sr-only">
        Use arrow keys to move between difficulty options and press Enter or Space to confirm the selected difficulty.
      </p>

      <div className="difficulty-options grid min-w-0 w-full grid-cols-1 gap-2 px-6 py-2 sm:grid-cols-3 sm:gap-4 sm:px-3 sm:py-3 lg:gap-5">
        {DIFFICULTY_LEVELS.map((level, index) => {
          const active = level.id === difficulty;
          const pending = level.id === selecting;
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
                "glass-light w-full min-w-0 max-w-full rounded-full border px-5 py-4 text-center transition duration-200 focus:outline-none sm:min-h-[8.5rem] sm:rounded-[1.4rem] sm:px-4 sm:py-5",
                "!border-cyan/45 shadow-[0_0_18px_rgba(0,212,255,0.14)] hover:!border-cyan/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.28)]",
                "bg-white/[0.03]",
                focused && "ring-2 ring-cyan/70 ring-offset-2 ring-offset-[#061f19]",
                disabled && "cursor-not-allowed opacity-40"
              )}
              aria-pressed={active || pending}
              aria-current={active ? "true" : undefined}
              aria-label={`${level.name} difficulty`}
              onFocus={() => setFocusedIndex(index)}
            >
              <div className="flex h-full items-center justify-center gap-3 text-center sm:flex-col sm:gap-2">
                <div className="text-xl sm:text-4xl">{level.emoji}</div>
                <div className="text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-foam sm:text-xl">
                  {pending ? `Starting ${level.name}` : level.name}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
