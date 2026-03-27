import { AnimatePresence, motion } from "framer-motion";
import IconButton from "./IconButton";

function Section({ title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-50">{title}</h3>
      <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{children}</div>
    </section>
  );
}

export default function InstructionsModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-[#020817]/80 px-4 py-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, x: 18, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 18, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Instructions</p>
                <h2 className="mt-3 font-display text-3xl text-foam">How to command the fleet</h2>
              </div>
              <IconButton onClick={onClose}>Close</IconButton>
            </div>

            <div className="mt-6 grid gap-4">
              <Section title="Rules">
                <p>Place your five ships on the player grid without overlap.</p>
                <p>Click the opponent grid to fire one shot per turn.</p>
                <p>Sink the entire enemy fleet before the AI sinks yours.</p>
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
