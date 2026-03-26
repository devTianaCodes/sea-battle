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
    description: "Random shots with simple pacing.",
  },
  {
    id: "medium",
    name: "Medium",
    description: "Parity search with focused follow-up shots.",
  },
  {
    id: "hard",
    name: "Hard",
    description: "Probability scanning that still plays fair.",
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
