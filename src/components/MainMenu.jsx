import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import IconButton from "./IconButton";

export default function MainMenu({
  historySummary,
  onPlayClick,
  onInstructionsClick,
  onSettingsClick,
  onStatsClick,
}) {
  const [activeAction, setActiveAction] = useState("instructions");
  const playButtonRef = useRef(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      playButtonRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const actionOrder = ["instructions", "settings", "stats"];

    function handleKeyDown(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onPlayClick();
        return;
      }

      const lowerKey = event.key.toLowerCase();

      if (lowerKey === "i") {
        event.preventDefault();
        setActiveAction("instructions");
        onInstructionsClick();
        return;
      }

      if (lowerKey === "s") {
        event.preventDefault();
        setActiveAction("settings");
        onSettingsClick();
        return;
      }

      if (lowerKey === "t") {
        event.preventDefault();
        setActiveAction("stats");
        onStatsClick();
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        setActiveAction((current) => {
          const currentIndex = actionOrder.indexOf(current);
          return actionOrder[(currentIndex - 1 + actionOrder.length) % actionOrder.length];
        });
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        setActiveAction((current) => {
          const currentIndex = actionOrder.indexOf(current);
          return actionOrder[(currentIndex + 1) % actionOrder.length];
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onInstructionsClick, onPlayClick, onSettingsClick, onStatsClick]);

  return (
    <section
      aria-labelledby="main-menu-title"
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-3 py-4 text-center sm:px-8 sm:py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex w-full max-w-4xl flex-1 flex-col justify-center"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-[0.72rem] uppercase tracking-[0.18em] text-cyan-100 sm:text-[0.84rem] sm:tracking-[0.24em]"
        >
          Tactical Launch
        </motion.p>
        <motion.h1
          id="main-menu-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-4 font-display text-[2.3rem] font-semibold tracking-[0.1em] text-cyan-100 drop-shadow-[0_0_14px_rgba(0,212,255,0.18)] sm:mt-6 sm:text-[4.5rem] sm:tracking-[0.14em]"
        >
          SEA BATTLE
        </motion.h1>
        <p className="sr-only">
          Press Play to start, or use the instructions, settings, and statistics buttons to review the game before launching.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          className="mt-7 flex justify-center sm:mt-12"
        >
          <IconButton
            ref={playButtonRef}
            onClick={onPlayClick}
            tone="accent"
            size="lg"
            className="animate-pulse-subtle min-h-12 min-w-[168px] !border-cyan/45 shadow-[0_0_18px_rgba(0,212,255,0.14)] px-6 text-[0.95rem] font-semibold uppercase tracking-[0.16em] sm:min-h-16 sm:min-w-[260px] sm:px-9 sm:text-[1.05rem] sm:tracking-[0.26em]"
            ariaLabel="Play Sea Battle"
          >
            Play
          </IconButton>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.24 }}
          className="mt-8 flex items-center justify-center gap-2.5 sm:mt-14 sm:gap-4"
        >
          <IconButton
            onClick={onInstructionsClick}
            ariaLabel="Open instructions"
            title="Instructions"
            shape="circle"
            className={clsx(
              activeAction === "instructions" && "ring-2 ring-cyan/70 ring-offset-2 ring-offset-[#071120]"
            )}
          >
            ?
          </IconButton>
          <IconButton
            onClick={onSettingsClick}
            ariaLabel="Open settings"
            title="Settings"
            shape="circle"
            className={clsx(
              activeAction === "settings" && "ring-2 ring-cyan/70 ring-offset-2 ring-offset-[#071120]"
            )}
          >
            ⚙
          </IconButton>
          <IconButton
            onClick={onStatsClick}
            ariaLabel="Open statistics"
            title="Statistics"
            shape="circle"
            className={clsx(
              activeAction === "stats" && "ring-2 ring-cyan/70 ring-offset-2 ring-offset-[#071120]"
            )}
          >
            #
          </IconButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.34 }}
          className="mt-7 px-3 text-[0.72rem] uppercase tracking-[0.08em] text-slate-300 sm:mt-10 sm:px-4 sm:text-[0.86rem] sm:tracking-[0.14em]"
        >
          {historySummary.totalMatches} matches | {historySummary.wins} wins | best accuracy {historySummary.bestAccuracy}%
        </motion.div>
      </motion.div>
    </section>
  );
}
