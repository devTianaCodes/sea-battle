import { createContext, useContext, useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import useSeaBattleGame from "../hooks/useSeaBattleGame";
import { initializeEmptyBoard, normalizeFleetForStore } from "../utils/gameLogic";

function toStorePhase(phase) {
  if (phase === "setup") {
    return "placement";
  }

  if (phase === "game-over") {
    return "gameover";
  }

  return phase;
}

function createInitialStoreState() {
  return {
    gamePhase: "placement",
    playerBoard: initializeEmptyBoard(),
    opponentBoard: initializeEmptyBoard(),
    playerShips: [],
    opponentShips: [],
    currentTurn: "player",
    playerScore: { hits: 0, misses: 0, accuracy: 0 },
    gameResult: null,
    difficulty: "medium",
  };
}

export const useGameStore = create(
  persist(
    (set) => ({
      ...createInitialStoreState(),
      setGamePhase: (gamePhase) => set({ gamePhase }),
      placeShip: (shipPositions, isPlayer = true) =>
        set((state) => {
          const key = isPlayer ? "playerShips" : "opponentShips";
          return {
            [key]: [
              ...state[key],
              {
                id: `${isPlayer ? "player" : "opponent"}-${state[key].length + 1}`,
                positions: shipPositions,
                sunk: false,
              },
            ],
          };
        }),
      fireShot: (row, col, isPlayer = true) =>
        set((state) => {
          const key = isPlayer ? "opponentBoard" : "playerBoard";
          const board = state[key].map((boardRow) => boardRow.map((cell) => ({ ...cell })));
          const target = board[row]?.[col];

          if (!target) {
            return state;
          }

          target.state = target.shipId ? "hit" : "miss";
          return { [key]: board };
        }),
      initializeGame: (difficulty = "medium") =>
        set({
          ...createInitialStoreState(),
          difficulty,
        }),
      resetGame: () => set(createInitialStoreState()),
      toggleTurn: () =>
        set((state) => ({
          currentTurn: state.currentTurn === "player" ? "opponent" : "player",
        })),
      syncFromSnapshot: (snapshot) =>
        set({
          gamePhase: toStorePhase(snapshot.phase),
          playerBoard: snapshot.playerBoard.map((row) =>
            row.map((cell) => ({
              row: cell.y,
              col: cell.x,
              shipId: cell.shipId,
              state: cell.isHit ? "hit" : cell.isMiss ? "miss" : cell.shipId ? "ship" : "empty",
            }))
          ),
          opponentBoard: snapshot.enemyBoard.map((row) =>
            row.map((cell) => ({
              row: cell.y,
              col: cell.x,
              shipId: cell.shipId,
              state: cell.isHit ? "hit" : cell.isMiss ? "miss" : cell.shipId ? "ship" : "empty",
            }))
          ),
          playerShips: normalizeFleetForStore(snapshot.playerFleet),
          opponentShips: normalizeFleetForStore(snapshot.enemyFleet),
          currentTurn: snapshot.turn === "ai" ? "opponent" : "player",
          playerScore: {
            hits: snapshot.playerMetrics.hits,
            misses: snapshot.playerMetrics.misses,
            accuracy: snapshot.playerMetrics.accuracy,
          },
          gameResult:
            snapshot.winner === "player"
              ? "win"
              : snapshot.winner === "ai"
                ? "loss"
                : null,
          difficulty: snapshot.difficulty,
        }),
    }),
    {
      name: "sea-battle-game-store",
      partialize: (state) => ({
        difficulty: state.difficulty,
      }),
    }
  )
);

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const game = useSeaBattleGame();

  useEffect(() => {
    useGameStore.getState().syncFromSnapshot(game);
  }, [game]);

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }

  return context;
}
