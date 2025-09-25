import { Page } from '@playwright/test';

// “Hash” the canvas by summing sampled pixel bytes (fast + stable heuristic).
export async function canvasHash(page: Page, selector = 'canvas'): Promise<number> {
  return await page.evaluate((sel) => {
    const c = document.querySelector(sel) as HTMLCanvasElement | null;
    if (!c) return -1;
    const ctx = c.getContext('2d');
    if (!ctx) return -2;
    const { width, height } = c;
    const data = ctx.getImageData(0, 0, width, height).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 16) {
      sum += data[i] + data[i+1] + data[i+2] + data[i+3];
    }
    return sum;
  }, selector);
}
async function snapshot(page: Page, selector = '#gameCanvas'): Promise<number> {
  return page.evaluate((sel) => {
    const canvas = document.querySelector<HTMLCanvasElement>(sel);
    if (!canvas) return -1;
    const ctx = canvas.getContext('2d'); if (!ctx) return -2;
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;

    let sum = 0;
    for (let i = 0; i < data.length; i += 16) sum += data[i];
    return sum;
  }, selector);
}

export async function waitForCanvasChange(
  page: Page,
  opts?: {
    selector?: string;
    timeoutMs?: number;
    intervalMs?: number;
    minDelta?: number;
    driveWhileWaiting?: boolean;
  }
): Promise<boolean> {
  const {
    selector = '#gameCanvas',
    timeoutMs = 3000,
    intervalMs = 120,
    minDelta = 5,
    driveWhileWaiting = true,
  } = opts ?? {};

  const start = await snapshot(page, selector);
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (driveWhileWaiting) {
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowDown');
    }
    await page.waitForTimeout(intervalMs);

    const now = await snapshot(page, selector);
    if (Math.abs(now - start) >= minDelta) return true;
  }
  return false;
}