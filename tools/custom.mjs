import { chromium } from 'playwright';
const EXE='/Users/zand/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell';
const b=await chromium.launch({executablePath:EXE});
const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
const click=s=>p.click(s,{timeout:6000}).catch(()=>console.log('!!',s));
const names=['永远不回消息的房东','周五晚上十一点的临时会议','半夜两点的奶茶外卖','自动续费的视频会员','明天开始的跑步计划','小组作业里的某位同学','kk'];
for (const n of names) {
  await p.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
  await click('.hero-cta [data-action="trial"]');
  await click('.custom-toggle'); await p.fill('#custom-name',n); await click('[data-action="custom-use"]');
  await p.waitForTimeout(300);
  const info=await p.evaluate(()=>({
    note:document.querySelector('.lede').innerText.replace(/\s+/g,' '),
    charges:[...document.querySelectorAll('.charge-grid .charge strong')].map(e=>e.textContent),
  }));
  await click('.charge-grid .charge:nth-child(1)');
  await click('.pickbar [data-action="next"]');
  const ev=await p.locator('.exhibit p, .exhibit .txt').allInnerTexts();
  await click('.exhibit:nth-child(1)'); await click('.exhibit:nth-child(2)');
  await click('.pickbar [data-action="verdict"]');
  await p.waitForTimeout(5600);
  const doc=await p.evaluate(()=>({
    cat:document.querySelectorAll('.doc-row .sub')[0]?.innerText,
    charge:document.querySelectorAll('.doc-row .v strong')[1]?.innerText,
    finding:document.querySelector('.doc-focus p')?.innerText,
    sentence:document.querySelector('.doc-verdict .sentence strong')?.innerText,
  }));
  console.log('\n被告：'+n);
  console.log('  归类  ', info.note.slice(0,70));
  console.log('  罪名  ', info.charges.join(' / '));
  console.log('  证据  ', ev.slice(0,2).map(x=>x.replace(/\s+/g,' ').slice(0,26)).join(' | '));
  console.log('  判决  ', doc.charge,'→',doc.sentence);
  console.log('  焦点  ', (doc.finding||'').slice(0,46));
}
console.log('\nERRORS('+errs.length+'):', errs.slice(0,5).join('|')||'none');
await b.close();
