export const GRID_SIZE = 10;

export const LETTERS = "ABCDEFGHIJ".split("");

export const SHIP_DEFINITIONS = [
  { id: "carrier", name: "Carrier", size: 5, color: "from-cyan-400 to-cyan-200" },
  {
    id: "battleship",
    name: "Battleship",
    size: 4,
    color: "from-sky-500 to-cyan-300",
  },
  { id: "cruiser", name: "Cruiser", size: 3, color: "from-teal-400 to-cyan-200" },
  {
    id: "submarine",
    name: "Submarine",
    size: 3,
    color: "from-indigo-400 to-sky-200",
  },
  { id: "destroyer", name: "Destroyer", size: 2, color: "from-orange-400 to-amber-200" },
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
