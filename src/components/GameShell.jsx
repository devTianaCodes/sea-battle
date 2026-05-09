import { useEffect, useState } from "react";
import { GAME_PHASES, SHIP_DEFINITIONS } from "../data/constants";
import { useGameContext } from "../context/GameContext";
import { isRotateKey } from "../utils/keyboard";
import BattleActionBar from "./BattleActionBar";
import BackgroundEffects from "./BackgroundEffects";
import BoardStageTabs from "./BoardStageTabs";
import DifficultySelector from "./DifficultySelector";
import GameBoard from "./GameBoard";
import IconButton from "./IconButton";
import InstructionsModal from "./InstructionsModal";
import MainMenu from "./MainMenu";
import OnboardingModal from "./OnboardingModal";
import PauseModal from "./PauseModal";
import ResultsModal from "./ResultsModal";
import SetupGuideModal from "./SetupGuideModal";
import SettingsModal from "./SettingsModal";
import ShipPlacer from "./ShipPlacer";
import StatusBar from "./StatusBar";
import TurnBanner from "./TurnBanner";

function getPageSlug(game, activeBoardView, setupBoardView) {
  if (game.showInstructions) {
    return "guide";
  }

  if (game.showSettings) {
    return game.settingsTab === "statistics" ? "statistics" : "settings";
  }

  if (game.screen === "menu") {
    return "entry-page";
  }

  if (game.screen === "difficulty") {
    return "difficulty";
  }

  if (game.phase === GAME_PHASES.GAME_OVER) {
    return game.winner === "player" ? "results-victory" : "results-defeat";
  }

  if (game.isPaused) {
    return "pause";
  }

  if (game.showSetupGuide) {
    return "how-to-play";
  }

  if (game.showOnboarding) {
    return "onboarding";
  }

  if (game.phase === GAME_PHASES.SETUP) {
    return setupBoardView === "enemy" ? "setup-opponent-waters" : "setup-your-fleet";
  }

  if (game.phase === GAME_PHASES.BATTLE) {
    return activeBoardView === "player" ? "battle-your-fleet" : "battle-opponent-waters";
  }

  return "game";
}

