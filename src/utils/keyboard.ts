import { Page } from '@playwright/test';
export type Dir = 'U'|'D'|'L'|'R';

const map: Record<Dir,'ArrowUp'|'ArrowDown'|'ArrowLeft'|'ArrowRight'> = {
  U: 'ArrowUp', D: 'ArrowDown', L: 'ArrowLeft', R: 'ArrowRight'
};

const key: Record<Dir,string> = { U:'ArrowUp', D:'ArrowDown', L:'ArrowLeft', R:'ArrowRight' };

export async function drive(page: Page, seq: Dir[], stepDelay = 100) {
  for (const d of seq) {
    await page.keyboard.press(map[d]);
    await page.waitForTimeout(stepDelay);
  }
}
export async function warmupDrive(page: Page) {
  // short deterministic movements
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(120);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(120);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(120);
}

export async function step(page: Page, d: Dir, ms = 110) {
  await page.keyboard.press(key[d]);
  await page.waitForTimeout(ms);
}

/** From near the center, shift up & left by `offset` cells (keeps us far from walls). */
export function toBoxTopLeft(offset = 4): Dir[] {
  const seq: Dir[] = [];
  for (let i = 0; i < offset; i++) seq.push('U');
  for (let i = 0; i < offset; i++) seq.push('L');
  return seq;
}

/** Serpentine path within a W×H box, starting at its top-left, moving Right first. */
export function serpentineBox(width: number, height: number): Dir[] {
  const seq: Dir[] = [];
  let goRight = true;
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width - 1; c++) seq.push(goRight ? 'R' : 'L');
    if (r < height - 1) { seq.push('D'); goRight = !goRight; }
  }
  return seq;
}
export const boxLoop: Dir[] = ['R','R','D','D','L','L','U','U'];
export const longRight: Dir[] = Array(40).fill('R') as Dir[];