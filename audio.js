// ============================================================
// WASTELAND DRIVERS ACADEMY — Audio engine
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

  function say(text, { pitch = 0.4, rate = 0.86, volume = 0.95 } = {}) {
    if (!voiceOn || !text || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (!demonVoice) demonVoice = pickDemonVoice();
      if (demonVoice) u.voice = demonVoice;
      u.pitch = pitch; u.rate = rate; u.volume = volume;
      speechSynthesis.speak(u);
    } catch (e) { /* speech not available — fail silent */ }
  }

  // ---- Pre-rendered ElevenLabs voice clips (high fidelity) ----
  // Files that exist as audio/<name>.mp3. bossCry/bossTaunt/bossDefeat
  // play these when present and fall back to SpeechSynthesis otherwise.
  const VOICE_CLIPS = new Set([
    'blood-cry', 'blood-taunt0', 'blood-taunt1', 'blood-taunt2', 'blood-defeat',
    'ember-cry', 'ember-taunt0', 'ember-taunt1', 'ember-taunt2', 'ember-defeat',
    'static-cry', 'static-taunt0', 'static-taunt1', 'static-taunt2', 'static-defeat',
    'iron-cry', 'iron-taunt0', 'iron-taunt1', 'iron-taunt2', 'iron-defeat',
    'thorn-cry', 'thorn-taunt0', 'thorn-taunt1', 'thorn-taunt2', 'thorn-defeat',
    'bone-cry', 'bone-taunt0', 'bone-taunt1', 'bone-taunt2', 'bone-defeat'
  ]);
  let currentClip = null;
  function playClip(name) {
    if (!voiceOn || !VOICE_CLIPS.has(name)) return false;
    try {
      if (currentClip) { try { currentClip.pause(); } catch (e) {} }
      const a = new Audio(`audio/${name}.mp3`);
      a.volume = 0.95;
      currentClip = a;
      a.play().catch(() => {});
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

  // ---- Boss taunt banks, keyed by chapter id ----
  const TAUNTS = {
    blood: {
      cry: "I am the toast at every wake. Drink, and drive into my arms.",
      strike: ["Your blood sings my song.", "One more for the road... your last.", "Point oh eight. That is all it takes."],
    },
    ember: {
      cry: "Your eyes belong to the screen now. Look away if you dare.",
      strike: ["Glance at me. Just for a second.", "The notification owns you.", "Eyes off the road, little driver."],
    },
    static: {
      cry: "I live in the blind spot. The child you never saw.",
      strike: ["You did not see them.", "Twenty miles an hour, and still too fast.", "The crosswalk is mine."],
    },
    iron: {
      cry: "Every sign is a riddle. Read wrong, and bleed.",
      strike: ["You misread the iron.", "Red means stop. You did not.", "The markings betray you."],
    },
    thorn: {
      cry: "Six roads cross here, and every one is mine to grant.",
      strike: ["You took what was not yours.", "Yield, or be taken.", "First passage belongs to me."],
    },
    bone: {
      cry: "I keep the final ledger. Every error written in bone.",
      strike: ["Another mark against you.", "The ledger remembers.", "You are almost spent."],
    }
  };
  function bank() { return tauntBank || TAUNTS; }
  function bossCry(chapterId) {
    if (clipsAvailable && playClip(`${chapterId}-cry`)) return;
    const t = bank()[chapterId]; if (t) say(t.cry, { pitch: 0.35, rate: 0.82 });
  }
  function bossTaunt(chapterId) {
    const t = bank()[chapterId];
    const n = (t && t.strike.length) ? t.strike.length : 3;
    const i = Math.floor(Math.random() * n);
    if (clipsAvailable && playClip(`${chapterId}-taunt${i}`)) return;
    if (t && t.strike.length) say(t.strike[i] || t.strike[0], { pitch: 0.38, rate: 0.9 });
  }
  function bossDefeat(chapterId, fallbackText) {
    if (clipsAvailable && playClip(`${chapterId}-defeat`)) return;
    if (fallbackText) say(fallbackText, { pitch: 0.45, rate: 0.8 });
  }

  // Theme hooks
  function setFlavor(f) { if (f && f.lead && f.bass) flavor = f; }
  function setTauntBank(newBank, hasClips) {
    tauntBank = newBank || null;
    clipsAvailable = hasClips === true;
  }

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
    fx: FX, say, shutUp, bossCry, bossTaunt, bossDefeat,
    setSfx, setVoice, isSfxOn, isVoiceOn, unlock,
    setFlavor, setTauntBank
  };
})();

// Expose globally — top-level `const` does not attach to window,
// and the rest of the app guards on `window.Sound`.
window.Sound = Sound;
