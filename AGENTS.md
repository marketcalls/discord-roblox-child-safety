# AGENTS.md — Discord & Roblox child-safety review

Instructions for AI coding agents (OpenAI Codex, Cursor, Google Antigravity, Gemini, Copilot and others) working in this repository. Claude Code and Claude Desktop load the same instructions from `.claude/skills/*/SKILL.md`.

## What this repo is
Skills that help a parent or guardian (or a teacher, counsellor, doctor or psychiatrist working with the parent's consent) review a child's Discord direct messages for danger: suicide/self-harm, grooming, sexual content, sextortion, 764-style coercion, scams, harassment and leaks of identifying details — and write a clear private report.

## Non-negotiable rules
1. Only for a parent/guardian reviewing their own minor child, or a professional with that parent's consent. Decline other uses (partners, adults, other people's children).
2. Never ask for, type or store the child's password, 2FA codes or tokens. The parent logs in. Never call Discord's API with tokens.
3. Read-only: never send, react, delete, block, change settings or join servers.
4. Crisis first: recent suicidal statements, goodbye messages, sextortion, meeting/location requests from adults, or self-harm coercion → stop and tell the adult immediately with steps and helplines (`.claude/skills/child-safety-expert/rules/helplines.md`).
5. Never open, describe, save or forward suspected sexual images of minors. Record the message link and direct the adult to the official reporting channel.
6. Keep everything local. Don't upload exports or reports anywhere unless the adult explicitly asks. Never commit real family data to this repo.
7. Quote short, dated evidence. Re-check who sent what before stating it.

## Workflow
1. **Setup / permissions:** `.claude/skills/setup/SKILL.md`, `.claude/skills/child-safety-expert/rules/tool-adapters.md`.
2. **Export:** `.claude/skills/dm-export/SKILL.md` — agent-driven (run `rules/assets/console-export.js` in the parent's logged-in Discord tab through your browser tool) or parent-run (parent pastes it into Chrome DevTools Console). Output: `discord_dm_export_*.json`.
3. **Analyse:** `python3 .claude/skills/child-safety-expert/rules/assets/analyze.py <export.json> --out review --tz <IANA zone>` → `summary.md`, `flags.md`, `contacts.csv`, `attachments.csv`, `calls.csv`, `transcripts/`.
4. **Review:** follow `.claude/skills/safety-review/SKILL.md` (or `quick-check`, `contact-deep-dive`, `photo-review`). Reference material is in `.claude/skills/child-safety-expert/rules/`.
5. **Report:** `.claude/skills/child-safety-expert/rules/report-outline.md` — local file, plain language, urgent items first, helplines for the family's country.

## Tool mapping
JavaScript-in-page: Claude in Chrome `javascript_tool` · Chrome DevTools MCP `evaluate_script` · Playwright MCP `browser_evaluate` · Antigravity browser agent. Keep each call under ~40 s; start long jobs without awaiting and poll `dmExport.status()`. Details: `rules/tool-adapters.md`.
