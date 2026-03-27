import test from "node:test";
import assert from "node:assert/strict";
import {
  ORIENTATIONS,
  SHIP_DEFINITIONS,
} from "../src/data/constants.js";
import {
  allShipsSunk,
  canPlaceShip,
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
  const carrier = SHIP_DEFINITIONS.find((ship) => ship.id === "carrier");
  const destroyer = SHIP_DEFINITIONS.find((ship) => ship.id === "destroyer");

  assert.equal(canPlaceShip([], carrier, 0, 0, ORIENTATIONS.HORIZONTAL), true);
  assert.equal(canPlaceShip([], carrier, 8, 0, ORIENTATIONS.HORIZONTAL), false);

  const fleet = placeShip([], carrier, 0, 0, ORIENTATIONS.HORIZONTAL);
  assert.equal(canPlaceShip(fleet, destroyer, 0, 0, ORIENTATIONS.VERTICAL), false);
  assert.equal(canPlaceShip(fleet, destroyer, 6, 0, ORIENTATIONS.VERTICAL), true);
});

test("all five ships must be placed before the fleet is considered ready", () => {
  let fleet = [];

  fleet = placeShip(fleet, SHIP_DEFINITIONS[0], 0, 0, ORIENTATIONS.HORIZONTAL);
  fleet = placeShip(fleet, SHIP_DEFINITIONS[1], 0, 2, ORIENTATIONS.HORIZONTAL);
  fleet = placeShip(fleet, SHIP_DEFINITIONS[2], 0, 4, ORIENTATIONS.HORIZONTAL);
  fleet = placeShip(fleet, SHIP_DEFINITIONS[3], 0, 6, ORIENTATIONS.HORIZONTAL);

  assert.equal(areAllShipsPlaced(fleet, SHIP_DEFINITIONS), false);

  fleet = placeShip(fleet, SHIP_DEFINITIONS[4], 0, 8, ORIENTATIONS.HORIZONTAL);
  assert.equal(areAllShipsPlaced(fleet, SHIP_DEFINITIONS), true);
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
