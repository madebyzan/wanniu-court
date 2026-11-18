import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const appJs = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const artwork = [
  "assets/scenes/hero-court.png","assets/scenes/case-hall.png","assets/scenes/filing-hall.png",
  "assets/scenes/deliberation-room.png","assets/scenes/archive-room.png","assets/scenes/verdict-paper.png",
  "assets/characters/cat-lawyer.png","assets/characters/frog-clerk.png","assets/characters/hamster-archivist.png",
  "assets/characters/hedgehog-bailiff.png","assets/characters/judge-pigeon.png","assets/characters/rabbit-witness.png",
  "assets/defendants/alarm.png","assets/defendants/algorithm.png","assets/defendants/autoplay.png","assets/defendants/boss.png",
  "assets/defendants/delivery.png","assets/defendants/early.png","assets/defendants/group.png","assets/defendants/meeting.png",
  "assets/defendants/monday.png","assets/defendants/next.png","assets/defendants/overthink.png","assets/defendants/procrastination.png",
  "assets/defendants/rain.png","assets/defendants/read.png","assets/defendants/renew.png","assets/defendants/simple-change.png",
  "assets/props/case-folder.png","assets/props/court-column.png","assets/props/crown.png","assets/props/evidence-envelope.png",
  "assets/props/gavel.png","assets/props/hourglass.png","assets/props/laurel-wreath.png","assets/props/magnifier.png",
  "assets/props/pocket-watch.png","assets/props/quill.png","assets/props/royal-candlestick.png","assets/props/royal-key.png",
  "assets/props/royal-scroll.png","assets/props/royal-seal.png","assets/props/royal-shield.png","assets/props/scales.png",
  "assets/decor/btn-primary.png","assets/decor/btn-secondary.png","assets/decor/case-card-frame.png","assets/decor/category-label.png",
  "assets/decor/deliberation-banner.png","assets/decor/divider-ornament.png","assets/decor/page-corners.png","assets/decor/section-banner.png"
];
const defendants = ['monday','meeting','simple','boss','alarm','delivery','rain','read','next','autoplay','renew','algorithm','procrastination','overthink','early','group'];

test('document uses Chinese language, local modules and no inline script', () => {
  assert.ok(html.includes('<html lang="zh-CN">'));
  assert.ok(html.includes('viewport-fit=cover'));
  assert.ok(html.includes('href="./styles.css"'));
  assert.ok(html.includes('src="./app.js"'));
  assert.equal(html.includes('<script>'), false);
  assert.ok(html.includes('rel="icon"'), 'favicon must be inlined so the shell never 404s');
});

test('application module parses without executing browser side effects', () => {
  assert.ok(appJs.length > 10000);
  assert.doesNotThrow(() => new vm.Script(appJs));
});

test('visual system keeps responsive behaviour and reduced-motion support', () => {
  assert.ok(css.length > 10000);
  assert.ok(css.includes('prefers-reduced-motion:reduce'));
  assert.ok(/@media \(max-width: 359px\)/.test(css), 'small-phone breakpoint missing');
  assert.ok(/@media \(min-width: 430px\)/.test(css), 'large-phone breakpoint missing');
  assert.ok(css.includes('env(safe-area-inset-bottom)'), 'tab bar must clear the home indicator');
});

test('decor artwork is used as chrome, not as stretched page backgrounds', () => {
  const inCss = ['btn-primary.png','btn-secondary.png','case-card-frame.png','category-label.png','page-corners.png','verdict-paper.png'];
  const inJs = ['deliberation-banner.png','divider-ornament.png','section-banner.png'];
  for (const d of inCss) assert.ok(css.includes(d), 'missing decoration use in CSS: ' + d);
  for (const d of inJs) assert.ok(appJs.includes(d), 'missing decoration use in JS: ' + d);
  assert.equal(css.includes('page-corners.png") center/100% 100%'), false, 'page-corners must be sliced into corners, never stretched across a page');
  assert.ok(css.includes('background-size: 26% auto'), 'page-corners must render as four corner tiles');
});

