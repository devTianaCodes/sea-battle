import GameShell from "./components/GameShell";
import GameViewport from "./components/GameViewport";
import { GameProvider } from "./context/GameContext";

export default function App() {
  return (
    <GameProvider>
      <a
        href="#game-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-cyan focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#04111f]"
      >
        Skip to main content
      </a>
      <GameViewport>
        <GameShell />
      </GameViewport>
    </GameProvider>
  );
}
