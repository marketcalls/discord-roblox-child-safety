# "Join servers for you" bots, verification channels and ban evasion

A hidden risk that sits behind many scams and harmful servers. Check it in every review.

## What it is
When a Discord app or bot asks you to "Authorize", the screen lists permissions. One of them is **"Join servers for you"** (technically the OAuth2 `guilds.join` scope). Once granted, that app can add your account to servers — any time, without asking again.

It has honest uses (a Patreon membership that unlocks a creator's server, a game linking its guild chat to Discord). But it is also the engine of **member backup / "restore" bot services**. Server owners put a "verify" button in their server. Everyone who verifies has silently granted "Join servers for you". If Discord bans that server, the owner makes a new one and pulls everyone back within minutes, as if nothing happened. Authorized members are also bought and sold in "member markets" to make new servers look big and trustworthy.

## How children get pulled in
- A DM from a bot: *"You've been gifted Nitro!"* → **Accept** → "verify with our bot" → Authorize.
- "Summer rewards" / *"Redeem 10,000 free Robux"* servers with a Roblox-looking verify bot.
- "Verify here" channels in Roblox trading / middleman servers, cheat and exploit servers, account and boost "market" servers, real-money casino servers (sometimes using Minecraft or Roblox currency), drug "roleplay" servers, vent/edgy servers — and, in the worst cases, servers that exploit children.
- Cookie-stealing scams in the same circles: videos and servers offering a Roblox **"voice chat enabler"**, **"game copier"**, **"limited checker"**, **"bot followers"** or **"join anyone"** tool that is really a script stealing the child's Roblox login cookie (often "paste this into the console / address bar").

## What can happen to the child
1. **Added to servers they never chose**, again and again — scam, gambling, drug, explicit or predatory servers — even after Discord bans them (ban evasion).
2. **Warnings and account bans.** When those servers are removed, accounts inside them can collect violations; children have lost accounts this way.
3. **Data exposure.** The same authorize screen can also ask for the email address and friends list (including blocked users), and the verification website sees the child's IP address and rough location. Some services pass such logs to server owners. That data can be used to dox, threaten or extort.
4. **Account theft** (Discord or Roblox) through fake "verify" or cookie-stealing tools.

## What to look for in the export
- **Discord's own system messages** in the official "Discord" DM: *"An application ___ has added you to the server ___"* (Discord now sends these), and any account warnings or limits. `analyze.py` lists them in `summary.md` §6.
- DMs from bots offering free Nitro, Robux, items or rewards with "accept / claim / verify / authorize".
- Messages like *"we got termed, rejoin the new server"*, *"verify in #verify to get access"*.
- **Server names** (from the export's server list, `summary.md` §7 and `servers.csv`): free Robux/Nitro/giveaway/rewards, MM/trading/values, cheats/executor/scripts, casino/coinflip/crash, accounts/boosts/members/shop, 18+/NSFW/dating.
- Anything asking the child to paste code into the browser console, the address bar, or "inspect element".

## What to tell the parent (actions are theirs; the review stays read-only)
1. With the child: **User Settings → Authorized Apps.** Look at every app. Remove ("Deauthorize") anything unknown, and anything with **"Join servers for you"** or friends-list access unless it's clearly legitimate (e.g. a known game or Patreon).
2. Leave servers the child doesn't recognise or didn't choose; report bot DMs as spam.
3. **Real Nitro gifts never need a bot.** They arrive as a `discord.gift/…` link inside Discord. No "verify", no authorize screen, no QR code.
4. If the child pasted anything into a console or used a "tool" for Roblox: change the Roblox password, use "Log out of all other sessions", turn on 2-step verification; do the same for Discord (password, 2FA, log out of all devices).
5. Teach the rule: *never authorize a bot to get something free.*

## Good to know
- Discord has added the system notice above and, reportedly since mid-2026, limits on how many members flagged bots can pull per day. Operators reportedly work around these limits (new accounts, slower pulls), so don't treat them as protection.
- Server owners can use Discord's built-in **"Apply to join"** instead of restore bots — a reasonable ask if a school or club server uses one.

Patterns compiled from public creator investigations (2022–2026) and Discord's own interface. Claims about specific companies are deliberately left out; describe behaviour, not brands, in reports unless the parent's export itself names an app.
