/* 小工具交付契约测试。
   规范来源：.codex/minitool-zip-builder（zip-artifact-spec / device-capabilities /
   js-compatibility / css-compatibility / performance-budget / cross-platform-h5）。
   这些断言只检查静态产物，不代表真机验证已通过。 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const appJs = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const platformJs = await readFile(new URL('../platform.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const js = appJs + '\n' + platformJs;

const dirs = { scenes: 6, characters: 6, defendants: 16, props: 16, decor: 8 };
const defendantIds = ['monday','meeting','simple','boss','alarm','delivery','rain','read','next','autoplay','renew','algorithm','procrastination','overthink','early','group'];

/* ---------- 入口与打包结构 ---------- */
test('entry is a compliant offline H5 document', () => {
  assert.ok(/<!DOCTYPE html>/i.test(html));
  assert.ok(html.includes('<html lang="zh-CN">'));
  assert.match(html, /charset="UTF-8"/i);
  assert.match(html, /width=device-width/);
  assert.match(html, /initial-scale=1\.0/);
  assert.match(html, /viewport-fit=cover/);
  assert.ok(html.includes('href="./styles.css"'));
  assert.equal(html.includes('<base '), false, '<base href> breaks real-device paths');
  assert.equal(/<iframe|<object/i.test(html), false);
  assert.equal(/http-equiv=["']content-security-policy/i.test(html), false, 'CSP belongs to the container');
});

test('scripts are classic, external, deferred and ordered', () => {
  assert.equal(html.includes('type="module"'), false, 'offline zip has no module resolution');
  assert.equal(/<script[\s\S]*?[^/]>[\s\S]*?\w+[\s\S]*?<\/script>/i.test(html.replace(/<script[^>]*src="[^"]*"[^>]*>\s*<\/script>/g, '')), false, 'inline script is blocked by container CSP');
  assert.equal(/\son(click|touchstart|input|change)=/.test(html), false, 'inline event handlers are blocked');
  const platform = html.indexOf('src="./platform.js"');
  const app = html.indexOf('src="./app.js"');
  assert.ok(platform > -1 && app > -1, 'both scripts must be referenced');
  assert.ok(platform < app, 'platform.js must load before app.js');
  assert.match(html, /<script defer src="\.\/platform\.js">/);
  assert.match(html, /<script defer src="\.\/app\.js">/);
  assert.equal(/\bimport\s|\bexport\s/.test(js), false, 'no ESM syntax in shipped JS');
  for (const [name, src] of [['app.js', appJs], ['platform.js', platformJs]]) {
    assert.doesNotThrow(() => new vm.Script(src, { filename: name }), name + ' must parse as a classic script');
  }
});

test('no external resource URL is referenced anywhere', () => {
  const all = html + js + css;
  const hits = all.match(/https?:\/\/[^"' )\s]+\.(?:js|css|png|jpe?g|webp|gif|svg|woff2?)/gi) || [];
  assert.deepEqual(hits, [], 'every asset must live inside the zip: ' + hits.join(', '));
});

/* ---------- 首屏 ---------- */
test('first screen is real content in HTML, not an empty mount point', () => {
  const mount = html.slice(html.indexOf('<main id="app"'), html.indexOf('</main>'));
  assert.ok(mount.includes('这点小事'), 'the real headline must be in the entry');
  assert.ok(mount.includes('也值得开庭'), 'the headline must not be truncated to a shell');
  assert.ok(mount.includes('hero-court.webp'), 'the first-screen artwork must be statically referenced');
  assert.ok(/data-action="random"/.test(mount) && /data-action="trial"/.test(mount), 'both entry CTAs exist before JS runs');
  assert.ok(/class="boot-note"[^>]*role="status"/.test(mount), 'a status line covers the pre-JS state');
  assert.ok(/-webkit-text-size-adjust/.test(css), 'entry text sizing must be pinned for WebView');
});

/* ---------- 端能力 ---------- */
test('forbidden Web APIs are absent from shipped code', () => {
  const banned = {
    'fetch(': /fetch\s*\(/, 'XMLHttpRequest': /XMLHttpRequest/, 'WebSocket': /new\s+WebSocket\s*\(/,
    'EventSource': /new\s+EventSource\s*\(/, 'navigator.geolocation': /navigator\.geolocation/,
    'navigator.clipboard': /navigator\.clipboard/, 'document.execCommand': /execCommand/,
    'navigator.share': /navigator\.share\b/, 'navigator.canShare': /navigator\.canShare\b/,
    'a[download]': /\bdownload\s*=|\.download\s*=/, 'window.open': /window\.open\s*\(/,
    'window.prompt': /window\.prompt\s*\(/, 'eval': /\beval\s*\(/, 'new Function': /new\s+Function\s*\(/,
    'WebAssembly': /WebAssembly\./, 'Worker': /new\s+(?:Shared)?Worker\s*\(/,
    'ServiceWorker': /navigator\.serviceWorker/, 'requestFullscreen': /requestFullscreen/,
    'DeviceMotion': /DeviceMotionEvent|'devicemotion'/, 'DeviceOrientation': /DeviceOrientationEvent|'deviceorientation'/,
    'navigator.storage.persist': /navigator\.storage\.persist/, 'location.href assign': /location\.href\s*=/,
  };
  for (const [label, re] of Object.entries(banned)) {
    assert.equal(re.test(js), false, 'forbidden capability present: ' + label);
  }
});

test('persistence uses the container Storage API and never writes browser storage', () => {
  assert.equal(/localStorage\.setItem|sessionStorage\.setItem|indexedDB\.open|caches\./.test(js), false);
  assert.ok(platformJs.includes('setStorage'), 'Storage API must be bridged');
  assert.ok(platformJs.includes('getStorage'), 'Storage API must be bridged');
  assert.ok(/MIN\s*=\s*{[^}]*storage:\s*9460/.test(platformJs), 'Storage requires client 9.46+');
  assert.ok(/isClientVersion|clientVersion/.test(platformJs), 'version must be compared, not guessed from UA');
  /* 在线文档允许一次性读取旧浏览器存储做迁移，迁移后不再读写 */
  assert.ok(/localStorage\.getItem/.test(platformJs), 'one-time migration read must exist');
  assert.ok(/removeItem/.test(platformJs), 'migration must clear the legacy store afterwards');
  assert.ok(appJs.includes("persistence='unsupported'"), 'the app must handle storage being unavailable');
  assert.equal(/return\s+\{[^}]*ok:\s*false[^}]*\}/.test(platformJs), true, 'adapters must report failure, not fake success');
});

test('image saving and sharing go through documented container APIs', () => {
  for (const api of ['writeTempFile', 'saveImageToPhotosAlbum', 'postNote', 'share', 'getWindowInfo']) {
    assert.ok(platformJs.includes(api), 'missing container API bridge: ' + api);
  }
  assert.match(platformJs, /share:\s*9530/, 'share requires client 9.53+');
  assert.match(platformJs, /window:\s*9490/, 'getWindowInfo requires client 9.49+');
  assert.ok(/type:\s*'image'/.test(platformJs) && /image_resource/.test(platformJs), 'share({type:"image", image_resource})');
  assert.ok(/pageType:\s*'photo_publish'/.test(platformJs) && /image_resources/.test(platformJs), 'postNote media shape');
  assert.ok(appJs.includes('state.posterDataUrl'), 'platform calls need a data URI, not a blob URL');
  assert.ok(/URL\.revokeObjectURL/.test(appJs), 'the blob preview must be released');
});

test('text copy falls back to selectable text, not the clipboard API', () => {
  assert.ok(appJs.includes('id="copy-field"'), 'the verdict copy must be presented as selectable text');
  assert.ok(/readonly/.test(appJs) && /user-select:\s*text/.test(css), 'the field must stay selectable');
  /* 只看真实声明，注释里提到它不算：禁用 touch-callout 会杀掉长按复制这条路 */
  const cssDecls = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal(/-webkit-touch-callout:\s*none/.test(cssDecls), false, 'disabling touch-callout would kill long-press copy');
});

/* ---------- JS 兼容性：Chrome 61 / ES2017 ---------- */
test('shipped JS stays within ES2017', () => {
  assert.equal(/\?\./.test(js), false, 'optional chaining is ES2020');
  assert.equal(/\?\?/.test(js), false, 'nullish coalescing is ES2020');
  assert.equal(/\|\|=|&&=|\?\?=/.test(js), false, 'logical assignment is ES2021');
  assert.equal(/#[A-Za-z_$]+\s*[=(]/.test(js), false, 'class fields are not ES2017');
  assert.equal(/BigInt|globalThis/.test(js), false);
  assert.equal(/\.flatMap\(|\.flat\(|Object\.entries\(\{[\s\S]*?\}\)\.flatMap/.test(js), false, 'Array flat/flatMap is ES2019');
  assert.equal(/Object\.fromEntries|String\.prototype\.replaceAll|\.replaceAll\(/.test(js), false, 'ES2019/2021 runtime APIs');
  assert.equal(/structuredClone|Array\.prototype\.at\(|\.at\(-?\d/.test(js), false, 'newer runtime APIs must not be the only path');
});

test('newer Web APIs are feature-detected', () => {
  assert.ok(/typeof canvas\.toBlob\s*===\s*'function'/.test(appJs), 'toBlob must be probed');
  assert.ok(/window\.visualViewport\s*&&/.test(platformJs), 'visualViewport must be probed');
  assert.ok(/typeof\s+\w+\.?(replaceState|addEventListener)\s*===\s*'function'/.test(js), 'history/listener APIs must be probed');
  assert.ok(/try\s*\{/.test(appJs) && appJs.includes('catch'), 'container calls must not throw into the UI');
  assert.equal(/navigator\.userAgent/.test(js), false, 'capability detection must not sniff UA');
});

test('dates are formatted explicitly, not via locale-dependent output', () => {
  assert.equal(/\.toLocaleDateString\(/.test(appJs), false, 'js-compatibility.md §4: do not rely on Intl formatting output');
  assert.ok(appJs.includes('function formatDate'), 'an explicit YYYY/MM/DD formatter must exist');
});

/* ---------- CSS 兼容性：Chrome 61 基线 + 增强 ---------- */
test('CSS never relies on post-Chrome-61 features as the only implementation', () => {
  assert.equal(/\baspect-ratio\s*:/.test(css), false, 'Chrome 88; ratio boxes must use padding-top');
  assert.equal(/\binset\s*:/.test(css), false, 'Chrome 87; use top/right/bottom/left');
  assert.equal(/overflow\s*:\s*clip/.test(css), false, 'Chrome 90; use hidden');
  assert.equal(/\b[0-9]+dvh|\b[0-9]+svh|\b[0-9]+lvh/.test(css), false, 'Chrome 108; use vh + --app-height');
  assert.equal(/\bmargin-inline\b|\bpadding-inline\b|\bpadding-block\b/.test(css), false, 'logical shorthands need physical properties');
  assert.equal(/repeating-conic-gradient/.test(css), false, 'Chrome 69');
  assert.equal(/\bclamp\(/.test(css), false, 'Chrome 79; use fixed values + media queries');
});

test('Chrome 61 fallbacks exist for gap, safe area, focus and blur', () => {
  assert.ok(/grid-gap/.test(css), 'grid spacing must also declare grid-gap (Chrome 57)');
  assert.ok(/no-flexgap/.test(css), 'flex gap needs a margin-based fallback');
  assert.ok(/--app-height/.test(css), 'viewport height must fall back to vh');
  const safeArea = css.match(/var\(--safe-area-inset-\w+, env\(safe-area-inset-\w+, 0px\)\)/g) || [];
  assert.ok(safeArea.length >= 4, 'safe areas must be var() -> env() -> 0, got ' + safeArea.length);
  const plainThenSafe = /padding-bottom:\s*\d+px;\s*\n\s*padding-bottom:\s*calc\([^)]*safe-area/.test(css)
    || /padding:\s*[^;]+;\s*\n\s*padding:\s*calc\([^)]*safe-area/.test(css)
    || /bottom:\s*\d+px;\s*\n\s*bottom:\s*calc\([^)]*safe-area/.test(css);
  assert.ok(plainThenSafe, 'a plain value must precede the env() form so Chrome 61 keeps a usable fallback');
  assert.ok(/:focus\s*\{[^}]*outline/.test(css), 'keyboard focus must be visible without :focus-visible');
  assert.ok(/@supports\s*\(selector\(:focus-visible\)\)/.test(css), ':focus-visible belongs in an enhancement block');
  assert.ok(/@supports\s*\(\(-webkit-backdrop-filter/.test(css), 'backdrop-filter must be gated');
  assert.ok(/prefers-reduced-motion:\s*reduce/.test(css));
});

test('artwork is cropped or sliced, never stretched, and reserves its box', () => {
  assert.equal(/url\(["']?\.\/assets\/(scenes|props)[^)]*100%\s*100%/.test(css), false);
  assert.ok(/object-fit:\s*cover/.test(css), 'scene windows crop');
  assert.ok(/padding-top:\s*45\.12%/.test(css), 'the certificate crest band keeps 1086/490');
  assert.ok(/padding-top:\s*19\.153%/.test(css), 'the wax-seal band keeps 1086/208');
  assert.ok(/padding-bottom:\s*123\.38%/.test(css), 'the empty certificate keeps 1129/1393');
  assert.ok(/\.art\s*>\s*img\s*\{[^}]*position:\s*absolute/.test(css), 'ratio boxes need an out-of-flow image');
});

test('transparent assets really carry an alpha channel', async () => {
  for (const path of ['decor/btn-primary.webp', 'props/laurel-wreath.webp', 'props/royal-key.webp', 'defendants/monday.webp']) {
    const bytes = await readFile(new URL('../assets/' + path, import.meta.url));
    assert.equal(bytes.subarray(0, 4).toString('latin1'), 'RIFF', path);
    assert.equal(bytes.subarray(8, 12).toString('latin1'), 'WEBP', path);
    assert.equal(bytes.includes('ALPH'), true, path + ' lost its alpha during conversion');
  }
});

/* ---------- 跨端 ---------- */
test('touch and scroll behaviour is device-safe', () => {
  assert.ok(/touch-action:\s*manipulation/.test(css), 'double-tap zoom delay hurts real devices');
  assert.ok(/-webkit-tap-highlight-color/.test(css));
  assert.ok(/@media \(max-width: 359px\)/.test(css) && /@media \(min-width: 430px\)/.test(css));
  assert.equal(/width:\s*375px/.test(css), false, 'no hard-coded device width');
  assert.ok(/max-width:\s*100%/.test(css), 'images must be fluid');
});

/* ---------- 业务逻辑未被顺手改坏 ---------- */
test('the courtroom product contract still holds', () => {
  for (const id of defendantIds) assert.ok(appJs.includes(id + ":'./assets/defendants/"), 'missing artwork mapping: ' + id);
  for (const id of defendantIds) assert.ok(appJs.includes(id + ':['), 'case-specific data missing: ' + id);
  for (const pool of ['const caseEvidence=', 'const caseCharges=', 'const caseFindings=', 'const verdictSentences=', 'const penaltiesByJudge=', 'const judgeComments=', 'const settleSentences=', 'const settlePenalties=', 'const settleComments=']) {
    assert.ok(appJs.includes(pool), 'missing pool ' + pool);
  }
  assert.ok(appJs.includes("const outcome=(evidenceCount>=2||style.id==='strict')?'guilty':'settle';"));
  assert.ok(appJs.includes('const customRules=['), 'custom defendants must still be classified');
  assert.ok(appJs.includes('依描述命中'));
  assert.ok(appJs.includes('function startAppeal()'));
  assert.ok(appJs.includes('function recordReaction(reaction)'));
  assert.ok(appJs.includes('data-action="gallery-tab"'));
  for (const action of ['home','trial','archive','gallery','next','verdict','poster','appeal','reaction','delete','daily','random']) {
    assert.ok(appJs.includes("'" + action + "'"), 'missing action: ' + action);
  }
  assert.ok(appJs.includes('slice(0,80)'), 'history stays bounded');
});

test('destructive delete uses an in-app sheet, not window.confirm', () => {
  assert.equal(appJs.includes('window.confirm'), false);
  assert.ok(appJs.includes('role="alertdialog"'));
  assert.ok(appJs.includes('data-action="confirm-ok"'));
});

test('poster is drawn at 1080x1440 with canvas text and kinsoku wrapping', () => {
  assert.ok(/const W=1080,H=1440/.test(appJs));
  assert.ok(appJs.includes('NO_LINE_START'), 'Chinese line-break rules must be applied');
  assert.ok(appJs.includes('NO_LINE_END'));
  assert.ok(/plaqueY=Math\.min\(y,950\)/.test(appJs), 'the plaque must not push the comment onto the footer rule');
  assert.equal(appJs.includes('g.fillRect(x,y+h-38,w,38)'), false, 'no baked caption bars over artwork');
});

test('page weight stays inside the delivery budget', async () => {
  const cssBytes = Buffer.byteLength(css);
  const jsBytes = Buffer.byteLength(appJs) + Buffer.byteLength(platformJs);
  assert.ok(cssBytes + jsBytes < 5 * 1024 * 1024, 'text total must stay well under the 5 MiB advisory');
  assert.ok(jsBytes < 2 * 1024 * 1024, 'a single JS file over 2 MiB is a risk signal');
  const base64 = (appJs + css).match(/base64,[A-Za-z0-9+/=]{2000,}/g) || [];
  assert.deepEqual(base64, [], 'no large base64 may be embedded in source');
});
