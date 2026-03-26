import GameShell from "./components/GameShell";
import { GameProvider } from "./context/GameContext";

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
