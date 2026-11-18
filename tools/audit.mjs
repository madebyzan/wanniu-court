import { chromium } from 'playwright';
const EXE='/Users/zand/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell';
const b=await chromium.launch({executablePath:EXE});
const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true})).newPage();
const click=s=>p.click(s,{timeout:6000}).catch(()=>{});
const box=sel=>p.evaluate(s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();const cs=getComputedStyle(e);
  return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),
    pad:cs.padding,m:cs.margin,ar:(r.height/r.width).toFixed(3)}},sel);

// --- daily card
await p.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=300){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}scrollTo(0,0)});
await p.waitForTimeout(500);
console.log('\n[首页 每日值班案件]');
for (const s of ['.daily','.daily-ribbon','.daily-inner','.daily .art','.daily h3','.daily-meta','.daily-cta .btn'])
  console.log('  ',s.padEnd(16), JSON.stringify(await box(s)));
const geo=await p.evaluate(()=>{
  const a=document.querySelector('.daily .art').getBoundingClientRect();
  const t=document.querySelector('.daily h3').getBoundingClientRect();
  const m=document.querySelector('.daily-meta').getBoundingClientRect();
  return {artRight:Math.round(a.right), h3Left:Math.round(t.left), metaLeft:Math.round(m.left), overlapH3:a.right>t.left, overlapMeta:a.right>m.left};
});
console.log('   overlap ->', JSON.stringify(geo));

// --- gallery
await click('.tab-bar [data-action="gallery"]');
await p.waitForTimeout(500);
console.log('\n[图鉴]');
for (const s of ['.crumb','.ribbon','.ribbon img','.g-intro','.tabs','.searchbar','.chips','.g-grid','.g-card'])
  console.log('  ',s.padEnd(14), JSON.stringify(await box(s)));

// --- archive
await click('.tab-bar [data-action="archive"]');
await p.waitForTimeout(500);
console.log('\n[卷宗]');
for (const s of ['.tabs','.tabs button','.rec-list','.rec','.rec .art','.rec-body'])
  console.log('  ',s.padEnd(14), JSON.stringify(await box(s)));

// --- intake step1
await click('.tab-bar [data-action="trial"]');
await p.waitForTimeout(500);
console.log('\n[立案 step1]');
for (const s of ['.custom','.custom-toggle','.custom-toggle .ic','.custom-toggle span','.pickbar','.def-grid'])
  console.log('  ',s.padEnd(22), JSON.stringify(await box(s)));
console.log('   pickbar gap to tabbar:', await p.evaluate(()=>{
  const pb=document.querySelector('.pickbar').getBoundingClientRect();
  const tb=document.querySelector('.tab-bar').getBoundingClientRect();
  return Math.round(tb.top-pb.bottom)+'px';
}));
await b.close();
