import { useEffect, useMemo, useState } from "react";
import { GAME_PHASES } from "../data/constants";
import { useGameContext } from "../context/GameContext";
import { isRotateKey } from "../utils/keyboard";
import { formatDuration } from "../utils/stats";
import BattleActionBar from "./BattleActionBar";
import BackgroundEffects from "./BackgroundEffects";
import DifficultySelector from "./DifficultySelector";
import FleetSidebar from "./FleetSidebar";
import GameBoard from "./GameBoard";
import InstructionsModal from "./InstructionsModal";
import MainMenu from "./MainMenu";
import OnboardingModal from "./OnboardingModal";
import PauseModal from "./PauseModal";
import ResultsModal from "./ResultsModal";
import SettingsModal from "./SettingsModal";
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

  const timerLabel = useMemo(() => {
    const endTime = game.matchEndTime ?? now;
    return formatDuration(endTime - game.matchStartTime);
  }, [game.matchEndTime, game.matchStartTime, now]);

  const canConfirm = game.playerFleet.length === 5;
  const selectedShipName =
    game.availableShips.find((ship) => ship.id === game.selectedShipId)?.name ?? null;
  const playerShipsAfloat = game.playerFleetStatus.filter((ship) => !ship.isSunk).length;
  const enemyShipsAfloat = game.enemyFleetStatus.filter((ship) => !ship.isSunk).length;
  const turnCount = Math.max(game.playerShots.length, game.aiShots.length) + 1;
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
          timerLabel={timerLabel}
          turnCount={turnCount}
          playerStats={game.playerMetrics}
          shipsRemaining={{ player: playerShipsAfloat, opponent: enemyShipsAfloat }}
          onRestart={game.restartMatch}
          onPause={game.togglePause}
          onOpenGuide={game.openInstructions}
          onOpenSettings={() => game.openSettings("settings")}
          soundEnabled={game.soundEnabled}
          onToggleSound={game.toggleSound}
          isPaused={game.isPaused}
        />

        {game.phase === GAME_PHASES.SETUP ? (
          <section className="grid min-h-0 w-full max-w-full gap-2 overflow-x-hidden md:grid-cols-[13rem_minmax(0,1fr)] md:items-stretch md:gap-2 lg:grid-cols-[14.5rem_minmax(0,1fr)]">
            <div className="min-w-0 w-full max-w-full space-y-1.5 md:flex md:h-full md:flex-col">
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
                onClear={game.clearPlayerFleet}
                onRotate={game.toggleOrientation}
                selectedShipName={selectedShipName}
              />
            </div>
            <div className="grid min-h-0 w-full max-w-full justify-items-center gap-2 overflow-x-hidden md:h-full md:grid-cols-2 md:justify-items-stretch md:gap-2">
              <GameBoard
                title="Your Fleet"
                boardId="Player Grid"
                board={game.playerBoard}
                focusCell={game.focus.player}
                interactive
                cursorMode="placement"
                onMoveFocus={(dx, dy) => game.moveBoardFocus("player", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("player", x, y)}
                onActivateCell={(x, y) => game.handlePlayerBoardAction(x, y)}
                className="setup-board h-full w-full max-w-[13.5rem] sm:max-w-[15rem] md:max-w-none"
              />
              <GameBoard
                title="Opponent Grid"
                boardId="Target Grid"
                board={game.enemyBoard}
                focusCell={game.focus.enemy}
                interactive={false}
                cursorMode="battle"
                onMoveFocus={(dx, dy) => game.moveBoardFocus("enemy", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("enemy", x, y)}
                onActivateCell={(x, y) => game.fireAtEnemy(x, y)}
                className="setup-board hidden h-full w-full max-w-[13.5rem] sm:max-w-[15rem] md:flex md:max-w-none"
              />
            </div>
          </section>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <section className="viewport-main grid min-h-0 w-full max-w-full justify-items-center gap-2 overflow-x-hidden md:grid-cols-2 md:justify-items-stretch md:gap-2">
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
                className="battle-board w-full max-w-[15rem] sm:max-w-[16rem] md:max-w-none"
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
                className="battle-board w-full max-w-[15rem] sm:max-w-[16rem] md:max-w-none"
              />
            </section>
            <BattleActionBar
              latestEvent={latestEventMessage}
              playerAccuracy={game.playerMetrics.accuracy}
              opponentAccuracy={game.enemyMetrics.accuracy}
              shipsRemaining={{ player: playerShipsAfloat, opponent: enemyShipsAfloat }}
              currentTurnLabel={game.turnLabel}
              onPause={game.togglePause}
              onOpenGuide={game.openInstructions}
              onRestart={game.restartMatch}
            />
          </div>
        )}
      </div>

      <ResultsModal
        open={game.phase === GAME_PHASES.GAME_OVER}
        winner={game.winner}
        stats={game.resultsStats}
        difficulty={game.difficulty}
        historySummary={game.historySummary}
        revealedBoard={game.revealedEnemyBoard}
        onReplay={game.restartMatch}
        onReplayStep={game.changeDifficultyByStep}
        onChangeDifficulty={game.openDifficultyScreen}
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
