/*
 * download-helper.js — works around Chrome's "one automatic download per tab" rule.
 * 1. Open a NEW tab at https://discord.com/robots.txt (same site, so tabs can talk to each other).
 * 2. Paste this file there. A green SAVE button appears.
 * 3. In the Discord tab, send files to it (mediaReview.sendToHelper('x.zip') or
 *    new BroadcastChannel('__child_safety_zip').postMessage({ name, blob })).
 * 4. Click SAVE once per file (a real click counts as a user gesture). If Chrome still blocks the
 *    second file, open another fresh helper tab — the first download in a new tab is always allowed —
 *    or allow discord.com under Site settings → Automatic downloads.
 */
(() => {
  window.__q = [];
  const bc = new BroadcastChannel('__child_safety_zip');
  const b = document.createElement('button');
  const label = () => { b.textContent = __q.length ? `SAVE ${__q[0].name} (${__q.length} waiting)` : 'SAVE (waiting for files)'; };
  bc.onmessage = e => { __q.push(e.data); label(); };
  b.style.cssText = 'position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);padding:24px 36px;font:700 20px system-ui;background:#16a34a;color:#fff;border:0;border-radius:12px;cursor:pointer;z-index:2147483647';
  b.onclick = () => { const z = __q.shift(); if (!z) return; const a = document.createElement('a'); a.href = URL.createObjectURL(z.blob); a.download = z.name; document.body.appendChild(a); a.click(); a.remove(); label(); };
  label(); document.body.appendChild(b);
})();
'download helper ready';
