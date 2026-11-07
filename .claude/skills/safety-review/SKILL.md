---
name: safety-review
description: Full end-to-end safety review of a child's Discord direct messages for a parent or guardian (or a teacher, school counsellor, doctor or psychiatrist working with the parent's consent). Exports every DM read-only from the parent's logged-in browser (or uses an export the parent already made), screens all conversations for suicide/self-harm, grooming, sexual content, sextortion, 764-style coercion, scams, abuse and identifying-detail leaks, identifies who each contact really is, rates every handle Critical/High/Watch/Low, checks calls and usage patterns, and writes a clear private report with next steps and helplines. Use when someone says "go through my son's/daughter's Discord", "check who my kid is talking to", "is my child talking to strangers or school friends", "find predators/scammers in her DMs", "my kid is addicted to Discord/Roblox", or shares a discord_dm_export JSON — even without the word "review".
---

# Safety review — end to end

Use the `child-safety-expert` skill's rule files as you go (paths below are relative to that skill). This review was modelled on a real case where the most important findings were the child's *own* suicide attempts disclosed to online friends, an 18-year-old hiding behind a cute display name, and adults embedded in Roblox trading servers — so read everything, not just the strangers.

## Step 0 — Consent, role, and the child

Confirm in one short question if not already clear: who they are (parent/guardian, or professional with the parent's consent), the child's age, pronouns, and country (for helplines and time zone). Decline anything that isn't a parent/guardian reviewing their own minor's account or a professional working with that parent's consent. Explain once: the review is read-only, opening DMs clears unread badges, automated reading may be against Discord's terms, and Discord Family Center exists as an official lighter option.

## Step 1 — Get the export

- If the person already has `discord_dm_export_*.json` → go to step 2.
- Otherwise run the `dm-export` skill (agent-driven if you can run JavaScript in the parent's logged-in Chrome; parent-run otherwise). Default range: last 12 months. Skip group DMs unless asked.
- Keep the parent informed while it runs (which chat, how many messages). Never type the child's password.

## Step 2 — Analyse

```bash
python3 <child-safety-expert>/rules/assets/analyze.py <export.json> --out <review-folder> --tz <IANA zone>
```

Read `summary.md` first. **Section 1 (the child's own risk statements) comes before everything else.** If anything there is recent (days, not months) and serious, follow the crisis protocol in `rules/self-harm-signals.md` now and tell the adult before continuing.

## Step 3 — Investigate each contact

Work from the highest score down in `flags.md`, then open `transcripts/` for context. For every contact that isn't clearly a bot or a two-line trade, write a short profile:

- **Who** — stated age, school year, adult indicators, country/time zone (phone-file clock offset), how they met (server, game, school, in person). `rules/identity-and-age.md`.
- **Aliases** — how the child addresses them, what they call themselves, mentions in other chats. Display names lie; join the dots across chats.
- **Relationship** — school/real-life friend, online peer, online adult, romantic, trading. Volume, late-night share, who starts conversations, dependency.
- **Red flags** — dated, quoted, short. Match against `rules/grooming-patterns.md`, `rules/sextortion.md`, `rules/coercion-networks-764.md`, `rules/scams-roblox-discord.md`.
- **What the child told them** — self-harm, home problems, real name, school, city, photos.
- **Level** — Critical / High / Watch / Low per `rules/risk-rubric.md`, with a one-line reason.

Also answer the parent's plain question directly: **strangers or school friends?** Count and name the categories.

## Step 4 — Child-level findings

- Self-harm and suicide timeline (dates, to whom, how recent).
- Disclosures about home (report the child's side neutrally; recommend family/clinical help, no blame).
- Account security: shared passwords, hacks, fake messages sent from the account.
- Identifying details leaked to online contacts (name, school, grade, city, state hints like language subjects, photos).
- Usage: messages per day by month, hour-of-day, midnight–5 AM share; what drives the late nights (e.g., trading-server "tickets" in other time zones).
- Calls (from `calls.csv`; DM calls only).
- Strengths: refusals, blocks, good instincts. Parents need these too.

## Step 5 — Photos (optional)

Only if asked. Use the `photo-review` skill. Never open images whose context suggests sexual content of a minor (`rules/photo-safety.md`).

## Step 6 — Report

Follow `rules/report-outline.md`. Lead with anything urgent. Default to a local HTML or Markdown file; publish nowhere unless the adult explicitly asks, and then privately. Include country helplines from `rules/helplines.md` and staged recommendations from `rules/parent-guidance.md` (no sudden bans in a crisis; professional help; talk without confronting).

## Step 7 — Close out

Tell the adult where every file is, what you could not see (deleted messages, closed DMs, server channels, voice, other apps), and that the folder holds a child's private disclosures — keep it private, share only with the clinician or police if needed. Offer the `contact-deep-dive` skill for anyone still unclear.

Check `rules/pitfalls.md` before claiming who sent what.
