import { test, expect } from './fixtures';
import { drive, longRight } from '../utils/keyboard';

test('GAME OVER | On collision: panel visible, final score matches; Play Again resets', async ({ game, page }) => {
  await drive(page, longRight, 60);
  await expect(game.gameOver).toBeVisible({ timeout: 1500 });

  const shownFinal = await game.getFinalScore();
  const liveScore = await game.getScore();
  expect(shownFinal).toBe(liveScore);

  // Act: play again
  await game.playAgain.click();

  // Assert: panel hidden and score reset to 0
  await expect(game.gameOver).toBeHidden();
  const after = await game.getScore();
  expect(after).toBe(0);
});
