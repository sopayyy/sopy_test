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