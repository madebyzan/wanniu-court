import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const scripts = Array.from(html.matchAll(/<script>([\s\S]*?)<\/script>/g));

if (!html.includes('<html lang="zh-CN">')) {
  throw new Error('The document must declare zh-CN as its language.');
}

if (scripts.length !== 1) {
  throw new Error('Expected exactly one application script.');
}

new vm.Script(scripts[0][1], { filename: 'index.inline.js' });

const imageDataUris = Array.from(html.matchAll(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/g));
if (imageDataUris.length < 1) {
  throw new Error('Expected at least one embedded, generated image asset.');
}

for (const [, encoded] of imageDataUris) {
  if (Buffer.from(encoded, 'base64').length < 500) {
    throw new Error('An embedded image asset is unexpectedly small.');
  }
}

if (/https?:\/\//.test(html)) {
  const remoteReferences = html.match(/(?:src|href)\s*=\s*["']https?:\/\//g) || [];
  if (remoteReferences.length) {
    throw new Error('Remote resources are not allowed in the mini-tool package.');
  }
}

process.stdout.write('Application validation passed. Inline JS parsed; embedded artwork and local-only resource rules checked.\n');
