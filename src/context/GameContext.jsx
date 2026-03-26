import { createContext, useContext } from "react";
import useSeaBattleGame from "../hooks/useSeaBattleGame";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const game = useSeaBattleGame();
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }

  return context;
}
