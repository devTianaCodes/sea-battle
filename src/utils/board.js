import { GRID_SIZE, ORIENTATIONS, SHIP_DEFINITIONS, SHOT_RESULTS } from "../data/constants";
import {
  coordinateKey,
  createPlacedShip,
  getShipAtCoordinate,
  getShipCells,
  getShipCoverageMap,
  isInBounds,
  isShipSunk,
} from "./ships";

export function createEmptyBoard() {
  return Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) => ({
      x,
      y,
      shipId: null,
      isHit: false,
      isMiss: false,
      isSunkReveal: false,
    }))
  );
}

export function hasShotAt(shots, x, y) {
  return shots.some((shot) => shot.x === x && shot.y === y);
}

export function canPlaceShip(fleet, ship, x, y, orientation) {
  const cells = getShipCells(ship, x, y, orientation);

  if (!cells.every((cell) => isInBounds(cell.x, cell.y))) {
    return false;
  }

  return !cells.some((cell) =>
    fleet.some((placedShip) =>
      placedShip.cells.some(
        (occupiedCell) => occupiedCell.x === cell.x && occupiedCell.y === cell.y
      )
    )
  );
}

export function placeShip(fleet, ship, x, y, orientation) {
  if (!canPlaceShip(fleet, ship, x, y, orientation)) {
    return fleet;
  }

  const filteredFleet = fleet.filter((placedShip) => placedShip.id !== ship.id);
  return [...filteredFleet, createPlacedShip(ship, x, y, orientation)];
}

export function randomizeFleet(shipDefinitions = SHIP_DEFINITIONS) {
  const nextFleet = [];

  for (const ship of shipDefinitions) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 500) {
      attempts += 1;
      const orientation =
        Math.random() > 0.5 ? ORIENTATIONS.HORIZONTAL : ORIENTATIONS.VERTICAL;
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);

      if (!canPlaceShip(nextFleet, ship, x, y, orientation)) {
        continue;
      }

      nextFleet.push(createPlacedShip(ship, x, y, orientation));
      placed = true;
    }

    if (!placed) {
      return randomizeFleet(shipDefinitions);
    }
  }

  return nextFleet;
}

export function receiveShot(fleet, shots, x, y) {
  if (hasShotAt(shots, x, y)) {
    return {
      fleet,
      shot: null,
      repeated: true,
    };
  }

  const targetShip = getShipAtCoordinate(fleet, x, y);

  if (!targetShip) {
    return {
      fleet,
      repeated: false,
      shot: {
        x,
        y,
        result: SHOT_RESULTS.MISS,
        shipId: null,
      },
    };
  }

  const nextFleet = fleet.map((ship) => {
    if (ship.id !== targetShip.id) {
      return ship;
    }

    return {
      ...ship,
      hits: [...ship.hits, coordinateKey(x, y)],
    };
  });

  const updatedShip = nextFleet.find((ship) => ship.id === targetShip.id);
  const sunk = isShipSunk(updatedShip);

  return {
    fleet: nextFleet,
    repeated: false,
    shot: {
      x,
      y,
      result: sunk ? SHOT_RESULTS.SUNK : SHOT_RESULTS.HIT,
      shipId: targetShip.id,
    },
  };
}

export function allShipsSunk(fleet) {
  return fleet.length === SHIP_DEFINITIONS.length && fleet.every(isShipSunk);
}

export function getSunkShip(fleet, shipId) {
  const ship = fleet.find((candidate) => candidate.id === shipId);
  return ship && isShipSunk(ship) ? ship : null;
}

export function buildBoardMatrix({ fleet, shots, revealShips = false, preview = null }) {
  const board = createEmptyBoard();
  const shipMap = getShipCoverageMap(fleet);

  board.forEach((row) => {
    row.forEach((cell) => {
      const key = coordinateKey(cell.x, cell.y);
      const ship = shipMap[key];
      const shot = shots.find((candidate) => candidate.x === cell.x && candidate.y === cell.y);

      if (ship) {
        cell.shipId = ship.id;
        cell.isSunkReveal = isShipSunk(ship);
      }

      if (shot) {
        cell.isHit = shot.result === SHOT_RESULTS.HIT || shot.result === SHOT_RESULTS.SUNK;
        cell.isMiss = shot.result === SHOT_RESULTS.MISS;
      }

      if (!revealShips && !cell.isHit) {
        cell.shipId = null;
      }

      if (preview?.cells?.some((previewCell) => previewCell.x === cell.x && previewCell.y === cell.y)) {
        cell.preview = preview.valid ? "valid" : "invalid";
      }
    });
  });

  return board;
}
