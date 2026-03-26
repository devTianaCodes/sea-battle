import { useEffect, useRef } from "react";
import { getEasyShot, getHardShot, getMediumShot } from "../utils/ai";

export default function useAIPlayer(difficulty) {
  const recentResultRef = useRef(null);

  useEffect(() => {
    recentResultRef.current = null;
  }, [difficulty]);

  function getNextShot(aiKnowledge, remainingShips) {
    if (difficulty === "easy") {
      return getEasyShot(aiKnowledge);
    }

    if (difficulty === "hard") {
      return getHardShot(aiKnowledge, remainingShips);
    }

    return getMediumShot(aiKnowledge);
  }

  function notifyShotResult(result) {
    recentResultRef.current = result;
  }

  return {
    getNextShot,
    notifyShotResult,
  };
}
