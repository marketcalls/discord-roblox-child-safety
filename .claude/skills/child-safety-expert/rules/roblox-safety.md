# Roblox: what a parent can see, and how to review it safely

Checked against Roblox's own help center, newsroom and developer forum in November 2026. Roblox changes these features often, so re-check the links before relying on a detail.

## Where Roblox conversations live

| Place | Kept? | Notes |
|---|---|---|
| **Web chat panel** (grey "Chat" box, lower-right of roblox.com pages; same chats in the app) | Yes | One-to-one chats, group chats (up to 5 friends) and Party chat. "Party" is being renamed "Chat" for users over 9; under-9 Kids accounts keep "Party". [help 360000432483] |
| **In-game (experience) chat** | **No** | It "ends as soon as you leave that experience". Nothing to review later. [help 203313520] |
| **Old Inbox messages** | Read-only | User-to-user Inbox messaging ended 29 Oct 2024. Old messages may still be visible. |
| **Voice chat** | No | Not recorded for parents. |

Unverified community report: unfriending someone may delete the chat history with them. Review before anyone unfriends or blocks.

## What Roblox itself lets a parent see

A **linked parent account** (Parental Controls) shows: pending requests, Robux balance, 7-day screen time, top 20 games, the friends list (all and Trusted Friends), blocked users, Robux transfer history, spending notifications and a weekly activity email. **It does not show chat content.** Control shrinks with age: from 13 the child manages screen time and blocking; from 16 the parent mainly gets notifications; accounts unlink at 18. [help 30428310121620, 39378204956820]

**Request Account Data** (Settings → Privacy) gives the account's own data as a download (link valid 7 days). Roblox does not say whether chat messages are included; check what arrives. US privacy responses can take up to 45 days. [help 40630460625556, 4402871541140]

## Safety changes that shape what you'll find (2024 to 2026)

- Nov 2024: under-13s can no longer message outside games.
- Jan 2026 (global): **age checks are required to chat**. Users are placed in age bands (under 9, 9-12, 13-15, 16-17, 18-20, 21+) and can chat only with nearby bands or **Trusted Friends**. Facial age estimation is about ±1.4 years, so an adult can still land in a teen band.
- Apr 2026: "Trusted Connections" became **Trusted Friends**; for under-13s they need parental approval.
- Jun 2026: **Roblox Kids** (5-8, chat off) and **Roblox Select** (9-15) accounts. Accounts without an age check cannot chat.
- Direct chat inside games needs parental consent for under-16s.

**What this means:** many younger accounts have little or no chat history. Risk concentrates in (1) **Trusted Friends**, especially adults or strangers who became "trusted", (2) in-game chat that is never stored, and (3) **moving the child to Discord, Snapchat or WhatsApp**, which is why this toolkit reviews Discord in depth.

## Roblox-specific warning signs

- A **Trusted Friend** the family has never met, or one added recently, especially if they asked for the trusted status.
- **Age band mismatch:** "I'm 14" from someone whose profile, voice, spelling, time zone or knowledge suggests an adult.
- **New or near-empty accounts** (check the profile's join date) that befriend many children.
- **Robux or item gifts**, "I'll buy you Premium/headless/a limited", trading favours.
- **Filter evasion:** words broken up to dodge the filter ("d i s c", "snap", "s.c", numbers for letters), lots of "####" (filtered text) around the same topics.
- **Moving off Roblox:** "add me on Discord/Snap", sharing usernames from other apps, QR codes.
- **Private servers or "condo"/"scented con" games** (sexual role-play experiences that get removed and re-uploaded), invitations to "special" places.
- **Account theft tools:** "voice chat enabler", "game copier", "free Robux", "paste this in the console". See `scams-roblox-discord.md`.
- **Secrecy, flattery, late-night play, gifts:** the same grooming pattern as `grooming-patterns.md`.

## Why this toolkit does not auto-export Roblox chat

Roblox's Terms of Use (in force 1 Nov 2026, section 9.2) forbid accessing content "except as expressly authorized", using "robots, crawlers, scrapers or other automated data gathering and extraction tools in connection with… machine learning models or AI", and harvesting data "for any purpose". There is no official chat-reading API. An automated reader feeding an AI could break those terms and get the child's account banned. So the Roblox review is **manual and parent-led**: the parent looks at the chats with (or on behalf of) their child, takes screenshots, and the AI reads the screenshots. This is not legal advice.

## The parent-led review (used by the `roblox-check` skill)

1. **Agree it with the child where possible** ("I'm doing a safety check, I won't read out your private stuff to anyone"). Never confront a suspected adult.
2. **Parental Controls:** link a parent account if not linked. Note screen time, top games, spending, blocked users.
3. **Friends list:** screenshot the friends list and the **Trusted Friends** list. For any friend you don't recognise, open their profile and note the **join date** and display name / username.
4. **Chats:** open the chat panel. For each conversation, scroll and take screenshots (or copy the text into a note). Prioritise: Trusted Friends you don't know, anyone who gifted Robux, anyone mentioning Discord/Snap, any chat active late at night.
5. **Give the screenshots to the AI** (ChatGPT, Claude or any agent) with the `roblox-check` skill. It labels each relationship Healthy / Mixed / Toxic / Dangerous with the reasons (`relationship-health.md`, `risk-rubric.md`).
6. **If the child also uses Discord**, run the full Discord review (`safety-review`): Roblox contacts very often continue there.
7. **Danger found?** Screenshot the profile and messages, use Roblox **Report Abuse** on the user, block, and follow `helplines.md`. Don't delete anything first.

## Sources

- Web chat: https://en.help.roblox.com/hc/en-us/articles/360000432483
- In-game chat not kept: https://en.help.roblox.com/hc/en-us/articles/203313520
- Inbox sunset: https://devforum.roblox.com/t/sunsetting-user-to-user-inbox-messaging/3187502
- Parental Controls: https://en.help.roblox.com/hc/en-us/articles/30428310121620 and https://en.help.roblox.com/hc/en-us/articles/39378204956820
- Account data request: https://en.help.roblox.com/hc/en-us/articles/40630460625556
- Age checks for chat: https://about.roblox.com/newsroom/2025/11/roblox-requires-age-checks-limits-minor-and-adult-chat and https://about.roblox.com/newsroom/2026/01/roblox-age-checks-required-to-chat
- Trusted Friends: https://devforum.roblox.com/t/friends-are-back-expanding-trusted-friends-for-a-new-way-to-chat-and-play/4554217
- Kids and Select accounts: https://about.roblox.com/newsroom/2026/06/age-based-roblox-kids-and-select-accounts-now-globally-available
- Under-13 messaging change: https://techcrunch.com/2024/11/18/roblox-no-longer-allows-users-under-13-to-message-others-outside-of-games
- Terms of Use: https://en.help.roblox.com/hc/en-us/articles/115004647846
