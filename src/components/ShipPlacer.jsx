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
  selectedShipSize,
}) {
  return (
    <div className="flex h-full flex-col gap-1.5 md:gap-2">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <FleetSidebar
          availableShips={availableShips}
          playerFleet={playerFleet}
          selectedShipId={selectedShipId}
          onSelectShip={onSelectShip}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: 0.04 }}
      >
        <ShipPlacementPanel
          phase={phase}
          canConfirm={canConfirm}
          onConfirm={onConfirm}
          onRandomize={onRandomize}
          onClear={onClear}
          onRotate={onRotate}
          selectedShipName={selectedShipName}
          selectedShipSize={selectedShipSize}
          orientation={orientation}
        />
      </motion.div>
    </div>
  );
}
