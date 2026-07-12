// ============================================================
// PERMIT LEGENDS — Music engine
// Procedural chiptune, zero asset files. Every world gets its own
// map theme (tempo, key, waveforms, groove); battle mode switches
// to that world's battle base blended with a per-boss motif, so
// all 30 fights sound distinct. Web Audio square/triangle/noise =
// authentic 8/16-bit character.
//
// API (window.Music):
//   setTheme(id)          — switch world ('wasteland'|'neon'|...)
//   scene(kind, houseId)  — 'world' | 'battle' (houseId picks motif) | 'off'
//   setOn(on) / isOn()    — toggle; off-state persists in localStorage
//   duck(seconds)         — dip volume under a voice line
// Starts on the first user gesture (autoplay policy), like Sound.
// ============================================================
'use strict';

window.Music = (function () {
  let ctx = null, master = null, delaySend = null, delayGain = null;
  let musicOn = true;
  try { musicOn = localStorage.getItem('pl_music') !== 'off'; } catch (e) {}

  let themeId = 'wasteland';
  let mode = 'world';          // 'world' | 'battle' | 'off'
  let houseId = null;          // active boss for battle motif
  let unlocked = false;

  // Sequencer state
  let timer = null, nextNoteTime = 0, step = 0, bar = 0;
  const LOOKAHEAD_MS = 30, SCHEDULE_AHEAD = 0.12;

  const VOL = 0.14;            // music sits under sfx + voice
  const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // ---------------------------------------------------------
  // WORLD SONGBOOK
  // Map themes: 16th-note grids. bass = 16 steps/bar (nulls rest),
  // lead = 32 steps (2 bars), played over a 4-bar chord loop via
  // barRoots (semitone offsets added per bar). Drums are 16-step masks.
  // Battle base: bpm, root, 4-bar progression; the boss motif rides it.
  // ---------------------------------------------------------
  const W = {
    wasteland: { // gothic waltz-march in A minor — solemn, beautiful, doomy
      map: {
        bpm: 96, waveLead: 'triangle', waveBass: 'sawtooth', echo: 0.30,
        barRoots: [0, -4, -2, -5],                       // Am F G E
        bass:  [45,null,null,null, 52,null,45,null, 45,null,null,null, 52,null,57,null],
        lead:  [69,null,null,72,  null,null,76,null, 74,null,72,null,  71,null,null,null,
                69,null,null,72,  null,null,76,null, 79,null,77,null,  76,null,74,null],
        leadAlt: [76,null,null,77, null,null,76,null, 74,null,71,null,  68,null,null,null,
                  69,null,null,64, null,null,69,null, 72,null,71,null,  69,null,null,null],
        kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        hat:   [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,1],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]
      },
      battle: { bpm: 132, root: 45, prog: [0, 0, -4, -2], waveLead: 'square', waveBass: 'sawtooth', echo: 0.18 }
    },

    neon: { // synthwave driver in E minor — pumping 16th bass, wet echo
      map: {
        bpm: 118, waveLead: 'square', waveBass: 'sawtooth', echo: 0.22,
        barRoots: [0, -4, -2, -7],                       // Em C D  A(low)
        bass:  [40,40,52,40, 40,40,52,40, 40,40,52,40, 40,40,52,52],
        lead:  [64,null,null,null, 67,null,64,null, 71,null,null,69, null,null,67,null,
                64,null,null,null, 67,null,71,null, 74,null,null,72, null,71,null,null],
        leadAlt: [76,null,74,null, 71,null,null,null, 69,null,67,null, 64,null,null,null,
                  62,null,64,null, 67,null,null,null, 64,null,null,null, null,null,null,null],
        kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        hat:   [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1]
      },
      battle: { bpm: 142, root: 40, prog: [0, 0, -2, 1], waveLead: 'sawtooth', waveBass: 'square', echo: 0.15 }
    },

    cosmic: { // weightless lydian drift in C — arps like starfields
      map: {
        bpm: 100, waveLead: 'sine', waveBass: 'triangle', echo: 0.42,
        barRoots: [0, 2, -3, -1],                        // C D A  B
        bass:  [48,null,null,null, null,null,null,null, 55,null,null,null, null,null,null,null],
        lead:  [72,null,76,null, 79,null,83,null, 78,null,79,null, 83,null,84,null,
                79,null,78,null, 76,null,72,null, 74,null,76,null, null,null,null,null],
        leadAlt: [84,null,83,null, 79,null,78,null, 76,null,74,null, 72,null,null,null,
                  71,null,72,null, 74,null,76,null, 79,null,null,null, null,null,null,null],
        kick:  [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
        hat:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      battle: { bpm: 128, root: 48, prog: [0, -3, -1, 2], waveLead: 'square', waveBass: 'triangle', echo: 0.30 }
    },

    realm: { // dorian folk quest in D — flute over a marching drone
      map: {
        bpm: 104, waveLead: 'triangle', waveBass: 'square', echo: 0.26,
        barRoots: [0, 0, -2, -4],                        // Dm Dm C  Bb-ish
        bass:  [50,null,50,null, 57,null,50,null, 50,null,50,null, 57,null,62,null],
        lead:  [74,null,76,null, 77,null,79,null, 81,null,79,null, 77,null,76,null,
                74,null,72,null, 74,null,77,null, 76,null,74,null, 72,null,null,null],
        leadAlt: [81,null,82,null, 81,null,79,null, 77,null,76,null, 74,null,null,null,
                  72,null,74,null, 76,null,77,null, 74,null,null,null, null,null,null,null],
        kick:  [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,0],
        hat:   [0,0,1,0, 0,1,0,0, 0,0,1,0, 0,1,0,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]
      },
      battle: { bpm: 134, root: 50, prog: [0, 0, -2, -4], waveLead: 'square', waveBass: 'sawtooth', echo: 0.20 }
    },

    cozy: { // major-pentatonic stroll in C — bouncy, round, warm
      map: {
        bpm: 92, waveLead: 'sine', waveBass: 'sine', echo: 0.18,
        barRoots: [0, 5, -3, 0],                         // C F A  C
        bass:  [48,null,55,null, 48,null,55,null, 48,null,55,null, 52,null,55,null],
        lead:  [72,null,74,null, 76,null,null,74, 72,null,null,null, 69,null,72,null,
                74,null,76,null, 79,null,null,76, 74,null,72,null,  null,null,null,null],
        leadAlt: [79,null,81,null, 79,null,76,null, 74,null,76,null, 72,null,null,null,
                  69,null,72,null, 74,null,72,null, 67,null,null,null, null,null,null,null],
        kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        hat:   [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]
      },
      battle: { bpm: 122, root: 48, prog: [0, 0, 5, -3], waveLead: 'triangle', waveBass: 'sine', echo: 0.14 }
    }
  };

  // ---------------------------------------------------------
  // BOSS MOTIFS — 16-step riffs (semitone offsets from the world's
  // battle root + 24, nulls rest), transposed per bar by the world's
  // progression. Same boss "song" wears each world's sound palette,
  // so blood-house in neon and blood-house in realm share DNA but
  // sound like their world. Each fight = world base × house motif.
  // ---------------------------------------------------------
  const MOTIFS = {
    blood:  { riff: [0,null,0,1,   null,0,-1,null,  0,null,1,null,   3,null,1,0],    drum: 'heavy' },  // chromatic creep
    ember:  { riff: [0,0,null,3,   null,0,0,null,   5,null,3,null,   0,null,-2,null], drum: 'sync' },  // syncopated stabs
    static: { riff: [12,null,12,12, null,10,null,8, 12,null,13,12,   null,10,8,null], drum: 'jitter' }, // jittery highs
    iron:   { riff: [0,null,null,null, 7,null,null,null, 0,null,0,null, 7,5,3,null],  drum: 'march' },  // iron march
    thorn:  { riff: [0,3,7,3,      0,3,7,10,        7,3,0,-2,        0,3,7,3],        drum: 'roll' },   // weaving thirds
    bone:   { riff: [12,null,11,null, 8,null,7,null, 5,null,4,null,  0,null,0,0],     drum: 'doom' }    // descending doom
  };
  const BATTLE_DRUMS = {
    heavy:  { kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], hat: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0] },
    sync:   { kick: [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1], hat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,1] },
    jitter: { kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], snare: [0,0,1,0, 1,0,0,1, 0,0,1,0, 1,0,0,0], hat: [1,1,0,1, 1,0,1,1, 1,1,0,1, 1,0,1,1] },
    march:  { kick: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,1], hat: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0] },
    roll:   { kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], snare: [0,0,0,1, 0,1,0,0, 0,0,0,1, 0,1,0,0], hat: [1,0,1,1, 0,1,1,0, 1,0,1,1, 0,1,1,0] },
    doom:   { kick: [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,1,0,0], hat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0] }
  };

  // ---------------------------------------------------------
  // Synth voices
  // ---------------------------------------------------------
  function ensureCtx() {
    if (ctx) return true;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = VOL;
      master.connect(ctx.destination);
      // one shared echo bus — the "cavern" behind the chips
      delaySend = ctx.createDelay(1.0);
      delaySend.delayTime.value = 0.28;
      delayGain = ctx.createGain();
      delayGain.gain.value = 0.28;
      delaySend.connect(delayGain);
      delayGain.connect(master);
      delayGain.connect(delaySend); // feedback
      return true;
    } catch (e) { return false; }
  }

  function tone(t, freq, dur, wave, vol, echoAmt) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = wave; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    if (echoAmt) { const s = ctx.createGain(); s.gain.value = echoAmt; g.connect(s); s.connect(delaySend); }
    o.start(t); o.stop(t + dur + 0.03);
  }
  function kickAt(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.09);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + 0.14);
  }
  function noiseAt(t, dur, hp, vol) {
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur + 0.02);
  }

  // ---------------------------------------------------------
  // Scheduler
  // ---------------------------------------------------------
  function world() { return W[themeId] || W.wasteland; }

  function scheduleStep(s, t) {
    const w = world();
    if (mode === 'battle') {
      const b = w.battle;
      const m = MOTIFS[houseId] || MOTIFS.bone;
      const dr = BATTLE_DRUMS[m.drum] || BATTLE_DRUMS.heavy;
      const barOfProg = bar % b.prog.length;
      const trans = b.prog[barOfProg];
      const i16 = s % 16;
      // pumping 8th bass on the progression
      if (i16 % 2 === 0) tone(t, midi(b.root + trans), 0.14, b.waveBass, 0.5, 0);
      // the boss riff, up two octaves
      const off = m.riff[i16];
      if (off !== null && off !== undefined) tone(t, midi(b.root + 24 + trans + off), 0.16, b.waveLead, 0.42, b.echo);
      if (dr.kick[i16]) kickAt(t);
      if (dr.snare[i16]) noiseAt(t, 0.09, 1400, 0.4);
      if (dr.hat[i16]) noiseAt(t, 0.03, 6000, 0.22);
    } else {
      const mp = w.map;
      const i16 = s % 16;
      const barOfProg = bar % mp.barRoots.length;
      const trans = mp.barRoots[barOfProg];
      const bnote = mp.bass[i16];
      if (bnote !== null && bnote !== undefined) tone(t, midi(bnote + trans), 0.20, mp.waveBass, 0.42, 0);
      // lead: 32-step phrase; bars 0-1 play `lead`, bar 2 plays `leadAlt`,
      // bar 3 plays `lead`'s back half — an A A B A' feel for free
      const phase = bar % 4;
      const seq = (phase === 2 && mp.leadAlt) ? mp.leadAlt : mp.lead;
      const idx = (phase % 2) * 16 + i16;
      const ln = seq[idx];
      if (ln !== null && ln !== undefined) tone(t, midi(ln + trans), 0.22, mp.waveLead, 0.36, mp.echo);
      if (mp.kick[i16]) kickAt(t);
      if (mp.snare && mp.snare[i16]) noiseAt(t, 0.08, 1600, 0.3);
      if (mp.hat[i16]) noiseAt(t, 0.028, 6500, 0.16);
    }
  }

  function tick() {
    if (!ctx) return;
    const w = world();
    const bpm = mode === 'battle' ? w.battle.bpm : w.map.bpm;
    const secPer16th = 60 / bpm / 4;
    while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
      if (mode !== 'off' && musicOn) scheduleStep(step, nextNoteTime);
      nextNoteTime += secPer16th;
      step++;
      if (step % 16 === 0) bar++;
    }
  }

  function startLoop() {
    if (timer || !ensureCtx()) return;
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    nextNoteTime = ctx.currentTime + 0.05;
    step = 0; bar = 0;
    timer = setInterval(tick, LOOKAHEAD_MS);
  }
  function resetSong() { step = 0; bar = 0; if (ctx) nextNoteTime = Math.max(nextNoteTime, ctx.currentTime + 0.06); }

  // ---------------------------------------------------------
  // Public API
  // ---------------------------------------------------------
  function setTheme(id) {
    if (W[id] && id !== themeId) { themeId = id; resetSong(); }
  }
  function scene(kind, house) {
    const next = (kind === 'battle') ? 'battle' : (kind === 'off' ? 'off' : 'world');
    const nextHouse = house || null;
    if (next === mode && nextHouse === houseId) return;
    mode = next; houseId = nextHouse;
    resetSong();
  }
  function setOn(on) {
    musicOn = !!on;
    try { localStorage.setItem('pl_music', musicOn ? 'on' : 'off'); } catch (e) {}
    if (musicOn && unlocked) startLoop();
  }
  function isOn() { return musicOn; }
  function duck(seconds) {
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(Math.max(master.gain.value * 0.3, 0.02), t);
    master.gain.linearRampToValueAtTime(VOL, t + (seconds || 2.5));
  }

  // Autoplay policy: arm on the first real gesture, same as Sound.
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    if (musicOn) startLoop();
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
    window.addEventListener(ev, unlock, { once: false, passive: true }));

  return { setTheme, scene, setOn, isOn, duck };
})();
