export const GRID_SIZE = 10;

export const LETTERS = "ABCDEFGHIJ".split("");

export const SHIP_DEFINITIONS = [
  { id: "flagship", name: "Flagship", size: 4, color: "from-cyan-400 to-cyan-200" },
  { id: "cruiser-1", name: "Cruiser 1", size: 3, color: "from-teal-400 to-cyan-200" },
  { id: "cruiser-2", name: "Cruiser 2", size: 3, color: "from-sky-500 to-cyan-300" },
  { id: "destroyer-1", name: "Destroyer 1", size: 2, color: "from-indigo-400 to-sky-200" },
  { id: "destroyer-2", name: "Destroyer 2", size: 2, color: "from-blue-400 to-cyan-200" },
  { id: "destroyer-3", name: "Destroyer 3", size: 2, color: "from-violet-400 to-sky-200" },
  { id: "patrol-1", name: "Patrol 1", size: 1, color: "from-orange-400 to-amber-200" },
  { id: "patrol-2", name: "Patrol 2", size: 1, color: "from-rose-400 to-orange-200" },
  { id: "patrol-3", name: "Patrol 3", size: 1, color: "from-lime-400 to-emerald-200" },
  { id: "patrol-4", name: "Patrol 4", size: 1, color: "from-mint to-cyan-200" },
];

export const DIFFICULTY_LEVELS = [
  {
    id: "easy",
    name: "Easy",
    emoji: "😊",
    accent: "mint",
    description: "Opponent plays randomly and leaves space to recover.",
    detail: "Longer games, forgiving search pattern, best for first runs.",
  },
  {
    id: "medium",
    name: "Medium",
    emoji: "😎",
    accent: "cyan",
    description: "Opponent follows patterns and presses after hits.",
    detail: "Balanced pressure with fair tactical punishment.",
  },
  {
    id: "hard",
    name: "Hard",
    emoji: "🔥",
    accent: "coral",
    description: "Opponent hunts efficiently and closes quickly.",
    detail: "Shorter games, tighter punish windows, highest pressure.",
  },
];

export const ORIENTATIONS = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
};

export const GAME_PHASES = {
  SETUP: "setup",
  BATTLE: "battle",
  GAME_OVER: "game-over",
};

export const TURN_STATES = {
  PLAYER: "player",
  AI: "ai",
  TRANSITION: "transition",
};

export const SHOT_RESULTS = {
  HIT: "hit",
  MISS: "miss",
  SUNK: "sunk",
};
