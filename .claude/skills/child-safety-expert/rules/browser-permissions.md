# Browser permissions — what to allow and why

| Permission | Why it's needed | How to grant | Turn off afterwards? |
|---|---|---|---|
| Discord login (child's account) | The export reads what the logged-in page shows | Parent logs in at discord.com — the AI never types passwords | Log out when the review is done, or keep for follow-ups |
| AI browser extension site access (Claude in Chrome) | Lets the agent read the Discord tab and run the read-only script | Extension → site access → allow on discord.com (or "on click") | Optional: set back to "on click" |
| Remote debugging (Chrome DevTools / Playwright MCP) | Lets Codex/Cursor/others control a separate Chrome profile | Start Chrome with `--remote-debugging-port` + separate `--user-data-dir` | **Yes** — close that window; don't leave a debugging port open |
| DevTools Console paste (parent-run mode) | Chrome blocks pasting into the Console by default | Type `allow pasting` when Chrome asks | Automatic |
| Automatic downloads for discord.com | The export/zip is saved by the page; Chrome allows only one automatic download per tab | Settings → Privacy and security → Site settings → Additional permissions → Automatic downloads → Allowed → add `[*.]discord.com` | Optional: remove after |
| DNS / ad filters (NextDNS, Pi-hole, school/router filters) | They can block `media.discordapp.net`, so images show "failed to load" | Pause the filter during the review, or rely on the CDN fallback in `media.js` | Turn back on |

Notes
- Opening DMs marks them read; unread badges disappear. Tell the parent beforehand.
- Keep the Discord tab in the foreground while exporting; Chrome throttles background tabs and loading slows to a crawl.
- Never install unknown "Discord exporter" extensions or paste scripts from strangers — that is exactly how token-stealing scams work. This repo's scripts are short and readable; read them first.
