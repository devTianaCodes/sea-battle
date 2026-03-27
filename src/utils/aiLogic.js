import { GRID_SIZE } from "../data/constants";
import { randomizeFleet } from "./board";
import { getEasyShot, getHardShot, getMediumShot } from "./ai";

export function isValidShot(row, col, previousMoves = []) {
  return (
    row >= 0 &&
    row < GRID_SIZE &&
    col >= 0 &&
    col < GRID_SIZE &&
    !previousMoves.some((move) => move.row === row && move.col === col)
  );
}

export function huntMode(lastHit, previousMoves = []) {
  if (!lastHit) {
    return [];
  }

  return [
    { row: lastHit.row - 1, col: lastHit.col },
    { row: lastHit.row + 1, col: lastHit.col },
    { row: lastHit.row, col: lastHit.col - 1 },
    { row: lastHit.row, col: lastHit.col + 1 },
  ].filter((candidate) => isValidShot(candidate.row, candidate.col, previousMoves));
}

export function placeAIShips() {
  return randomizeFleet();
}

export function getAIMove(
  difficulty,
  playerBoard = [],
  previousMoves = [],
  remainingShips = []
) {
  const aiKnowledge = previousMoves.map((move) => ({
    x: move.col,
    y: move.row,
    result: move.result,
    shipId: move.shipId ?? null,
  }));

  const move =
    difficulty === "easy"
      ? getEasyShot(aiKnowledge)
      : difficulty === "hard"
        ? getHardShot(aiKnowledge, remainingShips)
        : getMediumShot(aiKnowledge);

  return {
    row: move.y,
    col: move.x,
  };
}