export default function GameShell() {
  const game = useGameContext();
  const [activeBoardView, setActiveBoardView] = useState("enemy");
  const [setupBoardView, setSetupBoardView] = useState("player");

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
      setSetupBoardView("player");
      return;
    }

    if (game.phase === GAME_PHASES.BATTLE && game.turn === "player") {
      setActiveBoardView("enemy");
    }
  }, [game.phase, game.turn]);

  useEffect(() => {
    const pageSlug = getPageSlug(game, activeBoardView, setupBoardView);
    const nextUrl = `/${pageSlug}${window.location.search}`;

    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [
    activeBoardView,
    game.isPaused,
    game.phase,
    game.screen,
    game.settingsTab,
    game.showInstructions,
    game.showOnboarding,
    game.showSettings,
    game.showSetupGuide,
    game.winner,
    setupBoardView,
  ]);

  const canConfirm = game.playerFleet.length === SHIP_DEFINITIONS.length;
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
          turnLabel={game.turnLabel}
          announcement={game.announcement}
          shipsRemaining={{ player: playerShipsAfloat, opponent: enemyShipsAfloat }}
          onPause={game.togglePause}
          onOpenGuide={game.openInstructions}
          onOpenSettings={() => game.openSettings("settings")}
          isPaused={game.isPaused}
        />

        {game.phase === GAME_PHASES.SETUP ? (
          <section className="setup-layout grid min-h-0 w-full max-w-full gap-3 overflow-x-hidden md:grid-cols-[13rem_minmax(0,1fr)] md:items-stretch md:gap-4 lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:gap-5">
            <div className="setup-controls min-w-0 w-full max-w-full space-y-1.5 md:flex md:h-full md:flex-col">
              <ShipPlacer
                phase={game.phase}
                availableShips={game.availableShips}
                playerFleet={game.playerFleet}
                selectedShipId={game.selectedShipId}
                placementAnchor={game.placementAnchor}
                onSelectShip={game.selectShip}
                canConfirm={canConfirm}
                onRandomize={game.randomizePlayerFleet}
                onClear={game.clearPlayerFleet}
                selectedShipName={selectedShipName}
                selectedShipSize={selectedShipSize}
              />
            </div>
            <div
              className="board-stage setup-board-stage grid min-h-0 w-full max-w-full justify-items-center overflow-x-hidden md:h-full md:justify-items-stretch"
            >
              <BoardStageTabs
                activeView={setupBoardView}
                onChange={setSetupBoardView}
                className="setup-board-switcher"
                views={[
                  { id: "player", label: "Your Fleet" },
                  { id: "enemy", label: "Opponent Waters" },
                ]}
              />
              <GameBoard
                title="Your Fleet"
                boardId="Your Fleet"
                board={game.playerBoard}
                focusCell={game.focus.player}
                interactive={!canConfirm}
                cursorMode="placement"
                onMoveFocus={(dx, dy) => game.moveBoardFocus("player", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("player", x, y)}
                onActivateCell={(x, y) => game.handlePlayerBoardAction(x, y)}
                showHeading={false}
                showActiveCell={!canConfirm}
                overlay={
                  canConfirm ? (
                    <div className="setup-play-overlay absolute inset-0 z-20 flex items-center justify-center bg-[#03110e]/44 p-4 backdrop-blur-[1.5px]">
                      <IconButton
                        onClick={game.confirmPlayerFleet}
                        tone="success"
                        className="setup-play-button setup-play-cta justify-center px-10 py-3.5 text-[0.82rem] tracking-[0.12em] text-white sm:text-[0.92rem]"
                        size="sm"
                      >
                        Play
                      </IconButton>
                    </div>
                  ) : null
                }
                className={`setup-board mobile-board-panel h-full w-full max-w-full ${
                  setupBoardView === "player" ? "is-active" : ""
                }`}
              />
              <GameBoard
                title="Opponent Waters"
                boardId="Opponent Waters"
                board={game.enemyBoard}
                focusCell={game.focus.enemy}
                interactive={false}
                cursorMode="battle"
                onMoveFocus={(dx, dy) => game.moveBoardFocus("enemy", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("enemy", x, y)}
                onActivateCell={(x, y) => game.fireAtEnemy(x, y)}
                showHeading={false}
                showActiveCell={false}
                className={`setup-board mobile-board-panel h-full w-full max-w-full ${
                  setupBoardView === "enemy" ? "is-active" : ""
                }`}
                overlay={
                  <div className="opponent-waters-warning absolute inset-0 z-10 flex items-center justify-center p-4">
                    <div className="glass-light rounded-[1rem] border border-coral/35 px-4 py-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.13em] text-coral shadow-[0_0_24px_rgba(255,107,107,0.2)] sm:px-5 sm:py-4 sm:text-xs">
                      Opponent waters are dark and dangerous
                      <span className="ml-2 text-base leading-none text-coral sm:text-lg">X</span>
                    </div>
                  </div>
                }
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
                  { id: "enemy", label: "Opponent Waters" },
                  { id: "player", label: "Your Fleet" },
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
                title="Target Grid"
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
                overlay={
                  game.showShootPrompt ? (
                    <div className="shoot-prompt-overlay absolute inset-0 z-20 flex items-center justify-center p-4">
                      <div className="glass-light rounded-[1rem] border border-cyan/35 px-5 py-3 text-center text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-cyan-50 shadow-[0_0_26px_rgba(0,212,255,0.18)] sm:text-xs">
                        Shoot the opponent waters
                      </div>
                    </div>
                  ) : null
                }
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
      <SetupGuideModal open={game.showSetupGuide} onClose={game.closeSetupGuide} />
      <OnboardingModal
        open={game.showOnboarding && !game.showSetupGuide}
        onClose={game.dismissOnboarding}
      />
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
