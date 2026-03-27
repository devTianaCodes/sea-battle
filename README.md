# Sea Battle

Sea Battle is a modern single-player Battleship experience built with React and Vite. It pairs animated glasmorphism boards, three AI difficulty levels, match history, keyboard support, and a responsive layout tuned for both desktop and mobile play.

## Features

- Single-player fleet battles against Easy, Medium, and Hard AI
- Manual or randomized ship placement on a 10x10 grid
- Animated hit, miss, sunk, and AI-thinking feedback
- Match history with local statistics and difficulty breakdowns
- Keyboard shortcuts and board navigation support
- Settings for sound effects and ambient background motion
- Responsive interface with menu, onboarding, pause, and results flows

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS
- Framer Motion
- Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## How To Play

1. Open `Play` from the main menu.
2. Choose a difficulty.
3. Place all five ships or randomize your fleet.
4. Confirm deployment to begin combat.
5. Fire on the enemy grid until all opposing ships are sunk.

## Controls

- `Arrow Keys`: Move board focus
- `Enter` / `Space`: Confirm the active board action
- `R`: Rotate the selected ship during placement
- `M`: Toggle sound
- `P`: Pause or resume a match
- `?`: Open instructions

## Project Structure

```text
src/
  components/   UI surfaces and overlays
  context/      game context wiring
  data/         constants and static metadata
  hooks/        stateful gameplay and utility hooks
  styles/       global styling and animation layers
  utils/        board, AI, stats, history, and preference logic
```

## Accessibility

- Keyboard-navigable boards and controls
- Visible focus states on interactive elements
- Live status messaging for match state changes
- Touch-friendly mobile actions and modal layouts

## Future Enhancements

- Automated AI test coverage and simulation tuning
- Additional deployment targets and CI checks
- Expanded audio design and optional theme variants
- Multiplayer architecture when the frontend flow is fully stabilized

## Deployment

Deployment instructions live in [DEPLOYMENT.md](./DEPLOYMENT.md).
