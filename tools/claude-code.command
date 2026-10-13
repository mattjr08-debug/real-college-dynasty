#!/bin/zsh
export PATH="$HOME/.local/bin:/usr/local/bin:$PATH"
cd "$HOME/Documents/College-Dynasty" || { echo "Project folder not found"; read -k1; exit 1; }
echo "Starting Claude Code in $(pwd) ..."
exec claude
