/*
 * Discord DM safety export  —  READ-ONLY
 * ------------------------------------------------------------------
 * What it does
 *   Opens each direct message (DM) in THIS logged-in Discord web tab, scrolls back
 *   to the date you choose, reads the messages that the page itself shows, and
 *   saves them to ONE file on your computer: discord_dm_export_<date>.json
 *
 * What it never does
 *   - never sends, edits, deletes or reacts to anything
 *   - never reads passwords, tokens or cookies
 *   - never contacts any website except the Discord page you already have open
 *   - never uploads the file anywhere (it is only downloaded to your computer)
 *
 * How a parent uses it (Chrome on a computer)
 *   1. Log in to your child's account at https://discord.com/channels/@me
 *   2. Press F12 (Mac: Option+Command+J) and click "Console".
 *      Discord shows a big "Stop!" warning. That warning is right in general:
 *      read this file before pasting it. If Chrome asks, type:  allow pasting
 *   3. Paste this whole file and press Enter.
 *   4. Type:   dmExport.run({ since: '2026-01-01' })      and press Enter.
 *      Keep the tab open and visible. Progress shows in the console.
 *      When it finishes, the .json file downloads (or click the blue button).
 *
 * Options for dmExport.run({...})
 *   since          'YYYY-MM-DD'  oldest date to read (default: 12 months ago)
 *   includeGroups  true/false    also read group DMs (default false)
 *   only           ['<channelId>', ...]  read just these DMs
 *   skip           ['<channelId>', ...]  skip these DMs
 *   maxMinutesPerChat  number    safety cap per DM (default 20)
 *
 * The file also lists the NAMES of the servers your child is in (from the left sidebar) and keeps
 * Discord's own system messages (e.g. "an application has added you to a server", warnings).
 *
 * Other commands: dmExport.listDMs()  dmExport.listServers()  dmExport.status()  dmExport.save()  dmExport.stop()
 *                 dmExport.resume()   re-reads only chats that stopped early ("stalled"/"time-cap")
 * Tip: keep this tab in front. Chrome slows down background tabs and Discord then loads
 *      old messages very slowly.
 */
