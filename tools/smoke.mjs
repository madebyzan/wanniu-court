import { chromium } from 'playwright';
const EXE='/Users/zand/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell';
const b=await chromium.launch({executablePath:EXE});
const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true})).newPage();
const errs=[];
p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
p.on('console',m=>{ if(m.type()==='error') errs.push('CONSOLE '+m.text()); });
const req=[];
p.on('request',r=>req.push(r.url()));
const click=s=>p.click(s,{timeout:6000}).catch(()=>console.log('  !! click', s));

/* 1. 无容器环境（window.xhs 不存在）也必须能跑完整个流程 */
await p.goto('http://127.0.0.1:4173/dist/index.html',{waitUntil:'networkidle'});
await p.waitForTimeout(700);
console.log('first screen before JS settled:', await p.evaluate(()=>document.querySelector('.boot-note')? 'boot-note present':'no boot-note'));
console.log('platform present:', await p.evaluate(()=>!!window.CourtPlatform), '| xhs injected:', await p.evaluate(()=>!!window.xhs));
console.log('html classes:', await p.evaluate(()=>document.documentElement.className||'(none)'));
console.log('--app-height:', await p.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--app-height')||'(unset)'));
console.log('flex gap supported here:', await p.evaluate(()=>window.CourtPlatform? window.CourtPlatform.supportsFlexGap():'n/a'));

await click('.hero-cta [data-action="trial"]');
await click('.def-grid .def-card:nth-child(1)');
await click('.pickbar [data-action="next"]');
await click('.charge-grid .charge:nth-child(1)');
await click('.pickbar [data-action="next"]');
await click('.exhibit:nth-child(1)');
await click('.exhibit:nth-child(2)');
await click('.pickbar [data-action="verdict"]');
await p.waitForTimeout(5600);
console.log('verdict rendered:', await p.locator('.doc').count()===1);
console.log('crest/seal bands:', await p.evaluate(()=>{
  const c=document.querySelector('.doc-crest'), s=document.querySelector('.doc-seal');
  if(!c||!s) return 'missing';
  const rc=c.getBoundingClientRect(), rs=s.getBoundingClientRect();
  return `crest ${(rc.height/rc.width).toFixed(4)} (want ${(490/1086).toFixed(4)}) / seal ${(rs.height/rs.width).toFixed(4)} (want ${(208/1086).toFixed(4)})`;
}));
await click('[data-action="poster"]');
await p.waitForTimeout(2200);
console.log('poster preview ok:', await p.evaluate(()=>{const i=document.querySelector('.sheet-figure img');return !!(i&&i.naturalWidth===1080&&i.naturalHeight===1440)}));
console.log('sheet buttons:', await p.evaluate(()=>[...document.querySelectorAll('.sheet [data-action]')].map(e=>e.dataset.action).join(',')));
await p.keyboard.press('Escape');
await click('[data-action="verdict-text"]');
await p.waitForTimeout(500);
console.log('copy sheet:', await p.evaluate(()=>{const t=document.querySelector('#copy-field');return t? t.value.split('\n')[0].slice(0,26)+' | readonly='+t.readOnly : 'MISSING'}));
await p.keyboard.press('Escape');
console.log('note button label:', await p.evaluate(()=>document.querySelector('[data-action="note-publish"] span')?.textContent));

/* 3. 脚本被禁用时，静态首屏仍要可读 */
{
  const ctx2 = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, javaScriptEnabled: false });
  const p2 = await ctx2.newPage();
  await p2.goto('http://127.0.0.1:4173/dist/index.html', { waitUntil: 'networkidle' });
  const staticView = await p2.evaluate(() => ({
    headline: (document.querySelector('.hero-body h1') || {}).textContent || '',
    ctas: [...document.querySelectorAll('#app [data-action]')].length,
    boot: !!document.querySelector('.boot-note'),
    artLoaded: !!(document.querySelector('.hero-art img') && document.querySelector('.hero-art img').naturalWidth > 0),
    docHeight: document.documentElement.scrollHeight
  }));
  console.log('no-JS first screen:', JSON.stringify(staticView));
  await ctx2.close();
}

/* 2. 外部请求必须为零 */
/* blob: 是内存对象（容器 CSP 明确放行图片），data: 同理；只有真正的 http(s) 才算联网 */
const network=req.filter(u=>/^https?:\/\//.test(u) && !u.startsWith('http://127.0.0.1:4173/'));
console.log('network requests beyond the package:', network.length, network.slice(0,5).join(' '));
console.log('in-memory (blob:/data:) image refs:', req.filter(u=>/^(blob:|data:)/.test(u)).length);
console.log('\nERRORS('+errs.length+'):', errs.slice(0,8).join('\n')||'none');
await b.close();
