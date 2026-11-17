import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const appJs = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
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

test('document uses Chinese language and local application modules', () => {
  assert.ok(html.includes('<html lang="zh-CN">'));
  assert.ok(html.includes('viewport-fit=cover'));
  assert.ok(html.includes('href="./styles.css"'));
  assert.ok(html.includes('src="./app.js"'));
  assert.equal(html.includes('<script>'), false);
});

test('application module parses without executing browser side effects', () => {
  assert.ok(appJs.length > 10000);
  assert.doesNotThrow(() => new vm.Script(appJs));
});

test('visual system is an independently loaded, substantial stylesheet', () => {
  assert.ok(css.length > 5000);
  assert.ok(css.includes('prefers-reduced-motion:reduce'));
  assert.ok(css.includes('max-width:640px'));
});

test('generated artwork is valid local JPEG and remote assets are not referenced', async () => {
  for (const path of artwork) {
    const bytes = await readFile(new URL('../' + path, import.meta.url));
    assert.ok(bytes.length > 500, path + ' should not be empty');
    assert.deepEqual(Array.from(bytes.subarray(0, 3)), [0xff, 0xd8, 0xff], path + ' should be a JPEG');
  }
  for (const remotePrefix of ['src="https:', "src='https:", 'href="https:', "href='https:"]) {
    assert.equal(html.includes(remotePrefix) || appJs.includes(remotePrefix), false);
  }
});

test('key user journeys are wired to explicit actions', () => {
  for (const action of ['home', 'trial', 'archive', 'gallery', 'next', 'verdict', 'poster', 'copy', 'appeal']) {
    assert.ok(html.includes('data-action="' + action + '"') || appJs.includes("'" + action + "'"), 'missing action: ' + action);
  }
});

test('history uses a namespaced local storage key and is bounded', () => {
  assert.ok(appJs.includes('wanniu-court-github-v1'));
  assert.ok(appJs.includes('slice(0,80)'));
});
