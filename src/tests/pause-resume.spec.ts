import { test, expect } from './fixtures';
import { warmupDrive } from '../utils/keyboard';

test('PAUSE | Game freezes during pause and continues after resume', async ({ game, page }) => {
  await warmupDrive(page);
  await game.expectCanvasToChangeEventually({ minDelta: 5, maxWaitMs: 2500 });

  // Act: pause
  await game.pauseGame();

  // Assert: frozen even if we try to "drive" while paused
  await game.expectCanvasToStayFrozenWhileDriving(1500, 5);

  // Act: resume
  await game.resumeGame();

  // Assert: motion resumes
  await warmupDrive(page);
  await game.expectCanvasToChangeEventually({ minDelta: 5, maxWaitMs: 2500 });
});
