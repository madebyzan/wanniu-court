/* 组装小工具交付目录 dist/：入口 + 经典脚本 + 按显示尺寸重导出的图片。
   仓库里的 assets/ 是设计原图，不进包。 */
import { copyFile, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/* 本脚本在 scripts/ 下，'../' 已解析到项目根，不要再 dirname 一次 */
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');

const textFiles = ['index.html', 'styles.css', 'platform.js', 'app.js'];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const name of textFiles) {
  await copyFile(join(root, name), join(dist, name));
}

/* 图片：优先用随包脚本重导出；没有 Python/PIL 时退回复制原图并给出警告。 */
let imageNote = '';
try {
  execFileSync('python3', [join(root, 'scripts', 'prepare-assets.py'), join(root, 'assets'), join(dist, 'assets')], { stdio: 'pipe' });
  imageNote = 'rescaled';
} catch (error) {
  const src = join(root, 'assets');
  for (const dir of await readdir(src)) {
    const files = (await readdir(join(src, dir))).filter(f => f.endsWith('.webp'));
    await mkdir(join(dist, 'assets', dir), { recursive: true });
    for (const f of files) await copyFile(join(src, dir, f), join(dist, 'assets', dir, f));
  }
  imageNote = 'COPIED AT SOURCE SIZE (python3+PIL unavailable) - zip may exceed the 10 MiB cap';
}

/* macOS 会在被打开过的目录里生成 .DS_Store，交付前一律清掉 */
const scrub = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await scrub(p);
    else if (entry.name === '.DS_Store' || /\.map$/.test(entry.name)) await rm(p);
  }
};
await scrub(dist);

/* 交付目录里不允许出现的东西，直接在这里挡掉 */
const banned = ['node_modules', '.git', '.DS_Store', 'package.json', 'README.md'];
const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    out.push(...(entry.isDirectory() ? await walk(p) : [p]));
  }
  return out;
};
const files = await walk(dist);
const offenders = files.filter(p => {
  const rel = relative(dist, p);
  return banned.some(b => rel === b || rel.split('/').includes(b)) || /\.map$/.test(rel);
});
if (offenders.length) throw new Error('Delivery dir must not contain: ' + offenders.map(p => relative(dist, p)).join(', '));

const entryStat = await stat(join(dist, 'index.html'));
if (!entryStat.isFile()) throw new Error('index.html missing from the delivery root');

let unpacked = 0;
for (const p of files) unpacked += (await stat(p)).size;

/* 打包：必须先进入 dist 再压缩“目录内容”。压缩目录本身会多套一层，
   解压后 index.html 不在根，容器直接加载失败。 */
const zipPath = join(root, 'wanniu-court-minitool.zip');
if (await stat(zipPath).catch(() => null)) await rm(zipPath);
const zipped = spawnSync('zip', ['-q', '-r', '-X', zipPath, '.', '-x', '*.DS_Store'], { cwd: dist, encoding: 'utf8' });
if (zipped.status !== 0) throw new Error('zip failed: ' + (zipped.stderr || 'exit ' + zipped.status));
const zipStat = await stat(zipPath);

const MiB = (n) => (n / 1024 / 1024).toFixed(2) + ' MiB';
process.stdout.write(
  `dist/  ${files.length} files, index.html at root, images ${imageNote}, unpacked ${MiB(unpacked)}\n` +
  `zip    ${MiB(zipStat.size)}  (hard cap 10 MiB, advisory 2 MiB)\n`
);
if (zipStat.size > 10 * 1024 * 1024) throw new Error('zip exceeds the 10 MiB hard cap');
