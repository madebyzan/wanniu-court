import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

// 导出判决海报原图（1080x1440）用于人工复核
// 用法：node tools/poster.mjs [custom]   —— 传 custom 走自定义被告路径
const custom = process.argv.includes('custom');
mkdirSync('shots', { recursive: true });
const EXE = '/Users/zand/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell';
const b = await chromium.launch({ executablePath: EXE });
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true })).newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => m.type() === 'error' && errs.push('CONSOLE ' + m.text()));
const click = s => p.click(s, { timeout: 6000 }).catch(() => console.log('  !! ' + s));

await p.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
await click('.hero-cta [data-action="trial"]');
if (custom) {
  await click('.custom-toggle');
  await p.fill('#custom-name', '永远不回消息的房东');
  await click('[data-action="custom-use"]');
} else {
  await click('.def-grid .def-card:nth-child(1)');
  await click('.pickbar [data-action="next"]');
  await click('.pickbar [data-action="next"]');
  await click('.exhibit:nth-child(1)');
  await click('.exhibit:nth-child(2)');
  await click('.pickbar [data-action="verdict"]');
  await p.waitForTimeout(5400);
  await click('[data-action="poster"]');
  await p.waitForTimeout(2200);
}
if (custom) {
  await click('.pickbar [data-action="next"]');
  await click('.exhibit:nth-child(1)');
  await click('.pickbar [data-action="verdict"]');
  await p.waitForTimeout(5400);
  await click('[data-action="poster"]');
  await p.waitForTimeout(2200);
}
// the sheet caps the preview at 320px; widen it so the element screenshot is native
await p.evaluate(() => { const i = document.querySelector('.sheet-figure img'); i.style.width = '386px'; i.style.maxWidth = '386px'; });
await p.waitForTimeout(300);
const out = `shots/poster-${custom ? 'custom' : 'stock'}.png`;
await p.locator('.sheet-figure img').screenshot({ path: out });
console.log('saved', out, '| record:', await p.evaluate(() => {
  const r = JSON.parse(localStorage.getItem('wanniu-court-github-v1'))[0];
  return { target: r.target, defendantId: r.defendantId, outcome: r.outcome, evidence: r.evidence.length };
}));
console.log('ERRORS(' + errs.length + '):', errs.join('\n') || 'none');
await b.close();
