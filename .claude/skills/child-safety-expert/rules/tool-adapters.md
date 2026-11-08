# Tool adapters — running this in different AI tools

The workflow needs four abilities. If your agent has them in the parent's logged-in browser, use agent-driven mode; otherwise use parent-run mode (the parent pastes `console-export.js` into Chrome's Console) — that works with **every** AI tool because the rest is plain files + Python.

| Ability | Claude Code / Claude Desktop (Claude in Chrome) | Chrome DevTools MCP | Playwright MCP | Antigravity |
|---|---|---|---|---|
| Run JavaScript in the page | `javascript_tool` | `evaluate_script` | `browser_evaluate` | browser subagent "run JavaScript" / DevTools |
| Screenshot | `computer` → `screenshot` | `take_screenshot` | `browser_take_screenshot` | browser screenshot |
| Click (download button) | `computer` → `left_click` | `click` | `browser_click` | browser click |
| Tabs / navigate | `tabs_create_mcp`, `navigate` | `new_page`, `navigate_page` | `browser_tabs`, `browser_navigate` | browser navigate |
| Read files / run Python | built in | agent's shell | agent's shell | agent's terminal |

Limits that apply everywhere: keep each JavaScript call under ~40 seconds (start long jobs without `await` and poll), and tool output is often truncated near 1–2 KB — the export avoids this by writing a file instead of printing.

## Claude Code
- Install: `npx skills add marketcalls/discord-roblox-child-safety` (add `-g` for all projects), or open this repo folder (project skills in `.claude/skills/` load automatically). Commands: `/safety-review`, `/quick-check`, `/contact-deep-dive`, `/photo-review`, `/dm-export`, `/setup`.
- Browser: Claude in Chrome extension (claude.ai/chrome), signed in with the same account. The parent logs in to Discord in that Chrome. Check with the `tabs_context_mcp` tool; if "not connected", restart Chrome.
- Alternative: Chrome DevTools MCP attached to the parent's Chrome (below).

## Claude Desktop / claude.ai
- Download the repo ZIP, zip each folder in `.claude/skills/` on its own, then upload each in Settings → Capabilities → Skills.
- Browser: Claude in Chrome extension. Without it, use parent-run export and attach the JSON + run the analyzer locally (Desktop can't run local Python unless you have a filesystem/terminal MCP; otherwise paste `summary.md`/`flags.md` into the chat).

## OpenAI Codex (CLI / IDE)
- `npx skills add marketcalls/discord-roblox-child-safety` installs into `.agents/skills/`, which Codex reads. Ask Codex to use the `safety-review` skill.
- Browser: add Chrome DevTools MCP to `~/.codex/config.toml` and attach it to the parent's Chrome, or use parent-run mode (recommended for most families).

## Cursor
- `npx skills add marketcalls/discord-roblox-child-safety` installs into `.agents/skills/`, which Cursor reads.
- Browser: Cursor's built-in browser tools (if enabled) or Chrome DevTools / Playwright MCP in Cursor's MCP settings. The parent must log in inside the browser the agent controls. Parent-run mode always works.

## Google Antigravity
- `npx skills add marketcalls/discord-roblox-child-safety` (it detects Antigravity), or open this repo folder and ask the agent to follow `.claude/skills/safety-review/SKILL.md`.
- Browser: Antigravity's browser agent uses its own Chrome profile — the parent logs in to Discord in that window, then the agent can run the script. Parent-run mode also works.

## Attaching Chrome DevTools MCP to the parent's Chrome
1. Quit Chrome. Start a separate profile with remote debugging (Mac):
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222 --user-data-dir="$HOME/.child-safety-chrome"`
   (Windows: `chrome.exe --remote-debugging-port=9222 --user-data-dir=%USERPROFILE%\.child-safety-chrome`)
2. The parent logs in to the child's Discord in that window.
3. Configure the MCP with `--browserUrl http://127.0.0.1:9222` (chrome-devtools-mcp) — check your MCP's README for the exact flag in your version.
4. When finished, close that Chrome window. Anyone on the computer could control a browser with an open debugging port; the separate profile keeps the parent's normal browsing separate.

## Parent-run mode (any AI, including chat-only)
Parent: Chrome → discord.com (logged in) → F12 → Console → paste `console-export.js` → `dmExport.run({ since: 'YYYY-MM-DD' })` → JSON downloads. Then in any AI tool with a terminal: `python3 analyze.py export.json --out review --tz <zone>` and ask the AI to follow `safety-review`. Chat-only AIs (no terminal): run the Python yourself and paste `summary.md` and the relevant parts of `flags.md` into the chat — never the whole export into a public or shared service.
