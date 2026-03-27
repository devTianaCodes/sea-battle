import { GRID_SIZE, SHIP_DEFINITIONS, SHOT_RESULTS } from "../data/constants";
import {
  coordinateKey,
  createPlacedShip,
  getShipAtCoordinate,
  getShipCoverageMap,
  getShipDefinition,
  getShipCells,
  isInBounds,
  isShipSunk,
} from "./ships";

export function initializeEmptyBoard() {
  return Array.from({ length: GRID_SIZE }, (_, row) =>
    Array.from({ length: GRID_SIZE }, (_, col) => ({
      row,
      col,
      shipId: null,
      state: "empty",
    }))
  );
}

export function initializeShips() {
  return SHIP_DEFINITIONS.map((ship) => ({
    id: ship.id,
    name: ship.name,
    size: ship.size,
    positions: [],
    sunk: false,
  }));
}

export function calculateHit(row, col, fleet) {
  const ship = getShipAtCoordinate(fleet, col, row);
  return {
    hit: Boolean(ship),
    shipId: ship?.id ?? null,
  };
}

export function isSunkShip(shipId, fleet) {
  const ship = fleet.find((candidate) => candidate.id === shipId);
  return Boolean(ship && isShipSunk(ship));
}

export function getAdjacentCells(row, col) {
  return [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ].filter((cell) => isInBounds(cell.col, cell.row));
}

export function isValidShipPlacement(positions, fleet) {
  if (!positions.length) {
    return false;
  }

  const occupied = new Set(
    fleet.flatMap((ship) => ship.cells.map((cell) => coordinateKey(cell.x, cell.y)))
  );

  return positions.every((position) => {
    const x = position.x ?? position.col;
    const y = position.y ?? position.row;
    return isInBounds(x, y) && !occupied.has(coordinateKey(x, y));
  });
}

export function getBoardWithShips(board, fleet) {
  const shipMap = getShipCoverageMap(fleet);

  return board.map((row) =>
    row.map((cell) => {
      const ship = shipMap[coordinateKey(cell.col, cell.row)];
      return {
        ...cell,
        shipId: ship?.id ?? null,
        state: ship ? "ship" : cell.state,
      };
    })
  );
}

export function createShipPlacement(shipId, startCol, startRow, orientation) {
  const ship = getShipDefinition(shipId);
  return createPlacedShip(ship, startCol, startRow, orientation);
}

export function getGameStats(shots, fleet) {
  const hits = shots.filter((shot) => shot.result !== SHOT_RESULTS.MISS).length;
  const misses = shots.length - hits;
  const sunk = fleet.filter((ship) => isShipSunk(ship)).length;

  return {
    hits,
    misses,
    totalShots: shots.length,
    accuracy: shots.length ? Math.round((hits / shots.length) * 100) : 0,
    shipsSunk: sunk,
  };
}

export function normalizeFleetForStore(fleet) {
  return fleet.map((ship) => ({
    id: ship.id,
    positions: ship.cells.map((cell) => ({ row: cell.y, col: cell.x })),
    sunk: isShipSunk(ship),
  }));
}

export function getShipPlacementCells(shipId, row, col, orientation) {
  const ship = getShipDefinition(shipId);
  return getShipCells(ship, col, row, orientation).map((cell) => ({
    row: cell.y,
    col: cell.x,
  }));
}
