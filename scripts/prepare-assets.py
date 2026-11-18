#!/usr/bin/env python3
"""按真实显示尺寸重导出交付用图片到 dist/assets。

仓库里的 assets/ 是设计原图，zip 里只需要“显示尺寸 × 2 DPR”的版本。
小工具硬上限是 zip 10 MiB、建议 2 MiB，原图直接打包会超限。

用法：python3 scripts/prepare-assets.py [源目录] [目标目录]
"""
import os, sys, glob
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else 'assets'
DST = sys.argv[2] if len(sys.argv) > 2 else 'dist/assets'

# 长边上限 = 该素材在界面上的最大显示尺寸 × 2（DPR），再考虑海报画布尺寸
CAPS = {
    # 场景：首页 hero / 立案横幅 / 合议室 / 卷宗横幅 / 图鉴大厅，均为整宽 358px；
    # 海报里的场景窗是 602 画布像素
    'scenes': 700,
    # 判决书纸：crest/seal 两条带按 358 宽等比裁切，源图 1086 宽
    'verdict-paper.webp': 760,
    # 被告立绘：卡片 170px、海报窗 296 画布像素
    'defendants': 380,
    # 角色：图鉴 170px、合议人员 54px
    'characters': 320,
    # 物件：图鉴 170px、海报蜡封 140 画布像素
    'props': 320,
    # 装饰：按钮面 332x110、卡片框 358 宽、丝带 252 宽、标签 186 宽、角花 93 宽
    'decor': 720,
    'btn-primary.webp': 420,
    'btn-secondary.webp': 420,
    'category-label.webp': 400,
    'divider-ornament.webp': 400,
    'page-corners.webp': 560,
    'section-banner.webp': 520,
    'deliberation-banner.webp': 560,
    'case-card-frame.webp': 720,
}
QUALITY = 70
METHOD = 5

def cap_for(rel):
    base = os.path.basename(rel)
    if base in CAPS: return CAPS[base]
    head = rel.split(os.sep)[0]
    return CAPS.get(head, 720)

total = 0
count = 0
for path in sorted(glob.glob(os.path.join(SRC, '**', '*.webp'), recursive=True)):
    rel = os.path.relpath(path, SRC)
    out = os.path.join(DST, rel)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im = Image.open(path)
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    w, h = im.size
    edge = cap_for(rel)
    scale = min(1.0, edge / max(w, h))
    if scale < 1.0:
        im = im.resize((max(1, int(round(w * scale))), max(1, int(round(h * scale)))), Image.LANCZOS)
    im.save(out, 'WEBP', quality=QUALITY, method=METHOD)
    total += os.path.getsize(out)
    count += 1
print(f'{count} images -> {DST}, total {total/1024/1024:.2f} MiB')
