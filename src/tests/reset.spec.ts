import { test, expect } from './fixtures';

test('RESET | Reset sets score to 0 and hides Game Over panel', async ({ game, page }) => {
  // Act: play a bit, then reset
  await page.keyboard.press('ArrowRight');
  await game.reset.click();

  // Assert
  const score = await game.getScore();
  expect(score).toBe(0);
  await game.gameOver.waitFor({ state: 'hidden' });
});
