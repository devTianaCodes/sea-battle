import { useEffect, useMemo, useState } from "react";
import { GAME_PHASES } from "../data/constants";
import { useGameContext } from "../context/GameContext";
import { formatDuration } from "../utils/stats";
import BattleIntelPanel from "./BattleIntelPanel";
import BackgroundEffects from "./BackgroundEffects";
import BoardStageTabs from "./BoardStageTabs";
import GameBoard from "./GameBoard";
import HistoryPanel from "./HistoryPanel";
import IconButton from "./IconButton";
import InstructionsModal from "./InstructionsModal";
import MainMenu from "./MainMenu";
import OnboardingModal from "./OnboardingModal";
import PauseModal from "./PauseModal";
import PhaseCoach from "./PhaseCoach";
import ResultsModal from "./ResultsModal";
import SettingsModal from "./SettingsModal";
import ShipPlacer from "./ShipPlacer";
import StatusBar from "./StatusBar";
import TurnBanner from "./TurnBanner";

export default function GameShell() {
  const game = useGameContext();
  const [now, setNow] = useState(Date.now());
  const [mobileView, setMobileView] = useState("player");

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

      if (event.key.toLowerCase() === "r" && game.phase === GAME_PHASES.SETUP) {
        event.preventDefault();
        game.toggleOrientation();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game]);

  useEffect(() => {
    if (game.phase === GAME_PHASES.SETUP) {
      setMobileView("player");
      return;
    }

    if (game.phase === GAME_PHASES.BATTLE) {
      setMobileView("enemy");
      return;
    }

    setMobileView("intel");
  }, [game.phase]);

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

  if (game.screen === "menu") {
    return (
      <div className="min-h-screen overflow-hidden bg-[#050b18] text-slate-100">
        {game.backgroundEffectsEnabled ? <BackgroundEffects energetic={false} /> : null}
        <MainMenu
          historySummary={game.historySummary}
          onPlayClick={game.openDifficultyScreen}
          onInstructionsClick={game.openInstructions}
          onStatsClick={() => game.openSettings("statistics")}
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
      </div>
    );
  }

  if (game.screen === "difficulty") {
    return (
      <div className="min-h-screen overflow-hidden bg-[#050b18] text-slate-100">
        {game.backgroundEffectsEnabled ? <BackgroundEffects energetic={false} /> : null}
        <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">Difficulty</p>
                <h1 className="mt-3 font-display text-4xl text-foam">Choose your opponent</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Pick the AI behavior for this run. Each card shows how that difficulty tends to
                  perform in your archive.
                </p>
              </div>
              <IconButton onClick={game.openMenu}>Back</IconButton>
            </div>
            <div className="mt-6">
              <StatusBar
                difficulty={game.difficulty}
                onDifficultyChange={game.beginGameWithDifficulty}
                historySummary={game.historySummary}
                phaseLabel="Difficulty Select"
                turnLabel="Menu"
                announcement="Confirm a difficulty to enter ship placement."
                timerLabel="00:00"
                turnCount={0}
                playerStats={{ accuracy: 0, hits: 0, misses: 0 }}
                shipsRemaining={{ player: 5, opponent: 5 }}
                onRestart={game.openMenu}
                onPause={game.togglePause}
                onOpenGuide={game.openInstructions}
                onOpenSettings={() => game.openSettings("settings")}
                soundEnabled={game.soundEnabled}
                onToggleSound={game.toggleSound}
                difficultyLocked={false}
                isPaused={false}
              />
            </div>
          </div>
        </main>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#050b18] text-slate-100">
      {game.backgroundEffectsEnabled ? (
        <BackgroundEffects energetic={game.phase === GAME_PHASES.BATTLE} />
      ) : null}
      <TurnBanner visible={game.isAiThinking} label="Opponent Turn" />
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <StatusBar
          difficulty={game.difficulty}
          onDifficultyChange={game.setDifficulty}
          historySummary={game.historySummary}
          phaseLabel={game.phaseLabel}
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
          difficultyLocked={game.phase === GAME_PHASES.BATTLE}
          isPaused={game.isPaused}
        />
        <PhaseCoach
          phase={game.phase}
          selectedShipName={selectedShipName}
          playerFleetCount={game.playerFleet.length}
          playerShipsAfloat={playerShipsAfloat}
          enemyShipsAfloat={enemyShipsAfloat}
          playerShots={game.playerMetrics.shots}
          soundEnabled={game.soundEnabled}
        />
        <BoardStageTabs activeView={mobileView} onChange={setMobileView} />

        <section className="animate-panel-in grid gap-6 xl:grid-cols-[22rem,minmax(0,1fr)]">
          <div className="space-y-6">
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
                cursorMode="placement"
                onMoveFocus={(dx, dy) => game.moveBoardFocus("player", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("player", x, y)}
                onActivateCell={(x, y) => game.handlePlayerBoardAction(x, y)}
                className={mobileView === "player" ? "block xl:block" : "hidden xl:block"}
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
                isThinking={game.isAiThinking}
                cursorMode="battle"
                onMoveFocus={(dx, dy) => game.moveBoardFocus("enemy", dx, dy)}
                onSetFocus={(x, y) => game.setBoardFocus("enemy", x, y)}
                onActivateCell={(x, y) => game.fireAtEnemy(x, y)}
                className={mobileView === "enemy" ? "block xl:block" : "hidden xl:block"}
              />
            </div>
            <div className={mobileView === "intel" ? "block xl:block" : "hidden xl:block"}>
              <BattleIntelPanel
                playerMetrics={game.playerMetrics}
                enemyMetrics={game.enemyMetrics}
                playerFleetStatus={game.playerFleetStatus}
                enemyFleetStatus={game.enemyFleetStatus}
                eventLog={game.eventLog}
              />
            </div>
          </div>
        </section>
      </main>

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
    </div>
  );
}
