import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const inlineScript = Array.from(html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g))[0]?.[1] || '';
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
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /viewport[^>]+viewport-fit=cover/);
  assert.match(html, /id="app"/);
});

test('main application script parses without executing browser side effects', () => {
  assert.ok(inlineScript.length > 1000);
  assert.doesNotThrow(() => new vm.Script(inlineScript));
});

test('generated local artwork is valid JPEG and remote resources are not referenced', async () => {
  for (const path of artwork) {
    const bytes = await readFile(new URL('../' + path, import.meta.url));
    assert.ok(bytes.length > 500, path + ' should not be empty');
    assert.deepEqual(Array.from(bytes.subarray(0, 3)), [0xff, 0xd8, 0xff], path + ' should be a JPEG');
  }
  assert.doesNotMatch(html, /(?:src|href)=["']https?:\/\//i);
});

test('key user journeys are wired to explicit actions', () => {
  for (const action of ['home', 'trial', 'archive', 'gallery', 'next', 'verdict', 'poster', 'copy', 'appeal']) {
    assert.ok(html.includes('data-action="' + action + '"') || inlineScript.includes("'" + action + "'"), 'missing action: ' + action);
  }
});

test('the experience includes responsive and reduced-motion treatments', () => {
  assert.match(html, /@media\s*\(max-width:\s*640px\)/);
  assert.match(html, /prefers-reduced-motion:\s*reduce/);
});

test('history uses a namespaced local storage key and is bounded', () => {
  assert.match(inlineScript, /wanniu-court-github-v1/);
  assert.match(inlineScript, /slice\(0,\s*80\)/);
});
