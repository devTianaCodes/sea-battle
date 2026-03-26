import { useEffect, useMemo, useState } from "react";
import { GAME_PHASES } from "../data/constants";
import { useGameContext } from "../context/GameContext";
import { formatDuration } from "../utils/stats";
import BattleIntelPanel from "./BattleIntelPanel";
import FleetSidebar from "./FleetSidebar";
import GameBoard from "./GameBoard";
import HistoryPanel from "./HistoryPanel";
import ResultsModal from "./ResultsModal";
import ShipPlacementPanel from "./ShipPlacementPanel";
import StatusBar from "./StatusBar";
import TurnBanner from "./TurnBanner";

export default function GameShell() {
  const game = useGameContext();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key.toLowerCase() === "r" && game.phase === GAME_PHASES.SETUP) {
        event.preventDefault();
        game.toggleOrientation();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game]);

  const timerLabel = useMemo(() => {
    const endTime = game.matchEndTime ?? now;
    return formatDuration(endTime - game.matchStartTime);
  }, [game.matchEndTime, game.matchStartTime, now]);

  const canConfirm = game.playerFleet.length === 5;
  const selectedShipName =
    game.availableShips.find((ship) => ship.id === game.selectedShipId)?.name ?? null;

  return (
    <div className="min-h-screen overflow-hidden bg-[#050b18] text-slate-100">
      <div className="ocean-background" />
      <TurnBanner visible={game.isAiThinking} label="Opponent Turn" />
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <StatusBar
          difficulty={game.difficulty}
          onDifficultyChange={game.setDifficulty}
          phaseLabel={game.phaseLabel}
          turnLabel={game.turnLabel}
          announcement={game.announcement}
          timerLabel={timerLabel}
          onRestart={game.restartMatch}
          difficultyLocked={game.phase === GAME_PHASES.BATTLE}
        />

        <section className="animate-panel-in grid gap-6 xl:grid-cols-[22rem,minmax(0,1fr)]">
          <div className="space-y-6">
            <FleetSidebar
              availableShips={game.availableShips}
              playerFleet={game.playerFleet}
              selectedShipId={game.selectedShipId}
              orientation={game.orientation}
              onSelectShip={game.selectShip}
            />
            <ShipPlacementPanel
              phase={game.phase}
              canConfirm={canConfirm}
              onConfirm={game.confirmPlayerFleet}
              onRandomize={game.randomizePlayerFleet}
              onRotate={game.toggleOrientation}
              selectedShipName={selectedShipName}
            />
            <HistoryPanel
              history={game.history}
              summary={game.historySummary}
              onClearHistory={game.clearHistory}
            />
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <GameBoard
                title="Your Waters"
                subtitle="Ships visible"
                boardId="Player Grid"
                board={game.playerBoard}
                focusCell={game.focus.player}
                interactive={game.phase === GAME_PHASES.SETUP}
                onMoveFocus={(dx, dy) => game.moveBoardFocus("player", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("player", x, y)}
                onActivateCell={(x, y) => game.placeSelectedShip(x, y)}
              />
              <GameBoard
                title="Enemy Waters"
                subtitle="Fog of war active"
                boardId="Target Grid"
                board={game.enemyBoard}
                focusCell={game.focus.enemy}
                interactive={
                  game.phase === GAME_PHASES.BATTLE &&
                  game.turn === "player" &&
                  !game.isAiThinking
                }
                onMoveFocus={(dx, dy) => game.moveBoardFocus("enemy", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("enemy", x, y)}
                onActivateCell={(x, y) => game.fireAtEnemy(x, y)}
              />
            </div>
            <BattleIntelPanel
              playerMetrics={game.playerMetrics}
              enemyMetrics={game.enemyMetrics}
              playerFleetStatus={game.playerFleetStatus}
              enemyFleetStatus={game.enemyFleetStatus}
              eventLog={game.eventLog}
            />
          </div>
        </section>
      </main>

      <ResultsModal
        open={game.phase === GAME_PHASES.GAME_OVER}
        winner={game.winner}
        stats={game.resultsStats}
        difficulty={game.difficulty}
        historySummary={game.historySummary}
        onReplay={game.restartMatch}
      />
    </div>
  );
}
