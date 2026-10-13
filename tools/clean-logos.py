"""Removes the white box around the supplied logo images: near-white pixels connected to the image edge become transparent (white inside the artwork stays).
Reads realdata/logos-src/*.png|gif, writes realdata/logos-96/<name>.png (112 px). Run: python3 -I tools/clean-logos.py"""
import os, sys
from collections import deque
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, OUT = os.path.join(ROOT, 'realdata/logos-src'), os.path.join(ROOT, 'realdata/logos-96')
W = 224      # work size
TH = 228     # a pixel counts as "background white" when its darkest channel is at least this
changed = 0
for f in sorted(os.listdir(SRC)):
    if not f.lower().endswith(('.png', '.gif')):
        continue
    im = Image.open(os.path.join(SRC, f)).convert('RGBA')
    im.thumbnail((W, W), Image.LANCZOS)
    w, h = im.size
    px = im.load()
    def bg(x, y):
        r, g, b, a = px[x, y]
        return a < 24 or min(r, g, b) >= TH
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if bg(x, y) and not seen[y * w + x]: seen[y * w + x] = 1; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if bg(x, y) and not seen[y * w + x]: seen[y * w + x] = 1; q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and bg(nx, ny):
                seen[ny * w + nx] = 1; q.append((nx, ny))
    n = sum(seen)
    was_opaque_box = n > 0 and any(px[x, 0][3] > 200 and min(px[x, 0][:3]) >= TH for x in range(w))
    for y in range(h):
        for x in range(w):
            if seen[y * w + x]:
                px[x, y] = (255, 255, 255, 0)
    # soften the white fringe left on the edge of the artwork
    for y in range(h):
        for x in range(w):
            if seen[y * w + x]: continue
            r, g, b, a = px[x, y]
            m = min(r, g, b)
            if m < 190 or a == 0: continue
            near = False
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and seen[ny * w + nx]: near = True; break
            if near:
                px[x, y] = (r, g, b, int(a * max(0.0, min(1.0, (255 - m) / 65.0))))
    if was_opaque_box: changed += 1
    im.thumbnail((112, 112), Image.LANCZOS)
    im.save(os.path.join(OUT, os.path.splitext(f)[0] + '.png'), optimize=True)
print('processed; logos that had a white box:', changed)
