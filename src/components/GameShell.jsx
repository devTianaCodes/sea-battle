import { useEffect, useState } from "react";
import { GAME_PHASES } from "../data/constants";
import { useGameContext } from "../context/GameContext";
import { isRotateKey } from "../utils/keyboard";
import BattleActionBar from "./BattleActionBar";
import BackgroundEffects from "./BackgroundEffects";
import BoardStageTabs from "./BoardStageTabs";
import DifficultySelector from "./DifficultySelector";
import GameBoard from "./GameBoard";
import InstructionsModal from "./InstructionsModal";
import MainMenu from "./MainMenu";
import OnboardingModal from "./OnboardingModal";
import PauseModal from "./PauseModal";
import ResultsModal from "./ResultsModal";
import SettingsModal from "./SettingsModal";
import ShipPlacer from "./ShipPlacer";
import StatusBar from "./StatusBar";
import TurnBanner from "./TurnBanner";

export default function GameShell() {
  const game = useGameContext();
  const [activeBoardView, setActiveBoardView] = useState("enemy");

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.key === "?" || (event.key === "/" && event.shiftKey))) {
        event.preventDefault();
        game.openInstructions();
        return;
      }

      if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        game.toggleSound();
        return;
      }

      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        game.togglePause();
        return;
      }

      if (isRotateKey(event.key) && game.phase === GAME_PHASES.SETUP) {
        event.preventDefault();
        game.toggleOrientation();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game]);

  useEffect(() => {
    if (game.phase === GAME_PHASES.SETUP) {
      setActiveBoardView("player");
      return;
    }

    if (game.phase === GAME_PHASES.BATTLE && game.turn === "player") {
      setActiveBoardView("enemy");
    }
  }, [game.phase, game.turn]);

  const canConfirm = game.playerFleet.length === 5;
  const selectedShip = game.availableShips.find((ship) => ship.id === game.selectedShipId) ?? null;
  const selectedShipName = selectedShip?.name ?? null;
  const selectedShipSize = selectedShip?.size ?? null;
  const playerShipsAfloat = game.playerFleetStatus.filter((ship) => !ship.isSunk).length;
  const enemyShipsAfloat = game.enemyFleetStatus.filter((ship) => !ship.isSunk).length;
  const latestEventMessage = game.eventLog[0]?.message ?? game.announcement;

  if (game.screen === "menu") {
    return (
      <main
        id="game-main"
        className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden text-slate-100"
      >
        {game.backgroundEffectsEnabled ? <BackgroundEffects energetic={false} /> : null}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <MainMenu
            historySummary={game.historySummary}
            onPlayClick={game.openDifficultyScreen}
            onInstructionsClick={game.openInstructions}
            onSettingsClick={() => game.openSettings("settings")}
            onStatsClick={() => game.openSettings("statistics")}
          />
        </div>
        <InstructionsModal open={game.showInstructions} onClose={game.closeInstructions} />
        <SettingsModal
          open={game.showSettings}
          defaultTab={game.settingsTab}
          onClose={game.closeSettings}
          soundEnabled={game.soundEnabled}
          onToggleSound={game.toggleSound}
          backgroundEffectsEnabled={game.backgroundEffectsEnabled}
          onToggleBackgroundEffects={game.toggleBackgroundEffects}
          difficulty={game.difficulty}
          onDifficultyChange={game.setDifficulty}
          historySummary={game.historySummary}
          onClearStats={game.clearHistory}
          onResetToMenu={game.openMenu}
        />
      </main>
    );
  }

  if (game.screen === "difficulty") {
    return (
      <main
        id="game-main"
        className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden text-slate-100"
      >
        {game.backgroundEffectsEnabled ? <BackgroundEffects energetic={false} /> : null}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-start overflow-hidden sm:justify-center">
          <DifficultySelector
            difficulty={game.difficulty}
            onChange={game.beginGameWithDifficulty}
            historySummary={game.historySummary}
            onBack={game.openMenu}
          />
        </div>
        <InstructionsModal open={game.showInstructions} onClose={game.closeInstructions} />
        <SettingsModal
          open={game.showSettings}
          defaultTab={game.settingsTab}
          onClose={game.closeSettings}
          soundEnabled={game.soundEnabled}
          onToggleSound={game.toggleSound}
          backgroundEffectsEnabled={game.backgroundEffectsEnabled}
          onToggleBackgroundEffects={game.toggleBackgroundEffects}
          difficulty={game.difficulty}
          onDifficultyChange={game.setDifficulty}
          historySummary={game.historySummary}
          onClearStats={game.clearHistory}
          onResetToMenu={game.openMenu}
        />
      </main>
    );
  }

  return (
    <main
      id="game-main"
      className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden text-slate-100"
    >
      {game.backgroundEffectsEnabled ? (
        <BackgroundEffects energetic={game.phase === GAME_PHASES.BATTLE} />
      ) : null}
      <TurnBanner visible={game.isAiThinking} label="Opponent Turn" />
      <div className="relative z-10 flex flex-1 flex-col gap-2 overflow-hidden">
        <StatusBar
          difficulty={game.difficulty}
          turnLabel={game.turnLabel}
          announcement={game.announcement}
          shipsRemaining={{ player: playerShipsAfloat, opponent: enemyShipsAfloat }}
          onPause={game.togglePause}
          onOpenGuide={game.openInstructions}
          onOpenSettings={() => game.openSettings("settings")}
          isPaused={game.isPaused}
        />

        {game.phase === GAME_PHASES.SETUP ? (
          <section className="setup-layout grid min-h-0 w-full max-w-full gap-2 overflow-x-hidden md:grid-cols-[13rem_minmax(0,1fr)] md:items-stretch md:gap-2 lg:grid-cols-[14.5rem_minmax(0,1fr)]">
            <div className="setup-controls min-w-0 w-full max-w-full space-y-1.5 md:flex md:h-full md:flex-col">
              <ShipPlacer
                phase={game.phase}
                availableShips={game.availableShips}
                playerFleet={game.playerFleet}
                selectedShipId={game.selectedShipId}
                orientation={game.orientation}
                onSelectShip={game.selectShip}
                canConfirm={canConfirm}
                onConfirm={game.confirmPlayerFleet}
                onRandomize={game.randomizePlayerFleet}
                onClear={game.clearPlayerFleet}
                onRotate={game.toggleOrientation}
                selectedShipName={selectedShipName}
                selectedShipSize={selectedShipSize}
              />
            </div>
            <div className="board-stage grid min-h-0 w-full max-w-full justify-items-center gap-2 overflow-x-hidden md:h-full md:grid-cols-2 md:justify-items-stretch md:gap-2">
              <GameBoard
                title="Your Fleet"
                boardId="Your Fleet"
                board={game.playerBoard}
                focusCell={game.focus.player}
                interactive
                cursorMode="placement"
                onMoveFocus={(dx, dy) => game.moveBoardFocus("player", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("player", x, y)}
                onActivateCell={(x, y) => game.handlePlayerBoardAction(x, y)}
                className="setup-board mobile-board-panel is-active h-full w-full max-w-full"
              />
              <GameBoard
                title="Target Grid"
                boardId="Target Grid"
                board={game.enemyBoard}
                focusCell={game.focus.enemy}
                interactive={false}
                cursorMode="battle"
                onMoveFocus={(dx, dy) => game.moveBoardFocus("enemy", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("enemy", x, y)}
                onActivateCell={(x, y) => game.fireAtEnemy(x, y)}
                className="setup-board mobile-board-panel is-active h-full w-full max-w-full"
              />
            </div>
          </section>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <section className="viewport-main board-stage grid min-h-0 w-full max-w-full justify-items-center gap-2 overflow-x-hidden md:grid-cols-2 md:justify-items-stretch md:gap-2">
              <BoardStageTabs
                activeView={activeBoardView}
                onChange={setActiveBoardView}
                views={[
                  { id: "enemy", label: "Target" },
                  { id: "player", label: "Fleet" },
                ]}
              />
              <GameBoard
                title="Your Fleet"
                boardId="Player Grid"
                board={game.playerBoard}
                focusCell={game.focus.player}
                interactive={false}
                cursorMode="placement"
                onMoveFocus={(dx, dy) => game.moveBoardFocus("player", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("player", x, y)}
                onActivateCell={(x, y) => game.handlePlayerBoardAction(x, y)}
                className={`battle-board mobile-board-panel w-full max-w-full ${
                  activeBoardView === "player" ? "is-active" : ""
                }`}
              />
              <GameBoard
                title="Opponent Grid"
                boardId="Target Grid"
                board={game.enemyBoard}
                focusCell={game.focus.enemy}
                interactive={
                  game.phase === GAME_PHASES.BATTLE &&
                  game.turn === "player" &&
                  !game.isAiThinking
                }
                isThinking={game.isAiThinking}
                cursorMode="battle"
                onMoveFocus={(dx, dy) => game.moveBoardFocus("enemy", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("enemy", x, y)}
                onActivateCell={(x, y) => game.fireAtEnemy(x, y)}
                className={`battle-board mobile-board-panel w-full max-w-full ${
                  activeBoardView === "enemy" ? "is-active" : ""
                }`}
              />
            </section>
            <BattleActionBar
              latestEvent={latestEventMessage}
              playerAccuracy={game.playerMetrics.accuracy}
              opponentAccuracy={game.enemyMetrics.accuracy}
              shipsRemaining={{ player: playerShipsAfloat, opponent: enemyShipsAfloat }}
              currentTurnLabel={game.turnLabel}
            />
          </div>
        )}
      </div>

      <ResultsModal
        open={game.phase === GAME_PHASES.GAME_OVER}
        winner={game.winner}
        stats={game.resultsStats}
        history={game.history}
        historySummary={game.historySummary}
        revealedBoard={game.revealedEnemyBoard}
        onReplay={game.openDifficultyScreen}
        onMainMenu={game.openMenu}
      />
      <PauseModal
        open={game.isPaused}
        onResume={game.resumeGame}
        onOpenInstructions={game.openInstructions}
        onMainMenu={game.openMenu}
      />
      <OnboardingModal open={game.showOnboarding} onClose={game.dismissOnboarding} />
      <InstructionsModal open={game.showInstructions} onClose={game.closeInstructions} />
      <SettingsModal
        open={game.showSettings}
        defaultTab={game.settingsTab}
        onClose={game.closeSettings}
        soundEnabled={game.soundEnabled}
        onToggleSound={game.toggleSound}
        backgroundEffectsEnabled={game.backgroundEffectsEnabled}
        onToggleBackgroundEffects={game.toggleBackgroundEffects}
        difficulty={game.difficulty}
        onDifficultyChange={game.setDifficulty}
        historySummary={game.historySummary}
        onClearStats={game.clearHistory}
        onResetToMenu={game.openMenu}
      />
    </main>
  );
}
