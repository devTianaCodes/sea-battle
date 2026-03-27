import { motion } from "framer-motion";
import IconButton from "./IconButton";

function StatPreview({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] px-4 py-4">
      <div className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-foam">{value}</div>
    </div>
  );
}

export default function MainMenu({
  historySummary,
  onPlayClick,
  onInstructionsClick,
  onStatsClick,
}) {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_bottom,rgba(0,212,255,0.12),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-panel relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] p-8 sm:p-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,107,107,0.12),transparent_28%)]" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-xs uppercase tracking-[0.45em] text-cyan/70"
            >
              Naval Interface
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="mt-4 font-display text-5xl text-foam sm:text-6xl"
            >
              Sea Battle
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <IconButton onClick={onPlayClick}>
                Play
              </IconButton>
              <IconButton onClick={onInstructionsClick} tone="accent">
                Instructions
              </IconButton>
              <IconButton onClick={onStatsClick}>
                Statistics
              </IconButton>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5"
          >
            <div className="text-xs uppercase tracking-[0.35em] text-cyan/70">Archive Snapshot</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <StatPreview label="Matches" value={historySummary.totalMatches} />
              <StatPreview label="Wins" value={historySummary.wins} />
              <StatPreview label="Best Accuracy" value={`${historySummary.bestAccuracy}%`} />
              <StatPreview label="Average Accuracy" value={`${historySummary.averageAccuracy}%`} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
