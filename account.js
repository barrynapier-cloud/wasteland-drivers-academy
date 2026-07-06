// ============================================================
// PERMIT LEGENDS — Accounts + cloud sync (optional layer)
// Email magic-code login via Supabase Auth REST, progress sync to a
// `profiles` row, entitlement that follows the player across devices.
//
// Design rules:
//  - Anonymous play stays first-class. No feature requires an account.
//  - Zero client dependencies: plain fetch against Supabase REST.
//  - If PL_BACKEND is unconfigured or unreachable, every hook is a
//    silent no-op and the game behaves exactly as before.
//  - Local save remains the source of truth mid-session; the cloud is
//    a mirror, merged on login (union of progress, best of totals).
// ============================================================
'use strict';

// Filled at deploy time; empty url disables the whole layer.
window.PL_BACKEND = window.PL_BACKEND || {
  url: '',   // e.g. https://xxxx.supabase.co
  key: ''    // publishable/anon key (safe for client)
};

const Account = (() => {
  const cfg = () => window.PL_BACKEND || {};
  const enabled = () => !!(cfg().url && cfg().key);
  const H = (session) => {
    const h = { 'apikey': cfg().key, 'Content-Type': 'application/json' };
    if (session) h['Authorization'] = `Bearer ${session.access_token}`;
    return h;
  };

  let session = null;      // {access_token, refresh_token, user:{id,email}, expires_at}
  let profile = null;      // {unlocked, save}
  let pushTimer = null;

  // ---------- session persistence ----------
  function loadSession() {
    try { session = JSON.parse(localStorage.getItem('pl_session') || 'null'); } catch (e) { session = null; }
    return session;
  }
  function storeSession(s) {
    session = s;
    try { s ? localStorage.setItem('pl_session', JSON.stringify(s)) : localStorage.removeItem('pl_session'); } catch (e) {}
  }

  async function refreshIfNeeded() {
    if (!session) return false;
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at - now > 60) return true;
    try {
      const r = await fetch(`${cfg().url}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST', headers: H(),
        body: JSON.stringify({ refresh_token: session.refresh_token })
      });
      if (!r.ok) { storeSession(null); return false; }
      const d = await r.json();
      storeSession({ access_token: d.access_token, refresh_token: d.refresh_token, user: d.user, expires_at: Math.floor(Date.now() / 1000) + (d.expires_in || 3600) });
      return true;
    } catch (e) { return false; }
  }

  // ---------- auth ----------
  async function requestCode(email) {
    if (!enabled()) return { ok: false, err: 'accounts not configured' };
    try {
      const r = await fetch(`${cfg().url}/auth/v1/otp`, {
        method: 'POST', headers: H(),
        body: JSON.stringify({ email, create_user: true })
      });
      if (!r.ok) { const e = await r.json().catch(() => ({})); return { ok: false, err: e.msg || e.error_description || 'could not send code' }; }
      return { ok: true };
    } catch (e) { return { ok: false, err: 'network error' }; }
  }

  async function verifyCode(email, token) {
    if (!enabled()) return { ok: false, err: 'accounts not configured' };
    try {
      const r = await fetch(`${cfg().url}/auth/v1/verify`, {
        method: 'POST', headers: H(),
        body: JSON.stringify({ type: 'email', email, token })
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.access_token) return { ok: false, err: d.msg || d.error_description || 'wrong code' };
      storeSession({ access_token: d.access_token, refresh_token: d.refresh_token, user: d.user, expires_at: Math.floor(Date.now() / 1000) + (d.expires_in || 3600) });
      await afterLogin();
      return { ok: true };
    } catch (e) { return { ok: false, err: 'network error' }; }
  }

  // Magic-link return: play.html#access_token=...&refresh_token=...
  async function adoptHashSession() {
    if (!enabled() || !location.hash.includes('access_token=')) return false;
    const p = new URLSearchParams(location.hash.slice(1));
    const at = p.get('access_token'), rt = p.get('refresh_token');
    if (!at) return false;
    history.replaceState(null, '', location.pathname + location.search);
    try {
      const r = await fetch(`${cfg().url}/auth/v1/user`, { headers: { ...H(), 'Authorization': `Bearer ${at}` } });
      const user = await r.json();
      if (!r.ok || !user.id) return false;
      storeSession({ access_token: at, refresh_token: rt, user, expires_at: Math.floor(Date.now() / 1000) + 3600 });
      await afterLogin();
      return true;
    } catch (e) { return false; }
  }

  function signOut() {
    storeSession(null);
    profile = null;
    render();
  }

  // ---------- profile: fetch / merge / push ----------
  async function fetchProfile() {
    if (!session) return null;
    const r = await fetch(`${cfg().url}/rest/v1/profiles?id=eq.${session.user.id}&select=unlocked,save`, { headers: H(session) });
    if (!r.ok) return null;
    const rows = await r.json();
    return rows[0] || null;
  }

  function mergeSaves(local, remote) {
    if (!remote) return local;
    if (!local || !local.name) return remote;
    const merged = { ...((remote.xp || 0) + Object.keys(remote.completed || {}).length * 1000 >
                        (local.xp || 0) + Object.keys(local.completed || {}).length * 1000 ? remote : local) };
    merged.completed = { ...(local.completed || {}), ...(remote.completed || {}) };
    merged.xp = Math.max(local.xp || 0, remote.xp || 0);
    merged.level = Math.max(local.level || 1, remote.level || 1);
    merged.bestStreak = Math.max(local.bestStreak || 0, remote.bestStreak || 0);
    const seen = new Set();
    merged.mistakes = [...(local.mistakes || []), ...(remote.mistakes || [])]
      .filter(m => m && m.key && !seen.has(m.key) && seen.add(m.key));
    const sig = new Set();
    merged.sigils = [...(local.sigils || []), ...(remote.sigils || [])]
      .filter(s => s && !sig.has(s.chapterId) && sig.add(s.chapterId));
    merged.revealed = [...new Set([...(local.revealed || []), ...(remote.revealed || [])])];
    return merged;
  }

  async function afterLogin() {
    profile = await fetchProfile();
    // Merge cloud save with whatever this device has
    let local = null;
    try { local = JSON.parse(localStorage.getItem('pl_save') || 'null'); } catch (e) {}
    const merged = mergeSaves(local, profile && profile.save);
    if (merged) { try { localStorage.setItem('pl_save', JSON.stringify(merged)); } catch (e) {} }
    // A valid local unlock code grants the ACCOUNT the entitlement too
    let unlocked = !!(profile && profile.unlocked);
    try {
      const code = localStorage.getItem('pl_unlock') || '';
      if (!unlocked && typeof validCode === 'function' && validCode(code)) unlocked = true;
    } catch (e) {}
    await upsertProfile({ unlocked, save: merged || (profile && profile.save) || null });
    profile = { unlocked, save: merged };
    render();
  }

  async function upsertProfile(fields) {
    if (!session || !(await refreshIfNeeded())) return;
    try {
      await fetch(`${cfg().url}/rest/v1/profiles`, {
        method: 'POST',
        headers: { ...H(session), 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify([{ id: session.user.id, email: session.user.email, updated_at: new Date().toISOString(), ...fields }])
      });
    } catch (e) { /* offline — local save still holds */ }
  }

  // Debounced push, called from the game's saveProgress
  function schedulePush() {
    if (!enabled() || !session) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      let local = null;
      try { local = JSON.parse(localStorage.getItem('pl_save') || 'null'); } catch (e) {}
      if (local) await upsertProfile({ save: local });
    }, 2500);
  }

  const isUnlocked = () => !!(profile && profile.unlocked);
  const email = () => (session && session.user && session.user.email) || null;

  // ---------- minimal UI ----------
  function ensureModal() {
    if (document.getElementById('account-modal')) return;
    const m = document.createElement('div');
    m.id = 'account-modal';
    m.innerHTML = `
      <div class="acct-bg" id="acct-bg"></div>
      <div class="acct-card">
        <button class="acct-close" id="acct-close" aria-label="Close">×</button>
        <div id="acct-step-email">
          <h3 class="acct-title">Save your run everywhere</h3>
          <p class="acct-sub">Enter an email and we'll send a 6-digit code. Your progress and unlock follow you to any phone or computer.</p>
          <input id="acct-email" type="email" placeholder="you@example.com" autocomplete="email" />
          <button class="primary-btn" id="acct-send">Send Code →</button>
          <p class="acct-msg" id="acct-msg-1"></p>
        </div>
        <div id="acct-step-code" class="hidden">
          <h3 class="acct-title">Check your email</h3>
          <p class="acct-sub">Enter the 6-digit code (or tap the link in the email on this device).</p>
          <input id="acct-code" inputmode="numeric" maxlength="6" placeholder="123456" />
          <button class="primary-btn" id="acct-verify">Sign In →</button>
          <p class="acct-msg" id="acct-msg-2"></p>
        </div>
        <div id="acct-step-in" class="hidden">
          <h3 class="acct-title">Signed in</h3>
          <p class="acct-sub" id="acct-who"></p>
          <p class="acct-sub" id="acct-ent"></p>
          <button class="ghost-btn" id="acct-signout">Sign Out</button>
        </div>
      </div>`;
    document.body.appendChild(m);
    const close = () => m.classList.remove('open');
    document.getElementById('acct-close').addEventListener('click', close);
    document.getElementById('acct-bg').addEventListener('click', close);
    document.getElementById('acct-send').addEventListener('click', async () => {
      const em = document.getElementById('acct-email').value.trim();
      const msg = document.getElementById('acct-msg-1');
      if (!/.+@.+\..+/.test(em)) { msg.textContent = 'That email looks off.'; return; }
      msg.textContent = 'Sending…';
      const r = await requestCode(em);
      if (r.ok) {
        m.dataset.email = em;
        document.getElementById('acct-step-email').classList.add('hidden');
        document.getElementById('acct-step-code').classList.remove('hidden');
      } else msg.textContent = r.err;
    });
    document.getElementById('acct-verify').addEventListener('click', async () => {
      const msg = document.getElementById('acct-msg-2');
      msg.textContent = 'Checking…';
      const r = await verifyCode(m.dataset.email, document.getElementById('acct-code').value.trim());
      if (r.ok) showStep('in'); else msg.textContent = r.err;
    });
    document.getElementById('acct-signout').addEventListener('click', () => { signOut(); showStep('email'); });
  }
  function showStep(step) {
    ['email', 'code', 'in'].forEach(s => document.getElementById(`acct-step-${s}`).classList.toggle('hidden', s !== step));
    if (step === 'in') {
      document.getElementById('acct-who').textContent = email() || '';
      document.getElementById('acct-ent').textContent = isUnlocked() ? '✦ Full version unlocked on this account' : 'Free tier — unlock once, play everywhere';
    }
  }
  function openModal() {
    if (!enabled()) return;
    ensureModal();
    showStep(session ? 'in' : 'email');
    document.getElementById('account-modal').classList.add('open');
  }
  function render() {
    const btn = document.getElementById('acct-hud-btn');
    if (btn) btn.textContent = session ? '☁ ✓' : '☁ Save';
    // Re-render the map if visible so entitlement changes take effect
    if (typeof renderMap === 'function' && document.getElementById('scene-map') &&
        document.getElementById('scene-map').classList.contains('active')) renderMap();
  }
  function mountHudButton() {
    if (!enabled()) return;
    const hudAudio = document.querySelector('.hud-audio');
    if (!hudAudio || document.getElementById('acct-hud-btn')) return;
    const b = document.createElement('button');
    b.id = 'acct-hud-btn';
    b.className = 'audio-toggle acct-btn';
    b.title = 'Account & cloud save';
    b.textContent = session ? '☁ ✓' : '☁ Save';
    b.addEventListener('click', openModal);
    hudAudio.appendChild(b);
  }

  async function init() {
    if (!enabled()) return;
    loadSession();
    const adopted = await adoptHashSession();
    if (!adopted && session && await refreshIfNeeded()) {
      profile = await fetchProfile();
    }
    mountHudButton();
    render();
  }

  return { init, openModal, schedulePush, isUnlocked, email, signOut };
})();

window.Account = Account;
document.addEventListener('DOMContentLoaded', () => { Account.init(); });
