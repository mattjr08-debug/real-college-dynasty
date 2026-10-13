#!/bin/zsh
# Builds the macOS desktop app "College Dynasty.app" (Electron) from the current source.
# Usage: tools/make-desktop-app.sh [--install]     (--install copies the app into /Applications)
set -e
export PATH="$HOME/.local/bin:/usr/local/bin:$PATH"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
echo "1/5 Building the game from src/ ..."
node tools/build.js | tail -1
GAME="$(ls dist/College-Dynasty-V*.html | tail -1)"
VERSION="$(echo "$GAME" | sed -E 's/.*-V([0-9]+)\.html/\1/')"
echo "2/5 Copying $GAME into the app shell ..."
mkdir -p desktop/game && cp "$GAME" desktop/game/index.html
cd desktop
echo "3/5 Installing Electron tooling (first time downloads about 100 MB) ..."
[ -d node_modules/electron ] || npm install --save-dev electron @electron/packager >/dev/null 2>&1
echo "4/5 Packaging the app ..."
npx electron-packager . "College Dynasty" --platform=darwin --arch=arm64 --out="$ROOT/dist-app" --overwrite \
  --icon=icon.icns --app-version="${VERSION}.0.0" --ignore="icon\.(html|png)$"  >/dev/null
APP="$ROOT/dist-app/College Dynasty-darwin-arm64/College Dynasty.app"
codesign --force --deep --sign - "$APP" >/dev/null 2>&1 || true
echo "5/5 Built: $APP"
if [ "$1" = "--install" ]; then
  rm -rf "/Applications/College Dynasty.app"; ditto "$APP" "/Applications/College Dynasty.app"
  echo "Installed: /Applications/College Dynasty.app"
fi
