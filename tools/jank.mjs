import { chromium } from 'playwright';
const EXE='/Users/zand/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell';
const b=await chromium.launch({executablePath:EXE});
const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true})).newPage();
const click=s=>p.click(s,{timeout:6000}).catch(()=>{});
await p.goto('http://127.0.0.1:4173/dist/index.html',{waitUntil:'networkidle'});
await p.waitForTimeout(700);
// 走到立案第 2 步：正是用户截图那一屏（顶栏 + 粘性 pickbar + 滚动内容）
await click('.hero-cta [data-action="trial"]');
await click('.def-grid .def-card:nth-child(1)');
await click('.pickbar [data-action="next"]');
await p.waitForTimeout(600);

const profile = await p.evaluate(async () => {
  const frames = [];
  let last = performance.now();
  let stop = false;
  const tick = () => {
    const now = performance.now();
    frames.push(now - last);
    last = now;
    if (!stop) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  // 以稳定速度滚动一整屏
  const h = document.documentElement.scrollHeight - innerHeight;
  const t0 = performance.now();
  while (performance.now() - t0 < 1600) {
    const t = (performance.now() - t0) / 1600;
    window.scrollTo(0, Math.round(h * t));
    await new Promise(r => requestAnimationFrame(r));
  }
  stop = true;
  const long = frames.slice(1).filter(f => f > 22);      // >22ms = 掉帧
  const worst = frames.slice(1).reduce((m, f) => Math.max(m, f), 0);
  const avg = frames.slice(1).reduce((s, f) => s + f, 0) / (frames.length - 1);
  return {
    frames: frames.length, avgFps: +(1000 / avg).toFixed(1),
    dropped: long.length, worstFrameMs: +worst.toFixed(1)
  };
});
console.log('scroll profile @ 立案 step2:', JSON.stringify(profile));

// 合成层与昂贵属性统计
const layers = await p.evaluate(() => {
  const out = [];
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.backdropFilter && cs.backdropFilter !== 'none') out.push(el.className + ' :: backdrop-filter');
    if (cs.mixBlendMode && cs.mixBlendMode !== 'normal' && getComputedStyle(el.parentNode).position !== 'static') out.push(el.className + ' :: mix-blend-mode on animated layer');
    if (cs.position === 'sticky' || cs.position === 'fixed') out.push((el.className.split(' ')[0] || el.tagName) + ' :: ' + cs.position + ' willChange=' + cs.willChange);
  });
  return out;
});
console.log('compositor-sensitive:');
layers.forEach(l => console.log('  ', l));
await b.close();
