#!/bin/zsh
# Publishes ONLY the built game to a separate PUBLIC GitHub repository served by GitHub Pages, so it opens on a phone.
# Usage: tools/publish-web.sh        Exit codes: 0 ok, 5 refused (private info found in the game file), 6 publish failed
# Anything in web-extras/ (manifest, service worker, icons) is copied next to the game file.
export PATH="$HOME/.local/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"
cd "$(dirname "$0")/.." || exit 1
ROOT="$PWD"; REPO="${WEB_REPO:-college-dynasty-play}"
OWNER="$(gh api user --jq .login)"; UID_="$(gh api user --jq .id)" || { echo "NOT PUBLISHED: not signed in to GitHub."; exit 6; }
URL="https://$OWNER.github.io/$REPO/"

node tools/build.js >/dev/null || { echo "NOT PUBLISHED: the game did not build."; exit 6; }
GAME="$(ls dist/College-Dynasty-V*.html | tail -1)"

# Safety: this goes on the public internet. Refuse if the file contains anything personal.
if grep -qE "/Users/|@icloud|mattjr08|gh[opsu]_[A-Za-z0-9]{20,}|sk-ant-" "$GAME"; then echo "NOT PUBLISHED: the game file contains something that looks private. Nothing was uploaded."; exit 5; fi

WEB="$ROOT/web-publish"; mkdir -p "$WEB"; cd "$WEB"
[ -d .git ] || git init -q -b main
git config user.name "Matthew Jackson"; git config user.email "${UID_}+${OWNER}@users.noreply.github.com"   # private GitHub address, not your iCloud email
cp "$ROOT/$GAME" index.html; touch .nojekyll
cp "$ROOT/dist/build.json" build.json   # lets phones notice a newer version (item 52)
[ -d "$ROOT/web-extras" ] && cp -R "$ROOT/web-extras/." . 
cat > README.md <<EOF
# College Dynasty (web build)
Play it here: $URL

On a phone: open the link, then use Share (iPhone) or the menu (Android) and choose Add to Home Screen.
Your career is saved inside your own browser, not on any server.
EOF
git add -A
if git diff --cached --quiet; then echo "No change to the game since the last publish."; else git commit -q -m "Update the game ($(basename "$GAME" .html))"; fi

if ! git remote get-url origin >/dev/null 2>&1; then
  if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then git remote add origin "https://github.com/$OWNER/$REPO.git"; git fetch -q origin 2>/dev/null; git push -q -u origin main --force-with-lease 2>/dev/null || git push -q -u origin main
  else gh repo create "$OWNER/$REPO" --public --source=. --remote=origin --push --description "College Dynasty: play in a browser or on a phone" >/dev/null 2>/tmp/webpub.log || { echo "NOT PUBLISHED: could not create the web repository:"; tail -3 /tmp/webpub.log; exit 6; }
  fi
else git push -q origin main 2>/tmp/webpub.log || { echo "NOT PUBLISHED: push failed:"; tail -3 /tmp/webpub.log; exit 6; }
fi
gh api -X POST "repos/$OWNER/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 || true

echo "Waiting for the website to update ..."
WANT="$(wc -c < index.html | tr -d ' ')"
for i in $(seq 1 30); do
  GOT="$(curl -s "$URL" -o /dev/null -w '%{size_download}' 2>/dev/null)"; CODE="$(curl -s -o /dev/null -w '%{http_code}' "$URL" 2>/dev/null)"
  if [ "$CODE" = "200" ] && [ "$GOT" = "$WANT" ]; then echo "PUBLISHED: $URL"; exit 0; fi; sleep 6
done
echo "PUBLISHED (the page can take a few more minutes to appear): $URL"
