import { test, expect } from './fixtures';
test.describe('RESET', () => {
  test('should reset score to 0 and hide Game Over panel', async ({ game, page }) => {
    // Act: play a bit, then reset
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    await game.reset.click();

    // Assert
    const score = await game.getScore();
    expect(score).toBe(0);
    await expect(game.gameOver).toBeHidden();
  });
});