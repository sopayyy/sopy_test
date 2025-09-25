import { test, expect } from '@playwright/test';
import { SnakeGamePage } from '../pages/SnakeGamePage';

test('RESET | Reset sets score to 0 and hides Game Over panel', async ({ page }) => {
  // Arrange
  const snake = new SnakeGamePage(page);
  await snake.goto();
  await snake.startGame();
  await snake.focusCanvas();

  // Act: play a bit, then reset
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500);
  await snake.resetGame();

  // Assert
  const score = await snake.getScore();
  expect(score).toBe(0);
  await expect(snake.gameOver).toBeHidden();
});
