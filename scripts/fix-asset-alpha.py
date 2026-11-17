"""Remove baked white backgrounds from PNG assets that are meant to be transparent.

Usage: python3 scripts/fix-asset-alpha.py
Idempotent: already-transparent assets are skipped.
"""
from PIL import Image
import os, sys

TARGETS = [
    "assets/decor/btn-primary.png",
    "assets/props/laurel-wreath.png",
    "assets/props/royal-key.png",
]

def key_colour(px):
    """Estimate the background colour from the four corner patches."""
    samples = []
    w, h = px.size if hasattr(px, "size") else (0, 0)
    return None

def fix(path):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    corners = [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3)]
    vals = [im.getpixel(c) for c in corners]
    if all(v[3] < 20 for v in vals):
        print(f"skip  {path} (already transparent)")
        return False
    # background = brightest corner sample
    bg = max(vals, key=lambda v: v[0] + v[1] + v[2])[:3]

    pixels = im.load()
    # flood fill from the border so interior paper tones are preserved
    seen = [[False] * w for _ in range(h)]
    stack = []
    for x in range(w):
        stack += [(x, 0), (x, h - 1)]
    for y in range(h):
        stack += [(0, y), (w - 1, y)]

    def is_bg(x, y):
        r, g, b, a = pixels[x, y]
        if a == 0:
            return True
        return abs(r - bg[0]) < 26 and abs(g - bg[1]) < 26 and abs(b - bg[2]) < 34

    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h or seen[y][x]:
            continue
        seen[y][x] = True
        if not is_bg(x, y):
            continue
        r, g, b, a = pixels[x, y]
        # soft edge: fade near-background pixels instead of hard cutting
        d = max(abs(r - bg[0]), abs(g - bg[1]), abs(b - bg[2]))
        alpha = 0 if d < 14 else int(255 * min(1, (d - 14) / 12))
        pixels[x, y] = (r, g, b, min(a, alpha))
        stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]

    im.save(path, "PNG", optimize=True)
    print(f"fixed {path}")
    return True

if __name__ == "__main__":
    changed = sum(1 for t in TARGETS if os.path.exists(t) and fix(t))
    print(f"{changed} asset(s) updated")
