import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const appJs = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

if (!html.includes('<html lang="zh-CN">')) {
  throw new Error('The document must declare zh-CN as its language.');
}
if (!html.includes('href="./styles.css"')) {
  throw new Error('The stylesheet must be loaded from a local file.');
}
if (!html.includes('src="./app.js"')) {
  throw new Error('The app module must be loaded from a local file.');
}
if (html.includes('<script>')) {
  throw new Error('The application must not be inlined in index.html.');
}

new vm.Script(appJs, { filename: 'app.js' });
if (css.length < 5000) {
  throw new Error('The visual system stylesheet appears incomplete.');
}

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

const remotePrefixes = ['src="https:', "src='https:", 'href="https:', "href='https:"];
if (remotePrefixes.some(prefix => html.includes(prefix) || appJs.includes(prefix))) {
  throw new Error('Remote resources are not allowed in the mini-tool package.');
}

process.stdout.write('Application validation passed. App module parsed; local stylesheet and 11 generated JPEG assets checked.\\n');
