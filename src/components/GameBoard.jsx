import { LETTERS } from "../data/constants";
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
  showLabels = true,
  className = "",
}) {
  function handleKeyDown(event) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      onMoveFocus(0, -1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      onMoveFocus(0, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onMoveFocus(-1, 0);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onMoveFocus(1, 0);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivateCell(focusCell.x, focusCell.y);
    }
  }

  return (
    <section
      className={`game-board-container glass-panel group rounded-[1.6rem] px-3 py-3 sm:px-4 sm:py-4 ${
        cursorMode === "battle"
          ? "cursor-battle"
          : cursorMode === "placement"
            ? "cursor-placement"
            : ""
      } ${className}`}
    >
      <div className="mb-2 hidden w-full items-center justify-between lg:flex">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-slate-400">{boardId}</p>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan/70">{title}</p>
      </div>

      <div className="relative grid w-full grid-cols-[auto,1fr] gap-2">
        <div
          className={`grid grid-rows-10 gap-[3px] pt-6 text-[0.6rem] text-slate-500 transition-opacity duration-150 ${
            showLabels ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" : "opacity-0"
          }`}
        >
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={`${boardId}-row-${index}`}
              className="flex h-full items-center justify-center"
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div>
          <div
            className={`mb-2 grid grid-cols-10 gap-[3px] text-[0.6rem] text-slate-500 transition-opacity duration-150 ${
              showLabels ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" : "opacity-0"
            }`}
          >
            {LETTERS.map((letter) => (
              <div
                key={`${boardId}-col-${letter}`}
                className="text-center"
              >
                {letter}
              </div>
            ))}
          </div>
          <div
            className={`game-board relative ${!interactive ? "opacity-95" : ""}`}
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
              <div className="glass-light absolute inset-0 flex items-center justify-center rounded-[1rem] border border-cyan/15">
                <div className="flex items-center gap-2 rounded-full border border-cyan/20 bg-[#071120]/84 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-cyan-50">
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                  Thinking
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
