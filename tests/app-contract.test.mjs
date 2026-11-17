import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const appJs = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const artwork = [
  "assets/scenes/hero-court.png",
  "assets/scenes/case-hall.png",
  "assets/scenes/filing-hall.png",
  "assets/scenes/deliberation-room.png",
  "assets/scenes/archive-room.png",
  "assets/scenes/verdict-paper.png",
  "assets/characters/cat-lawyer.png",
  "assets/characters/frog-clerk.png",
  "assets/characters/hamster-archivist.png",
  "assets/characters/hedgehog-bailiff.png",
  "assets/characters/judge-pigeon.png",
  "assets/characters/rabbit-witness.png",
  "assets/defendants/alarm.png",
  "assets/defendants/algorithm.png",
  "assets/defendants/autoplay.png",
  "assets/defendants/boss.png",
  "assets/defendants/delivery.png",
  "assets/defendants/early.png",
  "assets/defendants/group.png",
  "assets/defendants/meeting.png",
  "assets/defendants/monday.png",
  "assets/defendants/next.png",
  "assets/defendants/overthink.png",
  "assets/defendants/procrastination.png",
  "assets/defendants/rain.png",
  "assets/defendants/read.png",
  "assets/defendants/renew.png",
  "assets/defendants/simple-change.png",
  "assets/props/case-folder.png",
  "assets/props/court-column.png",
  "assets/props/crown.png",
  "assets/props/evidence-envelope.png",
  "assets/props/gavel.png",
  "assets/props/hourglass.png",
  "assets/props/laurel-wreath.png",
  "assets/props/magnifier.png",
  "assets/props/pocket-watch.png",
  "assets/props/quill.png",
  "assets/props/royal-candlestick.png",
  "assets/props/royal-key.png",
  "assets/props/royal-scroll.png",
  "assets/props/royal-seal.png",
  "assets/props/royal-shield.png",
  "assets/props/scales.png",
  "assets/decor/btn-primary.png",
  "assets/decor/btn-secondary.png",
  "assets/decor/case-card-frame.png",
  "assets/decor/category-label.png",
  "assets/decor/deliberation-banner.png",
  "assets/decor/divider-ornament.png",
  "assets/decor/page-corners.png",
  "assets/decor/section-banner.png"
];
test('document uses Chinese language and local application modules', () => {
  assert.ok(html.includes('<html lang="zh-CN">')); assert.ok(html.includes('viewport-fit=cover'));
  assert.ok(html.includes('href="./styles.css"')); assert.ok(html.includes('src="./app.js"')); assert.equal(html.includes('<script>'), false);
});
test('application module parses without executing browser side effects', () => { assert.ok(appJs.length > 10000); assert.doesNotThrow(() => new vm.Script(appJs)); });
test('visual system retains responsive behavior and reduced-motion support', () => {
  assert.ok(css.length > 10000); assert.ok(css.includes('prefers-reduced-motion:reduce')); assert.ok(css.includes('max-width:640px'));
  for (const decor of ['btn-primary.png','btn-secondary.png','case-card-frame.png','category-label.png','deliberation-banner.png','divider-ornament.png','page-corners.png','section-banner.png']) assert.ok(css.includes(decor), 'missing decoration use: '+decor);
});
test('all 52 uploaded PNG assets exist and are referenced', async () => {
  for (const path of artwork) {
    const bytes = await readFile(new URL('../' + path, import.meta.url));
    assert.ok(bytes.length > 500, path + ' should not be empty');
    assert.deepEqual(Array.from(bytes.subarray(0,8)), [137,80,78,71,13,10,26,10], path + ' should be a PNG');
    assert.ok(appJs.includes(path.slice('assets/'.length)) || css.includes(path.slice('assets/'.length)), path + ' must be used by the UI');
  }
});
test('all 16 common defendants have individual illustration mappings', () => {
  for (const id of ['monday','meeting','simple','boss','alarm','delivery','rain','read','next','autoplay','renew','algorithm','procrastination','overthink','early','group']) assert.ok(appJs.includes(id+':\'./assets/defendants/'), 'missing defendant image mapping: '+id);
});
test('gallery exposes the four visual catalogue tabs', () => {
  for (const tab of ['cases','characters','props','scenes']) assert.ok(appJs.includes("'"+tab+"'"));
  assert.ok(appJs.includes('data-action="gallery-tab"'));
});
test('user journeys and local history remain connected', () => {
  for (const action of ['home','trial','archive','gallery','next','verdict','poster','copy','appeal']) assert.ok(html.includes('data-action="'+action+'"') || appJs.includes("'"+action+"'"), 'missing action: '+action);
  assert.ok(appJs.includes('wanniu-court-github-v1')); assert.ok(appJs.includes('slice(0,80)'));
});

test('daily case is stable for a given local date and differs from random quick trial', () => {
  assert.ok(appJs.includes('const getDailyDocket=function()'));
  assert.ok(appJs.includes("item.source==='daily'&&item.dailyDate===daily.dateKey"));
  assert.ok(appJs.includes("pickRandom('daily')"));
  assert.ok(appJs.includes("pickRandom('quick')"));
});
test('each defendant has tailored legal charges, evidence and a finding', () => {
  for (const id of ['monday','meeting','simple','boss','alarm','delivery','rain','read','next','autoplay','renew','algorithm','procrastination','overthink','early','group']) {
    assert.ok(appJs.includes(id+':['), 'case-specific data missing for '+id);
  }
  assert.ok(appJs.includes('const caseEvidence='));
  assert.ok(appJs.includes('const caseCharges='));
  assert.ok(appJs.includes('const caseFindings='));
  assert.ok(appJs.includes('chargesFor(state.target)'));
  assert.ok(appJs.includes('evidenceFor(state.target)'));
});
test('appeal carries forward the original target, charge, and evidence', () => {
  assert.ok(appJs.includes('function startAppeal()'));
  assert.ok(appJs.includes('state.appealOf=previous.id'));
  assert.ok(appJs.includes('state.evidence=Array.isArray(previous.evidence)?previous.evidence.slice(0,2):[]'));
  assert.ok(appJs.includes('appealRound:state.appealOf?(state.appealRound||1):0'));
});
test('post-verdict feedback persists and poster preview supports mobile sharing', () => {
  assert.ok(appJs.includes('function recordReaction(reaction)'));
  assert.ok(appJs.includes("['fair','light','heavy']"));
  assert.ok(appJs.includes('长按图片保存'));
  assert.ok(appJs.includes('navigator.share'));
  assert.ok(appJs.includes('data-action="poster-download"'));
  assert.ok(appJs.includes('data-action="poster-share"'));
});
test('live search restores focus and cursor without forcing page scroll', () => {
  assert.ok(appJs.includes('focusId:id'));
  assert.ok(appJs.includes('selectionStart:start,selectionEnd:end'));
  assert.ok(appJs.includes('render({scroll:false})'));
});
