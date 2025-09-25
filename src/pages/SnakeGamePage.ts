import { Page,Locator, expect } from '@playwright/test';
import { gameOR } from '../or/gameOR';
import { canvasHash } from '../utils/canvas';

export class SnakeGamePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(url = 'http://localhost:3456') {
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
        await expect(this.canvas).toBeVisible();
    }
    get canvas(): Locator { return this.page.locator(gameOR.canvas); }
    get start(): Locator { return this.page.locator(gameOR.startBtn); }
    get pause(): Locator { return this.page.locator(gameOR.pauseBtn); }
    get reset(): Locator { return this.page.locator(gameOR.resetBtn); }
    get score(): Locator { return this.page.locator(gameOR.score); }
    get highScore(): Locator { return this.page.locator(gameOR.highScore); }
    get gameOver(): Locator { return this.page.locator(gameOR.gameOverPanel); }
    get finalScore(): Locator { return this.page.locator(gameOR.finalScore); }
    get playAgain(): Locator { return this.page.locator(gameOR.playAgainBtn); }

    async startGame() {
        await this.start.click();
        await expect(this.pause).toBeEnabled();
    }
    async pauseGame() {
        await this.pause.click();
    }
    async resumeGame() {
        // If Pause toggles, one more click should resume.
        await this.pause.click();
    }
    async resetGame() {
        await this.reset.click();
    }
    async focusCanvas() {
        await this.canvas.click({ position: { x: 10, y: 10 } });
    }

    async move(key: 'ArrowUp'|'ArrowDown'|'ArrowLeft'|'ArrowRight') {
        await this.page.keyboard.press(key);
    }

    async getScore(): Promise<number> {
        const txt = (await this.score.innerText()).trim();
        return Number.parseInt(txt, 10);
    }
    async getHighScore(): Promise<number> {
        const txt = (await this.highScore.innerText()).trim();
        return Number.parseInt(txt, 10);
    }
    async getFinalScore(): Promise<number> {
        const txt = (await this.finalScore.innerText()).trim();
        return Number.parseInt(txt, 10);
    }
    // Assertions
    async expectCanvasToChange(minDelta = 60, waitMs = 150) {
        const before = await canvasHash(this.page, gameOR.canvas);
        await this.page.waitForTimeout(waitMs);
        const after = await canvasHash(this.page, gameOR.canvas);
        expect(Math.abs(after - before)).toBeGreaterThanOrEqual(minDelta);
    }

    async expectCanvasToFreeze(durationMs = 800, tolerance = 20) {
        const start = await canvasHash(this.page, gameOR.canvas);
        const steps = Math.max(3, Math.floor(durationMs / 200));
        for (let i = 0; i < steps; i++) {
            await this.page.waitForTimeout(200);
            const h = await canvasHash(this.page, gameOR.canvas);
            if (Math.abs(h - start) > tolerance) {
                throw new Error(`Canvas still changing (Δ=${Math.abs(h - start)}), not frozen.`);
            }
        }
    }

    async expectCanvasToChangeEventually(opts?: {
        maxWaitMs?: number;      // total budget to look for change
        pollEveryMs?: number;    // how often to re-sample
        minDelta?: number;       // 5–20 is usually enough
        driveWhileWaiting?: boolean;
    }) {
        const {
        maxWaitMs = 2000,
        pollEveryMs = 120,
        minDelta = 5,
        driveWhileWaiting = true,
        } = opts ?? {};

        const before = await canvasHash(this.page, gameOR.canvas);
        const deadline = Date.now() + maxWaitMs;

        while (Date.now() < deadline) {
            if (driveWhileWaiting) {
                // nudge movement to force a render delta
                await this.page.keyboard.press('ArrowRight');
                await this.page.keyboard.press('ArrowDown');
            }
            await this.page.waitForTimeout(pollEveryMs);
            const after = await canvasHash(this.page, gameOR.canvas);
            if (Math.abs(after - before) >= minDelta) {
                return;
            }
        }
        throw new Error(`Canvas did not change ≥ ${minDelta} within ${maxWaitMs}ms`);
    }
    async expectCanvasToStayFrozenWhileDriving(durationMs = 1200, tolerance = 5) {
        const start = await canvasHash(this.page, gameOR.canvas);
        const steps = Math.max(3, Math.floor(durationMs / 200));
        for (let i = 0; i < steps; i++) {
            // Try to move while paused; canvas should not change
            await this.page.keyboard.press('ArrowRight');
            await this.page.keyboard.press('ArrowDown');
            await this.page.waitForTimeout(200);
            const h = await canvasHash(this.page, gameOR.canvas);
            if (Math.abs(h - start) > tolerance) {
                throw new Error(`Canvas changed while supposed to be paused (Δ=${Math.abs(h - start)})`);
            }
        }
    }

}
