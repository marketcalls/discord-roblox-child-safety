# Who is this person? Identity, age and location

## Display names lie — resolve aliases
- The DM list shows a display name the contact can change anytime (a cute, girly name can belong to an adult man).
- Inside the chat, check: how the child greets them ("hey <nickname>"), letters addressed to them, "call me…", their server name/tag, what other friends call them in other DMs.
- Use the **user ID** (`author_id` in exports v1.3+, taken from the avatar URL) as the stable identity: it stays the same when someone changes their display name, and two accounts with the same name have different IDs.
- Search the whole export for each nickname — friends often describe the person ("he's 18", "he deletes messages", "people call him a pedo").

## Age
- **Stated:** "I'm 16", "turning 19", "grade 11", "my uni", "my job", "my rent", "my staff team is 18+", "I'm a grown adult", "lives with my boyfriend".
- **Consistency:** does the school year match the age across months? Do school terms/exams match the stated country?
- **Others' statements:** "he's 18 right?" — "yeah".
- Unknown age + adult indicators → treat as an adult.

## Location / time zone from phone files
Phones name photos with the local clock: `IMG_20260315_174512.jpg`, `VID_20260421_091530.mp4`, `Screenshot_20260502-203011.jpg`. Discord stores the UTC send time. **file clock − UTC send time = the sender's UTC offset** (e.g. +5:00 → Pakistan; +5:30 → India; 0/+1 → UK; −4/−5 → US East). A live photo sent 20 seconds after it was taken, with the same offset on every file for months, is strong evidence of a real person in that zone — very hard to fake consistently. `analyze.py` reports the median offset per contact.
Other clues: "it's 7am for me", exam calendars, holidays, prayer times, currency, slang.

## Real teen vs. fake persona
Signs of a real peer: consistent details over months, school/family life texture (exams, siblings, parents' fights), mutual friends who know them, live phone-clock photos. Signs of a fake: stock/internet photos (hashed file names, reverse-image results), age that shifts, pushes quickly for photos or other apps, no mutual friends, scripted flattery. Kids also run "catfish" accounts themselves (using strangers' photos) — note it if the child does.

## Be honest
Say "very likely", "can't verify", and what evidence each conclusion rests on. Never invent an identity.
