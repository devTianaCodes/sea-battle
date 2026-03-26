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

export function finalizeMatchStats({
  startTime,
  endTime,
  playerShots,
  playerHits,
  aiShots,
  aiHits,
  winner,
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
