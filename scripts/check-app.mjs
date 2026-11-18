import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const appJs = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
if (!html.includes('<html lang="zh-CN">')) throw new Error('Document language must be zh-CN.');
if (!html.includes('href="./styles.css"')) throw new Error('Missing local stylesheet.');
if (!html.includes('src="./app.js"')) throw new Error('Missing local app module.');
if (html.includes('<script>')) throw new Error('Inline scripts are not allowed.');
new vm.Script(appJs, { filename: 'app.js' });
if (css.length < 10000 || !css.includes('prefers-reduced-motion:reduce')) throw new Error('Stylesheet appears incomplete.');
const artwork = [
  "assets/scenes/hero-court.webp",
  "assets/scenes/case-hall.webp",
  "assets/scenes/filing-hall.webp",
  "assets/scenes/deliberation-room.webp",
  "assets/scenes/archive-room.webp",
  "assets/scenes/verdict-paper.webp",
  "assets/characters/cat-lawyer.webp",
  "assets/characters/frog-clerk.webp",
  "assets/characters/hamster-archivist.webp",
  "assets/characters/hedgehog-bailiff.webp",
  "assets/characters/judge-pigeon.webp",
  "assets/characters/rabbit-witness.webp",
  "assets/defendants/alarm.webp",
  "assets/defendants/algorithm.webp",
  "assets/defendants/autoplay.webp",
  "assets/defendants/boss.webp",
  "assets/defendants/delivery.webp",
  "assets/defendants/early.webp",
  "assets/defendants/group.webp",
  "assets/defendants/meeting.webp",
  "assets/defendants/monday.webp",
  "assets/defendants/next.webp",
  "assets/defendants/overthink.webp",
  "assets/defendants/procrastination.webp",
  "assets/defendants/rain.webp",
  "assets/defendants/read.webp",
  "assets/defendants/renew.webp",
  "assets/defendants/simple-change.webp",
  "assets/props/case-folder.webp",
  "assets/props/court-column.webp",
  "assets/props/crown.webp",
  "assets/props/evidence-envelope.webp",
  "assets/props/gavel.webp",
  "assets/props/hourglass.webp",
  "assets/props/laurel-wreath.webp",
  "assets/props/magnifier.webp",
  "assets/props/pocket-watch.webp",
  "assets/props/quill.webp",
  "assets/props/royal-candlestick.webp",
  "assets/props/royal-key.webp",
  "assets/props/royal-scroll.webp",
  "assets/props/royal-seal.webp",
  "assets/props/royal-shield.webp",
  "assets/props/scales.webp",
  "assets/decor/btn-primary.webp",
  "assets/decor/btn-secondary.webp",
  "assets/decor/case-card-frame.webp",
  "assets/decor/category-label.webp",
  "assets/decor/deliberation-banner.webp",
  "assets/decor/divider-ornament.webp",
  "assets/decor/page-corners.webp",
  "assets/decor/section-banner.webp"
];
for (const path of artwork) {
  const bytes = await readFile(new URL('../' + path, import.meta.url));
  const isPng = bytes.length > 500 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (!isPng) throw new Error('Missing or invalid PNG asset: ' + path);
}
if (/\\.jpe?g/.test(appJs)) throw new Error('Stale JPEG references remain in app.js.');
for (const path of artwork) if (!appJs.includes(path.slice('assets/'.length)) && !css.includes(path.slice('assets/'.length))) throw new Error('Asset not connected to UI: '+path);
process.stdout.write('Validation passed: all 52 PNG assets are present and connected.\\n');
