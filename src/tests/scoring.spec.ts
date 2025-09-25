import { test, expect } from '@playwright/test';
import { SnakeGamePage } from '../pages/SnakeGamePage';

test.describe('SCORING | Deterministic spawn, stop at first score > 0', () => {
  test('Snake moves right and eats the first food', async ({ page }) => {
    test.setTimeout(30_000);

    // 🔹 Pin the first two Math.random() calls (X then Y)
    // so the first food spawns just to the right, on the same row
    await page.addInitScript(() => {
      const orig = Math.random;
      let calls = 0;
      Math.random = () => {
        calls++;
        if (calls === 1) return 0.7;  // X → to the right
        if (calls === 2) return 0.5;  // Y → middle row
        return orig();                // after that, real randomness
      };
    });

    const snake = new SnakeGamePage(page);
    await snake.goto();
    await snake.startGame();
    await snake.focusCanvas();

    // Small nudge so the snake is ticking
    await page.keyboard.press('ArrowRight');

    const tickMs = 130;   // adjust if needed to match tick speed
    const maxTicks = 40;  // safety cap
    let last = await snake.getScore();
    console.log(`[score] start=${last}`);

    for (let i = 0; i < maxTicks; i++) {
      await page.waitForTimeout(tickMs);

      // fail-fast if game over overlay appears
      if (await snake.gameOver.isVisible({ timeout: 10 }).catch(() => false)) {
        throw new Error('Game Over occurred before scoring > 0');
      }

      const s = await snake.getScore();
      if (s !== last) {
        console.log(`[score] changed -> ${s} (tick ${i})`);
        last = s;
      }

      // ✅ Stop as soon as score > 0
      if (last > 0) {
        expect(last).toBeGreaterThan(0);
        console.log('[done] test stopped after first score > 0');
        return;
      }
    }

    throw new Error('Did not reach score > 0 within step budget');
  });
});
