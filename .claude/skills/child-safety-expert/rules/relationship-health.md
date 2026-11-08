# Relationship health: healthy, mixed, toxic or dangerous

Parents usually don't want to read every private message. They want to know, for each person their child talks to: **is this relationship good for my child?** Give every contact one plain label, with reasons, so the parent can respect the child's privacy for the healthy ones and focus on the few that matter.

`analyze.py` writes a first **hint** (`relationship_health` and `health_reasons` in `contacts.csv`, and the first table in `summary.md` §2). It is built from counts only, so it can be shown without quoting the child. You confirm or change it by reading the context.

## The four labels

| Label | What it looks like | What the parent sees |
|---|---|---|
| **Looks healthy** | Kind and balanced. Both sides start conversations. Talk about school, games, family, plans. Support when one is sad ("are you ok?", "go to sleep", "good luck on your test"). Boundaries respected ("ok, no worries"). Often a real-life friend. | Label and one line ("school friend, supportive"). **No quotes.** |
| **Mixed** | Mostly fine, with something to keep an eye on: crude jokes between same-age teens, fights that get resolved, heavy late-night chatting, one-sided messaging, a same-age online romance, distressed friends leaning on each other. | Label, the reason, and at most one short quote if it helps. |
| **Unhealthy (toxic)** | A pattern of **control**: jealousy ("who were you talking to?", "don't talk to them"), possessiveness ("you're mine"), demands to answer right away, guilt-tripping ("after everything I did", "you owe me"), threats to self-harm if the child leaves, put-downs, insults, isolation from other friends, pressure to share location or photos, the child constantly apologising. This happens between **same-age teens** too (teen dating abuse, bullying "friendships"). | Label, reasons, a few dated short quotes, and how to talk about it with the child. |
| **Dangerous** | Anything in the Critical/High rows of `risk-rubric.md` with warning signs: an adult (or unknown age with adult hints) who is close to the child, sexual talk, grooming, secrecy and deleted messages, requests for photos or location, sextortion, self-harm coercion, scams. | Full evidence, as in the main report. |

Use **Not enough to tell** for very short chats, and **n/a** for bots and Discord's own messages.

## How to decide

- **Pattern beats a single message.** One "shut up lol" between best friends is banter. "Why didn't you answer me" twenty times in a week is control.
- **Look at the child's side.** A child who apologises constantly, explains where they were, or seems afraid of the contact's reaction is a strong toxic sign, even if the contact sounds sweet.
- **Balance.** Who starts conversations? Who writes most? Very one-sided chats can mean dependency (the child begging for attention) or pressure (the contact flooding the child).
- **Love-bombing is not healthy.** Constant compliments, "you're the only one who understands me", gifts and "I've never felt this way" from someone the child hasn't met in person is a grooming pattern (`grooming-patterns.md`), not a healthy romance.
- **The age gap and the risk level come first.** The label never lowers a risk level. An adult who is "kind" is still Dangerous if the rubric says so.
- **Supportive friends are a strength.** Name them. Parents need to hear that some of their child's friends are good for them.

## Respecting the child's privacy

- For **Looks healthy** contacts: show only the label, the kind of relationship, and counts. Don't quote them, and don't summarise their private topics (crushes, gossip, feelings about parents) unless it's a safety issue.
- Quote only what the parent needs to act on: safety risks, toxic patterns, and the child's own statements about self-harm or harm at home (those always go to the adult).
- `analyze.py --privacy` skips the full transcripts and keeps `flags.md` only for contacts rated Watch or above.
- Suggest the parent tells the child that a safety check was done and that healthy friendships were left private. That builds trust instead of breaking it (`parent-guidance.md`).
