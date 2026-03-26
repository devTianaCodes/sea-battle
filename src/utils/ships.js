import { GRID_SIZE, ORIENTATIONS, SHIP_DEFINITIONS } from "../data/constants";

export function coordinateKey(x, y) {
  return `${x},${y}`;
}

export function parseCoordinateKey(key) {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
}

export function isInBounds(x, y) {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
}

export function getShipDefinition(shipId) {
  return SHIP_DEFINITIONS.find((ship) => ship.id === shipId);
}

export function getShipCells(ship, x, y, orientation) {
  return Array.from({ length: ship.size }, (_, offset) => ({
    x: orientation === ORIENTATIONS.HORIZONTAL ? x + offset : x,
    y: orientation === ORIENTATIONS.VERTICAL ? y + offset : y,
  }));
}

export function createPlacedShip(ship, x, y, orientation) {
  return {
    ...ship,
    orientation,
    start: { x, y },
    cells: getShipCells(ship, x, y, orientation),
    hits: [],
  };
}

export function isShipSunk(ship) {
  return ship.hits.length >= ship.size;
}

export function getPlacedShipById(fleet, shipId) {
  return fleet.find((ship) => ship.id === shipId);
}

export function getRemainingShips(fleet) {
  return SHIP_DEFINITIONS.filter((ship) => {
    const placedShip = getPlacedShipById(fleet, ship.id);
    return !placedShip || !isShipSunk(placedShip);
  });
}

export function getShipAtCoordinate(fleet, x, y) {
  return fleet.find((ship) =>
    ship.cells.some((cell) => cell.x === x && cell.y === y)
  );
}

export function getShipCoverageMap(fleet) {
  return fleet.reduce((map, ship) => {
    ship.cells.forEach((cell) => {
      map[coordinateKey(cell.x, cell.y)] = ship;
    });
    return map;
  }, {});
}

export function isSameCoordinate(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function sortCoordinates(coords) {
  return [...coords].sort((left, right) => left.y - right.y || left.x - right.x);
}
