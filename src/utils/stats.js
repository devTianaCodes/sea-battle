export function calculateAccuracy(hits, shots) {
  if (!shots) {
    return 0;
  }

  return Math.round((hits / shots) * 100);
}

export function createMatchStats() {
  return {
    startTime: Date.now(),
    endTime: null,
    playerShots: 0,
    playerHits: 0,
    aiShots: 0,
    aiHits: 0,
    winner: null,
    accuracy: 0,
    durationMs: 0,
  };
}

export function buildShotMetrics(shots) {
  let currentStreak = 0;
  let bestStreak = 0;
  let firstHitShot = null;
  let sinks = 0;

  shots.forEach((shot, index) => {
    if (shot.result === "miss") {
      currentStreak = 0;
      return;
    }

    currentStreak += 1;
    bestStreak = Math.max(bestStreak, currentStreak);

    if (firstHitShot === null) {
      firstHitShot = index + 1;
    }

    if (shot.result === "sunk") {
      sinks += 1;
    }
  });

  const hits = shots.filter((shot) => shot.result !== "miss").length;
  const misses = shots.length - hits;

  return {
    shots: shots.length,
    hits,
    misses,
    sinks,
    accuracy: calculateAccuracy(hits, shots.length),
    bestStreak,
    currentStreak,
    firstHitShot,
  };
}

export function getPerformanceLabel({ accuracy, bestStreak, sinks, winner }) {
  if (winner === "player" && accuracy >= 60 && bestStreak >= 3) {
    return "Clinical finish";
  }

  if (winner === "player" && sinks >= 3) {
    return "Fleet breaker";
  }

  if (accuracy >= 50) {
    return "Locked in";
  }

  if (bestStreak >= 2) {
    return "Momentum found";
  }

  return "Keep hunting";
}

export function finalizeMatchStats({
  startTime,
  endTime,
  playerShots,
  playerHits,
  aiShots,
  aiHits,
  winner,
  playerSinks = 0,
  aiSinks = 0,
  playerBestStreak = 0,
  aiBestStreak = 0,
  playerFirstHitShot = null,
  aiFirstHitShot = null,
}) {
  return {
    startTime,
    endTime,
    playerShots,
    playerHits,
    aiShots,
    aiHits,
    winner,
    accuracy: calculateAccuracy(playerHits, playerShots),
    durationMs: Math.max(0, endTime - startTime),
    playerSinks,
    aiSinks,
    playerBestStreak,
    aiBestStreak,
    playerFirstHitShot,
    aiFirstHitShot,
    performanceLabel: getPerformanceLabel({
      accuracy: calculateAccuracy(playerHits, playerShots),
      bestStreak: playerBestStreak,
      sinks: playerSinks,
      winner,
    }),
  };
}

export function formatDuration(durationMs) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
