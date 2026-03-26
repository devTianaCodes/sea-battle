import { GAME_PHASES, SHOT_RESULTS, TURN_STATES } from "../data/constants";
import {
  buildShotMetrics,
  calculateAccuracy,
  finalizeMatchStats,
  formatDuration,
} from "./stats";
import { isShipSunk } from "./ships";

export function getPhaseLabel(phase) {
  if (phase === GAME_PHASES.SETUP) {
    return "Fleet setup";
  }

  if (phase === GAME_PHASES.BATTLE) {
    return "Open waters";
  }

  return "Mission complete";
}

export function getTurnLabel(turn, isAiThinking) {
  if (isAiThinking || turn === TURN_STATES.AI) {
    return "Opponent plotting";
  }

  return "Your turn";
}

export function areAllShipsPlaced(fleet, shipDefinitions) {
  return fleet.length === shipDefinitions.length;
}

export function getAnnouncementForShot(shot, shipName, sourceLabel) {
  if (!shot) {
    return "";
  }

  if (shot.result === SHOT_RESULTS.MISS) {
    return `${sourceLabel} missed.`;
  }

  if (shot.result === SHOT_RESULTS.SUNK) {
    return `${sourceLabel} sunk the ${shipName}.`;
  }

  return `${sourceLabel} landed a hit on the ${shipName}.`;
}

export function getFleetSummary(fleet) {
  return {
    totalShips: fleet.length,
    sunkShips: fleet.filter(isShipSunk).length,
  };
}

export function buildResultsStats({
  startTime,
  endTime,
  playerShots,
  aiShots,
  winner,
}) {
  const playerMetrics = buildShotMetrics(playerShots);
  const aiMetrics = buildShotMetrics(aiShots);

  return finalizeMatchStats({
    startTime,
    endTime,
    playerShots: playerMetrics.shots,
    playerHits: playerMetrics.hits,
    aiShots: aiMetrics.shots,
    aiHits: aiMetrics.hits,
    winner,
    playerSinks: playerMetrics.sinks,
    aiSinks: aiMetrics.sinks,
    playerBestStreak: playerMetrics.bestStreak,
    aiBestStreak: aiMetrics.bestStreak,
    playerFirstHitShot: playerMetrics.firstHitShot,
    aiFirstHitShot: aiMetrics.firstHitShot,
  });
}

export { calculateAccuracy, formatDuration };
