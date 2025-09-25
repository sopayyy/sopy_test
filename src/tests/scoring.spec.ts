import { test, expect } from '@playwright/test';
import { SnakeGamePage } from '../pages/SnakeGamePage';

test('SCORING | Eat first food deterministically', async ({ page }) => {
  // Pin only first two spawns (X, Y)
  await page.addInitScript(() => {
    const orig = Math.random;
    let calls = 0;
    Math.random = () => {
      calls++;
      if (calls === 1) return 0.70;
      if (calls === 2) return 0.50;
      return orig();
    };
  });

  const snake = new SnakeGamePage(page);
  await snake.goto();
  await snake.startGame();
  await snake.focusCanvas();

  // Nudge so game loop starts
  await page.keyboard.press('ArrowRight');

  const MAX = 40;
  let last = await snake.getScore();
  console.log(`start score = ${last}`);
  for (let i = 0; i < MAX; i++) {
    const s = await snake.getScore();
    if (s > last) {
      console.log(`score increased to ${s} at tick ${i}`);
      expect(s).toBeGreaterThan(last);
      return;
    }
  }
  throw new Error('Score never increased');
});
