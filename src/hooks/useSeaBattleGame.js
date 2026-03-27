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
import useSoundEffects from "./useSoundEffects";
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
  formatCoordinate,
  formatShipSpan,
  getRemainingShips,
  getShipAtCoordinate,
  getShipCells,
  getShipDefinition,
  isShipSunk,
} from "../utils/ships";
import {
  appendHistoryEntry,
  loadHistory,
  saveHistory,
  summarizeHistory,
} from "../utils/history";
import { loadBooleanPreference, saveBooleanPreference } from "../utils/preferences";
import { buildShotMetrics } from "../utils/stats";

const DEFAULT_DIFFICULTY = DIFFICULTY_LEVELS[1].id;
const MAX_EVENT_LOG = 6;
const ONBOARDING_KEY = "sea-battle-onboarding-dismissed-v1";
const BACKGROUND_EFFECTS_KEY = "sea-battle-background-effects-v1";

function createFocusState() {
  return {
    player: { x: 0, y: 0 },
    enemy: { x: 0, y: 0 },
  };
}

function createSystemEvent(message, tone = "system") {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    message,
    tone,
  };
}

export default function useSeaBattleGame() {
  const [screen, setScreen] = useState("menu");
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
  const [resultsStats, setResultsStats] = useState(null);
  const [history, setHistory] = useState(() => loadHistory());
  const [showOnboarding, setShowOnboarding] = useState(
    () => !loadBooleanPreference(ONBOARDING_KEY, false)
  );
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState("settings");
  const [backgroundEffectsEnabled, setBackgroundEffectsEnabled] = useState(
    () => loadBooleanPreference(BACKGROUND_EFFECTS_KEY, true)
  );
  const [eventLog, setEventLog] = useState(() => [
    createSystemEvent("Awaiting deployment orders."),
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [focus, setFocus] = useState(createFocusState);
  const aiTimeoutRef = useRef(null);
  const aiPlayer = useAIPlayer(difficulty);
  const soundEffects = useSoundEffects();

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

  useEffect(() => {
    saveHistory(history);
  }, [history]);

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
        recentShot: aiShots.at(-1) ?? null,
      }),
    [aiShots, playerFleet, preview]
  );

  const enemyBoard = useMemo(
    () =>
      buildBoardMatrix({
        fleet: enemyFleet,
        shots: playerShots,
        revealShips: phase === GAME_PHASES.GAME_OVER,
        recentShot: playerShots.at(-1) ?? null,
      }),
    [enemyFleet, phase, playerShots]
  );

  const revealedEnemyBoard = useMemo(
    () =>
      buildBoardMatrix({
        fleet: enemyFleet,
        shots: playerShots,
        revealShips: true,
        recentShot: playerShots.at(-1) ?? null,
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

  const playerMetrics = useMemo(() => buildShotMetrics(playerShots), [playerShots]);
  const enemyMetrics = useMemo(() => buildShotMetrics(aiShots), [aiShots]);

  const playerFleetStatus = useMemo(
    () =>
      playerFleet.map((ship) => ({
        id: ship.id,
        name: ship.name,
        size: ship.size,
        isSunk: isShipSunk(ship),
        hits: ship.hits.length,
      })),
    [playerFleet]
  );

  const enemyFleetStatus = useMemo(
    () =>
      enemyFleet.map((ship) => ({
        id: ship.id,
        name: ship.name,
        size: ship.size,
        isSunk: isShipSunk(ship),
        hits: ship.hits.length,
      })),
    [enemyFleet]
  );

  const historySummary = useMemo(() => summarizeHistory(history), [history]);

  function pushEvent(message, tone = "system") {
    setEventLog((current) => [createSystemEvent(message, tone), ...current].slice(0, MAX_EVENT_LOG));
  }

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
    setResultsStats(null);
    setEventLog([createSystemEvent("Awaiting deployment orders.")]);
    setIsAiThinking(false);
    setIsPaused(false);
    setFocus(createFocusState());
  }

  function startNewGame(nextDifficulty = difficulty) {
    resetState(nextDifficulty);
    setScreen("game");
  }

  function setDifficulty(nextDifficulty) {
    resetState(nextDifficulty);
  }

  function changeDifficultyByStep(step) {
    const currentIndex = DIFFICULTY_LEVELS.findIndex((level) => level.id === difficulty);
    const nextIndex = Math.min(
      DIFFICULTY_LEVELS.length - 1,
      Math.max(0, currentIndex + step)
    );
    resetState(DIFFICULTY_LEVELS[nextIndex].id);
    setScreen("game");
  }

  function openDifficultyScreen() {
    setScreen("difficulty");
  }

  function openMenu() {
    clearAiTimeout();
    setScreen("menu");
    setShowInstructions(false);
  }

  function beginGameWithDifficulty(nextDifficulty) {
    resetState(nextDifficulty);
    setScreen("game");
  }

  function openInstructions() {
    setShowInstructions(true);
  }

  function closeInstructions() {
    setShowInstructions(false);
  }

  function openSettings(tab = "settings") {
    setSettingsTab(tab);
    setShowSettings(true);
  }

  function closeSettings() {
    setShowSettings(false);
  }

  function toggleBackgroundEffects() {
    setBackgroundEffectsEnabled((current) => {
      const next = !current;
      saveBooleanPreference(BACKGROUND_EFFECTS_KEY, next);
      return next;
    });
  }

  function selectShip(shipId) {
    if (phase !== GAME_PHASES.SETUP) {
      return;
    }

    const placedShip = getPlacedShipById(playerFleet, shipId);

    if (placedShip) {
      setPlayerFleet((current) => current.filter((ship) => ship.id !== shipId));
      setSelectedShipId(shipId);
      setOrientation(placedShip.orientation);
      setAnnouncement(`${placedShip.name} recalled for repositioning.`);
      pushEvent(`Recalled ${placedShip.name} for repositioning.`, "system");
      soundEffects.play("recall");
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
    if (phase !== GAME_PHASES.SETUP || !selectedShipId || isPaused) {
      return false;
    }

    const ship = getShipDefinition(selectedShipId);

    if (!canPlaceShip(playerFleet, ship, x, y, orientation)) {
      setAnnouncement(`The ${ship.name} does not fit there.`);
      return false;
    }

    const nextFleet = placeShip(playerFleet, ship, x, y, orientation);
    const deployedShip = nextFleet.find((candidate) => candidate.id === ship.id);
    const remaining = SHIP_DEFINITIONS.filter(
      (candidate) => !nextFleet.some((placedShip) => placedShip.id === candidate.id)
    );

    setPlayerFleet(nextFleet);
    setSelectedShipId(remaining[0]?.id ?? null);
    setAnnouncement(`${ship.name} locked in.`);
    pushEvent(`Deployed ${ship.name} across ${formatShipSpan(deployedShip.cells)}.`, "player");
    soundEffects.play("place");
    return true;
  }

  function randomizePlayerFleet() {
    if (phase !== GAME_PHASES.SETUP || isPaused) {
      return;
    }

    setPlayerFleet(randomizeFleet(SHIP_DEFINITIONS));
    setSelectedShipId(null);
    setAnnouncement("Fleet randomized. Confirm when ready.");
    pushEvent("Fleet randomized for a faster launch.", "system");
    soundEffects.play("randomize");
  }

  function clearPlayerFleet() {
    if (phase !== GAME_PHASES.SETUP || isPaused) {
      return;
    }

    setPlayerFleet([]);
    setSelectedShipId(SHIP_DEFINITIONS[0].id);
    setOrientation(ORIENTATIONS.HORIZONTAL);
    setAnnouncement("Fleet cleared. Select a ship and deploy again.");
    pushEvent("Player fleet cleared for a fresh deployment.", "system");
    soundEffects.play("recall");
  }

  function confirmPlayerFleet() {
    if (isPaused) {
      return false;
    }

    if (!areAllShipsPlaced(playerFleet, SHIP_DEFINITIONS)) {
      setAnnouncement("Place all ships before you engage.");
      return false;
    }

    setPhase(GAME_PHASES.BATTLE);
    setTurn(TURN_STATES.PLAYER);
    setMatchStartTime(Date.now());
    setAnnouncement("Battle stations. Fire when ready.");
    pushEvent(`Battle started on ${difficulty.toUpperCase()} difficulty.`, "system");
    soundEffects.play("start");
    return true;
  }

  function finishGame(nextWinner, nextPlayerShots, nextAiShots) {
    const endTime = Date.now();
    const nextResults = buildResultsStats({
      startTime: matchStartTime,
      endTime,
      playerShots: nextPlayerShots,
      aiShots: nextAiShots,
      winner: nextWinner,
    });

    setWinner(nextWinner);
    setPhase(GAME_PHASES.GAME_OVER);
    setTurn(TURN_STATES.TRANSITION);
    setIsAiThinking(false);
    setMatchEndTime(endTime);
    setResultsStats(nextResults);
    setAnnouncement(
      nextWinner === "player"
        ? "Enemy fleet neutralized."
        : "Your fleet has been lost."
    );
    pushEvent(
      nextWinner === "player"
        ? "Mission success. The enemy fleet has been sunk."
        : "Mission failed. Your fleet was destroyed.",
      nextWinner === "player" ? "player" : "enemy"
    );
    soundEffects.play(nextWinner === "player" ? "win" : "lose");
    setHistory((current) =>
      appendHistoryEntry(current, {
        id: `${endTime}-${nextWinner}-${difficulty}`,
        difficulty,
        playedAt: endTime,
        ...nextResults,
      })
    );
  }

  function fireAtEnemy(x, y) {
    if (phase !== GAME_PHASES.BATTLE || turn !== TURN_STATES.PLAYER || isAiThinking || isPaused) {
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

    const nextPlayerShots = [...playerShots, outcome.shot];

    setEnemyFleet(outcome.fleet);
    setPlayerShots(nextPlayerShots);
    setAnnouncement(
      getAnnouncementForShot(outcome.shot, shipName, "You")
    );
    pushEvent(
      `You fired at ${formatCoordinate(x, y)}: ${
        outcome.shot.result === "miss"
          ? "miss"
          : outcome.shot.result === "sunk"
            ? `${shipName} sunk`
            : `${shipName} hit`
      }.`,
      "player"
    );
    soundEffects.play(outcome.shot.result);

    if (allShipsSunk(outcome.fleet)) {
      finishGame("player", nextPlayerShots, aiShots);
      return true;
    }

    setTurn(TURN_STATES.AI);
    return true;
  }

  useEffect(() => {
    if (phase !== GAME_PHASES.BATTLE || turn !== TURN_STATES.AI || winner || isPaused) {
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
      const nextAiShots = [...aiShots, outcome.shot];
      setPlayerFleet(outcome.fleet);
      setAiShots(nextAiShots);
      setAnnouncement(
        getAnnouncementForShot(outcome.shot, shipName, "Opponent")
      );
      pushEvent(
        `Opponent fired at ${formatCoordinate(nextShot.x, nextShot.y)}: ${
          outcome.shot.result === "miss"
            ? "miss"
            : outcome.shot.result === "sunk"
              ? `${shipName} sunk`
              : `${shipName} hit`
        }.`,
        "enemy"
      );
      soundEffects.play(outcome.shot.result);

      if (allShipsSunk(outcome.fleet)) {
        finishGame("ai", playerShots, nextAiShots);
        return;
      }

      setTurn(TURN_STATES.PLAYER);
      setIsAiThinking(false);
    }, difficulty === "easy" ? 550 : difficulty === "medium" ? 750 : 900);

    return clearAiTimeout;
  }, [aiPlayer, aiShots, difficulty, isPaused, phase, playerFleet, remainingPlayerShips, turn, winner]);

  function restartMatch() {
    resetState(difficulty);
    setScreen("game");
  }

  function togglePause() {
    if (screen !== "game" || phase === GAME_PHASES.GAME_OVER) {
      return;
    }

    if (!isPaused) {
      clearAiTimeout();
      setIsAiThinking(false);
    }

    setIsPaused((current) => !current);
  }

  function resumeGame() {
    if (screen !== "game") {
      return;
    }

    setIsPaused(false);
  }

  function dismissOnboarding() {
    saveBooleanPreference(ONBOARDING_KEY, true);
    setShowOnboarding(false);
  }

  function reopenOnboarding() {
    setShowOnboarding(true);
  }

  function handlePlayerBoardAction(x, y) {
    if (phase !== GAME_PHASES.SETUP) {
      return false;
    }

    if (selectedShipId) {
      return placeSelectedShip(x, y);
    }

    const placedShip = getShipAtCoordinate(playerFleet, x, y);

    if (!placedShip) {
      return false;
    }

    selectShip(placedShip.id);
    return true;
  }

  function clearHistory() {
    setHistory([]);
    pushEvent("Local battle history cleared.", "system");
  }

  const phaseLabel = getPhaseLabel(phase);
  const turnLabel = getTurnLabel(turn, isAiThinking);

  return {
    screen,
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
    revealedEnemyBoard,
    preview,
    winner,
    announcement,
    matchStartTime,
    matchEndTime,
    resultsStats,
    history,
    historySummary,
    showOnboarding,
    showInstructions,
    showSettings,
    settingsTab,
    backgroundEffectsEnabled,
    eventLog,
    soundEnabled: soundEffects.soundEnabled,
    isAiThinking,
    isPaused,
    focus,
    playerMetrics,
    enemyMetrics,
    playerFleetStatus,
    enemyFleetStatus,
    remainingEnemyShips,
    remainingPlayerShips,
    startNewGame,
    setDifficulty,
    changeDifficultyByStep,
    openDifficultyScreen,
    openMenu,
    beginGameWithDifficulty,
    openInstructions,
    closeInstructions,
    openSettings,
    closeSettings,
    toggleBackgroundEffects,
    selectShip,
    toggleOrientation,
    placeSelectedShip,
    handlePlayerBoardAction,
    randomizePlayerFleet,
    clearPlayerFleet,
    confirmPlayerFleet,
    fireAtEnemy,
    restartMatch,
    togglePause,
    resumeGame,
    dismissOnboarding,
    reopenOnboarding,
    clearHistory,
    toggleSound: soundEffects.toggleSound,
    moveBoardFocus,
    setBoardFocus,
  };
}
