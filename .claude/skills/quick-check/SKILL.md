---
name: quick-check
description: Fast first-pass child-safety triage of a Discord DM export — in a few minutes tells the parent whether there is anything urgent (suicide/self-harm statements, sextortion, adults with sexual or secret talk, meeting/location requests) and which handles are high alert, before any full review. Use when a parent says "quickly check", "is there anything dangerous", "who should I worry about", "just tell me the red flags", or when time matters.
---

# Quick check

1. Make sure there is an export (`dm-export` skill) — or use one the adult already has.
2. Run the analyzer:
   `python3 <child-safety-expert>/rules/assets/analyze.py <export.json> --out quick --tz <zone>`
3. Read `quick/summary.md` section 1. Anything from the last 30 days about dying, cutting, goodbye, or "can't take it" → crisis protocol (`child-safety-expert/rules/self-harm-signals.md`) and tell the adult first.
4. For the top 5 contacts by score, open their section in `quick/flags.md` and read only the sexual, grooming, sextortion, coercion, location and secrecy hits in context. Discard obvious false positives (trading slang, song lyrics, jokes between same-age friends).
5. Glance at `quick/summary.md` §6–7: any app that "added you to the server", Discord warnings, and flagged server names (free Robux/Nitro, casino, cheats, 18+). These point to verification-bot scams (`child-safety-expert/rules/verification-bots-and-ban-evasion.md`).
6. Answer in this shape, plainly:

```
URGENT (act today): … or "nothing urgent found in the messages"
HIGH ALERT HANDLES:
  1. <display name> — who they seem to be (age/adult?) — why, with 1-2 dated quotes
  2. …
WATCH: <names> — one line each
STRANGERS vs REAL-LIFE FRIENDS: x online-only contacts, y school/real-life friends (examples)
LATE NIGHTS: z% of the child's messages between midnight and 5 AM
APPS & SERVERS: apps that added the child to servers / warnings / risky server names (or "none found")
NEXT: run the full safety-review / deep-dive on <name> / check Authorized Apps / talk to a counsellor …
```

7. Say clearly that this is triage from keywords plus a quick read, not a full review, and what wasn't checked (photos, deleted messages, server channels, voice).
