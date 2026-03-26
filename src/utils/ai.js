import { GRID_SIZE, ORIENTATIONS, SHOT_RESULTS } from "../data/constants";
import { coordinateKey, getShipCells } from "./ships";

function getAllCoordinates() {
  return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({
    x: index % GRID_SIZE,
    y: Math.floor(index / GRID_SIZE),
  }));
}

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function buildKnowledge(aiKnowledge) {
  const shotMap = new Map();
  const sunkShipIds = new Set();

  aiKnowledge.forEach((shot) => {
    shotMap.set(coordinateKey(shot.x, shot.y), shot);
    if (shot.result === SHOT_RESULTS.SUNK && shot.shipId) {
      sunkShipIds.add(shot.shipId);
    }
  });

  return { shotMap, sunkShipIds };
}

function getAvailableCoordinates(shotMap) {
  return getAllCoordinates().filter((cell) => !shotMap.has(coordinateKey(cell.x, cell.y)));
}

function uniqueCoordinates(coords) {
  const seen = new Set();
  return coords.filter((coord) => {
    const key = coordinateKey(coord.x, coord.y);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function getOrthogonalNeighbors({ x, y }) {
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ].filter((coord) => coord.x >= 0 && coord.x < GRID_SIZE && coord.y >= 0 && coord.y < GRID_SIZE);
}

function getUnsunkHits(aiKnowledge, sunkShipIds) {
  return aiKnowledge.filter(
    (shot) =>
      (shot.result === SHOT_RESULTS.HIT || shot.result === SHOT_RESULTS.SUNK) &&
      shot.shipId &&
      !sunkShipIds.has(shot.shipId)
  );
}

function getTargetCandidates(aiKnowledge, shotMap, sunkShipIds) {
  const unsunkHits = getUnsunkHits(aiKnowledge, sunkShipIds);

  if (unsunkHits.length === 0) {
    return [];
  }

  const groupedHits = unsunkHits.reduce((groups, hit) => {
    if (!groups[hit.shipId]) {
      groups[hit.shipId] = [];
    }
    groups[hit.shipId].push(hit);
    return groups;
  }, {});

  const prioritizedGroup = Object.values(groupedHits)
    .sort((left, right) => right.length - left.length)
    .at(0);

  if (!prioritizedGroup) {
    return [];
  }

  if (prioritizedGroup.length >= 2) {
    const horizontal = prioritizedGroup.every((hit) => hit.y === prioritizedGroup[0].y);
    const vertical = prioritizedGroup.every((hit) => hit.x === prioritizedGroup[0].x);

    if (horizontal) {
      const ordered = [...prioritizedGroup].sort((left, right) => left.x - right.x);
      return [
        { x: ordered[0].x - 1, y: ordered[0].y },
        { x: ordered.at(-1).x + 1, y: ordered.at(-1).y },
      ].filter(
        (coord) =>
          coord.x >= 0 &&
          coord.x < GRID_SIZE &&
          coord.y >= 0 &&
          coord.y < GRID_SIZE &&
          !shotMap.has(coordinateKey(coord.x, coord.y))
      );
    }

    if (vertical) {
      const ordered = [...prioritizedGroup].sort((left, right) => left.y - right.y);
      return [
        { x: ordered[0].x, y: ordered[0].y - 1 },
        { x: ordered.at(-1).x, y: ordered.at(-1).y + 1 },
      ].filter(
        (coord) =>
          coord.x >= 0 &&
          coord.x < GRID_SIZE &&
          coord.y >= 0 &&
          coord.y < GRID_SIZE &&
          !shotMap.has(coordinateKey(coord.x, coord.y))
      );
    }
  }

  return uniqueCoordinates(
    prioritizedGroup.flatMap((hit) =>
      getOrthogonalNeighbors(hit).filter((coord) => !shotMap.has(coordinateKey(coord.x, coord.y)))
    )
  );
}

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function getEasyShot(aiKnowledge) {
  const { shotMap } = buildKnowledge(aiKnowledge);
  const available = getAvailableCoordinates(shotMap);
  return chooseRandom(available);
}

export function getMediumShot(aiKnowledge) {
  const { shotMap, sunkShipIds } = buildKnowledge(aiKnowledge);
  const targetCandidates = getTargetCandidates(aiKnowledge, shotMap, sunkShipIds);

  if (targetCandidates.length > 0) {
    return chooseRandom(targetCandidates);
  }

  const parityCandidates = getAvailableCoordinates(shotMap).filter(
    (coord) => (coord.x + coord.y) % 2 === 0
  );

  if (parityCandidates.length > 0) {
    return chooseRandom(parityCandidates);
  }

  return chooseRandom(getAvailableCoordinates(shotMap));
}

function createProbabilityGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => 0));
}

function isPlacementPossible(cells, shotMap, sunkCells, activeHits) {
  const cellKeys = new Set(cells.map((cell) => coordinateKey(cell.x, cell.y)));

  for (const key of sunkCells) {
    if (cellKeys.has(key)) {
      return false;
    }
  }

  for (const cell of cells) {
    const shot = shotMap.get(coordinateKey(cell.x, cell.y));

    if (!shot) {
      continue;
    }

    if (shot.result === SHOT_RESULTS.MISS) {
      return false;
    }
  }

  if (activeHits.length > 0) {
    return activeHits.every((hit) => cellKeys.has(coordinateKey(hit.x, hit.y)));
  }

  return true;
}

export function getHardShot(aiKnowledge, remainingShips) {
  const { shotMap, sunkShipIds } = buildKnowledge(aiKnowledge);
  const targetCandidates = getTargetCandidates(aiKnowledge, shotMap, sunkShipIds);

  if (targetCandidates.length > 0) {
    return chooseRandom(targetCandidates);
  }

  const grid = createProbabilityGrid();
  const available = getAvailableCoordinates(shotMap);
  const sunkCells = aiKnowledge
    .filter((shot) => shot.shipId && sunkShipIds.has(shot.shipId))
    .map((shot) => coordinateKey(shot.x, shot.y));
  const activeHits = getUnsunkHits(aiKnowledge, sunkShipIds);

  remainingShips.forEach((ship) => {
    [ORIENTATIONS.HORIZONTAL, ORIENTATIONS.VERTICAL].forEach((orientation) => {
      for (let y = 0; y < GRID_SIZE; y += 1) {
        for (let x = 0; x < GRID_SIZE; x += 1) {
          const cells = getShipCells(ship, x, y, orientation);
          const withinBounds = cells.every(
            (cell) => cell.x >= 0 && cell.x < GRID_SIZE && cell.y >= 0 && cell.y < GRID_SIZE
          );

          if (!withinBounds || !isPlacementPossible(cells, shotMap, sunkCells, activeHits)) {
            continue;
          }

          cells.forEach((cell) => {
            if (!shotMap.has(coordinateKey(cell.x, cell.y))) {
              grid[cell.y][cell.x] += 1;
            }
          });
        }
      }
    });
  });

  let bestScore = -1;
  let bestCells = [];

  available.forEach((cell) => {
    const score = grid[cell.y][cell.x] + ((cell.x + cell.y) % 2 === 0 ? 0.2 : 0);

    if (score > bestScore) {
      bestScore = score;
      bestCells = [cell];
      return;
    }

    if (score === bestScore) {
      bestCells.push(cell);
    }
  });

  return chooseRandom(bestCells.length > 0 ? bestCells : available);
}
