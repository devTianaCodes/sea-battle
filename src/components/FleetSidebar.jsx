import clsx from "clsx";
import { motion } from "framer-motion";
import { ORIENTATIONS, SHIP_DEFINITIONS } from "../data/constants";

export default function FleetSidebar({
  availableShips,
  playerFleet,
  selectedShipId,
  orientation,
  onSelectShip,
}) {
  const availableIds = new Set(availableShips.map((ship) => ship.id));

  return (
    <div className="glass-light min-w-0 w-full max-w-full overflow-hidden rounded-[1.1rem] p-2.5 sm:rounded-[1.35rem] sm:p-3">
      <div className="mb-2 flex items-center justify-between sm:mb-2.5">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-cyan/70 sm:text-xs sm:tracking-[0.24em]">
            Ships
          </p>
          <h2 className="text-[0.82rem] uppercase tracking-[0.14em] text-slate-300 sm:text-sm sm:tracking-[0.18em]">
            Deployment
          </h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[0.52rem] uppercase tracking-[0.12em] text-slate-300 sm:px-2.5 sm:py-1 sm:text-[0.58rem] sm:tracking-[0.16em]">
          {orientation === ORIENTATIONS.HORIZONTAL ? "H" : "V"}
        </div>
      </div>
      <div className="flex min-w-0 w-full max-w-full gap-1 overflow-x-auto pb-1 md:flex-col md:gap-1.5 md:overflow-visible">
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
                "min-w-[6.6rem] max-w-[6.9rem] px-2 py-1.5 sm:min-w-[7.6rem] sm:max-w-[7.9rem] sm:px-2.5 sm:py-2 md:max-w-none",
                isSelected
                  ? "border-cyan/60 bg-cyan/[0.12] shadow-[0_0_0_1px_rgba(0,212,255,0.2)]"
                  : isPlaced
                    ? "border-white/15 bg-white/[0.07] hover:border-cyan/25 hover:bg-white/[0.09]"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
              )}
              >
              <div className="min-w-0">
                <div className="truncate text-[0.72rem] font-medium text-foam sm:text-[0.8rem]">
                  {ship.name}
                </div>
                <div className="text-[0.52rem] uppercase tracking-[0.04em] text-slate-500 sm:text-[0.58rem] sm:tracking-[0.06em]">
                  {ship.size} cells {isPlaced ? "placed" : isAvailable ? "ready" : ""}
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
