import { chromium } from 'playwright';
const EXE='/Users/zand/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell';
const b=await chromium.launch({executablePath:EXE});
for (const h of [669, 844]) {
  const p=await (await b.newContext({viewport:{width:390,height:h},deviceScaleFactor:2,isMobile:true})).newPage();
  const click=s=>p.click(s,{timeout:6000}).catch(()=>{});
  await p.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
  await click('.hero-cta [data-action="trial"]');
  await click('.custom-toggle');
  await p.waitForTimeout(300);
  await p.focus('#custom-name');
  await p.waitForTimeout(400);
  const r=await p.evaluate(()=>{
    const i=document.querySelector('#custom-name').getBoundingClientRect();
    const pb=document.querySelector('.pickbar');
    const tb=document.querySelector('.tab-bar').getBoundingClientRect();
    return {inputTop:Math.round(i.top), inputBottom:Math.round(i.bottom),
      pickbarPresent:!!pb, tabTop:Math.round(tb.top), vh:innerHeight,
      inView: i.top>=0 && i.bottom<=innerHeight,
      clearOfTabbar: i.bottom<=tb.top};
  });
  const ok = r.inView && r.clearOfTabbar && !r.pickbarPresent;
  console.log(String(h)+'px viewport:', JSON.stringify(r), ok?'OK':'FAIL');
  if(!ok) process.exitCode=1;
  await p.close();
}
await b.close();
