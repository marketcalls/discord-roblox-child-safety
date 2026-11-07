---
description: Review a child's Discord direct messages for safety with a parent's consent (grooming, sextortion, scams, self-harm, high-alert contacts) and write a private report.
---

1. Read `AGENTS.md` and follow its safety rules for the whole task (parent/guardian consent, never handle passwords, read-only, crisis first, never open suspected sexual images of minors, keep data local).
2. Ask the adult: their role, the child's age, pronouns and country, and the date range to review.
3. Get an export: if the parent has `discord_dm_export_*.json`, use it. Otherwise follow `.claude/skills/dm-export/SKILL.md` — either use the browser agent in the window where the parent has logged in to Discord, or give the parent the "parent-run" steps for `.claude/skills/child-safety-expert/rules/assets/console-export.js`.
4. Run `python3 .claude/skills/child-safety-expert/rules/assets/analyze.py <export.json> --out review --tz <zone>`.
5. Read `review/summary.md` section 1 first; if anything recent suggests suicide/self-harm or sextortion, stop and tell the adult with steps and helplines.
6. Follow `.claude/skills/safety-review/SKILL.md` steps 3–7 using the reference files in `.claude/skills/child-safety-expert/rules/`.
7. Write the report per `rules/report-outline.md` as a local file and tell the adult where everything is saved.
