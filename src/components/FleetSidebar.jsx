import clsx from "clsx";
import { motion } from "framer-motion";
import { SHIP_DEFINITIONS } from "../data/constants";

export default function FleetSidebar({
  availableShips,
  playerFleet,
  selectedShipId,
  onSelectShip,
}) {
  const availableIds = new Set(availableShips.map((ship) => ship.id));

  return (
    <div className="glass-light min-w-0 w-full max-w-full overflow-hidden rounded-[1.2rem] p-3 sm:rounded-[1.4rem] sm:p-4">
      <div className="mb-2.5 sm:mb-3">
        <p className="text-[0.76rem] uppercase tracking-[0.16em] text-cyan-100 sm:text-[0.82rem] sm:tracking-[0.22em]">
          Ships
        </p>
        <h2 className="text-[0.98rem] uppercase tracking-[0.12em] text-foam sm:text-[1.05rem] sm:tracking-[0.16em]">
          Deployment
        </h2>
        <div className="mt-2 h-px w-full bg-cyan/15" />
      </div>
      <div className="flex min-w-0 w-full max-w-full gap-1.5 overflow-x-auto pb-1 md:flex-col md:gap-2 md:overflow-visible">
        {SHIP_DEFINITIONS.map((ship) => {
          const isPlaced = playerFleet.some((placedShip) => placedShip.id === ship.id);
          const isAvailable = availableIds.has(ship.id);
          const isSelected = selectedShipId === ship.id;

          return (
            <motion.button
              key={ship.id}
              type="button"
              onClick={() => onSelectShip(ship.id)}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
              className={clsx(
                "flex flex-none items-center justify-between rounded-[0.95rem] border text-left transition duration-200 md:min-w-0 md:w-full md:flex-1",
                "min-w-[7.1rem] max-w-[7.4rem] px-2.5 py-2 sm:min-w-[8.2rem] sm:max-w-[8.5rem] sm:px-3 sm:py-2.5 md:max-w-none",
                isSelected
                  ? "border-cyan/60 bg-cyan/[0.12] shadow-[0_0_0_1px_rgba(0,212,255,0.2)]"
                  : isPlaced
                    ? "border-mint/25 bg-mint/[0.08] hover:border-mint/35 hover:bg-mint/[0.11]"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
              )}
            >
              <div className="min-w-0">
                <div className="truncate text-[0.82rem] font-medium text-foam sm:text-[0.92rem]">
                  {ship.name}
                </div>
                <div className="text-[0.6rem] uppercase tracking-[0.04em] text-slate-300 sm:text-[0.66rem] sm:tracking-[0.05em]">
                  {ship.size} cells {isPlaced ? "placed" : isAvailable ? "ready" : "queued"}
                </div>
              </div>
              <div className="ml-2 flex shrink-0 gap-0.5 sm:gap-1">
                {Array.from({ length: ship.size }).map((_, index) => (
                  <span
                    key={`${ship.id}-${index}`}
                    className={`h-1.5 w-2.5 rounded-full bg-gradient-to-r sm:w-3.5 ${ship.color} ${
                      isPlaced && !isSelected ? "opacity-50" : "opacity-90"
                    }`}
                  />
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
