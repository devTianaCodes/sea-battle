import { GRID_SIZE, ORIENTATIONS, SHIP_DEFINITIONS, SHOT_RESULTS } from "../data/constants.js";
import {
  coordinateKey,
  createPlacedShip,
  getShipAtCoordinate,
  getShipCells,
  getShipCoverageMap,
  isInBounds,
  isShipSunk,
  parseCoordinateKey,
} from "./ships.js";

export function createEmptyBoard() {
  return Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) => ({
      x,
      y,
      shipId: null,
      isHit: false,
      isMiss: false,
      isSunkReveal: false,
      isRecentShot: false,
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

  return !cells.some((cell) => fleet.some((placedShip) => touchesShip(cell, placedShip)));
}

function touchesShip(cell, placedShip) {
  return placedShip.cells.some(
    (occupiedCell) =>
      Math.abs(occupiedCell.x - cell.x) <= 1 && Math.abs(occupiedCell.y - cell.y) <= 1
  );
}

export function getFleetBufferCells(fleet) {
  const occupied = new Set(
    fleet.flatMap((ship) => ship.cells.map((cell) => coordinateKey(cell.x, cell.y)))
  );
  const buffer = new Set();

  fleet.forEach((ship) => {
    ship.cells.forEach((cell) => {
      for (let y = cell.y - 1; y <= cell.y + 1; y += 1) {
        for (let x = cell.x - 1; x <= cell.x + 1; x += 1) {
          const key = coordinateKey(x, y);

          if (isInBounds(x, y) && !occupied.has(key)) {
            buffer.add(key);
          }
        }
      }
    });
  });

  return Array.from(buffer, parseCoordinateKey);
}

export function placeShip(fleet, ship, x, y, orientation) {
  if (!canPlaceShip(fleet, ship, x, y, orientation)) {
    return fleet;
  }

  const filteredFleet = fleet.filter((placedShip) => placedShip.id !== ship.id);
  return [...filteredFleet, createPlacedShip(ship, x, y, orientation)];
}

export function randomizeFleet(shipDefinitions = SHIP_DEFINITIONS) {
  const sortedShips = [...shipDefinitions].sort((left, right) => right.size - left.size);
  const fleet = placeFleetFromIndex(sortedShips, 0, []);

  if (!fleet) {
    throw new Error("Unable to randomize fleet with the current spacing rules.");
  }

  return shipDefinitions
    .map((ship) => fleet.find((placedShip) => placedShip.id === ship.id))
    .filter(Boolean);
}

function placeFleetFromIndex(shipDefinitions, index, fleet) {
  if (index >= shipDefinitions.length) {
    return fleet;
  }

  const ship = shipDefinitions[index];
  const candidates = shufflePlacementsForShip(ship);

  for (const candidate of candidates) {
    if (!canPlaceShip(fleet, ship, candidate.x, candidate.y, candidate.orientation)) {
      continue;
    }

    const result = placeFleetFromIndex(
      shipDefinitions,
      index + 1,
      [...fleet, createPlacedShip(ship, candidate.x, candidate.y, candidate.orientation)]
    );

    if (result) {
      return result;
    }
  }

  return null;
}

function shufflePlacementsForShip(ship) {
  const placements = [];

  for (const orientation of [ORIENTATIONS.HORIZONTAL, ORIENTATIONS.VERTICAL]) {
    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        if (getShipCells(ship, x, y, orientation).every((cell) => isInBounds(cell.x, cell.y))) {
          placements.push({ x, y, orientation });
        }
      }
    }
  }

  for (let index = placements.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [placements[index], placements[swapIndex]] = [placements[swapIndex], placements[index]];
  }

  return placements;
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

export function buildBoardMatrix({
  fleet,
  shots,
  revealShips = false,
  preview = null,
  blockedCells = [],
  recentShot = null,
}) {
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
        cell.isPlacedShip = revealShips && !shot;
      }

      if (shot) {
        cell.isHit = shot.result === SHOT_RESULTS.HIT || shot.result === SHOT_RESULTS.SUNK;
        cell.isMiss = shot.result === SHOT_RESULTS.MISS;
      }

      if (recentShot?.x === cell.x && recentShot?.y === cell.y) {
        cell.isRecentShot = true;
      }

      if (!revealShips && !cell.isHit) {
        cell.shipId = null;
      }

      const previewOptions = preview?.options ?? [];
      const validOption = previewOptions.some(
        (option) =>
          option.valid &&
          option.cells.some((previewCell) => previewCell.x === cell.x && previewCell.y === cell.y)
      );
      const invalidOption = previewOptions.some(
        (option) =>
          !option.valid &&
          option.cells.some((previewCell) => previewCell.x === cell.x && previewCell.y === cell.y)
      );

      if (validOption) {
        cell.preview = "valid";
      } else if (invalidOption) {
        cell.preview = "invalid";
      } else if (preview?.cells?.some((previewCell) => previewCell.x === cell.x && previewCell.y === cell.y)) {
        cell.preview = preview.valid ? "valid" : "invalid";
      }

      if (preview?.anchor?.x === cell.x && preview.anchor.y === cell.y) {
        cell.isPlacementAnchor = true;
      }

      if (
        !cell.shipId &&
        !cell.preview &&
        blockedCells.some((blockedCell) => blockedCell.x === cell.x && blockedCell.y === cell.y)
      ) {
        cell.isPlacementBlocked = true;
      }
    });
  });

  return board;
}
