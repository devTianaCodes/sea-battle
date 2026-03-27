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
  subtitle,
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
      className={`glass-panel rounded-[2rem] p-4 sm:p-5 ${
        cursorMode === "battle"
          ? "cursor-battle"
          : cursorMode === "placement"
            ? "cursor-placement"
            : ""
      } ${className}`}
    >
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan/70">{boardId}</p>
          <h2 className="font-display text-2xl text-foam">{title}</h2>
        </div>
        <p className="text-sm text-slate-300">{subtitle}</p>
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-2">
        <div className="grid grid-rows-10 gap-2 pt-10">
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={`${boardId}-row-${index}`}
              className="flex h-full items-center justify-center text-xs text-slate-400"
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div>
          <div className="mb-2 grid grid-cols-10 gap-2">
            {LETTERS.map((letter) => (
              <div
                key={`${boardId}-col-${letter}`}
                className="text-center text-xs text-slate-400"
              >
                {letter}
              </div>
            ))}
          </div>
          <div
            className="relative grid grid-cols-10 gap-2"
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
              <div className="glass-light absolute inset-0 flex items-center justify-center rounded-[1.25rem] border border-cyan/15">
                <div className="flex items-center gap-2 rounded-full border border-cyan/20 bg-[#071120]/80 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-50">
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                  Opponent scanning
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
