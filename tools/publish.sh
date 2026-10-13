#!/bin/zsh
# Commits everything that changed, checks the game still works, then pushes to GitHub.
# Usage: tools/publish.sh ["commit message"]        Exit codes: 0 ok, 2 tests failed (nothing pushed), 3 push failed, 4 no GitHub connection
# Set PUBLISH_TEST_CMD to change the check (default: npm test, which rebuilds the game and runs the smoke test).
export PATH="$HOME/.local/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"
cd "$(dirname "$0")/.." || exit 1
MSG="${1:-Update from Claude Code}"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

git add -A
if ! git diff --cached --quiet; then git commit -q -m "$MSG" && echo "Committed: $(git log --oneline -1)"; else echo "No new changes to commit."; fi

if ! git remote get-url origin >/dev/null 2>&1; then echo "NOT PUSHED: this project has no GitHub connection (no origin)."; exit 4; fi

echo "Checking the game before anything leaves this Mac ..."
if ! eval "${PUBLISH_TEST_CMD:-npm test}" > /tmp/publish-check.log 2>&1; then
  echo "NOT PUSHED: the check failed, so the changes stay on this Mac only. Last lines of the check:"; tail -6 /tmp/publish-check.log; exit 2
fi
echo "Check passed."

AHEAD="$(git rev-list --count "origin/$BRANCH..HEAD" 2>/dev/null || git rev-list --count HEAD)"
if [ "$AHEAD" = "0" ]; then echo "Nothing to push: GitHub is already up to date."; exit 0; fi
if git push -q -u origin "$BRANCH" 2>/tmp/publish-push.log; then
  echo "PUSHED $AHEAD commit(s) to GitHub. Latest: $(git log --oneline -1)"
else
  echo "NOT PUSHED: the push failed (offline, or not signed in to GitHub):"; tail -3 /tmp/publish-push.log; exit 3
fi
