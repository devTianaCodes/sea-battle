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
    <div className="glass-panel rounded-[2rem] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Fleet</p>
          <h2 className="font-display text-xl text-foam">Deployment</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-300">
          {orientation === ORIENTATIONS.HORIZONTAL ? "Horizontal" : "Vertical"}
        </div>
      </div>
      <div className="space-y-3">
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
                "flex w-full items-center justify-between rounded-3xl border px-4 py-3 text-left transition duration-200",
                isSelected
                  ? "border-cyan/50 bg-cyan/12 shadow-[0_0_0_1px_rgba(0,212,255,0.2)]"
                  : isPlaced
                    ? "border-white/15 bg-white/[0.07] hover:border-cyan/25 hover:bg-white/[0.09]"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
              )}
            >
              <div>
                <div className="font-medium text-foam">{ship.name}</div>
                <div className="text-xs text-slate-400">
                  {ship.size} tiles {isPlaced ? "• click to reposition" : isAvailable ? "• ready" : ""}
                </div>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: ship.size }).map((_, index) => (
                  <span
                    key={`${ship.id}-${index}`}
                    className={`h-2.5 w-6 rounded-full bg-gradient-to-r ${ship.color} ${
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
