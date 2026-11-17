import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const scripts = Array.from(html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g));

if (!html.includes('<html lang="zh-CN">')) {
  throw new Error('The document must declare zh-CN as its language.');
}

if (scripts.length !== 1) {
  throw new Error('Expected exactly one application script.');
}

new vm.Script(scripts[0][1], { filename: 'index.inline.js' });

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
  if (!isJpeg) {
    throw new Error('Missing, invalid or unexpectedly small generated artwork: ' + path);
  }
}

const remoteReferences = html.match(/(?:src|href)\\s*=\\s*["']https?:\\/\\//g) || [];
if (remoteReferences.length) {
  throw new Error('Remote resources are not allowed in the mini-tool package.');
}

process.stdout.write('Application validation passed. Inline JS parsed; 11 local JPEG assets and no-remote-resource rules checked.\\n');
