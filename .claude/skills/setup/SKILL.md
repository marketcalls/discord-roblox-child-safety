---
name: setup
description: One-time setup for the Discord/Roblox child-safety skills — checks prerequisites (Chrome, Python 3.9+, an AI agent with browser control or the parent-run fallback), explains and configures browser permissions (Claude in Chrome extension site access, Chrome DevTools remote debugging, Playwright extension, Antigravity browser, Chrome "automatic downloads" for discord.com), warns about DNS filters, and installs the skills into Claude Code, Claude Desktop, Codex, Cursor or Antigravity. Use when someone installs this repo, asks "what do I need", "how do I connect my browser", "why can't the AI see Discord", or a download/image keeps failing.
---

# Setup

Walk the adult through only what their tool needs. Details per tool: `child-safety-expert/rules/tool-adapters.md`; permissions: `child-safety-expert/rules/browser-permissions.md`.

## 1. Prerequisites checklist
- A computer with **Google Chrome** (or Chromium/Edge/Brave) — Discord's web app at discord.com.
- **Python 3.9+** for the analyzer (`python3 --version`). No extra packages.
- The **parent can log in** to the child's Discord account (they know the password or can do the 2FA). The AI never logs in for them.
- One of:
  - an AI agent that can run JavaScript in the parent's Chrome tab (agent-driven mode), or
  - nothing extra: the parent pastes the export script into Chrome's Console (parent-run mode). Works with every AI tool, including ones without browser control.
- About 30–60 minutes for a heavy user; the tab must stay open and visible.

## 2. Browser permissions to grant (agent-driven mode)
- **Claude in Chrome** (Claude Code, Claude Desktop): install the extension, sign in with the same Claude account, allow it on `discord.com`. If tools say "not connected", restart Chrome.
- **Chrome DevTools MCP** (Codex, Cursor, others): start a separate Chrome profile with remote debugging, have the parent log in to Discord there, and point the MCP at it (exact commands in `tool-adapters.md`). Close it when done — a debugging port gives full control of that profile.
- **Playwright MCP** (extension mode) or **Antigravity's browser**: the parent logs in inside the browser window the agent controls.
- **Downloads:** Chrome → Settings → Privacy and security → Site settings → Additional permissions → Automatic downloads → *Allowed to automatically download multiple files* → add `[*.]discord.com`. Otherwise only the first download per tab works.
- **Filters:** NextDNS / Pi-hole / school or router filters may block `media.discordapp.net` (images) — pause them during the review or rely on the CDN fallback.

## 3. Install the skills
Run `./install.sh` from the repo root and pick the targets, or copy manually:
- Claude Code: `.claude/skills/*` → `~/.claude/skills/` (or keep them in this project folder).
- Claude Desktop / claude.ai: `./install.sh --zip` creates one zip per skill → Settings → Capabilities → Skills → Upload.
- Codex: copy skills to `~/.codex/skills/` (if your version supports skills) — `AGENTS.md` in this repo works in any case.
- Cursor: open this folder; `.cursor/rules/child-safety.mdc` and `AGENTS.md` load automatically.
- Antigravity: open this folder; `.agent/workflows/child-safety-review.md` and `AGENTS.md`/`GEMINI.md` apply.

## 4. Smoke test
Export one small DM first: `dmExport.run({ only: ['<channelId>'], since: '2026-01-01' })`, then run `analyze.py` on it and open `summary.md`. If that works, do the full export.
