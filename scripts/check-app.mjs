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
for (const path of artwork) {
  const bytes = await readFile(new URL('../' + path, import.meta.url));
  const isPng = bytes.length > 500 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (!isPng) throw new Error('Missing or invalid PNG asset: ' + path);
}
if (/\\.jpe?g/.test(appJs)) throw new Error('Stale JPEG references remain in app.js.');
for (const path of artwork) if (!appJs.includes(path.slice('assets/'.length)) && !css.includes(path.slice('assets/'.length))) throw new Error('Asset not connected to UI: '+path);
process.stdout.write('Validation passed: all 52 PNG assets are present and connected.\\n');
