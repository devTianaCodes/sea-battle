import { AnimatePresence, motion } from "framer-motion";

function ParticleBurst({ colorClass, duration = 0.55 }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 6 }).map((_, index) => {
        const angle = (index / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 16;
        const y = Math.sin(angle) * 16;

        return (
          <motion.span
            key={index}
            initial={{ opacity: 0.9, x: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, x, y, scale: 0.2 }}
            transition={{ duration, ease: "easeOut" }}
            className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${colorClass}`}
          />
        );
      })}
    </div>
  );
}

export default function BattleEffects({ cell }) {
  if (!cell?.isRecentShot || (!cell.isHit && !cell.isMiss)) {
    return null;
  }

  const sunk = cell.isHit && cell.isSunkReveal;
  const hit = cell.isHit && !cell.isMiss;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${cell.x}-${cell.y}-${cell.isHit ? "hit" : "miss"}`}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        {hit ? (
          <>
            <motion.div
              initial={{ opacity: 0.9, scale: 0.6 }}
              animate={{ opacity: 0, scale: sunk ? 1.4 : 1.15 }}
              transition={{ duration: sunk ? 0.8 : 0.35, ease: "easeOut" }}
              className={`absolute inset-[12%] rounded-full ${
                sunk ? "bg-mint/30" : "bg-coral/35"
              } blur-sm`}
            />
            <ParticleBurst colorClass={sunk ? "bg-mint" : "bg-coral"} duration={sunk ? 0.8 : 0.45} />
            {sunk ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="absolute inset-x-0 top-1 flex justify-center"
              >
                <span className="rounded-full border border-mint/30 bg-[#061f19]/85 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.25em] text-mint">
                  Ship Sunk
                </span>
              </motion.div>
            ) : null}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0.9, scale: 0.35 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-[18%] rounded-full border border-cyan/45"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
