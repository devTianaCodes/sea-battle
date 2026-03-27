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
  onRotate,
  selectedShipName,
}) {
  return (
    <div className="space-y-6">
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
          onRotate={onRotate}
          selectedShipName={selectedShipName}
        />
      </motion.div>
    </div>
  );
}
