# Pitfalls (lessons from real reviews)

1. **Wrong attribution causes panic.** In one review a photo of a neighbourhood was first reported as "she sent him a photo outside your house" — it was the *contact's* photo; the child had only promised to send one. Always re-check sender, direction and date before telling the parent anything about who sent what.
2. **Display names hide identities.** A contact with a sweet, girly display name turned out to be an 18-year-old man. Resolve aliases (how the child addresses them, self-references, other chats) before profiling.
3. **The child is often the biggest risk to themselves.** Read the child's messages to close friends for self-harm before hunting for strangers.
4. **Keyword false positives.** Roblox trading slang: owner, slave, proof, leak, blacklist, staff, mm, tickets. Don't escalate on words alone.
5. **Background tabs are throttled.** Discord loads old messages slowly when its tab isn't in front; the exporter waits up to 60 s and re-anchors, and `dmExport.resume()` continues stalled chats.
6. **Tool calls time out (~45 s).** Start long jobs without `await`, poll with a 35 s sleep.
7. **Tool output is truncated (often ~1 KB).** Don't print transcripts through the JavaScript tool; save a file.
8. **Chrome allows one automatic download per tab.** Use the blue save button, `download-helper.js` in a fresh tab, or allow discord.com under Automatic downloads. Keep the blob in memory until the file is confirmed on disk — freeing it early means collecting everything again.
9. **DNS filters block images.** NextDNS etc. can block `media.discordapp.net`; images show "failed to load". Fetch from `cdn.discordapp.com` or pause the filter.
10. **macOS folders are case-insensitive.** "Alex" and "alex" merge and the second index overwrites the first; suffix folder names with the channel id.
11. **Sudden bans backfire in a crisis.** In the reference case the child's worst night followed a sudden block of Discord at home; recommend staged limits with a clinician.
12. **Deleted messages are gone.** If a contact admits deleting ("so you won't see"), say so in the report; only a police data request to Discord can recover more.
13. **Group chats are huge.** Skip them by default; export specific ones on request.
14. **Calls in DMs are logged; server voice chats aren't.** Say so when reporting calls.
