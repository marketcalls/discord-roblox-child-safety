/*
 * media.js — safety-first photo/video review for a child's Discord DMs (agent-driven only)
 * Paste into the logged-in Discord tab (after console-export.js is NOT required).
 * READ-ONLY. Fetches attachment files that the page can already show, keeps them in memory,
 * renders thumbnail contact sheets for screening, and packs screened files into a zip.
 *
 * Rules (see photo-safety.md): read message context first; never open/zoom/save anything whose
 * context or thumbnail is sexual content of a minor — record the link and stop.
 *
 *   await mediaReview.collect('<channelId>', '<label>')      // repeat until "done"; ~30 s per call
 *   await mediaReview.sheet('<label>', 0)                    // page 0,1,2… (48 thumbnails); take a screenshot
 *   mediaReview.flag('<label>', 17, 'self-harm photo of someone else')   // 1-based number on the sheet
 *   mediaReview.exclude('<label>', 23)                       // never save this item
 *   await mediaReview.pack(['<label>', ...], 'batch.zip')    // builds zip in memory (one folder per contact + index)
 *   mediaReview.sendToHelper('batch.zip')                    // then click "SAVE" in the helper tab (download-helper.js)
 *   mediaReview.free('<label>')                              // only AFTER the zip is confirmed on disk
 *   mediaReview.closeSheet()
 */
