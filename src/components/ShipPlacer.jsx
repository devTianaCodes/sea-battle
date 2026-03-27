import { motion } from "framer-motion";
import FleetSidebar from "./FleetSidebar";
import ShipPlacementPanel from "./ShipPlacementPanel";

export default function ShipPlacer({
  phase,
  availableShips,
  playerFleet,
  selectedShipId,
  orientation,
  onSelectShip,
  canConfirm,
  onConfirm,
  onRandomize,
  onClear,
  onRotate,
  selectedShipName,
}) {
  return (
    <div className="glass-panel animate-slide-up-fast rounded-[1.8rem] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Placement</p>
          <h2 className="text-sm uppercase tracking-[0.28em] text-slate-300">Minimal deployment flow</h2>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[15rem,1fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FleetSidebar
            availableShips={availableShips}
            playerFleet={playerFleet}
            selectedShipId={selectedShipId}
            orientation={orientation}
            onSelectShip={onSelectShip}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          <ShipPlacementPanel
            phase={phase}
            canConfirm={canConfirm}
            onConfirm={onConfirm}
            onRandomize={onRandomize}
            onClear={onClear}
            onRotate={onRotate}
            selectedShipName={selectedShipName}
          />
        </motion.div>
      </div>
    </div>
  );
}
