#!/bin/zsh
# Runs one Claude Code task non-interactively inside this project.
# Usage: tools/run-claude-task.sh tools/prompts/<task>.txt [extra claude options, for example --model claude-sonnet-5-5 --session-id <uuid> or --resume <uuid>]
# It may edit files and run npm/node and read-only git commands. It may commit, but NOT push.
export PATH="$HOME/.local/bin:/usr/local/bin:$PATH"
cd "$(dirname "$0")/.." || exit 1
PROMPT="$1"; shift
claude -p "$(cat "$PROMPT")" \
  --permission-mode acceptEdits \
  --allowedTools "Read" "Edit" "Write" "Glob" "Grep" \
    "Bash(npm:*)" "Bash(node:*)" "Bash(npx:*)" \
    "Bash(git add:*)" "Bash(git commit:*)" "Bash(git status:*)" "Bash(git diff:*)" "Bash(git log:*)" \
    "Bash(ls:*)" "Bash(cat:*)" "Bash(mkdir:*)" "Bash(sleep:*)" "Bash(wait:*)" \
  --output-format text "$@" < /dev/null

