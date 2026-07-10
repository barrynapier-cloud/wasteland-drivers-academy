// ============================================================
// PERMIT LEGENDS — Accounts + cloud sync (Firebase edition)
// Username + password accounts (the pattern every kid knows) via
// Firebase Auth REST; progress lives in a Firestore `profiles/{uid}`
// doc guarded by owner-only security rules.
//
// Design rules:
//  - Anonymous play stays first-class. No feature requires an account.
//  - Zero client dependencies: plain fetch against Google REST APIs.
//  - Usernames without an @ become synthetic emails
//    (<slug>@players.permitlegends.com) so kids don't need email.
//  - Local save remains the source of truth mid-session; the cloud is
//    a mirror, merged on login (union of progress, best of totals).
// ============================================================
'use strict';

window.PL_BACKEND = window.PL_BACKEND || {
  apiKey: 'AIzaSyCm4G2o9XcPHC5pR-XLW2rKnkqHhBIdL8U', // public client key
  projectId: 'permitlegends'
};

const Account = (() => {
  const cfg = () => window.PL_BACKEND || {};
  const enabled = () => !!(cfg().apiKey && cfg().projectId);
  const AUTH = () => `https://identitytoolkit.googleapis.com/v1`;
  const DOC = (uid) => `https://firestore.googleapis.com/v1/projects/${cfg().projectId}/databases/(default)/documents/profiles/${uid}`;

  let session = null;   // {idToken, refreshToken, uid, email, username, exp}
  let profile = null;   // {unlocked, save}
  let pushTimer = null;

  // ---------- helpers ----------
  const slugify = (u) => (u || '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 30);
  function toEmail(usernameOrEmail) {
    const v = (usernameOrEmail || '').trim();
    if (v.includes('@')) return v.toLowerCase();
    const s = slugify(v);
    return s ? `${s}@players.permitlegends.com` : '';
  }
  const AUTH_ERRORS = {
    EMAIL_EXISTS: 'That username is taken. Try signing in instead.',
    EMAIL_NOT_FOUND: 'No account with that name. Try Create Account.',
    INVALID_LOGIN_CREDENTIALS: 'Wrong username or password.',
    INVALID_PASSWORD: 'Wrong password.',
    WEAK_PASSWORD: 'Password needs at least 6 characters.',
    'WEAK_PASSWORD : Password should be at least 6 characters': 'Password needs at least 6 characters.',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'Too many tries. Wait a minute and try again.'
  };
  const friendly = (code) => AUTH_ERRORS[code] || AUTH_ERRORS[(code || '').split(':')[0].trim()] || 'Something went wrong. Try again.';

  // ---------- session ----------
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
    if (session.exp && session.exp - Math.floor(Date.now() / 1000) > 120) return true;
    try {
      const r = await fetch(`https://securetoken.googleapis.com/v1/token?key=${cfg().apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(session.refreshToken)}`
      });
      const d = await r.json();
      if (!r.ok || !d.id_token) { storeSession(null); return false; }
      storeSession({ ...session, idToken: d.id_token, refreshToken: d.refresh_token, uid: d.user_id, exp: Math.floor(Date.now() / 1000) + (+d.expires_in || 3600) });
      return true;
    } catch (e) { return false; }
  }

  // ---------- auth ----------
  async function authCall(endpoint, usernameOrEmail, password) {
    const email = toEmail(usernameOrEmail);
    if (!email) return { ok: false, err: 'Pick a username first.' };
    if ((password || '').length < 6) return { ok: false, err: 'Password needs at least 6 characters.' };
    try {
      const r = await fetch(`${AUTH()}/accounts:${endpoint}?key=${cfg().apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      });
      const d = await r.json();
      if (!r.ok) return { ok: false, err: friendly(d.error && d.error.message) };
      storeSession({
        idToken: d.idToken, refreshToken: d.refreshToken, uid: d.localId,
        email, username: usernameOrEmail.includes('@') ? email : usernameOrEmail.trim(),
        exp: Math.floor(Date.now() / 1000) + (+d.expiresIn || 3600)
      });
      await afterLogin();
      return { ok: true };
    } catch (e) { return { ok: false, err: 'Network error. Check the connection.' }; }
  }
  const signUp = (u, p) => authCall('signUp', u, p);
  const signIn = (u, p) => authCall('signInWithPassword', u, p);
  function signOut() { storeSession(null); profile = null; render(); }

  // ---------- Firestore profile ----------
  const enc = (save) => JSON.stringify(save || null);
  function docToProfile(doc) {
    const f = (doc && doc.fields) || {};
    let save = null;
    try { save = JSON.parse((f.save && f.save.stringValue) || 'null'); } catch (e) {}
    return { unlocked: !!(f.unlocked && f.unlocked.booleanValue), save };
  }
  async function fetchProfile() {
    if (!session || !(await refreshIfNeeded())) return null;
    try {
      const r = await fetch(DOC(session.uid), { headers: { 'Authorization': `Bearer ${session.idToken}` } });
      if (r.status === 404) return { unlocked: false, save: null };
      if (!r.ok) return null;
      return docToProfile(await r.json());
    } catch (e) { return null; }
  }
  async function writeProfile(fields) {
    if (!session || !(await refreshIfNeeded())) return false;
    const body = { fields: {
      email: { stringValue: session.email },
      username: { stringValue: session.username || '' },
      unlocked: { booleanValue: !!fields.unlocked },
      save: { stringValue: enc(fields.save) },
      updatedAt: { timestampValue: new Date().toISOString() }
    } };
    try {
      const r = await fetch(DOC(session.uid), {
        method: 'PATCH', headers: { 'Authorization': `Bearer ${session.idToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return r.ok;
    } catch (e) { return false; }
  }

  function mergeSaves(local, remote) {
    if (!remote) return local;
    if (!local || !local.name) return remote;
    const localScore = (local.xp || 0) + Object.keys(local.completed || {}).length * 1000;
    const remoteScore = (remote.xp || 0) + Object.keys(remote.completed || {}).length * 1000;
    const merged = { ...(remoteScore > localScore ? remote : local) };
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
    profile = await fetchProfile() || { unlocked: false, save: null };
    let local = null;
    try { local = JSON.parse(localStorage.getItem('pl_save') || 'null'); } catch (e) {}
    const merged = mergeSaves(local, profile.save);
    if (merged) { try { localStorage.setItem('pl_save', JSON.stringify(merged)); } catch (e) {} }
    // A valid unlock code on this device grants the ACCOUNT the entitlement
    let unlocked = profile.unlocked;
    try {
      const code = localStorage.getItem('pl_unlock') || '';
      if (!unlocked && typeof validCode === 'function' && validCode(code)) unlocked = true;
      if (window.PL_NATIVE_PAID === true) unlocked = true; // paid store app
    } catch (e) {}
    await writeProfile({ unlocked, save: merged || profile.save });
    profile = { unlocked, save: merged };
    render();
  }

  function schedulePush() {
    if (!enabled() || !session) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      let local = null;
      try { local = JSON.parse(localStorage.getItem('pl_save') || 'null'); } catch (e) {}
      if (local) await writeProfile({ unlocked: !!(profile && profile.unlocked), save: local });
    }, 2500);
  }

  const isUnlocked = () => !!(profile && profile.unlocked);
  const who = () => (session && (session.username || session.email)) || null;

  // ---------- UI ----------
  function ensureModal() {
    if (document.getElementById('account-modal')) return;
    const m = document.createElement('div');
    m.id = 'account-modal';
    m.innerHTML = `
      <div class="acct-bg" id="acct-bg"></div>
      <div class="acct-card">
        <button class="acct-close" id="acct-close" aria-label="Close">×</button>
        <div id="acct-step-auth">
          <h3 class="acct-title">Save your run everywhere</h3>
          <p class="acct-sub">Pick a username and password. Your progress and unlock follow you to any phone or computer.</p>
          <input id="acct-user" placeholder="username" autocomplete="username" autocapitalize="off" />
          <input id="acct-pass" type="password" placeholder="password (6+ characters)" autocomplete="current-password" />
          <button class="primary-btn" id="acct-signin">Sign In →</button>
          <button class="ghost-btn" id="acct-signup">Create Account</button>
          <p class="acct-msg" id="acct-msg"></p>
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
    const msg = () => document.getElementById('acct-msg');
    const go = async (fn) => {
      msg().textContent = 'One sec…';
      const r = await fn(document.getElementById('acct-user').value, document.getElementById('acct-pass').value);
      if (r.ok) { showStep('in'); msg().textContent = ''; } else msg().textContent = r.err;
    };
    document.getElementById('acct-signin').addEventListener('click', () => go(signIn));
    document.getElementById('acct-signup').addEventListener('click', () => go(signUp));
    document.getElementById('acct-pass').addEventListener('keydown', (e) => { if (e.key === 'Enter') go(signIn); });
    document.getElementById('acct-signout').addEventListener('click', () => { signOut(); showStep('auth'); });
  }
  function showStep(step) {
    ['auth', 'in'].forEach(s => document.getElementById(`acct-step-${s}`).classList.toggle('hidden', s !== step));
    if (step === 'in') {
      document.getElementById('acct-who').textContent = who() || '';
      document.getElementById('acct-ent').textContent = isUnlocked()
        ? '✦ Full version unlocked on this account'
        : 'Free tier — unlock once, play everywhere';
    }
  }
  function openModal() {
    if (!enabled()) return;
    ensureModal();
    showStep(session ? 'in' : 'auth');
    document.getElementById('account-modal').classList.add('open');
  }
  function render() {
    const btn = document.getElementById('acct-hud-btn');
    if (btn) btn.textContent = session ? '☁ ✓' : '☁ Save';
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
    if (session && await refreshIfNeeded()) {
      profile = await fetchProfile();
      // pull newer cloud save into this device on boot
      if (profile && profile.save) {
        let local = null;
        try { local = JSON.parse(localStorage.getItem('pl_save') || 'null'); } catch (e) {}
        const merged = mergeSaves(local, profile.save);
        if (merged) { try { localStorage.setItem('pl_save', JSON.stringify(merged)); } catch (e) {} }
      }
    }
    mountHudButton();
    render();
  }

  return { init, openModal, schedulePush, isUnlocked, email: who, signOut, signIn, signUp };
})();

window.Account = Account;
document.addEventListener('DOMContentLoaded', () => { Account.init(); });
