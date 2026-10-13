"""Packs the player photos into a few sprite sheets (for the phone/web build, where thousands of separate files are not allowed).
Order = REAL_PHOTO_LIST in src/js/0000e-RealPhotos.js (run tools/build-photos.js first). Output: realdata/sprites/photos-N.jpg and realdata/sprites/layout.json.
Run: python3 tools/build-sprites.py"""
import os, re, json, urllib.parse
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PH = os.path.join(ROOT, 'realdata/photos-128')
OUT = os.path.join(ROOT, 'realdata/sprites')
os.makedirs(OUT, exist_ok=True)
src = open(os.path.join(ROOT, 'src/js/0000e-RealPhotos.js'), encoding='utf-8').read()
lst = json.loads(re.search(r'var REAL_PHOTO_LIST = (\[.*?\]);\n', src, re.S).group(1))
CELL, COLS, ROWS = 80, 36, 34
PER = COLS * ROWS
sheets = (len(lst) + PER - 1) // PER
for s in range(sheets):
    sh = Image.new('RGB', (COLS * CELL, ROWS * CELL), (36, 37, 40))
    for k, enc in enumerate(lst[s * PER:(s + 1) * PER]):
        path = os.path.join(PH, *[urllib.parse.unquote(p) for p in enc.split('/')])
        try:
            im = Image.open(path).convert('RGB')
        except Exception:
            continue
        w, h = im.size
        side = min(w, h)
        left = (w - side) // 2
        im = im.crop((left, 0, left + side, side)).resize((CELL, CELL), Image.LANCZOS)  # square, from the top (faces)
        sh.paste(im, ((k % COLS) * CELL, (k // COLS) * CELL))
    sh.save(os.path.join(OUT, 'photos-%d.jpg' % s), quality=62, optimize=True, progressive=True)
json.dump({'cell': CELL, 'cols': COLS, 'rows': ROWS, 'per': PER, 'sheets': sheets, 'count': len(lst)}, open(os.path.join(OUT, 'layout.json'), 'w'))
print('sheets', sheets, 'photos', len(lst), [os.path.getsize(os.path.join(OUT, 'photos-%d.jpg' % s)) // 1024 for s in range(sheets)], 'KB')
