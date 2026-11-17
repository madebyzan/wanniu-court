import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.indexOf('</script>', scriptStart + 8);
const inlineScript = scriptStart >= 0 && scriptEnd > scriptStart ? html.slice(scriptStart + 8, scriptEnd) : '';
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

test('document declares Chinese language and a mobile-safe viewport', () => {
  assert.ok(html.includes('<html lang="zh-CN">'));
  assert.ok(html.includes('viewport-fit=cover'));
  assert.ok(html.includes('id="app"'));
});

test('main application script parses without executing browser side effects', () => {
  assert.ok(inlineScript.length > 1000);
  assert.doesNotThrow(() => new vm.Script(inlineScript));
});

test('generated artwork is valid local JPEG and remote assets are not referenced', async () => {
  for (const path of artwork) {
    const bytes = await readFile(new URL('../' + path, import.meta.url));
    assert.ok(bytes.length > 500, path + ' should not be empty');
    assert.deepEqual(Array.from(bytes.subarray(0, 3)), [0xff, 0xd8, 0xff], path + ' should be a JPEG');
  }
  for (const remotePrefix of ['src="https:', "src='https:", 'href="https:', "href='https:"]) {
    assert.equal(html.includes(remotePrefix), false);
  }
});

test('key user journeys are wired to explicit actions', () => {
  for (const action of ['home', 'trial', 'archive', 'gallery', 'next', 'verdict', 'poster', 'copy', 'appeal']) {
    assert.ok(html.includes('data-action="' + action + '"') || inlineScript.includes("'" + action + "'"), 'missing action: ' + action);
  }
});

test('the experience includes responsive and reduced-motion treatments', () => {
  assert.ok(html.includes('max-width:640px'));
  assert.ok(html.includes('prefers-reduced-motion:reduce'));
});

test('history uses a namespaced local storage key and is bounded', () => {
  assert.ok(inlineScript.includes('wanniu-court-github-v1'));
  assert.ok(inlineScript.includes('slice(0,80)'));
});
