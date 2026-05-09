import test from "node:test";
import assert from "node:assert/strict";
import {
  ORIENTATIONS,
  SHIP_DEFINITIONS,
} from "../src/data/constants.js";
import {
  allShipsSunk,
  canPlaceShip,
  getFleetBufferCells,
  placeShip,
  randomizeFleet,
  receiveShot,
} from "../src/utils/board.js";
import {
  areAllShipsPlaced,
} from "../src/utils/gameRules.js";
import {
  getBoardNavigationDelta,
  isBoardConfirmKey,
  isRotateKey,
} from "../src/utils/keyboard.js";

test("ships can be placed legally without overlap and out-of-bounds placements are rejected", () => {
  const flagship = SHIP_DEFINITIONS.find((ship) => ship.id === "flagship");
  const patrol = SHIP_DEFINITIONS.find((ship) => ship.id === "patrol-1");

  assert.equal(canPlaceShip([], flagship, 0, 0, ORIENTATIONS.HORIZONTAL), true);
  assert.equal(canPlaceShip([], flagship, 7, 0, ORIENTATIONS.HORIZONTAL), false);

  const fleet = placeShip([], flagship, 0, 0, ORIENTATIONS.HORIZONTAL);
  assert.equal(canPlaceShip(fleet, patrol, 0, 0, ORIENTATIONS.VERTICAL), false);
  assert.equal(canPlaceShip(fleet, patrol, 5, 0, ORIENTATIONS.VERTICAL), true);
});

test("ship definitions match the 10-ship fleet composition", () => {
  assert.equal(SHIP_DEFINITIONS.length, 10);
  assert.deepEqual(
    SHIP_DEFINITIONS.map((ship) => ship.size).sort((left, right) => right - left),
    [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
  );
});

test("all 10 ships must be placed before the fleet is considered ready", () => {
  const fleet = randomizeFleet(SHIP_DEFINITIONS);
  assert.equal(areAllShipsPlaced(fleet.slice(0, -1), SHIP_DEFINITIONS), false);
  assert.equal(areAllShipsPlaced(fleet, SHIP_DEFINITIONS), true);
});

test("ships cannot touch horizontally, vertically, or diagonally", () => {
  const flagship = SHIP_DEFINITIONS.find((ship) => ship.id === "flagship");
  const patrol = SHIP_DEFINITIONS.find((ship) => ship.id === "patrol-1");
  const fleet = placeShip([], flagship, 0, 0, ORIENTATIONS.HORIZONTAL);

  assert.equal(canPlaceShip(fleet, patrol, 4, 0, ORIENTATIONS.HORIZONTAL), false);
  assert.equal(canPlaceShip(fleet, patrol, 0, 1, ORIENTATIONS.HORIZONTAL), false);
  assert.equal(canPlaceShip(fleet, patrol, 4, 1, ORIENTATIONS.HORIZONTAL), false);
  assert.equal(canPlaceShip(fleet, patrol, 5, 1, ORIENTATIONS.HORIZONTAL), true);
});

test("size-one ships obey the same one-square buffer rule", () => {
  const firstPatrol = SHIP_DEFINITIONS.find((ship) => ship.id === "patrol-1");
  const secondPatrol = SHIP_DEFINITIONS.find((ship) => ship.id === "patrol-2");
  const fleet = placeShip([], firstPatrol, 4, 4, ORIENTATIONS.HORIZONTAL);

  assert.equal(canPlaceShip(fleet, secondPatrol, 5, 5, ORIENTATIONS.HORIZONTAL), false);
  assert.equal(canPlaceShip(fleet, secondPatrol, 6, 4, ORIENTATIONS.HORIZONTAL), true);
});

test("fleet buffer cells identify the blocked squares around placed ships", () => {
  const flagship = SHIP_DEFINITIONS.find((ship) => ship.id === "flagship");
  const fleet = placeShip([], flagship, 0, 0, ORIENTATIONS.HORIZONTAL);
  const bufferKeys = new Set(getFleetBufferCells(fleet).map((cell) => `${cell.x},${cell.y}`));

  assert.equal(bufferKeys.has("4,0"), true);
  assert.equal(bufferKeys.has("0,1"), true);
  assert.equal(bufferKeys.has("4,1"), true);
  assert.equal(bufferKeys.has("0,0"), false);
});

test("randomized fleets contain 10 ships that do not overlap or touch", () => {
  const fleet = randomizeFleet(SHIP_DEFINITIONS);

  assert.equal(fleet.length, 10);
  assertNoOverlapOrTouching(fleet);
});

test("the same target cell cannot be fired on more than once", () => {
  const enemyFleet = randomizeFleet(SHIP_DEFINITIONS);
  const firstShot = receiveShot(enemyFleet, [], 0, 0);

  assert.equal(firstShot.repeated, false);
  assert.ok(firstShot.shot);

  const repeatedShot = receiveShot(enemyFleet, [firstShot.shot], 0, 0);
  assert.equal(repeatedShot.repeated, true);
  assert.equal(repeatedShot.shot, null);
});

test("the player wins only after the entire enemy fleet is sunk", () => {
  const fleet = randomizeFleet(SHIP_DEFINITIONS);

  assert.equal(allShipsSunk(fleet), false);

  const sunkFleet = fleet.map((ship) => ({
    ...ship,
    hits: ship.cells.map((cell) => `${cell.x},${cell.y}`),
  }));

  assert.equal(allShipsSunk(sunkFleet), true);
});

function assertNoOverlapOrTouching(fleet) {
  for (let leftIndex = 0; leftIndex < fleet.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < fleet.length; rightIndex += 1) {
      const leftShip = fleet[leftIndex];
      const rightShip = fleet[rightIndex];

      for (const leftCell of leftShip.cells) {
        for (const rightCell of rightShip.cells) {
          assert.ok(
            Math.abs(leftCell.x - rightCell.x) > 1 || Math.abs(leftCell.y - rightCell.y) > 1,
            `${leftShip.id} touches ${rightShip.id}`
          );
        }
      }
    }
  }
}

test("arrow keys map to board movement and enter/space trigger confirmation", () => {
  assert.deepEqual(getBoardNavigationDelta("ArrowUp"), { dx: 0, dy: -1 });
  assert.deepEqual(getBoardNavigationDelta("ArrowDown"), { dx: 0, dy: 1 });
  assert.deepEqual(getBoardNavigationDelta("ArrowLeft"), { dx: -1, dy: 0 });
  assert.deepEqual(getBoardNavigationDelta("ArrowRight"), { dx: 1, dy: 0 });
  assert.equal(getBoardNavigationDelta("KeyA"), null);

  assert.equal(isBoardConfirmKey("Enter"), true);
  assert.equal(isBoardConfirmKey(" "), true);
  assert.equal(isBoardConfirmKey("Spacebar"), true);
  assert.equal(isBoardConfirmKey("Escape"), false);
});

test("R is the setup rotation shortcut", () => {
  assert.equal(isRotateKey("r"), true);
  assert.equal(isRotateKey("R"), true);
  assert.equal(isRotateKey("x"), false);
});
