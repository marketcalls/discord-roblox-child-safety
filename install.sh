#!/usr/bin/env bash
# Install the Discord & Roblox child-safety skills into your AI tools.
#   ./install.sh                 interactive
#   ./install.sh --claude-code   copy skills to ~/.claude/skills/
#   ./install.sh --codex         copy skills to ~/.codex/skills/  (Codex versions with skills support)
#   ./install.sh --zip           make dist/<skill>.zip for Claude Desktop / claude.ai upload
#   ./install.sh --all
set -euo pipefail
cd "$(dirname "$0")"
SKILLS_DIR=".claude/skills"
SKILLS=$(ls "$SKILLS_DIR")

copy_to() {
  local dest="$1"; mkdir -p "$dest"
  for s in $SKILLS; do rm -rf "${dest:?}/$s"; cp -R "$SKILLS_DIR/$s" "$dest/$s"; done
  echo "Installed $(echo $SKILLS | wc -w | tr -d ' ') skills to $dest"
}

make_zips() {
  mkdir -p dist
  for s in $SKILLS; do (cd "$SKILLS_DIR" && rm -f "../../dist/$s.zip" && zip -qr "../../dist/$s.zip" "$s"); done
  echo "Created zips in dist/ — upload them in Claude Desktop or claude.ai: Settings → Capabilities → Skills"
}

case "${1:-}" in
  --claude-code) copy_to "$HOME/.claude/skills" ;;
  --codex)       copy_to "$HOME/.codex/skills" ;;
  --zip)         make_zips ;;
  --all)         copy_to "$HOME/.claude/skills"; copy_to "$HOME/.codex/skills"; make_zips ;;
  "")
    echo "Where should the skills go?"
    echo "  1) Claude Code (~/.claude/skills)"
    echo "  2) OpenAI Codex (~/.codex/skills)"
    echo "  3) Zips for Claude Desktop / claude.ai"
    echo "  4) All of the above"
    echo "  (Cursor and Antigravity: just open this folder — nothing to install)"
    read -r -p "Choose 1-4: " c
    case "$c" in 1) copy_to "$HOME/.claude/skills" ;; 2) copy_to "$HOME/.codex/skills" ;; 3) make_zips ;; 4) copy_to "$HOME/.claude/skills"; copy_to "$HOME/.codex/skills"; make_zips ;; *) echo "Nothing done." ;; esac ;;
  *) echo "Unknown option: $1"; exit 1 ;;
esac
