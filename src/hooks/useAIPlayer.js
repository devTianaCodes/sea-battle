import { useEffect, useRef } from "react";
import { getAIMove } from "../utils/aiLogic";

export default function useAIPlayer(difficulty) {
  const recentResultRef = useRef(null);

  useEffect(() => {
    recentResultRef.current = null;
  }, [difficulty]);

  function getNextShot(aiKnowledge, remainingShips) {
    const nextMove = getAIMove(
      difficulty,
      [],
      aiKnowledge.map((shot) => ({
        row: shot.y,
        col: shot.x,
        result: shot.result,
        shipId: shot.shipId,
      })),
      remainingShips
    );

    return {
      x: nextMove.col,
      y: nextMove.row,
    };
  }

  function notifyShotResult(result) {
    recentResultRef.current = result;
  }

  return {
    getNextShot,
    notifyShotResult,
  };
}
