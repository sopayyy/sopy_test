# sopy_test Snake Game Automation Tests

This repository contains an **automated test suite** for the [Snake Game](https://github.com/josephvouch/vouch_snake), implemented with **Playwright** and **TypeScript**.  
The tests validate game functionality such as starting, pausing, scoring, and game-over behavior.

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sopayyy/sopy_test.git
cd sopy_test
```
### 2. Install dependencies

```bash
npm install
```
### 3. Install Playwright browsers
```bash
npx playwright install
```

## Running Tests

Run all tests:
```bash
npx playwright test
```
Run tests in UI mode:

```bash
npx playwright test --ui
```

## Environment Variables

Create .env inside src/config/env/:

GAME_URL=http://localhost:3456

## Implemented Tests

1. Smoke: verify UI, start game, canvas changes
2. Pause / Resume: canvas freezes, then continues
3. Reset: score returns to 0 after reset
4. Scoring: deterministic spawn, snake eats, score increases
5. Game Over: force collision, check game-over panel

## Testing Strategy

I focused on five core areas:
1. **Smoke Tests** – Ensure UI loads, buttons work, and snake moves.
2. **Pause/Resume** – Validate that the game can freeze and continue.
3. **Reset** – Ensure the game resets score and state.
4. **Scoring** – Deterministic test to prove snake can eat food and score > 0.
5. **Game Over** – Validate collision ends the game and "Play Again" resets.

This strategy balances functional coverage, user flows, and edge cases while staying reliable.

## Interesting Findings / Challenges

- Timing was tricky: snake speed depends on game loop tick. I solved this with retries and canvas-hash polling.
- Scoring is random by default; to make it testable I overrode `Math.random` for the first spawn so the snake always eats once.
- Game Over detection sometimes lagged; I added short timeouts to stabilize.

## Additional Tests (if I had more time)

- Performance: let the snake run for 10–20 minutes and assert it doesn’t freeze.
- Visual regression: take canvas snapshots and compare differences.
- Multi-browser runs: Firefox and WebKit support.
- Mobile viewport testing for responsive layout.
- More time will make me to create a consistent fixture usage
