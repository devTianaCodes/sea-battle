const STORAGE_KEY = "sea-battle-history-v1";
const HISTORY_LIMIT = 8;

export function loadHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(history) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function appendHistoryEntry(history, entry) {
  return [entry, ...history].slice(0, HISTORY_LIMIT);
}

export function summarizeHistory(history) {
  if (!history.length) {
    return {
      totalMatches: 0,
      wins: 0,
      losses: 0,
      bestAccuracy: 0,
      averageAccuracy: 0,
      averageDurationMs: 0,
      difficultyBreakdown: {},
    };
  }

  const totals = history.reduce(
    (summary, match) => ({
      wins: summary.wins + (match.winner === "player" ? 1 : 0),
      losses: summary.losses + (match.winner === "ai" ? 1 : 0),
      accuracyTotal: summary.accuracyTotal + match.accuracy,
      bestAccuracy: Math.max(summary.bestAccuracy, match.accuracy),
      durationTotal: summary.durationTotal + match.durationMs,
    }),
    {
      wins: 0,
      losses: 0,
      accuracyTotal: 0,
      bestAccuracy: 0,
      durationTotal: 0,
      difficultyBreakdown: {},
    }
  );

  return {
    totalMatches: history.length,
    wins: totals.wins,
    losses: totals.losses,
    bestAccuracy: totals.bestAccuracy,
    averageAccuracy: Math.round(totals.accuracyTotal / history.length),
    averageDurationMs: Math.round(totals.durationTotal / history.length),
    difficultyBreakdown: history.reduce((breakdown, match) => {
      const current = breakdown[match.difficulty] ?? { matches: 0, wins: 0 };
      breakdown[match.difficulty] = {
        matches: current.matches + 1,
        wins: current.wins + (match.winner === "player" ? 1 : 0),
      };
      return breakdown;
    }, {}),
  };
}
