#!/bin/zsh
# Builds and installs "Edit My Game.app" (Electron, Apple silicon).   Usage: tools/make-edit-app.sh [--install]
set -e
export PATH="$HOME/.local/bin:/usr/local/bin:$PATH"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; cd "$ROOT/edit-my-game"
cp ../claude-console/lib.js lib.js
[ -f icon.icns ] || { echo "Making the icon ..."; rm -rf icon.iconset; mkdir icon.iconset
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --default-background-color=00000000 --screenshot="$PWD/icon-1024.png" --window-size=1024,1024 "file://$PWD/icon.html" >/dev/null 2>&1
  for s in 16 32 128 256 512; do sips -z $s $s icon-1024.png --out icon.iconset/icon_${s}x${s}.png >/dev/null; sips -z $((s*2)) $((s*2)) icon-1024.png --out icon.iconset/icon_${s}x${s}@2x.png >/dev/null; done
  iconutil -c icns icon.iconset -o icon.icns; rm -rf icon.iconset; }
[ -d node_modules/electron ] || npm install --save-dev electron @electron/packager >/dev/null 2>&1
# The installed app is a thin launcher that loads edit-my-game/main.js from the project folder. It is only rebuilt when the launcher itself changes,
# so the macOS permissions you gave it keep working. After a code change you only need to quit and reopen Edit My Game.
LDIR="$ROOT/edit-my-game-launcher"; cp "$PWD/icon.icns" "$LDIR/icon.icns" 2>/dev/null || true
HASH=$(cat "$LDIR/package.json" "$LDIR/stub.js" "$LDIR/icon.icns" | shasum | cut -c1-12)
if [ -f "/Applications/Edit My Game.app/Contents/Resources/launcher-$HASH" ] && [ "$1" = "--install" ] && [ "$2" != "--force" ]; then echo "Installed app is already the current launcher (launcher-$HASH). Code changes load from the project folder: quit and reopen Edit My Game."; exit 0; fi
EV=$(node -p "require('./node_modules/electron/package.json').version")
npx electron-packager "$LDIR" "Edit My Game" --platform=darwin --arch=arm64 --electron-version="$EV" --out="$ROOT/dist-app" --overwrite --icon="$LDIR/icon.icns" --app-version=2.0.0 >/dev/null 2>&1
APP="$ROOT/dist-app/Edit My Game-darwin-arm64/Edit My Game.app"
touch "$APP/Contents/Resources/launcher-$HASH"
codesign --force --deep --sign - "$APP" >/dev/null 2>&1 || true
echo "Built: $APP"
if [ "$1" = "--install" ]; then rm -rf "/Applications/Edit My Game.app"; ditto "$APP" "/Applications/Edit My Game.app"; echo "Installed: /Applications/Edit My Game.app"; fi