(() => {
  if (window.mediaReview) return;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const snowISO = id => new Date(Number(BigInt(id) >> 22n) + 1420070400000).toISOString();
  const S = {}; const zips = {};
  const bc = new BroadcastChannel('__child_safety_zip');

  function harvest(st, li, msg) {
    const acc = li.querySelector('[id^="message-accessories-"]'); if (!acc) return;
    const urls = [...acc.querySelectorAll('a[href], img, video, source')].map(x => x.href || x.src).filter(u => u && /\/attachments\/\d+\/\d+\//.test(u));
    for (const u of urls) {
      const key = (u.match(/\/attachments\/\d+\/(\d+)\//) || [])[1]; if (!key || st.files.has(key)) continue;
      const fn = decodeURIComponent(u.split('?')[0].split('/').pop()); if (!/\.(jpe?g|png|webp|heic|gif|mov|mp4)$/i.test(fn)) continue;
      const rec = { key, msg: msg.id, who: msg.who, ts: msg.ts, fn, blob: null, note: '', exclude: false };
      st.files.set(key, rec);
      // cdn.discordapp.com usually works even when DNS filters block media.discordapp.net
      rec.p = fetch(u.replace('media.discordapp.net', 'cdn.discordapp.com').replace(/([?&])(format|width|height|quality)=[^&]*/g, '$1'))
        .then(r => r.ok ? r.blob() : null).then(b => { rec.blob = b; }).catch(() => {});
    }
  }

  async function collect(ch, label, budget = 30000) {
    const t0 = Date.now();
    const st = S[label] = S[label] || { ch, files: new Map(), done: new Set(), queue: null };
    if (!st.queue) { // all messages with attachments visible while scrolling; reuse dmExport data if loaded
      const recs = window.dmExport?._state?.store?.[ch];
      st.queue = recs ? [...recs.values()].filter(r => r.attachments?.length).map(r => ({ id: r.id, who: r.author, ts: r.ts })) : null;
      if (!st.queue) return 'Load console-export.js and export this chat first (dmExport.run({only:[id]})) so I know which messages have files.';
    }
    const byId = new Map(st.queue.map(m => [m.id, m]));
    for (const m of st.queue) {
      if (Date.now() - t0 > budget) break; if (st.done.has(m.id)) continue;
      history.pushState({}, '', '/channels/@me/' + ch + '/' + m.id); dispatchEvent(new PopStateEvent('popstate', { state: {} }));
      let li = null; for (let i = 0; i < 24 && !li; i++) { await sleep(150); li = document.getElementById('chat-messages-' + ch + '-' + m.id); }
      await sleep(250);
      for (const el of document.querySelectorAll('li[id^="chat-messages-' + ch + '-"]')) { const id = el.id.split('-').pop(); if (byId.has(id) && !st.done.has(id)) { harvest(st, el, byId.get(id)); st.done.add(id); } }
      st.done.add(m.id);
    }
    await Promise.race([Promise.all([...st.files.values()].filter(f => f.p && !f.blob).map(f => f.p)), sleep(6000)]);
    const got = [...st.files.values()].filter(f => f.blob);
    return `${label}: messages ${st.done.size}/${st.queue.length}, files ${got.length}, ${(got.reduce((a, f) => a + f.blob.size, 0) / 1e6).toFixed(0)} MB` + (st.done.size >= st.queue.length ? ' — done' : ' — call again');
  }

  const list = label => [...S[label].files.values()].filter(f => f.blob).sort((a, b) => a.ts < b.ts ? -1 : 1);

  async function sheet(label, page = 0, per = 48) {
    const items = list(label).slice(page * per, (page + 1) * per);
    closeSheet(); const ov = document.createElement('div'); ov.id = '__cs_sheet';
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:#111;display:grid;grid-template-columns:repeat(8,1fr);grid-auto-rows:calc((100vh - 8px)/6);gap:2px;padding:2px';
    document.body.appendChild(ov); const loads = [];
    items.forEach((f, i) => {
      const n = page * per + i + 1; const cell = document.createElement('div'); cell.style.cssText = 'position:relative;overflow:hidden;background:#222;display:flex;align-items:center;justify-content:center';
      const lab = document.createElement('span'); lab.textContent = n + (f.who === window.__childName ? ' C' : ' O'); lab.title = f.fn;
      lab.style.cssText = 'position:absolute;left:2px;top:2px;color:#fff;font:bold 11px monospace;padding:0 3px;z-index:2;background:' + (f.who === window.__childName ? '#c33' : '#36c');
      let el; if (/\.(mov|mp4)$/i.test(f.fn)) { el = document.createElement('video'); el.muted = true; el.src = URL.createObjectURL(f.blob); loads.push(new Promise(r => { el.onloadeddata = () => { el.currentTime = Math.min(1, (el.duration || 2) / 2); r(); }; el.onerror = r; setTimeout(r, 4000); })); }
      else { el = document.createElement('img'); el.src = URL.createObjectURL(f.blob); loads.push(new Promise(r => { el.onload = r; el.onerror = () => { lab.textContent += ' ?'; r(); }; setTimeout(r, 4000); })); }
      el.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain'; cell.append(el, lab); ov.appendChild(cell);
    });
    await Promise.all(loads); await sleep(400);
    return `${label} page ${page}: items ${page * per + 1}-${page * per + items.length} of ${list(label).length}. Red C = sent by child (set window.__childName), blue O = other person. Take a screenshot now.`;
  }
  function closeSheet() { document.getElementById('__cs_sheet')?.remove(); return 'closed'; }
  function flag(label, n, note) { const f = list(label)[n - 1]; if (f) f.note = note; return f ? `${f.fn} flagged` : 'no such item'; }
  function exclude(label, n) { const f = list(label)[n - 1]; if (f) f.exclude = true; return f ? `${f.fn} will not be saved` : 'no such item'; }
  function info(label, n) { const f = list(label)[n - 1]; return f ? `${f.fn} | ${f.who} | ${f.ts} | message ${f.msg}` : 'no such item'; }

  // minimal ZIP (store, no compression)
  const T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc = u8 => { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = T[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  async function zip(entries) {
    const enc = new TextEncoder(); const parts = [], cen = []; let off = 0;
    for (const e of entries) {
      const data = new Uint8Array(await e.blob.arrayBuffer()); const c = crc(data); const nm = enc.encode(e.name);
      const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(12, 0x21, true); h.setUint32(14, c, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, nm.length, true);
      parts.push(h.buffer, nm, data);
      const d = new DataView(new ArrayBuffer(46)); d.setUint32(0, 0x02014b50, true); d.setUint16(4, 20, true); d.setUint16(6, 20, true); d.setUint16(8, 0x0800, true); d.setUint16(14, 0x21, true); d.setUint32(16, c, true); d.setUint32(20, data.length, true); d.setUint32(24, data.length, true); d.setUint16(28, nm.length, true); d.setUint32(42, off, true);
      cen.push(d.buffer, nm); off += 30 + nm.length + data.length;
    }
    const size = cen.reduce((a, b) => a + (b.byteLength || b.length), 0); const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, entries.length, true); end.setUint16(10, entries.length, true); end.setUint32(12, size, true); end.setUint32(16, off, true);
    return new Blob([...parts, ...cen, end.buffer], { type: 'application/zip' });
  }

  async function pack(labels, name) {
    const safe = s => s.replace(/[^\w.\-]+/g, '_').slice(0, 80); let entries = [];
    for (const label of labels) {
      const st = S[label]; const folder = safe(label) + '_' + st.ch.slice(-4); // channel suffix avoids case-insensitive folder merges
      const rows = [['no', 'date_utc', 'sent_by', 'original_file', 'saved_as', 'note', 'open_in_discord']]; let n = 0;
      for (const f of list(label)) { n++; if (f.exclude) continue; const by = f.who === window.__childName ? 'child' : 'contact';
        const saved = String(n).padStart(3, '0') + '_' + f.ts.slice(0, 16).replace(/[:T]/g, '-') + '_from-' + by + (f.note ? '_FLAG' : '') + '_' + safe(f.fn);
        entries.push({ name: folder + '/' + saved, blob: f.blob }); rows.push([n, f.ts, by, f.fn, saved, f.note, 'https://discord.com/channels/@me/' + st.ch + '/' + f.msg]); }
      entries.unshift({ name: folder + '/_index_who_sent_what.csv', blob: new Blob(['﻿' + rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n')], { type: 'text/csv' }) });
    }
    zips[name] = await zip(entries); return `${name}: ${(zips[name].size / 1e6).toFixed(0)} MB, ${entries.length} entries — now mediaReview.sendToHelper('${name}')`;
  }
  function sendToHelper(name) { bc.postMessage({ name, blob: zips[name] }); return 'sent to helper tab; click its SAVE button, then confirm the file on disk'; }
  function free(label) { if (S[label]) S[label].files.forEach(f => { f.blob = null; }); return 'freed ' + label; }
  function dropZip(name) { delete zips[name]; return 'dropped ' + name; }

  window.mediaReview = { collect, sheet, closeSheet, flag, exclude, info, pack, sendToHelper, free, dropZip, _S: S, _zips: zips };
})();
'mediaReview loaded — set window.__childName = "<child display name>" for sheet colours';
