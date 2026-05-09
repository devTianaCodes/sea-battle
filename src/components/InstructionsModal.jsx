import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import useDialogA11y from "../hooks/useDialogA11y";
import FleetCompositionCard from "./FleetCompositionCard";
import IconButton from "./IconButton";

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
          className="fixed inset-0 z-[55] flex items-center justify-center p-2 sm:p-3"
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

            <div className="mt-4 sm:mt-6">
              <FleetCompositionCard descriptionId={descriptionId} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
