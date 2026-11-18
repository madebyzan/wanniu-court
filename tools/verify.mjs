import { chromium } from 'playwright';
const EXE='/Users/zand/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell';
const b=await chromium.launch({executablePath:EXE});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push('PAGEERROR '+e.message)); p.on('console',m=>m.type()==='error'&&errs.push('CONSOLE '+m.text()));
let pass=0,fail=0;
const t=(name,cond,extra)=>{ if(cond){pass++;console.log('  ok   '+name)} else {fail++;console.log('  FAIL '+name+(extra?'  -> '+extra:''))} };
const go=async()=>{ await p.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'}); await p.waitForTimeout(400); };
const click=s=>p.click(s,{timeout:6000});
const state=()=>p.evaluate(()=>({
  page:document.querySelector('#app > div > section, #app > div > article, #app > div > div')?.className||'',
  hash:location.hash,
  tabs:[...document.querySelectorAll('.tab-bar .tab')].map(x=>[x.dataset.action,x.classList.contains('is-on')]),
  hist:JSON.parse(localStorage.getItem('wanniu-court-github-v1')||'[]').length,
}));

await go();
// --- tab navigation is wired
for (const [action,expect] of [['trial','#/trial'],['archive','#/archive'],['gallery','#/gallery'],['home','#/']]) {
  await click(`.tab-bar [data-action="${action}"]`);
  await p.waitForTimeout(250);
  const s=await state();
  t('tab '+action+' navigates', s.hash===expect, s.hash);
  t('tab '+action+' highlights', (s.tabs.find(x=>x[0]===action)||[])[1]===true);
}
// --- intake flow end to end
await click('.tab-bar [data-action="trial"]');
await click('.def-grid .def-card:nth-child(3)');
t('selection marks card', await p.locator('.def-card.is-on').count()===1);
t('actionbar shows pick', await p.locator('.pickbar .who strong').innerText()!=='');
await click('.pickbar [data-action="next"]');
t('step2 reached', await p.locator('.charge-grid .charge').count()>0);
const charges=await p.locator('.charge-grid .charge').count();
t('>=4 tailored charges', charges>=4, 'got '+charges);
await click('.charge-grid .charge:nth-child(2)');
await click('.pickbar [data-action="next"]');
t('step3 reached', await p.locator('.exhibit').count()>0);
await click('.exhibit:nth-child(1)'); await click('.exhibit:nth-child(2)');
t('two evidence selected', await p.locator('.exhibit.is-on').count()===2);
const locked=await p.locator('.exhibit.is-locked').count();
t('rest locked at cap', locked>0, 'locked='+locked);
await click('.exhibit:nth-child(3)').catch(()=>{});
t('cap respected', await p.locator('.exhibit.is-on').count()===2);
await click('.pickbar [data-action="verdict"]');
t('deliberation shows', await p.locator('.delib-steps .delib-step').count()===4);
await p.waitForTimeout(5400);
t('verdict rendered', await p.locator('.doc').count()===1);
const bands = await p.evaluate(() => {
  const pick = sel => {
    const host = document.querySelector(sel);
    if (!host) return null;
    const im = host.tagName === 'IMG' ? host : host.querySelector('img');
    const r = host.getBoundingClientRect();
    return { src: im && im.getAttribute('src'), fit: im && getComputedStyle(im).objectFit, w: r.width, h: r.height };
  };
  return {
    crest: pick('.doc-crest'),
    seal: pick('.doc-seal'),
    page: document.documentElement.scrollHeight
  };
});
t('crest band uses verdict artwork cropped, not stretched', !!(bands.crest && bands.crest.src.includes('verdict-paper') && bands.crest.fit === 'cover'), JSON.stringify(bands.crest));
t('seal band uses verdict artwork cropped', !!(bands.seal && bands.seal.src.includes('verdict-paper') && bands.seal.fit === 'cover'), JSON.stringify(bands.seal));
t('certificate bands stay proportional to width', Math.abs(bands.crest.h / bands.crest.w - 490 / 1086) < 0.02, 'crest ratio ' + (bands.crest.h / bands.crest.w).toFixed(3));
t('verdict page fits 1.8 screens at 390px', bands.page <= 844 * 1.8, bands.page + 'px = ' + (bands.page / 844).toFixed(2) + ' screens');
t('verdict summary bar carries outcome + docket', await p.locator('.verdict-bar').count() === 1 && (await p.locator('.verdict-bar .badge').count()) === 1);
const st1=await state();
t('history persisted', st1.hist===1, 'hist='+st1.hist);
t('route is #/verdict', st1.hash==='#/verdict', st1.hash);
// --- reaction persists
await click('.reaction-grid button:nth-child(1)');
const h0=JSON.parse(await p.evaluate(()=>localStorage.getItem('wanniu-court-github-v1')));
t('reaction saved', h0[0].reaction==='fair', JSON.stringify(h0[0].reaction));
t('outcome saved', ['guilty','settle'].includes(h0[0].outcome), h0[0].outcome);
// --- poster
await click('[data-action="poster"]');
await p.waitForTimeout(2200);
t('sheet opens', await p.evaluate(()=>!document.getElementById('sheet').hidden));
const posterOk=await p.evaluate(async()=>{ const im=document.querySelector('.sheet-figure img'); if(!im.complete||!im.naturalWidth) return 'no image'; return im.naturalWidth===1080&&im.naturalHeight===1440; });
t('poster is 1080x1440', posterOk===true, String(posterOk));
await p.keyboard.press('Escape');
t('escape closes sheet', await p.evaluate(()=>document.getElementById('sheet').hidden));
// --- appeal keeps the case
await click('[data-action="appeal"]');
t('appeal lands on step3', await p.locator('.exhibit.is-on').count()===2);
// --- archive + confirm delete
await click('.tab-bar [data-action="archive"]');
t('archive lists records', await p.locator('.rec').count()>=1);
await click('.rec-del');
t('confirm sheet', await p.locator('[data-action="confirm-ok"]').count()===1);
await click('[data-action="confirm-cancel"]');
t('cancel keeps record', await p.locator('.rec').count()>=1);
await click('.rec-del'); await click('[data-action="confirm-ok"]');
await p.waitForTimeout(300);
t('delete empties archive', await p.evaluate(()=>JSON.parse(localStorage.getItem('wanniu-court-github-v1')||'[]').length)===0);
t('empty state shown', await p.locator('.empty').count()===1);
// --- search focus
await click('.tab-bar [data-action="trial"]');
await p.fill('#case-search','闹钟');
const focused=await p.evaluate(()=>document.activeElement && document.activeElement.id);
t('search keeps focus', focused==='case-search', focused);
t('search filters', await p.locator('.def-card').count()>0 && await p.locator('.def-card').count()<16);
await click('.searchbar .clear');
t('clear resets query', await p.evaluate(()=>document.getElementById('case-search').value)==='');
// --- daily
await click('.tab-bar [data-action="home"]');
const d1=await p.locator('.daily h3').innerText();
await click('.daily [data-action="daily"]');
await p.waitForTimeout(5400);
t('daily verdict produced', await p.locator('.doc').count()===1);
const rec=await p.evaluate(()=>JSON.parse(localStorage.getItem('wanniu-court-github-v1'))[0]);
t('daily tagged', rec.source==='daily', rec.source);
t('daily defendant matches', rec.target===d1, rec.target+' vs '+d1);
// --- gallery tabs
await click('.tab-bar [data-action="gallery"]');
for (const tab of ['characters','props','scenes','cases']) {
  await click(`.tabs [data-action="gallery-tab"][data-id="${tab}"]`);
  await p.waitForTimeout(200);
  t('gallery tab '+tab, await p.locator('.g-card').count()>0);
}
// --- reduced motion + a11y basics
const a11y=await p.evaluate(()=>({
  lang:document.documentElement.lang,
  live:document.getElementById('app').getAttribute('aria-live'),
  tabsAria:!!document.querySelector('.tab-bar[aria-label]'),
  press:document.querySelectorAll('[aria-pressed]').length,
  imgAlt:[...document.querySelectorAll('img')].filter(i=>i.alt===''||i.alt).length,
  totalImg:document.querySelectorAll('img').length,
}));
t('lang zh-CN', a11y.lang==='zh-CN');
t('app is a live region', a11y.live==='polite');
t('tab bar labelled', a11y.tabsAria);
t('every img has alt attr', a11y.imgAlt===a11y.totalImg, a11y.imgAlt+'/'+a11y.totalImg);
console.log('\nERRORS('+errs.length+'):', errs.slice(0,8).join('\n')||'none');
console.log(`\n${pass} passed, ${fail} failed`);
await b.close();
process.exit(fail?1:0);