test('all 52 PNG assets exist and are referenced', async () => {
  for (const path of artwork) {
    const bytes = await readFile(new URL('../' + path, import.meta.url));
    assert.ok(bytes.length > 500, path + ' should not be empty');
    assert.deepEqual(Array.from(bytes.subarray(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10], path + ' should be a PNG');
    assert.ok(appJs.includes(path.slice('assets/'.length)) || css.includes(path.slice('assets/'.length)), path + ' must be used by the UI');
  }
});

test('assets that must be transparent carry real alpha, not a baked white box', async () => {
  for (const path of ['assets/decor/btn-primary.png','assets/props/laurel-wreath.png','assets/props/royal-key.png']) {
    const bytes = await readFile(new URL('../' + path, import.meta.url));
    const colorType = bytes[25];
    const chunks = bytes.toString('latin1');
    const hasTrns = chunks.includes('tRNS');
    assert.ok(colorType === 6 || (colorType === 3 && hasTrns),
      path + ' must be RGBA or a paletted PNG with a tRNS chunk (got colour type ' + colorType + ')');
  }
});

test('all 16 defendants have individual illustrations', () => {
  for (const id of defendants) assert.ok(appJs.includes(id + ":'./assets/defendants/"), 'missing defendant image mapping: ' + id);
});

test('gallery exposes the four visual catalogue tabs', () => {
  for (const tab of ['cases','characters','props','scenes']) assert.ok(appJs.includes("'" + tab + "'"));
  assert.ok(appJs.includes('data-action="gallery-tab"'));
});

test('primary navigation is wired and mirrors the route', () => {
  for (const action of ['home','trial','archive','gallery']) {
    assert.ok(html.includes('data-action="' + action + '"'), 'tab bar missing action: ' + action);
  }
  assert.ok(appJs.includes("document.body.addEventListener('click',onClick)"), 'navigation must be handled outside #app too');
  assert.ok(appJs.includes("routeOf={home:'#/'"), 'routes must be reflected in the address bar');
  assert.ok(appJs.includes("addEventListener('popstate'"), 'browser back must be honoured');
  for (const action of ['next','verdict','poster','copy','appeal','reaction','delete','daily','random']) assert.ok(appJs.includes("'" + action + "'"), 'missing action: ' + action);
  assert.ok(appJs.includes('wanniu-court-github-v1'));
  assert.ok(appJs.includes('slice(0,80)'));
});

test('destructive delete uses an in-app confirmation, not window.confirm', () => {
  assert.equal(appJs.includes('window.confirm'), false, 'window.confirm is blocked inside embedded webviews');
  assert.ok(appJs.includes('function askConfirm('));
  assert.ok(appJs.includes('role="alertdialog"'));
  assert.ok(appJs.includes('data-action="confirm-ok"'));
  assert.ok(appJs.includes('data-action="confirm-cancel"'));
});

test('daily case is stable for a local date and distinct from quick trial', () => {
  assert.ok(appJs.includes('const getDailyDocket=function()'));
  assert.ok(appJs.includes("x.source==='daily'&&x.dailyDate===daily.dateKey"));
  assert.ok(appJs.includes("pickRandom('daily')"));
  assert.ok(appJs.includes("pickRandom('quick')"));
});

test('each defendant has tailored charges, evidence and a finding', () => {
  for (const id of defendants) assert.ok(appJs.includes(id + ':['), 'case-specific data missing for ' + id);
  for (const pool of ['const caseEvidence=','const caseCharges=','const caseFindings=','const verdictSentences=','const penaltiesByJudge=','const judgeComments=']) assert.ok(appJs.includes(pool), 'missing pool ' + pool);
  assert.ok(appJs.includes('chargesFor(who)'));
  assert.ok(appJs.includes('evidenceFor(who)'));
});

test('verdict outcome is derived from evidence count and judge style', () => {
  assert.ok(appJs.includes("const outcome=(evidenceCount>=2||style.id==='strict')?'guilty':'settle';"));
  for (const pool of ['const settleSentences=','const settlePenalties=','const settleComments=']) assert.ok(appJs.includes(pool), 'settle copy missing: ' + pool);
  assert.ok(appJs.includes('outcome:outcome'), 'outcome must be written into the archived record');
  assert.ok(appJs.includes('const outcomeOf=function('), 'legacy records without an outcome must still render');
});

test('appeal carries forward the original target, charge and evidence', () => {
  assert.ok(appJs.includes('function startAppeal()'));
  assert.ok(appJs.includes('state.appealOf=previous.id'));
  assert.ok(appJs.includes('state.evidence=Array.isArray(previous.evidence)?previous.evidence.slice(0,2):[]'));
  assert.ok(appJs.includes('appealRound:state.appealOf?(state.appealRound||1):0'));
});

test('post-verdict feedback persists and sharing works on mobile', () => {
  assert.ok(appJs.includes('function recordReaction(reaction)'));
  assert.ok(appJs.includes("['fair','light','heavy']"));
  assert.ok(appJs.includes('长按图片可保存到相册'));
  assert.ok(appJs.includes('navigator.share'));
  assert.ok(appJs.includes('navigator.canShare'));
  assert.ok(appJs.includes('data-action="poster-download"'));
  assert.ok(appJs.includes('data-action="poster-share"'));
});

test('poster is drawn at 1080x1440 with canvas text, never baked artwork', () => {
  assert.ok(appJs.includes('canvas.width=W') && appJs.includes('const W=1080,H=1440'));
  assert.ok(appJs.includes("round(L,plateY,CW,plateH,10)"), 'crest plate must be vector-drawn');
  assert.ok(appJs.includes('wrapMax='), 'long copy must truncate instead of colliding');
  assert.ok(appJs.includes('toBlob'), 'poster must produce a shareable blob');
});

test('dev server allows blob posters under CSP', async () => {
  const server = await readFile(new URL('../scripts/dev-server.mjs', import.meta.url), 'utf8');
  assert.ok(/img-src 'self' data: blob:/.test(server), 'blob: must be an allowed image source');
  assert.ok(/object-src 'none'/.test(server));
  assert.ok(/connect-src 'none'/.test(server));
});

test('live search restores focus and cursor without forcing page scroll', () => {
  assert.ok(appJs.includes('focusId:id'));
  assert.ok(appJs.includes('selectionStart:start,selectionEnd:end'));
  assert.ok(appJs.includes('render({scroll:false})'));
  assert.ok(appJs.includes('data-action="clear-query"'));
});

test('illustration artwork is never stretched into UI surfaces', () => {
  const stretched = [...css.matchAll(/url\("\.\/assets\/(scenes|props)[^"]*"\)[^;]*100% 100%/g)];
  assert.equal(stretched.length, 0, 'scene and prop artwork must crop or slice, never stretch: ' + JSON.stringify(stretched.map(m => m[0])));
  assert.ok(css.includes('object-fit: cover'), 'artwork windows should crop, not stretch');
  assert.ok(css.includes('border-image'), 'certificate frames must use sliced border images');
  assert.ok(css.includes('aspect-ratio'), 'artwork windows must reserve their box before the image loads');
});

test('custom defendants fall back to a drawn monogram, never to decorative artwork', () => {
  assert.ok(appJs.includes('const monogram=function('), 'custom defendants need a typographic placeholder');
  assert.ok(appJs.includes('art--mono'), 'the artwork scrim must not grey out the monogram plate');
  assert.equal(/defendantId\?defendantAssets\[[^\]]*\]:propAssets\.scroll/.test(appJs), false,
    'a blank scroll in the defendant slot reads as a broken image');
  assert.equal(appJs.includes("'被 告'") && appJs.includes("自定义被告 · 本庭照单受理"), true,
    'the poster must draw a nameplate for custom defendants');
});

test('poster windows carry no baked caption bars and single exhibits are unnumbered', () => {
  assert.equal(appJs.includes("g.fillRect(x,y+h-38,w,38)"), false, 'hard black caption bars were removed');
  assert.ok(appJs.includes('const evText=ev.length===1?ev[0]'), 'one exhibit must not render a "1." prefix');
});

test('custom defendants are classified from the words the user typed', () => {
  assert.ok(appJs.includes('const customRules=['), 'custom defendants need a real classifier');
  for (const id of ['work','life','social','digital','self','campus']) {
    assert.ok(new RegExp("\\{id:'" + id + "',focus:").test(appJs), 'no rule for category ' + id);
  }
  assert.ok(appJs.includes('const ranked=best.charges.map'), 'headline charge must follow the matched keyword, not list order');
  assert.ok(appJs.includes('依描述命中'), 'the court must show which reading produced the charge');
  assert.ok(appJs.includes("id:'custom',matched:0"), 'unmatched names must fall back honestly, not pretend to be classified');
  assert.equal(appJs.includes("state.charge='故意扰乱心情秩序罪'"), false, 'custom defendants must not get a hardcoded charge');
  assert.ok(appJs.includes('customClassified:'), 'the archived record must keep how it was classified');
});
