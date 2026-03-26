import { useEffect, useMemo, useRef, useState } from "react";
import {
  DIFFICULTY_LEVELS,
  GAME_PHASES,
  GRID_SIZE,
  ORIENTATIONS,
  SHIP_DEFINITIONS,
  TURN_STATES,
} from "../data/constants";
import useAIPlayer from "./useAIPlayer";
import {
  allShipsSunk,
  buildBoardMatrix,
  canPlaceShip,
  placeShip,
  randomizeFleet,
  receiveShot,
} from "../utils/board";
import {
  areAllShipsPlaced,
  buildResultsStats,
  getAnnouncementForShot,
  getPhaseLabel,
  getTurnLabel,
} from "../utils/gameRules";
import {
  getPlacedShipById,
  getRemainingShips,
  getShipCells,
  getShipDefinition,
} from "../utils/ships";

const DEFAULT_DIFFICULTY = DIFFICULTY_LEVELS[1].id;

function createFocusState() {
  return {
    player: { x: 0, y: 0 },
    enemy: { x: 0, y: 0 },
  };
}

export default function useSeaBattleGame() {
  const [difficulty, setDifficultyState] = useState(DEFAULT_DIFFICULTY);
  const [phase, setPhase] = useState(GAME_PHASES.SETUP);
  const [turn, setTurn] = useState(TURN_STATES.PLAYER);
  const [orientation, setOrientation] = useState(ORIENTATIONS.HORIZONTAL);
  const [selectedShipId, setSelectedShipId] = useState(SHIP_DEFINITIONS[0].id);
  const [playerFleet, setPlayerFleet] = useState([]);
  const [enemyFleet, setEnemyFleet] = useState(() => randomizeFleet(SHIP_DEFINITIONS));
  const [playerShots, setPlayerShots] = useState([]);
  const [aiShots, setAiShots] = useState([]);
  const [winner, setWinner] = useState(null);
  const [announcement, setAnnouncement] = useState(
    "Place your fleet and prepare for contact."
  );
  const [matchStartTime, setMatchStartTime] = useState(Date.now());
  const [matchEndTime, setMatchEndTime] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [focus, setFocus] = useState(createFocusState);
  const aiTimeoutRef = useRef(null);
  const aiPlayer = useAIPlayer(difficulty);

  const availableShips = useMemo(
    () =>
      SHIP_DEFINITIONS.filter((ship) => !playerFleet.some((placedShip) => placedShip.id === ship.id)),
    [playerFleet]
  );

  useEffect(() => {
    if (selectedShipId && availableShips.some((ship) => ship.id === selectedShipId)) {
      return;
    }

    setSelectedShipId(availableShips[0]?.id ?? null);
  }, [availableShips, selectedShipId]);

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, []);

  const preview = useMemo(() => {
    if (phase !== GAME_PHASES.SETUP || !selectedShipId) {
      return null;
    }

    const ship = getShipDefinition(selectedShipId);
    const focusCell = focus.player;
    const cells = getShipCells(ship, focusCell.x, focusCell.y, orientation);
    return {
      cells,
      valid: canPlaceShip(playerFleet, ship, focusCell.x, focusCell.y, orientation),
    };
  }, [focus.player, orientation, phase, playerFleet, selectedShipId]);

  const playerBoard = useMemo(
    () =>
      buildBoardMatrix({
        fleet: playerFleet,
        shots: aiShots,
        revealShips: true,
        preview,
      }),
    [aiShots, playerFleet, preview]
  );

  const enemyBoard = useMemo(
    () =>
      buildBoardMatrix({
        fleet: enemyFleet,
        shots: playerShots,
        revealShips: false,
      }),
    [enemyFleet, playerShots]
  );

  const remainingEnemyShips = useMemo(
    () => getRemainingShips(enemyFleet),
    [enemyFleet]
  );

  const remainingPlayerShips = useMemo(
    () => getRemainingShips(playerFleet),
    [playerFleet]
  );

  const resultsStats = useMemo(() => {
    if (phase !== GAME_PHASES.GAME_OVER || !winner || !matchEndTime) {
      return null;
    }

    return buildResultsStats({
      startTime: matchStartTime,
      endTime: matchEndTime,
      playerShots,
      aiShots,
      winner,
    });
  }, [aiShots, matchEndTime, matchStartTime, phase, playerShots, winner]);

  function clearAiTimeout() {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
  }

  function resetState(nextDifficulty = difficulty) {
    clearAiTimeout();
    setDifficultyState(nextDifficulty);
    setPhase(GAME_PHASES.SETUP);
    setTurn(TURN_STATES.PLAYER);
    setOrientation(ORIENTATIONS.HORIZONTAL);
    setSelectedShipId(SHIP_DEFINITIONS[0].id);
    setPlayerFleet([]);
    setEnemyFleet(randomizeFleet(SHIP_DEFINITIONS));
    setPlayerShots([]);
    setAiShots([]);
    setWinner(null);
    setAnnouncement("Place your fleet and prepare for contact.");
    setMatchStartTime(Date.now());
    setMatchEndTime(null);
    setIsAiThinking(false);
    setFocus(createFocusState());
  }

  function startNewGame(nextDifficulty = difficulty) {
    resetState(nextDifficulty);
  }

  function setDifficulty(nextDifficulty) {
    resetState(nextDifficulty);
  }

  function selectShip(shipId) {
    if (phase !== GAME_PHASES.SETUP) {
      return;
    }
    setSelectedShipId(shipId);
  }

  function toggleOrientation() {
    if (phase !== GAME_PHASES.SETUP) {
      return;
    }

    setOrientation((current) =>
      current === ORIENTATIONS.HORIZONTAL ? ORIENTATIONS.VERTICAL : ORIENTATIONS.HORIZONTAL
    );
  }

  function moveBoardFocus(boardId, dx, dy) {
    setFocus((current) => ({
      ...current,
      [boardId]: {
        x: Math.min(GRID_SIZE - 1, Math.max(0, current[boardId].x + dx)),
        y: Math.min(GRID_SIZE - 1, Math.max(0, current[boardId].y + dy)),
      },
    }));
  }

  function setBoardFocus(boardId, x, y) {
    setFocus((current) => ({
      ...current,
      [boardId]: { x, y },
    }));
  }

  function placeSelectedShip(x, y) {
    if (phase !== GAME_PHASES.SETUP || !selectedShipId) {
      return false;
    }

    const ship = getShipDefinition(selectedShipId);

    if (!canPlaceShip(playerFleet, ship, x, y, orientation)) {
      setAnnouncement(`The ${ship.name} does not fit there.`);
      return false;
    }

    const nextFleet = placeShip(playerFleet, ship, x, y, orientation);
    const remaining = SHIP_DEFINITIONS.filter(
      (candidate) => !nextFleet.some((placedShip) => placedShip.id === candidate.id)
    );

    setPlayerFleet(nextFleet);
    setSelectedShipId(remaining[0]?.id ?? null);
    setAnnouncement(`${ship.name} locked in.`);
    return true;
  }

  function randomizePlayerFleet() {
    if (phase !== GAME_PHASES.SETUP) {
      return;
    }

    setPlayerFleet(randomizeFleet(SHIP_DEFINITIONS));
    setSelectedShipId(null);
    setAnnouncement("Fleet randomized. Confirm when ready.");
  }

  function confirmPlayerFleet() {
    if (!areAllShipsPlaced(playerFleet, SHIP_DEFINITIONS)) {
      setAnnouncement("Place all ships before you engage.");
      return false;
    }

    setPhase(GAME_PHASES.BATTLE);
    setTurn(TURN_STATES.PLAYER);
    setMatchStartTime(Date.now());
    setAnnouncement("Battle stations. Fire when ready.");
    return true;
  }

  function finishGame(nextWinner) {
    setWinner(nextWinner);
    setPhase(GAME_PHASES.GAME_OVER);
    setTurn(TURN_STATES.TRANSITION);
    setIsAiThinking(false);
    setMatchEndTime(Date.now());
    setAnnouncement(
      nextWinner === "player"
        ? "Enemy fleet neutralized."
        : "Your fleet has been lost."
    );
  }

  function fireAtEnemy(x, y) {
    if (phase !== GAME_PHASES.BATTLE || turn !== TURN_STATES.PLAYER || isAiThinking) {
      return false;
    }

    const outcome = receiveShot(enemyFleet, playerShots, x, y);

    if (outcome.repeated || !outcome.shot) {
      setAnnouncement("That coordinate was already targeted.");
      return false;
    }

    const shipName = outcome.shot.shipId
      ? getPlacedShipById(outcome.fleet, outcome.shot.shipId)?.name
      : null;

    setEnemyFleet(outcome.fleet);
    setPlayerShots((current) => [...current, outcome.shot]);
    setAnnouncement(
      getAnnouncementForShot(outcome.shot, shipName, "You")
    );

    if (allShipsSunk(outcome.fleet)) {
      finishGame("player");
      return true;
    }

    setTurn(TURN_STATES.AI);
    return true;
  }

  useEffect(() => {
    if (phase !== GAME_PHASES.BATTLE || turn !== TURN_STATES.AI || winner) {
      return;
    }

    setIsAiThinking(true);

    aiTimeoutRef.current = setTimeout(() => {
      const nextShot = aiPlayer.getNextShot(aiShots, remainingPlayerShips);
      const outcome = receiveShot(playerFleet, aiShots, nextShot.x, nextShot.y);

      if (outcome.repeated || !outcome.shot) {
        setTurn(TURN_STATES.PLAYER);
        setIsAiThinking(false);
        return;
      }

      const shipName = outcome.shot.shipId
        ? getPlacedShipById(outcome.fleet, outcome.shot.shipId)?.name
        : null;

      aiPlayer.notifyShotResult(outcome.shot);
      setPlayerFleet(outcome.fleet);
      setAiShots((current) => [...current, outcome.shot]);
      setAnnouncement(
        getAnnouncementForShot(outcome.shot, shipName, "Opponent")
      );

      if (allShipsSunk(outcome.fleet)) {
        finishGame("ai");
        return;
      }

      setTurn(TURN_STATES.PLAYER);
      setIsAiThinking(false);
    }, difficulty === "easy" ? 550 : difficulty === "medium" ? 750 : 900);

    return clearAiTimeout;
  }, [aiPlayer, aiShots, difficulty, phase, playerFleet, remainingPlayerShips, turn, winner]);

  function restartMatch() {
    resetState(difficulty);
  }

  const phaseLabel = getPhaseLabel(phase);
  const turnLabel = getTurnLabel(turn, isAiThinking);

  return {
    difficulty,
    phase,
    phaseLabel,
    turn,
    turnLabel,
    orientation,
    selectedShipId,
    playerFleet,
    enemyFleet,
    playerShots,
    aiShots,
    availableShips,
    playerBoard,
    enemyBoard,
    preview,
    winner,
    announcement,
    matchStartTime,
    matchEndTime,
    resultsStats,
    isAiThinking,
    focus,
    remainingEnemyShips,
    remainingPlayerShips,
    startNewGame,
    setDifficulty,
    selectShip,
    toggleOrientation,
    placeSelectedShip,
    randomizePlayerFleet,
    confirmPlayerFleet,
    fireAtEnemy,
    restartMatch,
    moveBoardFocus,
    setBoardFocus,
  };
}
