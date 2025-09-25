import { test } from '@playwright/test';
import { SnakeGamePage } from '../pages/SnakeGamePage';
import { warmupDrive, boxLoop } from '../utils/keyboard';

test('PAUSE | Game freezes during pause and continues after resume', async ({ page }) => {
  // Arrange
  const snake = new SnakeGamePage(page);
  await snake.goto();
  await snake.startGame();
  await snake.focusCanvas();

  // Prove motion
  await warmupDrive(page);
  await snake.expectCanvasToChangeEventually({ minDelta: 5, maxWaitMs: 2500 });

  // Act: pause
  await snake.pauseGame();

  // Assert: frozen even if we press keys
  await snake.expectCanvasToStayFrozenWhileDriving(1500, 5);

  // Act: resume (same button toggles in most builds)
  await snake.resumeGame();

  // Assert: motion resumes
  await warmupDrive(page);
  await snake.expectCanvasToChangeEventually({ minDelta: 5, maxWaitMs: 2500 });
});
