#!/bin/zsh
# Builds and installs "Claude Code Console.app" (Electron, Apple silicon).   Usage: tools/make-console-app.sh [--install]
set -e
export PATH="$HOME/.local/bin:/usr/local/bin:$PATH"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; cd "$ROOT/claude-console"
[ -f icon.icns ] || { echo "Making the icon ..."; rm -rf icon.iconset; mkdir icon.iconset
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --default-background-color=00000000 --screenshot="$PWD/icon-1024.png" --window-size=1024,1024 "file://$PWD/icon.html" >/dev/null 2>&1
  for s in 16 32 128 256 512; do sips -z $s $s icon-1024.png --out icon.iconset/icon_${s}x${s}.png >/dev/null; sips -z $((s*2)) $((s*2)) icon-1024.png --out icon.iconset/icon_${s}x${s}@2x.png >/dev/null; done
  iconutil -c icns icon.iconset -o icon.icns; rm -rf icon.iconset; }
[ -d node_modules/electron ] || npm install --save-dev electron @electron/packager >/dev/null 2>&1
npx electron-packager . "Claude Code Console" --platform=darwin --arch=arm64 --out="$ROOT/dist-app" --overwrite --icon=icon.icns \
  --app-version=1.0.0 --ignore="icon\.(html|png)$" >/dev/null 2>&1
APP="$ROOT/dist-app/Claude Code Console-darwin-arm64/Claude Code Console.app"
codesign --force --deep --sign - "$APP" >/dev/null 2>&1 || true
echo "Built: $APP"
if [ "$1" = "--install" ]; then rm -rf "/Applications/Claude Code Console.app"; ditto "$APP" "/Applications/Claude Code Console.app"; echo "Installed: /Applications/Claude Code Console.app"; fi
