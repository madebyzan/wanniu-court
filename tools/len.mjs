import { chromium } from 'playwright';
const EXE='/Users/zand/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell';
const widths=[320,375,390,430,520,760];
const b=await chromium.launch({executablePath:EXE});
for (const w of widths) {
  const p=await (await b.newContext({viewport:{width:w,height:844},deviceScaleFactor:2,isMobile:true})).newPage();
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  const click=s=>p.click(s,{timeout:6000}).catch(()=>{});
  await p.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
  await click('.hero-cta [data-action="trial"]');
  await click('.def-grid .def-card:nth-child(1)');
  await click('.pickbar [data-action="next"]');
  await click('.pickbar [data-action="next"]');
  await click('.exhibit:nth-child(1)'); await click('.exhibit:nth-child(2)');
  await click('.pickbar [data-action="verdict"]');
  await p.waitForTimeout(5600);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=300){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}scrollTo(0,0)});
  await p.waitForTimeout(500);
  const m=await p.evaluate(()=>{
    const q=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return Math.round(r.width)+'x'+Math.round(r.height)};
    return {doc:q('.doc'),crest:q('.doc-crest'),seal:q('.doc-seal'),body:q('.doc-body'),
      total:document.documentElement.scrollHeight, screens:+(document.documentElement.scrollHeight/innerHeight).toFixed(2)};
  });
  console.log(String(w).padStart(4), JSON.stringify(m), errs.length?('ERR '+errs[0]):'');
  if (w===390) await p.screenshot({path:'shots/final-verdict.png', fullPage:true});
  if (w===320) await p.screenshot({path:'shots/final-verdict-320.png', fullPage:true});
}
await b.close();
