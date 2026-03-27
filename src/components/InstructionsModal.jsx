import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import useDialogA11y from "../hooks/useDialogA11y";
import IconButton from "./IconButton";

function Section({ title, children }) {
  return (
    <section className="rounded-[1rem] border border-white/10 bg-white/[0.04] p-3 sm:rounded-3xl sm:p-4">
      <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-cyan-50 sm:text-sm sm:tracking-[0.28em]">
        {title}
      </h3>
      <div className="mt-2 space-y-1.5 text-[0.8rem] leading-5 text-slate-300 sm:mt-3 sm:space-y-2 sm:text-sm sm:leading-6">
        {children}
      </div>
    </section>
  );
}

export default function InstructionsModal({ open, onClose }) {
  useBodyScrollLock(open);
  const titleId = useId();
  const descriptionId = useId();
  const { dialogRef, initialFocusRef } = useDialogA11y(open, onClose);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-[15px] z-[55] flex items-center justify-center rounded-[20px] bg-[#020817]/80 p-2 backdrop-blur-md sm:p-3"
        >
          <motion.div
            initial={{ opacity: 0, x: 18, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 18, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            className="glass-frosted flex max-h-full w-full max-w-3xl flex-col overflow-y-auto rounded-[1.35rem] p-3 sm:rounded-[2rem] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-cyan/70 sm:text-xs sm:tracking-[0.28em]">
                  Instructions
                </p>
                <h2 id={titleId} className="mt-2 font-display text-[1.45rem] text-foam sm:mt-3 sm:text-3xl">
                  How to command the fleet
                </h2>
              </div>
              <IconButton
                onClick={onClose}
                className="px-3 py-2 text-[0.72rem] tracking-[0.08em] sm:text-sm"
                ref={initialFocusRef}
              >
                Close
              </IconButton>
            </div>

            <div id={descriptionId} className="mt-4 grid gap-3 sm:mt-6 sm:gap-5">
              <Section title="Rules">
                <p>Place your five ships on the player grid without overlap.</p>
                <p>Click the opponent grid to fire one shot per turn.</p>
                <p>Sink the entire enemy fleet before the enemy sinks yours.</p>
              </Section>

              <Section title="Controls">
                <p>`Click / Tap` to place ships or fire at a target cell.</p>
                <p>`R` rotates the selected ship during setup.</p>
                <p>`Arrow Keys` move board focus.</p>
                <p>`Enter / Space` confirms the active board action.</p>
              </Section>

              <Section title="Difficulty">
                <p><strong>Easy</strong>: random shots with light pressure.</p>
                <p><strong>Medium</strong>: parity search with focused follow-up.</p>
                <p><strong>Hard</strong>: probability hunting with efficient finish patterns.</p>
              </Section>

              <Section title="Tips">
                <p>Spread ships out so one lucky hit does not expose a cluster.</p>
                <p>Use misses to erase lanes before overcommitting around a hit.</p>
                <p>The intel panel tracks streaks, sunk ships, and recent action. Use it.</p>
              </Section>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