(() => {
  if (window.dmExport && window.dmExport.version) { console.log('dmExport already loaded:', window.dmExport.status()); return; }

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const snowISO = id => new Date(Number(BigInt(id) >> 22n) + 1420070400000).toISOString();
  const cmpId = (a, b) => (a.length - b.length) || (a < b ? -1 : a > b ? 1 : 0);
  const state = { dms: [], store: {}, stopFlag: false,
    progress: { running: false, done: false, i: 0, total: 0, current: '', log: [] }, opts: null, startedAt: null };

  async function listDMs() {
    // wait (up to ~20 s) for Discord to finish loading the DM list
    for (let i = 0; i < 40 && document.querySelectorAll('a[href^="/channels/@me/"]').length < 2; i++) await sleep(500);
    const nav =document.querySelector('nav[aria-label="Private channels"]') || document.querySelector('[class*="privateChannels"]');
    const sc = nav ? [...nav.querySelectorAll('*')].find(e => /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight) : null;
    const seen = new Map();
    const collect = () => document.querySelectorAll('a[href^="/channels/@me/"]').forEach(a => {
      const id = a.getAttribute('href').split('/')[3]; if (!id || seen.has(id)) return;
      const label = (a.getAttribute('aria-label') || a.innerText || '').replace(/\s+/g, ' ').trim();
      seen.set(id, { id, label: label.replace(/ \((direct|group) message\)/, '').replace(/, (Online|Idle|Do Not Disturb|Offline)$/, ''),
        type: /group message/i.test(label) ? 'group' : 'dm' });
    });
    collect();
    if (sc) { sc.scrollTop = 0; for (let i = 0; i < 200; i++) { sc.scrollTop += 300; await sleep(150); collect(); if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2) break; } sc.scrollTop = 0; }
    state.dms = [...seen.values()];
    return state.dms.map(d => `${d.type === 'group' ? '[group] ' : ''}${d.label}  (${d.id})`).join('\n');
  }

  // Names of the servers the child is in (left sidebar). Open any closed server folders first to include them.
  function listServers() {
    const out = new Map();
    document.querySelectorAll('[data-list-item-id^="guildsnav___"]').forEach(el => {
      const id = el.getAttribute('data-list-item-id').replace('guildsnav___', ''); if (!/^\d+$/.test(id)) return;
      const name = (el.closest('[data-dnd-name]')?.getAttribute('data-dnd-name') || el.querySelector('img[alt]')?.alt || el.innerText || '').replace(/\s+/g, ' ').trim();
      out.set(id, { id, name });
    });
    state.servers = [...out.values()];
    return state.servers.length + ' servers found';
  }

  function getScroller() {
    let el = document.querySelector('ol[data-list-id="chat-messages"]'); if (!el) return null; el = el.parentElement;
    while (el && el !== document.body) { if (/(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight) return el; el = el.parentElement; }
    return null;
  }
  const atStart = () => /beginning of your direct message history|Welcome to the beginning of the|This is the beginning/i.test(getScroller()?.innerText || '');

  async function open(chId, msgId) {
    history.pushState({}, '', '/channels/@me/' + chId + (msgId ? '/' + msgId : ''));
    dispatchEvent(new PopStateEvent('popstate', { state: {} }));
    for (let i = 0; i < 40; i++) { await sleep(250); if (document.querySelector('li[id^="chat-messages-' + chId + '-"]') || atStart()) break; }
  }

  function attachmentsOf(acc) {
    if (!acc) return [];
    const isAttachment = raw => { try { const u = new URL(raw, location.href); return u.protocol === 'https:' && (u.hostname === 'cdn.discordapp.com' || u.hostname === 'media.discordapp.net') && /^\/attachments\/\d+\/\d+\/[^/]+$/.test(u.pathname); } catch { return false; } };
    const urls = [...acc.querySelectorAll('a[href], img, video, source')].map(x => x.href || x.src).filter(u => u && isAttachment(u));
    const out = new Map();
    for (const u of urls) {
      const clean = u.split('?')[0].replace('media.discordapp.net', 'cdn.discordapp.com');
      const key = (clean.match(/\/attachments\/\d+\/(\d+)\//) || [])[1];
      if (key && !out.has(key)) out.set(key, { file: decodeURIComponent(clean.split('/').pop()), url: clean });
    }
    return [...out.values()];
  }

  function grab(chId) {
    const recs = (state.store[chId] = state.store[chId] || new Map());
    for (const li of document.querySelectorAll('li[id^="chat-messages-' + chId + '-"]')) {
      const id = li.id.split('-').pop();
      if (recs.has(id) && recs.get(id).author) continue;
      const art = li.querySelector('[role="article"]') || li;
      const head = ((art.getAttribute('aria-labelledby') || '').match(/message-username-(\d+)/) || [])[1] || null;
      const u = li.querySelector('[id^="message-username-"]');
      const c = li.querySelector('[id="message-content-' + id + '"]');
      const acc = li.querySelector('[id^="message-accessories-"]');
      const reply = li.querySelector('[id^="message-reply-context-"]');
      const links = acc ? [...acc.querySelectorAll('a[href]')].map(a => a.href).filter(h => !/discord(app)?\.(com|net)\/(channels|attachments)/.test(h)) : [];
      recs.set(id, {
        id, ts: snowISO(id), head,
        author: u ? u.innerText.replace(/\s+/g, ' ').trim() : null,
        text: c ? c.innerText.trim() : '',
        reply: reply ? reply.innerText.replace(/\s+/g, ' ').trim().slice(0, 160) : '',
        attachments: attachmentsOf(acc),
        links: [...new Set(links)].slice(0, 10),
        embed: acc && !acc.querySelector('img,video') ? acc.innerText.replace(/\s+/g, ' ').trim().slice(0, 300) : '',
        system: (!c && !acc) ? li.innerText.replace(/\s+/g, ' ').trim().slice(0, 300) : ''
      });
    }
    return recs;
  }

  const oldestId = recs => { let o = null; for (const k of recs.keys()) if (!o || cmpId(k, o) < 0) o = k; return o; };

  async function extract(chId, sinceISO, budgetMs) {
    // Patient by design: Discord loads older messages slowly in background tabs.
    const t0 = Date.now(); const recs = grab(chId); let lastGrowth = Date.now(); let noScroller = 0; let kicks = 0;
    while (Date.now() - t0 < budgetMs) {
      if (state.stopFlag) return 'stopped';
      const sc = getScroller(); if (!sc) { await sleep(300); if (++noScroller > 40) return recs.size ? 'complete' : 'no-messages'; continue; }
      if (atStart() && sc.scrollTop < 5) { grab(chId); return 'complete'; }
      const oldest = oldestId(recs);
      if (oldest && sinceISO && snowISO(oldest) < sinceISO) return 'reached-since-date';
      const before = recs.size;
      sc.dispatchEvent(new WheelEvent('wheel', { deltaY: -600, bubbles: true, cancelable: true })); sc.scrollBy(0, -600);
      await sleep(sc.scrollTop < 5 ? 700 : 250); grab(chId);
      if (recs.size > before) { lastGrowth = Date.now(); kicks = 0; continue; }
      const idle = Date.now() - lastGrowth;
      if (idle > 20000 && kicks < 2 && oldest) { kicks++; await open(chId, oldest); await sleep(1500); grab(chId); continue; } // re-anchor on the oldest message
      if (idle > 60000) return 'stalled';
    }
    return 'time-cap';
  }

  function toJSON() {
    const channels = [];
    for (const d of state.dms) {
      const recs = state.store[d.id]; if (!recs) continue;
      const arr = [...recs.values()].sort((a, b) => cmpId(a.id, b.id)); let last = null;
      for (const r of arr) { if (r.author) last = r.author; else r.author = (r.head && recs.get(r.head)?.author) || last || '?'; }
      const since = state.opts?.since ? state.opts.since + 'T00:00:00Z' : null;
      channels.push({ id: d.id, label: d.label, type: d.type, status: d.status || '',
        messages: arr.filter(r => !since || r.ts >= since).map(({ head, ...r }) => r) });
    }
    if (!state.servers) listServers();
    return { tool: 'discord-roblox-child-safety/console-export.js', version: '1.2', exported_at: new Date().toISOString(),
      since: state.opts?.since || null, timezone_of_browser: Intl.DateTimeFormat().resolvedOptions().timeZone,
      servers: state.servers || [], channels };
  }

  function save(name) {
    const blob = new Blob([JSON.stringify(toJSON())], { type: 'application/json' });
    const fn = name || ('discord_dm_export_' + new Date().toISOString().slice(0, 10) + '.json');
    const go = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); a.remove(); };
    go();
    // Chrome sometimes blocks automatic downloads: offer a button the person can click.
    let b = document.getElementById('dm-export-save');
    if (!b) { b = document.createElement('button'); b.id = 'dm-export-save'; document.body.appendChild(b); }
    b.textContent = 'Save ' + fn + ' (' + (blob.size / 1e6).toFixed(1) + ' MB)';
    b.style.cssText = 'position:fixed;right:24px;bottom:24px;z-index:2147483647;padding:14px 20px;font:600 15px system-ui;background:#2563eb;color:#fff;border:0;border-radius:10px;cursor:pointer';
    b.onclick = go;
    return fn + ' (' + (blob.size / 1e6).toFixed(1) + ' MB) — if no download appeared, click the blue button at the bottom-right.';
  }

  async function run(opts = {}) {
    if (state.progress.running) return 'already running: ' + status();
    const d12 = new Date(); d12.setFullYear(d12.getFullYear() - 1);
    const o = Object.assign({ since: d12.toISOString().slice(0, 10), includeGroups: false, only: null, skip: [], maxMinutesPerChat: 20, autoSave: true }, opts);
    state.opts = o; state.stopFlag = false; state.startedAt = Date.now();
    if (!state.dms.length) await listDMs();
    listServers();
    if (!state.dms.length) return 'No DMs found — open https://discord.com/channels/@me, wait until the DM list shows, then run again.';
    const q =state.dms.filter(d => (o.includeGroups || d.type === 'dm') && (!o.only || o.only.includes(d.id)) && !o.skip.includes(d.id));
    state.progress = { running: true, done: false, i: 0, total: q.length, current: '', log: [] };
    const sinceISO = o.since + 'T00:00:00Z';
    for (const d of q) {
      if (state.stopFlag) break;
      state.progress.current = d.label;
      try {
        const have = state.store[d.id];
        await open(d.id, have && have.size ? oldestId(have) : undefined); // resume from the oldest message already read
        await sleep(1200); d.status = await extract(d.id, sinceISO, o.maxMinutesPerChat * 60000);
      } catch (e) { d.status = 'error: ' + e.message; }
      const n = state.store[d.id]?.size || 0;
      state.progress.log.push(`${d.label}: ${n} messages (${d.status})`); state.progress.i++;
      console.log(`[dmExport] ${state.progress.i}/${q.length} ${d.label}: ${n} messages (${d.status})`);
    }
    state.progress.running = false; state.progress.done = true; state.progress.current = '';
    const msg = o.autoSave ? save() : 'done (autoSave off) — run dmExport.save()';
    console.log('[dmExport] finished. ' + msg);
    return msg;
  }

  function status() {
    const p = state.progress; const mins = state.startedAt ? ((Date.now() - state.startedAt) / 60000).toFixed(1) : '0';
    const cur = p.current ? `reading "${p.current}" (${state.store[state.dms.find(d => d.label === p.current)?.id]?.size || 0} msgs so far)` : '';
    return `${p.done ? 'DONE' : p.running ? 'RUNNING' : 'IDLE'} ${p.i}/${p.total} chats, ${mins} min. ${cur}\n` + p.log.slice(-5).join('\n');
  }

  // Re-read only the chats that did not finish (stalled / time-cap / error), continuing where they stopped.
  function resume(opts = {}) {
    const unfinished = state.dms.filter(d => d.status && !/^(complete|reached-since-date|no-messages)$/.test(d.status)).map(d => d.id);
    if (!unfinished.length) return 'nothing to resume — all chats finished';
    run(Object.assign({}, state.opts || {}, opts, { only: unfinished })); return 'resuming ' + unfinished.length + ' chat(s); watch dmExport.status()';
  }

  window.dmExport = { version: '1.2', listDMs, listServers, run, resume, status, save, toJSON, stop: () => { state.stopFlag = true; return 'stopping after current step'; }, _state: state, _extract: extract, _open: open };
  console.log('%cdmExport loaded (read-only).', 'font-weight:bold', '\nNext:  dmExport.run({ since: "2026-01-01" })   then watch progress with dmExport.status()');
})();
'dmExport loaded';
