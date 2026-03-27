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
    <div className="glass-light rounded-[1.5rem] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Ships</p>
          <h2 className="text-sm uppercase tracking-[0.26em] text-slate-300">Deployment</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-slate-300">
          {orientation === ORIENTATIONS.HORIZONTAL ? "H" : "V"}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
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
                "flex min-w-[132px] flex-1 items-center justify-between rounded-[1.15rem] border px-3 py-3 text-left transition duration-200 lg:min-w-0",
                isSelected
                  ? "border-cyan/60 bg-cyan/[0.12] shadow-[0_0_0_1px_rgba(0,212,255,0.2)]"
                  : isPlaced
                    ? "border-white/15 bg-white/[0.07] hover:border-cyan/25 hover:bg-white/[0.09]"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
              )}
            >
              <div>
                <div className="text-sm font-medium text-foam">{ship.name}</div>
                <div className="text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">
                  {ship.size} cells {isPlaced ? "placed" : isAvailable ? "ready" : ""}
                </div>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: ship.size }).map((_, index) => (
                  <span
                    key={`${ship.id}-${index}`}
                    className={`h-2 w-4 rounded-full bg-gradient-to-r ${ship.color} ${
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
