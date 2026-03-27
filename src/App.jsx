import GameShell from "./components/GameShell";
import GameViewport from "./components/GameViewport";
import { GameProvider } from "./context/GameContext";

export default function App() {
  return (
    <GameProvider>
      <GameViewport>
        <GameShell />
      </GameViewport>
    </GameProvider>
  );
}
