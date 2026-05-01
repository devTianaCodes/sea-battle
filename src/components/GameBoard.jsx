import { LETTERS } from "../data/constants";
import { getBoardNavigationDelta, isBoardConfirmKey } from "../utils/keyboard";
import BoardCell from "./BoardCell";

function describeCell(cell, x, y, title) {
  const coordinate = `${LETTERS[x]}${y + 1}`;

  if (cell.isHit && cell.isSunkReveal) {
    return `${title} ${coordinate}, sunk ship segment`;
  }

  if (cell.isHit) {
    return `${title} ${coordinate}, hit`;
  }

  if (cell.isMiss) {
    return `${title} ${coordinate}, miss`;
  }

  if (cell.preview === "valid") {
    return `${title} ${coordinate}, valid placement preview`;
  }

  if (cell.preview === "invalid") {
    return `${title} ${coordinate}, invalid placement preview`;
  }

  if (cell.shipId) {
    return `${title} ${coordinate}, occupied by ship`;
  }

  return `${title} ${coordinate}, open water`;
}

function formatCoordinate(x, y) {
  return `${LETTERS[x]}${y + 1}`;
}

export default function GameBoard({
  title,
  boardId,
  board,
  focusCell,
  interactive,
  isThinking = false,
  cursorMode = "default",
  onMoveFocus,
  onSetFocus,
  onActivateCell,
  className = "",
}) {
  const isBattleTargetBoard = cursorMode === "battle";

  function handleKeyDown(event) {
    const nextDelta = getBoardNavigationDelta(event.key);

    if (nextDelta) {
      event.preventDefault();
      onMoveFocus(nextDelta.dx, nextDelta.dy);
    } else if (isBoardConfirmKey(event.key)) {
      event.preventDefault();
      onActivateCell(focusCell.x, focusCell.y);
    }
  }

  return (
    <section
      className={`game-board-container glass-panel group min-w-0 w-full max-w-full rounded-[1.45rem] px-3 py-3 sm:rounded-[1.75rem] sm:px-5 sm:py-5 ${
        cursorMode === "battle"
          ? "cursor-battle"
          : cursorMode === "placement"
            ? "cursor-placement"
            : ""
      } ${interactive && isBattleTargetBoard ? "targetable-board" : ""} ${className}`}
    >
      <div className="game-board-heading mb-2 flex w-full items-center justify-between lg:mb-2.5">
        <p className="text-[0.76rem] uppercase tracking-[0.22em] text-slate-300">{boardId}</p>
        {title && title !== boardId ? (
          <p className="text-[0.76rem] uppercase tracking-[0.18em] text-cyan-100">{title}</p>
        ) : null}
      </div>

      <div className="game-board-frame">
        <div
          className={`game-board relative w-full transition-opacity duration-300 ${!interactive ? "opacity-95" : ""} ${
            isThinking ? "opacity-85" : ""
          }`}
          onKeyDown={handleKeyDown}
          role="grid"
          aria-label={title}
        >
          {board.flat().map((cell) => {
            const active = focusCell.x === cell.x && focusCell.y === cell.y;
            const isInteractive = interactive && !cell.isHit && !cell.isMiss;

            return (
              <BoardCell
                key={`${boardId}-${cell.x}-${cell.y}`}
                cell={cell}
                active={active}
                isInteractive={isInteractive}
                onFocus={() => onSetFocus(cell.x, cell.y)}
                onActivate={() => onActivateCell(cell.x, cell.y)}
                tabIndex={active ? 0 : -1}
                ariaLabel={describeCell(cell, cell.x, cell.y, title)}
                coordinateLabel={formatCoordinate(cell.x, cell.y)}
                index={cell.y * 10 + cell.x}
              />
            );
          })}
          {isThinking ? (
            <div className="glass-light thinking-overlay absolute inset-0 flex items-center justify-center rounded-[1rem] border border-cyan/15">
              <div className="animate-fade-in-fast banner-sheen flex items-center gap-2 rounded-full border border-cyan/20 bg-[#061f19]/84 px-4 py-2 text-[0.76rem] uppercase tracking-[0.14em] text-cyan-50">
                <span className="thinking-dot" />
                <span className="thinking-dot" />
                <span className="thinking-dot" />
                Opponent turn
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
