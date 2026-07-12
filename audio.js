// ============================================================
// PERMIT LEGENDS — Audio engine
// Pure Web Audio API synthesis (no asset files) + browser
// SpeechSynthesis for demon voiceovers. Zero dependencies,
// works offline, matches the no-build static stack.
// ============================================================
'use strict';

const Sound = (() => {
  let ctx = null;
  let master = null;
  let sfxOn = true;
  let voiceOn = true;
  let unlocked = false;
  let demonVoice = null;
  // Theme sound personality — which waveforms the FX lean on.
  let flavor = { lead: 'triangle', bass: 'sawtooth' };
  // Active taunt bank + whether pre-rendered clips exist for it.
  let tauntBank = null;
  let clipsAvailable = true;

  // AudioContext must be created/resumed from a user gesture.
  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function now() { return ctx.currentTime; }

  // ---- Primitive: a single shaped oscillator voice ----
  function tone({ type = 'sine', freq = 440, dur = 0.2, gain = 0.2, attack = 0.005, decay = null, glideTo = null, delay = 0 } = {}) {
    if (!sfxOn) return;
    const c = ensure(); if (!c) return;
    const t0 = now() + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, glideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // ---- Primitive: filtered noise burst (slashes, impacts) ----
  function noise({ dur = 0.25, gain = 0.3, type = 'highpass', freq = 1200, q = 0.8, glideTo = null, delay = 0 } = {}) {
    if (!sfxOn) return;
    const c = ensure(); if (!c) return;
    const t0 = now() + delay;
    const frames = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, frames, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const src = c.createBufferSource();
    src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = type;
    filt.frequency.setValueAtTime(freq, t0);
    if (glideTo) filt.frequency.exponentialRampToValueAtTime(Math.max(40, glideTo), t0 + dur);
    filt.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filt); filt.connect(g); g.connect(master);
    src.start(t0);
  }

  function chord(freqs, opts = {}) { freqs.forEach((f, i) => tone({ ...opts, freq: f, delay: (opts.stagger || 0) * i })); }

  // ============================================================
  // Named sound effects
  // ============================================================
  const FX = {
    ui()      { tone({ type: flavor.lead, freq: 320, dur: 0.07, gain: 0.12, glideTo: 200 }); },
    select()  { chord([523, 784], { type: flavor.lead, dur: 0.16, gain: 0.14, stagger: 0.05 }); },
    hover()   { tone({ type: 'sine', freq: 660, dur: 0.05, gain: 0.05 }); },

    correct() { chord([659, 880, 1319], { type: flavor.lead, dur: 0.28, gain: 0.16, stagger: 0.06 }); },
    wrong()   { tone({ type: flavor.bass, freq: 160, dur: 0.32, gain: 0.18, glideTo: 70 });
                tone({ type: 'square', freq: 110, dur: 0.3, gain: 0.08, glideTo: 60 }); },

    // Hero strike: a metal slash + thud
    slash()   { noise({ dur: 0.22, gain: 0.32, type: 'highpass', freq: 3000, glideTo: 600 });
                tone({ type: 'triangle', freq: 420, dur: 0.12, gain: 0.16, glideTo: 180, delay: 0.04 }); },

    // Critical: bigger slash, ring-out shimmer
    crit()    { noise({ dur: 0.3, gain: 0.4, type: 'highpass', freq: 4200, glideTo: 500 });
                chord([1047, 1568, 2093], { type: 'sine', dur: 0.5, gain: 0.12, stagger: 0.03 });
                tone({ type: 'sawtooth', freq: 260, dur: 0.18, gain: 0.14, glideTo: 90, delay: 0.02 }); },

    // Boss claws back: growl sweep + low impact
    bossStrike() { tone({ type: flavor.bass, freq: 220, dur: 0.4, gain: 0.2, glideTo: 50 });
                   noise({ dur: 0.35, gain: 0.34, type: 'lowpass', freq: 900, glideTo: 120, delay: 0.05 });
                   tone({ type: 'square', freq: 80, dur: 0.3, gain: 0.18, glideTo: 40, delay: 0.08 }); },

    combo(n)  { const base = 520 + Math.min(8, n) * 90;
                tone({ type: flavor.lead, freq: base, dur: 0.14, gain: 0.14, glideTo: base * 1.5 }); },

    victory() { const seq = [523, 659, 784, 1047, 1319];
                seq.forEach((f, i) => tone({ type: flavor.lead, freq: f, dur: 0.3, gain: 0.16, delay: i * 0.12 }));
                chord([523, 784, 1047], { type: 'sine', dur: 1.2, gain: 0.1, delay: 0.6 }); },

    defeat()  { const seq = [330, 294, 247, 196];
                seq.forEach((f, i) => tone({ type: flavor.bass, freq: f, dur: 0.5, gain: 0.14, delay: i * 0.22, glideTo: f * 0.92 })); },

    levelup() { const seq = [659, 880, 1047, 1319, 1760];
                seq.forEach((f, i) => tone({ type: 'sine', freq: f, dur: 0.25, gain: 0.13, delay: i * 0.07 })); },

    sigil()   { chord([784, 1175, 1568], { type: 'sine', dur: 0.9, gain: 0.1, stagger: 0.08 });
                noise({ dur: 0.6, gain: 0.06, type: 'highpass', freq: 5000 }); },

    tick()    { tone({ type: 'square', freq: 900, dur: 0.04, gain: 0.08 }); },
    timesUp() { tone({ type: 'sawtooth', freq: 200, dur: 0.6, gain: 0.18, glideTo: 80 }); },
    start()   { chord([392, 523, 659], { type: flavor.lead, dur: 0.4, gain: 0.14, stagger: 0.08 }); }
  };

  // ============================================================
  // Voice (SpeechSynthesis) — the demon speaks
  // ============================================================
  function pickDemonVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return null;
    // Prefer a deep/male English voice for the demon.
    const pref = ['Daniel', 'Google UK English Male', 'Microsoft David', 'Fred', 'Alex', 'Arthur', 'Rishi'];
    for (const name of pref) {
      const v = voices.find(x => x.name.includes(name));
      if (v) return v;
    }
    return voices.find(v => /en[-_]/i.test(v.lang)) || voices[0];
  }

  function say(text, { pitch = 0.4, rate = 0.86, volume = 0.95, deep = true } = {}) {
    if (!voiceOn || !text || !('speechSynthesis' in window)) return;
    if (window.Music && Music.duck) Music.duck(3); // dip music under the line
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (deep) { if (!demonVoice) demonVoice = pickDemonVoice(); if (demonVoice) u.voice = demonVoice; }
      u.pitch = pitch; u.rate = rate; u.volume = volume;
      speechSynthesis.speak(u);
    } catch (e) { /* speech not available — fail silent */ }
  }

  // ---- Pre-rendered ElevenLabs voice clips (high fidelity) ----
  // Availability is driven by audio/manifest.json (an array of clip
  // paths like "wasteland/blood-cry" or "heroes/vex-intro"), loaded at
  // boot. Any path not in the manifest falls back to the browser voice
  // using the same written line, so partial rollouts never go silent.
  let clipSet = new Set();
  let currentThemeId = 'wasteland';
  if (typeof fetch === 'function') {
    fetch('audio/manifest.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : []).then(list => {
      if (Array.isArray(list)) clipSet = new Set(list);
    }).catch(() => {});
  }
  let currentClip = null;
  // Returns true if a real clip exists and was started. If playback is
  // rejected (autoplay block, decode error), the optional onFail fires so
  // the browser-voice fallback still speaks the line.
  function playClip(path, onFail) {
    if (!voiceOn || !clipSet.has(path)) return false;
    if (window.Music && Music.duck) Music.duck(3.5); // dip music under the clip
    try {
      if (currentClip) { try { currentClip.pause(); } catch (e) {} }
      const a = new Audio(`audio/${path}.mp3`);
      a.volume = 0.95;
      currentClip = a;
      a.play().catch(() => { if (typeof onFail === 'function') onFail(); });
      a.addEventListener('error', () => { if (typeof onFail === 'function') onFail(); }, { once: true });
      return true;
    } catch (e) { return false; }
  }

  function shutUp() {
    if ('speechSynthesis' in window) try { speechSynthesis.cancel(); } catch (e) {}
    if (currentClip) { try { currentClip.pause(); } catch (e) {} currentClip = null; }
  }

  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = () => { demonVoice = pickDemonVoice(); };
  }

  // The active theme's boss bank (houseId -> {cry, strike[], defeat[]}).
  // Provided by themes.js via setBossBank; falls back to a built-in set.
  const FALLBACK_BANK = {
    blood: { cry: "One drink is all it takes.", strike: ["Point oh eight."], defeat: ["You stayed under the line."] },
    ember: { cry: "Legal does not mean safe.", strike: ["Your reflexes slow."], defeat: ["You knew the difference."] },
    static: { cry: "Just one look.", strike: ["You did not see them."], defeat: ["Eyes on the road. Always."] },
    iron: { cry: "Read the sign wrong and pay.", strike: ["Red means stop."], defeat: ["You read them all true."] },
    thorn: { cry: "Who goes first? Choose.", strike: ["You did not yield."], defeat: ["You knew whose turn it was."] },
    bone: { cry: "Every number, remembered.", strike: ["Another mark."], defeat: ["The account is clean."] }
  };
  function bank() { return tauntBank || FALLBACK_BANK; }

  // Show the spoken line on-screen too (subtitles / muted play / a11y).
  // The app registers window.PL_onBossSpeak to render a speech bubble.
  function announce(text) {
    if (text) { try { if (window.PL_onBossSpeak) window.PL_onBossSpeak(text); } catch (e) {} }
  }

  function bossCry(houseId) {
    const t = bank()[houseId];
    if (t) announce(t.cry);
    if (playClip(`${currentThemeId}/${houseId}-cry`, () => t && say(t.cry, { pitch: 0.4, rate: 0.85 }))) return;
    if (t) say(t.cry, { pitch: 0.4, rate: 0.85 });
  }
  function bossTaunt(houseId) {
    const t = bank()[houseId];
    const lines = (t && t.strike) || [];
    const n = lines.length || 3;
    const i = Math.floor(Math.random() * n);
    if (lines.length) announce(lines[i] || lines[0]);
    if (playClip(`${currentThemeId}/${houseId}-taunt${i}`, () => lines.length && say(lines[i] || lines[0], { pitch: 0.42, rate: 0.92 }))) return;
    if (lines.length) say(lines[i] || lines[0], { pitch: 0.42, rate: 0.92 });
  }
  function bossDefeat(houseId, fallbackText) {
    const t = bank()[houseId];
    const lines = (t && t.defeat) || (fallbackText ? [fallbackText] : []);
    const n = lines.length || 1;
    const i = Math.floor(Math.random() * n);
    if (lines.length) announce(lines[i] || lines[0]);
    if (playClip(`${currentThemeId}/${houseId}-defeat${i}`, () => lines.length && say(lines[i] || lines[0], { pitch: 0.5, rate: 0.82 }))) return;
    if (lines.length) say(lines[i] || lines[0], { pitch: 0.5, rate: 0.82 });
  }

  // Hero voices — played on driver select and on victory. Fallback uses
  // the normal browser voice (not the deep villain voice).
  function heroVoice(heroId, kind) {
    if (!heroId) return;
    const cast = (window.VOICE_CAST && VOICE_CAST.heroes && VOICE_CAST.heroes[heroId]) || null;
    const line = cast && cast[kind];
    if (line) { try { if (window.PL_onHeroSpeak) window.PL_onHeroSpeak(line); } catch (e) {} }
    if (playClip(`heroes/${heroId}-${kind}`, () => line && say(line, { pitch: 1.0, rate: 1.0, deep: false }))) return;
    if (line) say(line, { pitch: 1.0, rate: 1.0, deep: false });
  }

  // Theme hooks
  function setFlavor(f) { if (f && f.lead && f.bass) flavor = f; }
  function setTheme(themeId) { if (themeId) currentThemeId = themeId; }
  function setBossBank(newBank) { tauntBank = newBank || null; }
  // Back-compat shim for older callers.
  function setTauntBank(newBank) { tauntBank = newBank || null; }

  // ============================================================
  // Toggles + boot
  // ============================================================
  function setSfx(on) { sfxOn = on; if (on) ensure(); }
  function setVoice(on) { voiceOn = on; if (!on) shutUp(); }
  function isSfxOn() { return sfxOn; }
  function isVoiceOn() { return voiceOn; }

  // Unlock audio on the first interaction anywhere.
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    ensure();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    demonVoice = pickDemonVoice();
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
    window.addEventListener(ev, unlock, { once: false, passive: true }));

  return {
    fx: FX, say, shutUp, bossCry, bossTaunt, bossDefeat, heroVoice,
    setSfx, setVoice, isSfxOn, isVoiceOn, unlock,
    setFlavor, setTheme, setBossBank, setTauntBank
  };
})();

// Expose globally — top-level `const` does not attach to window,
// and the rest of the app guards on `window.Sound`.
window.Sound = Sound;
