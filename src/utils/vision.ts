import { Page } from '@playwright/test';

type XY = { x: number; y: number };
type Dir = 'U'|'D'|'L'|'R';

const OPP: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };

/**
 * Scan the canvas and return the first red-ish pixel (food) we can find.
 * Returns pixel coordinates, not grid cells (good enough to steer).
 */
export async function findFood(page: Page, selector = '#gameCanvas'): Promise<XY | null> {
  return page.evaluate((sel) => {
    const c = document.querySelector<HTMLCanvasElement>(sel);
    if (!c) return null;
    const ctx = c.getContext('2d'); if (!ctx) return null;
    const { width, height } = c;
    const data = ctx.getImageData(0, 0, width, height).data;

    // sample every 3px for speed
    for (let y = 0; y < height; y += 3) {
      for (let x = 0; x < width; x += 3) {
        const i = (y * width + x) * 4;
        const r = data[i], g = data[i+1], b = data[i+2];
        // red-ish with low G/B
        if (r >= 180 && g <= 90 && b <= 90) return { x, y };
      }
    }
    return null;
  }, selector);
}

/**
 * Decide 1-step direction that reduces distance to target (food),
 * avoiding 180° reversal (cannot go opposite of the last direction).
 * We alternate horizontal/vertical preference to avoid long straight runs to a wall.
 */
export function chooseNextDir(
  from: XY, to: XY, last: Dir | null, preferHFirst: boolean
): Dir {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const horiz: Dir = dx >= 0 ? 'R' : 'L';
  const vert : Dir = dy >= 0 ? 'D' : 'U';

  const primary  = preferHFirst ? horiz : vert;
  const fallback = preferHFirst ? vert  : horiz;

  // Avoid direct reverse
  if (last && primary === OPP[last]) {
    if (fallback !== OPP[last]) return fallback;
  }
  return primary;
}

/**
 * Estimate head position as canvas center (good enough to steer from the start).
 * On each step we re-read food → the “center” heuristic is fine for approaching.
 */
export function canvasCenter(page: Page, selector = '#gameCanvas'): Promise<XY> {
  return page.evaluate((sel) => {
    const c = document.querySelector<HTMLCanvasElement>(sel)!;
    return { x: c.width / 2, y: c.height / 2 };
  }, selector);
}
