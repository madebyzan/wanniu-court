import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const out = process.argv[2] || 'shots3'; mkdirSync(out, { recursive: true });
const EXE = '/Users/zand/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: EXE });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push('PAGEERROR ' + e.message)); page.on('console', m => m.type() === 'error' && errs.push('CONSOLE ' + m.text()));
const click = s => page.click(s, { timeout: 6000 }).catch(e => console.log('  !!', s, e.message.split('\n')[0]));
async function reveal() {
  await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 380) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(350);
}
async function full(n) { await page.waitForTimeout(500); await reveal(); await page.screenshot({ path: `${out}/${n}.png`, fullPage: true }); console.log('  full', n, await page.evaluate(() => document.documentElement.scrollHeight)); }
async function vp(n) { await page.waitForTimeout(350); await page.screenshot({ path: `${out}/${n}.png` }); console.log('  vp  ', n); }

await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
await vp('home-vp');
await full('home');

// ---- settle path: 1 evidence + soft judge
await click('.hero-cta [data-action="trial"]');
await vp('step1-vp');
await click('.def-grid .def-card:nth-child(1)');
await vp('step1-selected-vp');
await click('.pickbar [data-action="next"]');
await click('.judge-row .judge:nth-child(2)');
await click('.pickbar [data-action="next"]');
await click('.exhibit:nth-child(1)');
await full('step3');
await click('.pickbar [data-action="verdict"]');
await vp('delib-vp');
await page.waitForTimeout(5200);
await full('verdict-settle');

// ---- guilty path: 2 evidence + strict
await click('.tab-bar [data-action="trial"]');
await click('.def-grid .def-card:nth-child(8)');
await click('.pickbar [data-action="next"]');
await click('.pickbar [data-action="next"]');
await click('.exhibit:nth-child(1)');
await click('.exhibit:nth-child(2)');
await click('.pickbar [data-action="verdict"]');
await page.waitForTimeout(5200);
await full('verdict-guilty');
await click('.reaction-grid button:nth-child(2)');
await vp('verdict-reacted-vp');

// ---- poster
await click('[data-action="poster"]');
await page.waitForTimeout(1600);
await vp('poster-sheet');

// ---- archive
await click('.sheet [data-action="poster-close"]').catch(()=>{});
await page.keyboard.press('Escape');
await click('.tab-bar [data-action="archive"]');
await full('archive');
await vp('archive-vp');

// ---- gallery tabs
await click('.tab-bar [data-action="gallery"]');
await full('gallery-cases');
await click('.tabs [data-action="gallery-tab"][data-id="characters"]');
await full('gallery-people');
await click('.tabs [data-action="gallery-tab"][data-id="props"]');
await full('gallery-props');
await click('.tabs [data-action="gallery-tab"][data-id="scenes"]');
await full('gallery-scenes');

// ---- custom defendant
await click('.tab-bar [data-action="trial"]');
await click('.custom-toggle');
await page.fill('#custom-name', '永远不回消息的房东');
await click('[data-action="custom-use"]');
await vp('custom-step2-vp');

console.log('ERRORS(' + errs.length + '):', errs.slice(0, 12).join('\n') || 'none');
await browser.close();
