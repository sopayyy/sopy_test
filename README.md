# sopy_test Snake Game Automation Tests

This repository contains an **automated test suite** for the [Snake Game](https://github.com/josephvouch/vouch_snake), implemented with **Playwright** and **TypeScript**.  
The tests validate game functionality such as starting, pausing, scoring, and game-over behavior.

---

## 📋 Features

- **Playwright + TypeScript** test framework  
- **Page Object Model (POM)** for maintainability  
- **Object Repository** for selectors  
- **Deterministic scoring tests** (using `Math.random` override)  
- **Smoke tests** (UI sanity, movement, canvas change)  
- **Pause / Resume tests** (assert canvas freezes then continues)  
- **Reset tests** (reset to initial state)  
- **Game Over tests** (snake collides and ends game)  
- Test logs include **score changes** for easy debugging  

---

## 📂 Project Structure
sopy_test/
├── playwright.config.ts
├── src/
│ ├── pages/
│ ├── tests/
│ └── utils/
├── .gitignore
├── package.json
└── README.md

---

## 🚀 Getting Started

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