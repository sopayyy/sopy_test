import { test as base } from '@playwright/test';
import { SnakeGamePage } from '../pages/SnakeGamePage';
import { warmupDrive,drive, longRight } from '../utils/keyboard';

export const test = base.extend<{ game: SnakeGamePage }>({
  game: async ({ page }, use) => {
    const game = new SnakeGamePage(page);
    await game.goto();
    await game.startGame();
    await game.focusCanvas();
    await use(game);
  },
});

export const expect = base.expect;
