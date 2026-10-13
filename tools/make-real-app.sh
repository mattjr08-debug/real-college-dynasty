#!/bin/zsh
# Builds "Real College Dynasty.app" (Electron, the same shell as the College Dynasty desktop app) and puts it on the Desktop.
set -e
export PATH="$HOME/.local/bin:/usr/local/bin:$PATH"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_SHELL="$HOME/Documents/College-Dynasty/desktop"
cd "$ROOT"
echo "1/6 Building the game ..."; node tools/build.js | tail -1
echo "2/6 Copying the app shell ..."
mkdir -p desktop && rsync -a --exclude game "$SRC_SHELL/" desktop/
mkdir -p desktop/game && cp dist/College-Dynasty-V1.html desktop/game/index.html
# player photos (supplied by the user) sit in a "photos" folder next to the game file
if [ -d realdata/photos-128 ]; then rm -rf desktop/game/photos; cp -R realdata/photos-128 desktop/game/photos; rm -rf dist/photos; cp -R realdata/photos-128 dist/photos; fi
echo "3/6 Making the basketball icon ..."
ICON_SVG="$ROOT/data/app-icon.svg"; TMP="$(mktemp -d)"
qlmanage -t -s 1024 -o "$TMP" "$ICON_SVG" >/dev/null 2>&1
BASE="$TMP/app-icon.svg.png"; [ -f "$BASE" ] || { echo "icon render failed"; exit 1; }
IS="$TMP/AppIcon.iconset"; mkdir -p "$IS"
for s in 16 32 128 256 512; do
  sips -z $s $s "$BASE" --out "$IS/icon_${s}x${s}.png" >/dev/null
  sips -z $((s*2)) $((s*2)) "$BASE" --out "$IS/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns "$IS" -o desktop/icon.icns
echo "4/6 Naming the app ..."
cd desktop
sed -i '' 's/"name": "college-dynasty"/"name": "real-college-dynasty"/; s/"productName": "College Dynasty"/"productName": "Real College Dynasty"/; s/"version": "13.0.0"/"version": "1.0.0"/' package.json
sed -i '' "s/title: 'College Dynasty'/title: 'Real College Dynasty'/; s/app.setName('College Dynasty')/app.setName('Real College Dynasty')/" main.js
echo "5/6 Packaging (this takes a minute) ..."
npx electron-packager . "Real College Dynasty" --platform=darwin --arch=arm64 --out="$ROOT/dist-app" --overwrite \
  --icon=icon.icns --app-version="1.0.0" --ignore="icon\.(html|png)$" >/dev/null
APP="$ROOT/dist-app/Real College Dynasty-darwin-arm64/Real College Dynasty.app"
codesign --force --deep --sign - "$APP" >/dev/null 2>&1 || true
echo "6/6 Putting it on the Desktop ..."
rm -rf "$HOME/Desktop/Real College Dynasty.app"; ditto "$APP" "$HOME/Desktop/Real College Dynasty.app"
echo "DONE: $HOME/Desktop/Real College Dynasty.app"
