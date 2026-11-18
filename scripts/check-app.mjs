/* 小工具产物校验：素材存在性 + 容器合规静态扫描。
   与 .codex/minitool-zip-builder 的 device-capabilities.md §6 扫描清单保持一致。 */
import { readFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = (p) => readFile(new URL(p, root), 'utf8');

const html = await read('index.html');
const appJs = await read('app.js');
const platformJs = await read('platform.js');
const css = await read('styles.css');
const js = appJs + '\n' + platformJs;

const fail = (msg) => { throw new Error(msg); };

/* ---------- 入口与资源引用 ---------- */
if (!html.includes('<html lang="zh-CN">')) fail('Document language must be zh-CN.');
if (!/charset="UTF-8"/i.test(html)) fail('Missing UTF-8 charset.');
if (!/viewport-fit=cover/.test(html)) fail('viewport must include viewport-fit=cover.');
if (!/initial-scale=1\.0/.test(html)) fail('viewport must include initial-scale=1.0.');
if (!html.includes('href="./styles.css"')) fail('Missing local stylesheet.');
if (!/script[^>]+src="\.\/platform\.js"/.test(html)) fail('platform.js must be an external classic script.');
if (!/script[^>]+src="\.\/app\.js"/.test(html)) fail('app.js must be an external classic script.');
if (/<script[\s\S]*?<\/script>/i.test(html.replace(/<script[^>]*src="[^"]*"[^>]*>\s*<\/script>/g, ''))) {
  fail('Inline <script> is blocked by the container CSP.');
}
if (/type="module"/.test(html)) fail('type="module" is forbidden: offline zip has no module resolution.');
if (/\son(click|touchstart|input|change)=/.test(html)) fail('Inline event handlers are forbidden.');
if (/<base\s/i.test(html)) fail('<base href> breaks real-device paths.');
if (/<iframe|<object/i.test(html)) fail('iframe / object are forbidden.');
if (/https?:\/\/[^"')\s]+\.(js|css|png|jpe?g|webp|gif|svg|woff2?)/i.test(html + js + css)) {
  fail('External resource URL found; every asset must live inside the zip.');
}
if (/<meta[^>]+http-equiv=["']content-security-policy/i.test(html)) fail('Do not declare your own CSP meta.');

/* ---------- 脚本必须是经典脚本 ---------- */
if (/(^|\n)\s*(import|export)\s/.test(js)) fail('ES module import/export found in shipped JS.');
/* vm.Script 按「脚本」而非「模块」解析，所以顶层 await 会直接在这里报语法错误；
   这比正则更可靠，也顺带证明两个文件都能作为经典脚本被解析。 */
for (const [name, src] of [['app.js', appJs], ['platform.js', platformJs]]) {
  try { new vm.Script(src, { filename: name }); } catch (e) { fail(name + ' cannot parse as a classic script: ' + e.message); }
}
if (!/^\(function \(\) \{/m.test(appJs) || !/\}\)\(\);\s*$/.test(appJs)) {
  fail('app.js must be wrapped in an IIFE so a classic script leaks no globals.');
}

/* ---------- 禁用能力扫描（device-capabilities.md §6） ---------- */
const banned = [
  [/fetch\s*\(/, 'fetch()'],
  [/XMLHttpRequest/, 'XMLHttpRequest'],
  [/new\s+WebSocket\s*\(/, 'WebSocket'],
  [/new\s+EventSource\s*\(/, 'EventSource'],
  [/RTCPeerConnection/, 'WebRTC'],
  [/navigator\.geolocation/, 'navigator.geolocation'],
  [/navigator\.clipboard/, 'navigator.clipboard'],
  [/execCommand/, 'document.execCommand'],
  [/navigator\.(bluetooth|usb|hid|serial)\b/, 'hardware connection APIs'],
  [/navigator\.(getBattery|connection|credentials|locks)\b/, 'device/credential APIs'],
  [/enumerateDevices|getDisplayMedia/, 'media device enumeration / screen share'],
  [/navigator\.storage\.persist|navigator\.serviceWorker/, 'persistent storage / service worker'],
  [/new\s+(?:Shared)?Worker\s*\(/, 'Worker'],
  [/new\s+(?:Accelerometer|Gyroscope|Magnetometer)\s*\(/, 'sensor constructors'],
  [/Device(Motion|Orientation)Event/, 'device motion / orientation'],
  [/requestFullscreen|webkitRequestFullscreen/, 'requestFullscreen'],
  [/\beval\s*\(|new\s+Function\s*\(|WebAssembly\./, 'dynamic code execution'],
  [/window\.open\s*\(|window\.prompt\s*\(/, 'window.open / window.prompt'],
  [/location\.href\s*=|location\.assign\s*\(/, 'external navigation'],
  [/\bdownload\s*=|\.download\s*=/, 'a[download] file download'],
  [/target=["']_blank/, 'target="_blank"'],
  [/navigator\.share\b|navigator\.canShare\b/, 'Web Share API (use the platform share API)'],
  [/localStorage\.setItem|sessionStorage\.setItem|indexedDB\.open|caches\./, 'browser storage writes'],
];
for (const [re, label] of banned) {
  if (re.test(js)) fail('Forbidden capability in shipped JS: ' + label);
}
/* 一次性迁移允许只读旧浏览器存储，但不得再写 */
if (!/localStorage\.getItem/.test(platformJs)) {
  fail('The one-time localStorage migration read is missing.');
}

/* ---------- 端能力必须走适配层 ---------- */
for (const api of ['saveImageToPhotosAlbum', 'writeTempFile', 'postNote', 'share', 'getStorage', 'setStorage', 'getWindowInfo']) {
  if (!platformJs.includes(api)) fail('platform.js must bridge the documented container API: ' + api);
}
if (!/window\.xhs/.test(platformJs)) fail('platform.js must read the injected window.xhs namespace.');

/* ---------- CSS：Chrome 61 基线不得作为唯一实现 ---------- */
const cssOnly = [
  [/\baspect-ratio\s*:/, 'aspect-ratio must not be the only sizing path (Chrome 88)'],
  [/\binset\s*:/, 'inset shorthand is Chrome 87; use physical offsets'],
  [/overflow\s*:\s*clip/, 'overflow: clip is Chrome 90; use hidden'],
  [/\bdvh\b|\bsvh\b|\blvh\b/, 'dynamic viewport units are Chrome 108; use vh + --app-height'],
  [/\bmargin-inline\b|\bpadding-inline\b|\bpadding-block\b/, 'logical shorthands need physical fallbacks'],
  [/repeating-conic-gradient/, 'conic gradients are Chrome 69'],
];
for (const [re, why] of cssOnly) if (re.test(css)) fail('CSS compatibility: ' + why);
if (!/grid-gap/.test(css)) fail('Grid spacing must also declare grid-gap for Chrome 61.');
if (!/no-flexgap/.test(css)) fail('Flex gap needs a margin-based Chrome 61 fallback.');
if (!/var\(--safe-area-inset-/.test(css)) fail('Safe areas must prefer the container variable over env().');
if (!/prefers-reduced-motion:\s*reduce/.test(css)) fail('Missing prefers-reduced-motion support.');
if (css.length < 10000) fail('Stylesheet appears incomplete.');

/* ---------- 素材：52 张 WEBP 存在且接入界面 ---------- */
const dirs = ['scenes', 'characters', 'defendants', 'props', 'decor'];
const expected = { scenes: 6, characters: 6, defendants: 16, props: 16, decor: 8 };
let total = 0;
let count = 0;
for (const dir of dirs) {
  const files = (await readdir(new URL('assets/' + dir + '/', root))).filter(f => f.endsWith('.webp'));
  if (files.length !== expected[dir]) fail(`assets/${dir} should hold ${expected[dir]} webp files, found ${files.length}`);
  for (const f of files) {
    const bytes = await readFile(new URL(`assets/${dir}/${f}`, root));
    const isWebp = bytes.length > 500
      && String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === 'RIFF'
      && String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]) === 'WEBP';
    if (!isWebp) fail('Missing or invalid WEBP asset: assets/' + dir + '/' + f);
    const rel = `${dir}/${f}`;
    if (!js.includes(rel) && !css.includes(rel)) fail('Asset not connected to UI: ' + rel);
    total += bytes.length;
    count++;
  }
}
if (count !== 52) fail('Expected 52 assets, saw ' + count);

/* 装饰件不得被当作可拉伸的 UI 表面 */
if (/url\(["']?\.\/assets\/(scenes|props)[^)]*100%\s*100%/.test(css)) {
  fail('Scene/prop artwork must crop or slice, never stretch to 100% 100%.');
}

process.stdout.write(
  `Validation passed: ${count} WEBP assets present and connected (${(total / 1024 / 1024).toFixed(2)} MiB source), ` +
  `entry is a classic-script offline H5 with no forbidden container capabilities.\n`
);
