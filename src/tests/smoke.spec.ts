import { test, expect } from '@playwright/test';
import { SnakeGamePage } from '../pages/SnakeGamePage';
import { waitForCanvasChange } from '../utils/canvas';
import { warmupDrive } from '../utils/keyboard';

test.describe.configure({ mode: 'serial' });
test.describe('SMOKE | Snake Game basic checks', () => {

  test('UI awal valid + Start game bisa jalan', async ({ page }) => {
    // Arrange
    const snake = new SnakeGamePage(page);
    await snake.goto();
    await snake.focusCanvas();

    // Assert initial UI state
    await expect(snake.start).toBeEnabled();
    await expect(snake.pause).toBeDisabled();
    await expect(snake.reset).toBeEnabled();
    await expect(snake.gameOver).toBeHidden();

    // Act
    await snake.startGame();
    await snake.focusCanvas();
    await warmupDrive(page);

    // Assert canvas benar-benar berubah
    await snake.expectCanvasToChangeEventually({ minDelta: 5, maxWaitMs: 2500 });

    // Assert score tidak error
    const score = await snake.getScore();
    console.log(`Score saat mulai: ${score}`);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  test('Canvas berubah setelah snake digerakkan (minimal check)', async ({ page }) => {
    // Arrange
    const snake = new SnakeGamePage(page);
    await snake.goto();
    await snake.startGame();
    await snake.focusCanvas();

    // Act: beberapa langkah, bukan satu tap
    await warmupDrive(page);

    // Assert: gunakan helper retry
    const changed = await waitForCanvasChange(page, {
      selector: '#gameCanvas',
      timeoutMs: 3000,
      intervalMs: 120,
      minDelta: 5,
      driveWhileWaiting: true,
    });
    expect(changed).toBe(true);
  });

});
