import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

if (!html.includes('<html lang="zh-CN">')) {
  throw new Error('The document must declare zh-CN as its language.');
}

const scriptStart = html.indexOf('<script>');
const scriptEnd = html.indexOf('</script>', scriptStart + 8);
if (scriptStart < 0 || scriptEnd < 0 || html.indexOf('<script>', scriptStart + 1) >= 0) {
  throw new Error('Expected exactly one application script.');
}

const inlineScript = html.slice(scriptStart + 8, scriptEnd);
new vm.Script(inlineScript, { filename: 'index.inline.js' });

const artwork = [
  'assets/hero-court.jpg',
  'assets/judge-cat.jpg',
  'assets/judge-frog.jpg',
  'assets/archive-cat.jpg',
  'assets/evidence-objects.jpg',
  'assets/categories/work.jpg',
  'assets/categories/life.jpg',
  'assets/categories/social.jpg',
  'assets/categories/digital.jpg',
  'assets/categories/self.jpg',
  'assets/categories/campus.jpg'
];

for (const path of artwork) {
  const bytes = await readFile(new URL('../' + path, import.meta.url));
  const isJpeg = bytes.length > 500 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (!isJpeg) throw new Error('Missing or invalid generated artwork: ' + path);
}

const hasRemoteAsset = ['src="https:', "src='https:", 'href="https:', "href='https:"].some(ref => html.includes(ref));
if (hasRemoteAsset) throw new Error('Remote resources are not allowed in the mini-tool package.');

process.stdout.write('Application validation passed. Inline JS parsed; 11 local JPEG assets checked.\\n');
