import { test, expect } from '@playwright/test';
import { SnakeGamePage } from '../pages/SnakeGamePage';
import { drive, longRight } from '../utils/keyboard';

test('GAME OVER | On collision: panel visible, final score matches; Play Again resets', async ({ page }) => {
  // Arrange
  const snake = new SnakeGamePage(page);
  await snake.goto();
  await snake.startGame();
  await snake.focusCanvas();

  // Act: drive to a wall (most Snake games end on boundary)
  await drive(page, longRight, 60);

  // Assert: Game Over panel appears (allow brief time if animation)
  await expect(snake.gameOver).toBeVisible({ timeout: 1500 });

  const shownFinal = await snake.getFinalScore();
  const liveScore = await snake.getScore();
  expect(shownFinal).toBe(liveScore);

  // Act: play again
  await snake.playAgain.click();

  // Assert: panel hidden and score reset to 0 (or remains 0 on start)
  await expect(snake.gameOver).toBeHidden();
  const after = await snake.getScore();
  expect(after).toBe(0);
});
