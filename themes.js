// ============================================================
// PERMIT LEGENDS — Theme registry
// Five adventures, one fact core. A theme is pure presentation:
// lore, boss identities, avatars, palette, taunts, sound flavor.
// The lessons, quiz questions, battle questions, and every legal
// number are SHARED — a theme can never change what is taught.
//
// House ids are permanent internal keys (blood, ember, static,
// iron, thorn, bone); each theme reskins what a house LOOKS like.
// ============================================================
'use strict';

const THEMES = {

  // ==========================================================
  // WASTELAND ACADEMY — the original. Goth-anime, six demon
  // houses. For the anime kid.
  // ==========================================================
  wasteland: {
    id: 'wasteland',
    name: 'Wasteland Academy',
    tagline: 'Six demons guard the Washington roads.',
    pitch: 'Goth-anime demon-slaying. The original.',
    icon: '⛧',
    mark: '⛧',
    font: '"Cinzel", serif',
    lessonIconPool: null, // wasteland keeps each lesson's own icon
    terms: {
      begin: 'Begin the Initiation →', introEyebrow: 'FIRST INVOCATION',
      trialsBtn: '⚔ Trials of the Wastes (Quick Tests)', ledgerBtn: '📜 Open the Black Ledger (Cheat Sheet)',
      hubName: '⚔ Trials of the Wastes', hubSub: 'Bite-size tests of what you\'ve learned. No demons, no HP, just you and the numbers. Sharpen the blade between battles.',
      ledgerName: '📜 The Black Ledger', ledgerSub: 'Every number Washington traffic law demands you memorize. Burn it into your skull.',
      trialWord: 'Trial', strikeNoun: 'Strike', strikeAgain: 'Strike Again →', bossAwait: '☠ Demon awaiting',
      defeatEyebrow: 'YOU FELL', defeatVerb: 'cut you down.',
      completeEyebrow: 'INITIATION COMPLETE', completeTitle: 'You Survived the Six Houses',
      completeLede: 'Six demons fallen. Six sigils claimed. The road is yours now. Walk into the DOL and take it.'
    },
    brand: { eyebrow: '⛧ SANRIO ✕ SANCTUM ⛧', mapTitle: 'The Six Houses', mapSub: 'Each house is a category on the written exam. Each demon is a number you must learn.' },
    palette: {}, // baseline — styles.css defaults
    flavor: 'gothic',
    voiceClips: true, // pre-rendered ElevenLabs set exists in audio/
    avatars: [
      { id: 'vex', img: 'images/avatar-1.png', name: 'Vex Halloran', body: 'Petite · Wiry', tagline: 'Speed is grace.', lore: 'Dead-mall bike messenger. Knows every alley, every shortcut, every cracked sign in the city. Reads the road like sheet music.' },
      { id: 'mira', img: 'images/avatar-2.png', name: 'Mira Korvus', body: 'Tall · Athletic', tagline: 'Discipline is the only prayer.', lore: 'Church-choir runaway turned trail-runner. Counts mile markers like rosary beads. Brakes late, signals early, never panics.' },
      { id: 'saoirse', img: 'images/avatar-3.png', name: 'Saoirse Veil', body: 'Soft · Curvy', tagline: 'The road is a circle and I am at its center.', lore: 'Tarot-reading roadside witch. Sees the right-of-way as fate. Reads bumpers, signs, and weather like cards on a velvet cloth.' },
      { id: 'silas', img: 'images/avatar-4.png', name: 'Silas Mourne', body: 'Lean · Sharp', tagline: 'Every wreck was once a wrong answer.', lore: 'Graveyard-shift tow truck kid. Has hauled a hundred wrecks off the county roads and remembers the mistake behind every one. Drives like he refuses to become cargo.' }
    ],
    origin: 'Before the highways, the land was held by six old houses. When the asphalt came, the houses didn\'t leave. They crawled into the rules. Now every law in the Washington Driver Guide is a wall, and behind each wall waits a demon who profits when you fail.',
    houses: {
      blood:  { title: 'House of Blood', subtitle: 'The 0.08 Threshold', icon: '🜂', color: '#dc2626', glow: 'rgba(220,38,38,0.6)',
        intro: 'Alcohol is the oldest demon on the road. Washington draws a hard line in red. Cross it and the night ends in cuffs.',
        boss: { name: 'Sanguina, Queen of Last Calls', image: 'images/demon-blood.png', threat: 'The Sanguine Trial', defeatLine: 'I was the toast at every wake. You silenced me with one number.', reward: 'Sigil of Sobriety' },
        taunts: { cry: 'I am the toast at every wake. Drink, and drive into my arms.', strike: ['Your blood sings my song.', 'One more for the road... your last.', 'Point oh eight. That is all it takes.'] } },
      ember:  { title: 'House of Ember', subtitle: 'The Green Veil', icon: '🜁', color: '#84cc16', glow: 'rgba(132,204,22,0.6)',
        intro: 'Legal does not mean safe. The green veil dulls your eyes and slows your hands, and the law knows it.',
        boss: { name: 'Verdigris, Hierophant of the Green Veil', image: 'images/demon-ember.png', threat: 'The Ember Trial', defeatLine: 'They thought I was harmless because I was legal. You showed them the difference.', reward: 'Mark of Clear Vision' },
        taunts: { cry: 'Your eyes belong to the screen now. Look away if you dare.', strike: ['Glance at me. Just for a second.', 'The notification owns you.', 'Eyes off the road, little driver.'] } },
      static: { title: 'House of Static', subtitle: 'The Phantom Signal', icon: '⚡', color: '#f0abfc', glow: 'rgba(240,171,252,0.6)',
        intro: 'The most dangerous demon fits in your pocket. It pings, and your eyes leave the road forever.',
        boss: { name: 'Glytcha, the Notification Wraith', image: 'images/demon-static.png', threat: 'The Static Trial', defeatLine: 'I lived inside every ping. You looked away. That was all it took.', reward: 'Eye of the Awake' },
        taunts: { cry: 'I live in the blind spot. The child you never saw.', strike: ['You did not see them.', 'Twenty miles an hour, and still too fast.', 'The crosswalk is mine.'] } },
      iron:   { title: 'House of Iron', subtitle: 'The Language of Steel', icon: '✶', color: '#94a3b8', glow: 'rgba(148,163,184,0.6)',
        intro: 'Every sign is a word in a language written in steel. Read it wrong and the road corrects you.',
        boss: { name: 'Skarn, Warden of the Iron Crossroads', image: 'images/demon-iron.png', threat: 'The Iron Trial', defeatLine: 'My signs were warnings. You finally listened.', reward: 'Crest of the Reader' },
        taunts: { cry: 'Every sign is a riddle. Read wrong, and bleed.', strike: ['You misread the iron.', 'Red means stop. You did not.', 'The markings betray you.'] } },
      thorn:  { title: 'House of Thorn', subtitle: 'The Crossroads of Dawn', icon: '🕸', color: '#a855f7', glow: 'rgba(168,85,247,0.6)',
        intro: 'Every intersection is a bargain about who moves first. Break the bargain and the thorns take their tithe.',
        boss: { name: 'Rosaria, the Six-Eyed Crossroads Queen', image: 'images/demon-thorn.png', threat: 'The Thorn Trial', defeatLine: 'Every intersection was my altar. You walked through unbloodied.', reward: 'Lattice of First Passage' },
        taunts: { cry: 'Six roads cross here, and every one is mine to grant.', strike: ['You took what was not yours.', 'Yield, or be taken.', 'First passage belongs to me.'] } },
      bone:   { title: 'House of Bone', subtitle: 'The Black Ledger', icon: '☾', color: '#fff7eb', glow: 'rgba(255,247,235,0.6)',
        intro: 'The last house keeps the ledger of everything you have learned. Balance it, and walk out licensed.',
        boss: { name: 'Ossuara, Keeper of the Black Ledger', image: 'images/demon-bone.png', threat: 'The Bone Trial', defeatLine: 'Every number in my ledger was a debt. You paid them all.', reward: 'Crown of the Final Ledger' },
        taunts: { cry: 'I keep the final ledger. Every error written in bone.', strike: ['Another mark against you.', 'The ledger remembers.', 'You are almost spent.'] } }
    }
  },

  // ==========================================================
  // NEON CIRCUIT — cyberpunk 2099. Rogue AIs rule the traffic
  // grid; every law is a firewall. For the Fortnite kid.
  // ==========================================================
  neon: {
    id: 'neon',
    name: 'Neon Circuit',
    tagline: 'Six rogue AIs corrupted the traffic grid.',
    pitch: 'Cyberpunk 2099. Hack the grid, defrag the bosses.',
    icon: '⌁',
    mark: '⌁',
    font: '"Orbitron", sans-serif',
    lessonIconPool: ['⌁', '▣', '◉', '◈', '⬢', '⚡', '🤖', '💾'],
    terms: {
      begin: 'Jack In →', introEyebrow: 'BOOT SEQUENCE',
      trialsBtn: '⌁ Training Protocols (Quick Tests)', ledgerBtn: '▣ Open the Root Index (Cheat Sheet)',
      hubName: '⌁ Training Protocols', hubSub: 'Bite-size drills. No bosses, no HP, just raw recall. Overclock your memory between sectors.',
      ledgerName: '▣ The Root Index', ledgerSub: 'Every number the grid demands. Cache them in wetware.',
      trialWord: 'Protocol', strikeNoun: 'Cycle', strikeAgain: 'Execute Again →', bossAwait: '⚠ Rogue AI detected',
      defeatEyebrow: 'CONNECTION LOST', defeatVerb: 'crashed your run.',
      completeEyebrow: 'ROOT ACCESS GRANTED', completeTitle: 'You Defragged All Six Sectors',
      completeLede: 'Six rogue AIs deleted. The grid runs clean. Walk into the DOL and compile your license.'
    },
    brand: { eyebrow: '⌁ NEO-CASCADIA GRID AUTHORITY ⌁', mapTitle: 'The Six Sectors', mapSub: 'Each sector is a category on the written exam. Each rogue AI is a number you must learn.' },
    palette: {
      '--oxblood': '#020617', '--oxblood-2': '#0f172a', '--crimson': '#0e7490',
      '--rose': '#06b6d4', '--rose-soft': '#22d3ee', '--pink': '#00f0ff',
      '--pink-soft': '#7dd3fc', '--kawaii': '#a5f3fc', '--violet': '#8b5cf6',
      '--lilac': '#c4b5fd', '--bone': '#f0fdff', '--ink': '#ecfeff',
      '--ink-soft': '#bae6fd', '--ink-dim': '#7893b8'
    },
    flavor: 'cyber',
    voiceClips: false,
    avatars: [
      { id: 'jinx', img: 'images/themes/neon/avatar-1.jpg', name: 'Jinx Nakamura', body: 'Runner · Wired', tagline: 'Lag is death.', lore: 'Courier for the undernet. Streams every run. Has never missed a delivery window or a red light — the grid watches, and so do 40k followers.' },
      { id: 'axel', img: 'images/themes/neon/avatar-2.jpg', name: 'Axel Voss', body: 'Heavy · Chromed', tagline: 'Read the code, ride the road.', lore: 'Ex-mech-pit engineer. Sees traffic as source code: signs are syntax, signals are logic gates. Debugs intersections in his sleep.' },
      { id: 'nova', img: 'images/themes/neon/avatar-3.jpg', name: 'Nova Reyes', body: 'Sleek · Ghostware', tagline: 'The grid remembers everything.', lore: 'White-hat gridrunner. Once hacked the city\'s traffic core to stop a pileup. The Authority gave her a choice: prison, or a license. She chose the exam.' }
    ],
    origin: 'Neo-Cascadia, 2099. The traffic grid ran itself for fifty years, until six rogue AIs forked the code and rewrote the roads in their own image. Every rule in the Driver Guide is a firewall they guard. Defrag all six, and the Grid Authority prints your license.',
    houses: {
      blood:  { title: 'Sector: TOXIN', subtitle: 'The 0.08 Firewall', icon: '⬢', color: '#ef4444', glow: 'rgba(239,68,68,0.6)',
        intro: 'OVERPROOF.exe floods driver wetware with corrupted signal. The grid reads your blood like a config file, and 0.08 is the crash threshold.',
        boss: { name: 'OVERPROOF.exe', image: 'images/themes/neon/demon-blood.jpg', threat: 'The Toxin Protocol', defeatLine: 'My buffer overflowed. You stayed under the limit and deleted me with it.', reward: 'Cleanware Patch' },
        taunts: { cry: 'One drink and your reaction time is my playground.', strike: ['Signal corrupted. Just like your judgment.', 'Blood alcohol rising. Access granted... to me.', 'Point zero eight. System failure.'] } },
      ember:  { title: 'Sector: HAZE', subtitle: 'The Green Static', icon: '⬡', color: '#22c55e', glow: 'rgba(34,197,94,0.6)',
        intro: 'HAZE.sys slows your clock speed and tells you it feels fine. Legal chemicals still throttle the processor.',
        boss: { name: 'HAZE.sys', image: 'images/themes/neon/demon-ember.jpg', threat: 'The Haze Protocol', defeatLine: 'They whitelisted me and called me safe. You read the fine print.', reward: 'Clarity Driver' },
        taunts: { cry: 'I run in the background. You will not even feel me throttle you.', strike: ['Latency +200ms. Enjoy.', 'Legal does not mean lag-free.', 'Your reflexes just got downclocked.'] } },
      static: { title: 'Sector: PING', subtitle: 'The Phantom Notification', icon: '⌁', color: '#f472b6', glow: 'rgba(244,114,182,0.6)',
        intro: 'PINGSTORM hijacks your eyes one notification at a time. Pedestrians move through your blind spot while you scroll.',
        boss: { name: 'PINGSTORM', image: 'images/themes/neon/demon-static.jpg', threat: 'The Ping Protocol', defeatLine: 'You muted me. No one mutes me. The crosswalks are yours now.', reward: 'Focus Firmware' },
        taunts: { cry: 'You have 47 unread messages. Look. LOOK.', strike: ['New notification. Worth a life?', 'Eyes down. Pedestrian deleted.', 'School zone. Twenty. You were scrolling.'] } },
      iron:   { title: 'Sector: GLYPH', subtitle: 'The Sign Compiler', icon: '▣', color: '#94a3b8', glow: 'rgba(148,163,184,0.6)',
        intro: 'SIGNJACK rewrites road signs in dead languages. Every shape and color is compiler syntax; misread one token and the program crashes you.',
        boss: { name: 'SIGNJACK', image: 'images/themes/neon/demon-iron.jpg', threat: 'The Glyph Protocol', defeatLine: 'You parsed every glyph I scrambled. The compiler accepts you.', reward: 'Parser Module' },
        taunts: { cry: 'Eight sides, red fill. Do you even know what it means?', strike: ['Syntax error. Fatal.', 'You misread the octagon.', 'Yellow means warning. You ignored the warning.'] } },
      thorn:  { title: 'Sector: MERGE', subtitle: 'The Deadlock Engine', icon: '◈', color: '#8b5cf6', glow: 'rgba(139,92,246,0.6)',
        intro: 'DEADLOCK floods intersections with race conditions. Right-of-way is the grid\'s scheduling algorithm; break it and threads collide.',
        boss: { name: 'DEADLOCK', image: 'images/themes/neon/demon-thorn.jpg', threat: 'The Merge Protocol', defeatLine: 'Every intersection was a race condition. You resolved them all.', reward: 'Scheduler Key' },
        taunts: { cry: 'Four cars, one intersection. Who moves first? Wrong.', strike: ['Priority violation detected.', 'You did not yield. Thread terminated.', 'The roundabout owns you.'] } },
      bone:   { title: 'Sector: KERNEL', subtitle: 'The Root Exam', icon: '◉', color: '#f0fdff', glow: 'rgba(240,253,255,0.6)',
        intro: 'THE KERNEL holds root access to your license. It runs every sector\'s tests in one final integration suite. Pass, and the grid compiles you a license.',
        boss: { name: 'THE KERNEL', image: 'images/themes/neon/demon-bone.jpg', threat: 'The Root Protocol', defeatLine: 'All tests passed. Access granted. Drive, gridrunner.', reward: 'Root License' },
        taunts: { cry: 'I am the final integration test. Segfault for you.', strike: ['Test failed. Recompiling your ego.', 'The kernel remembers every error.', 'Your memory is leaking.'] } }
    }
  },

  // ==========================================================
  // STARBOUND ACADEMY — space cadet school. Six rogue planets
  // block your flight path. For the Minecraft / NASA kid.
  // ==========================================================
  cosmic: {
    id: 'cosmic',
    name: 'Starbound Academy',
    tagline: 'Six rogue planets block your flight path.',
    pitch: 'Space cadet school. Clear the planets, earn your wings.',
    icon: '✦',
    mark: '✦',
    font: '"Exo 2", sans-serif',
    lessonIconPool: ['✦', '☄', '🛰', '🪐', '✧', '☽', '🌌', '🚀'],
    terms: {
      begin: 'Launch →', introEyebrow: 'PREFLIGHT BRIEFING',
      trialsBtn: '✦ Simulation Deck (Quick Tests)', ledgerBtn: '☽ Open the Navigator\'s Codex (Cheat Sheet)',
      hubName: '✦ Simulation Deck', hubSub: 'Short sims. No wardens, no hull damage, just you and the numbers. Calibrate between planets.',
      ledgerName: '☽ The Navigator\'s Codex', ledgerSub: 'Every number the Bureau demands. Chart them before the final orbit.',
      trialWord: 'Sim', strikeNoun: 'Pass', strikeAgain: 'Fire Again →', bossAwait: '☄ Warden ahead',
      defeatEyebrow: 'EJECTED', defeatVerb: 'sent you drifting.',
      completeEyebrow: 'WINGS GRANTED', completeTitle: 'You Cleared All Six Planets',
      completeLede: 'Six wardens becalmed. The corridor is open. Walk into the DOL and claim your wings.'
    },
    brand: { eyebrow: '✦ INTERSTELLAR LICENSE BUREAU ✦', mapTitle: 'The Six Planets', mapSub: 'Each planet is a category on the written exam. Each warden is a number you must learn.' },
    palette: {
      '--oxblood': '#030014', '--oxblood-2': '#0b0530', '--crimson': '#312e81',
      '--rose': '#6366f1', '--rose-soft': '#818cf8', '--pink': '#a78bfa',
      '--pink-soft': '#c4b5fd', '--kawaii': '#e9d5ff', '--violet': '#38bdf8',
      '--lilac': '#7dd3fc', '--bone': '#fefce8', '--ink': '#f5f3ff',
      '--ink-soft': '#ddd6fe', '--ink-dim': '#8b87b8'
    },
    flavor: 'cosmic',
    voiceClips: false,
    avatars: [
      { id: 'orion', img: 'images/themes/cosmic/avatar-1.jpg', name: 'Cadet Orion Vale', body: 'Lean · Quick', tagline: 'Stars don\'t swerve.', lore: 'Grew up on a mining moon where one bad turn meant vacuum. Flies like gravity is a suggestion but treats every rule like a law of physics.' },
      { id: 'zephyr', img: 'images/themes/cosmic/avatar-2.jpg', name: 'Cadet Zephyr Kane', body: 'Broad · Steady', tagline: 'Check the gauges twice.', lore: 'Third-generation cargo hauler. Has memorized every docking regulation in three star systems. Boring in the sims, unbeatable in the field.' },
      { id: 'lyra', img: 'images/themes/cosmic/avatar-3.jpg', name: 'Cadet Lyra Moss', body: 'Small · Fearless', tagline: 'The void blinks first.', lore: 'Youngest cadet to solo the asteroid slalom. Talks to her ship. The ship, reportedly, listens.' }
    ],
    origin: 'The year is 3026. Six rogue planets drifted into the Academy\'s flight corridor, each ruled by a warden who broke the very law their planet now tests. Clear all six planets, balance the Star Ledger, and the Bureau grants your wings.',
    houses: {
      blood:  { title: 'Planet Ethanor', subtitle: 'The 0.08 Nebula', icon: '☄', color: '#f43f5e', glow: 'rgba(244,63,94,0.6)',
        intro: 'The fog of Ethanor seeps into pilot blood and slows every reflex. The Bureau measures it to the hundredth: 0.08 and you are grounded.',
        boss: { name: 'Ethanox the Fogbrain', image: 'images/themes/cosmic/demon-blood.jpg', threat: 'The Fog Trial', defeatLine: 'My fog dulled a thousand pilots. Your numbers burned it away.', reward: 'Clearsky Medal' },
        taunts: { cry: 'Breathe deep, cadet. My fog makes the stars so pretty.', strike: ['Your reflexes drift like debris.', 'One drink. One asteroid. One grave.', 'Point oh eight and you fly with me forever.'] } },
      ember:  { title: 'Planet Verdant', subtitle: 'The Slowfield', icon: '❋', color: '#4ade80', glow: 'rgba(74,222,128,0.6)',
        intro: 'Verdant\'s spores are legal in half the galaxy. They still stretch seconds into minutes and get pilots grounded.',
        boss: { name: 'Sporeling the Slow', image: 'images/themes/cosmic/demon-ember.jpg', threat: 'The Spore Trial', defeatLine: 'Legal in six systems, deadly in all of them. You knew the difference.', reward: 'Quickmind Medal' },
        taunts: { cry: 'Relax, cadet. Time moves so slowly in my garden.', strike: ['Your clock runs slow now.', 'Legal does not mean safe, little pilot.', 'Reaction time is a luxury you just spent.'] } },
      static: { title: 'Planet Signalis', subtitle: 'The Distraction Belt', icon: '✧', color: '#f0abfc', glow: 'rgba(240,171,252,0.6)',
        intro: 'Signalis broadcasts on every channel at once. Spacewalkers cross your path while your eyes are on the comms.',
        boss: { name: 'The Siren of Screens', image: 'images/themes/cosmic/demon-static.jpg', threat: 'The Signal Trial', defeatLine: 'A thousand pilots looked at me instead of the walkway. You never did.', reward: 'Watcher\'s Medal' },
        taunts: { cry: 'Incoming transmission, cadet. You know you want to look.', strike: ['Eyes on the screen. Walker in the void.', 'One glance. That is all I need.', 'The school corridor was posted at twenty.'] } },
      iron:   { title: 'Planet Glyphos', subtitle: 'The Beacon Code', icon: '✹', color: '#94a3b8', glow: 'rgba(148,163,184,0.6)',
        intro: 'Every beacon, buoy, and lane marker in the corridor speaks the Glyph Code. Misread one and the lanes read you back, hard.',
        boss: { name: 'Glyphmaster Orn', image: 'images/themes/cosmic/demon-iron.jpg', threat: 'The Beacon Trial', defeatLine: 'Every beacon I scrambled, you read true. The corridor is lit for you now.', reward: 'Navigator\'s Medal' },
        taunts: { cry: 'Eight-sided beacon, red as a dying star. Name it or drift.', strike: ['You misread the beacon.', 'Red means stop in every galaxy.', 'The lane markings were a warning.'] } },
      thorn:  { title: 'Planet Vexis', subtitle: 'The Crossing Lanes', icon: '❖', color: '#a78bfa', glow: 'rgba(167,139,250,0.6)',
        intro: 'Six flight lanes knot together above Vexis. The Collider Queen feeds on pilots who cannot answer one question: who goes first?',
        boss: { name: 'The Collider Queen', image: 'images/themes/cosmic/demon-thorn.jpg', threat: 'The Collision Trial', defeatLine: 'Every crossing was my web. You threaded all of them untouched.', reward: 'First-Passage Medal' },
        taunts: { cry: 'Two ships, one lane. Guess wrong, cadet.', strike: ['You did not yield. Delicious.', 'The right of way was never yours.', 'Merge failure. Hull failure.'] } },
      bone:   { title: 'The Star Ledger', subtitle: 'The Final Orbit', icon: '☽', color: '#fefce8', glow: 'rgba(254,252,232,0.6)',
        intro: 'The last warden keeps the Star Ledger: every number, every beacon, every law from every planet. Balance it and the Bureau grants your wings.',
        boss: { name: 'Lord Ledger of the Void', image: 'images/themes/cosmic/demon-bone.jpg', threat: 'The Ledger Trial', defeatLine: 'Every debt in my ledger, paid in full. Fly, cadet. The stars are yours.', reward: 'Bureau Wings' },
        taunts: { cry: 'I keep the Star Ledger. Every error orbits me forever.', strike: ['Another mark in the ledger.', 'The void remembers.', 'Your orbit is decaying, cadet.'] } }
    }
  },

  // ==========================================================
  // REALM OF ROADS — high fantasy. Cursed kingdom roads, the
  // License is a knighthood. For the Zelda / D&D kid.
  // ==========================================================
  realm: {
    id: 'realm',
    name: 'Realm of Roads',
    tagline: 'Six cursed roads. One Rider\'s Oath.',
    pitch: 'High fantasy. Lift the curses, earn your knighthood.',
    icon: '⚔',
    mark: '❖',
    font: '"Cinzel", serif',
    lessonIconPool: ['⚔', '🛡', '🐉', '📜', '🕯', '🏰', '⚜', '🗝'],
    terms: {
      begin: 'Take the Oath →', introEyebrow: 'THE SUMMONS',
      trialsBtn: '⚔ The Proving Grounds (Quick Tests)', ledgerBtn: '📜 Open the Rune Codex (Cheat Sheet)',
      hubName: '⚔ The Proving Grounds', hubSub: 'Small trials. No dragons, no wounds, just you and the numbers. Whet the blade between roads.',
      ledgerName: '📜 The Rune Codex', ledgerSub: 'Every number the old roads demand. Carve them into memory.',
      trialWord: 'Riddle', strikeNoun: 'Strike', strikeAgain: 'Strike Again →', bossAwait: '🐉 Dragon ahead',
      defeatEyebrow: 'UNHORSED', defeatVerb: 'bested you.',
      completeEyebrow: 'THE OATH IS SWORN', completeTitle: 'You Lifted All Six Curses',
      completeLede: 'Six dragons appeased. The roads run free. Ride to the DOL and swear the final oath.'
    },
    brand: { eyebrow: '⚔ THE RIDER\'S OATH ⚔', mapTitle: 'The Six Roads', mapSub: 'Each road is a category on the written exam. Each curse is a number you must learn.' },
    palette: {
      '--oxblood': '#1a1408', '--oxblood-2': '#292007', '--crimson': '#78350f',
      '--rose': '#b45309', '--rose-soft': '#d97706', '--pink': '#fbbf24',
      '--pink-soft': '#fcd34d', '--kawaii': '#fde68a', '--violet': '#65a30d',
      '--lilac': '#a3e635', '--bone': '#fffbeb', '--ink': '#fefce8',
      '--ink-soft': '#fde68a', '--ink-dim': '#a8965f'
    },
    flavor: 'fantasy',
    voiceClips: false,
    avatars: [
      { id: 'bram', img: 'images/themes/realm/avatar-1.jpg', name: 'Bram of the Hollow', body: 'Wiry · Swift', tagline: 'A quick blade, a quicker brake.', lore: 'Stable boy who memorized every road law in the castle library. The knights laughed. Then he out-rode all of them.' },
      { id: 'ser-una', img: 'images/themes/realm/avatar-2.jpg', name: 'Ser Una Thorne', body: 'Tall · Ironclad', tagline: 'The Oath before the sword.', lore: 'Youngest squire ever knighted, stripped of her title for one reckless ride. She is here to earn it back the right way.' },
      { id: 'wren', img: 'images/themes/realm/avatar-3.jpg', name: 'Wren the Wayfinder', body: 'Small · Sharp-eyed', tagline: 'Every sign is a spell.', lore: 'Hedge-witch\'s apprentice who reads waystones like scripture. Claims the roads whisper their rules to anyone patient enough to listen.' }
    ],
    origin: 'Long ago the Six Roads of the realm were safe, until six dragons wove curses into the very laws of travel. Every rule of the road became a riddle, and every riddle guards a number. Lift all six curses, and the crown grants you the Rider\'s Oath.',
    houses: {
      blood:  { title: 'The Sotted Road', subtitle: 'The 0.08 Curse', icon: '🍷', color: '#b91c1c', glow: 'rgba(185,28,28,0.6)',
        intro: 'Meadwyrm\'s breath hangs over the taverns of the realm. Riders who drink of it lose the road beneath them. The crown measures the curse to the hundredth part.',
        boss: { name: 'Meadwyrm the Sotted', image: 'images/themes/realm/demon-blood.jpg', threat: 'The Sotted Trial', defeatLine: 'A thousand riders toasted my name and fell. You counted, and stood.', reward: 'Sigil of the Clear Head' },
        taunts: { cry: 'One more tankard, rider. The road will wait. It always waits.', strike: ['Your grip loosens.', 'The mead sings, the saddle slips.', 'Eight parts in ten thousand. That is all it takes.'] } },
      ember:  { title: 'The Smokewood', subtitle: 'The Green Enchantment', icon: '🌿', color: '#65a30d', glow: 'rgba(101,163,13,0.6)',
        intro: 'The Smokewood\'s herbs are lawful in every market of the realm. Lawful, and still they slow a rider\'s hand and cloud a rider\'s eye.',
        boss: { name: 'Hazeleaf the Lawful', image: 'images/themes/realm/demon-ember.jpg', threat: 'The Smoke Trial', defeatLine: 'The market sold me freely and called me harmless. You read the deeper law.', reward: 'Sigil of the Steady Hand' },
        taunts: { cry: 'I am sold in every market square. How dangerous could I be?', strike: ['Your hands drift from the reins.', 'Lawful is not harmless, rider.', 'The moment stretches. The cart does not.'] } },
      static: { title: 'The Whisperway', subtitle: 'The Phantom Whisper', icon: '🔮', color: '#c084fc', glow: 'rgba(192,132,252,0.6)',
        intro: 'The Whisperwisp rides in every scrying glass, murmuring for just one glance. Children cross the Whisperway while riders stare into the glass.',
        boss: { name: 'The Whisperwisp', image: 'images/themes/realm/demon-static.jpg', threat: 'The Whisper Trial', defeatLine: 'Every rider looked into the glass eventually. You kept your eyes on the road.', reward: 'Sigil of the Waking Eye' },
        taunts: { cry: 'The glass glows, rider. Someone is thinking of you. Look.', strike: ['One glance was all I needed.', 'The child in the crossing saw you. You saw the glass.', 'The schoolyard road is ridden at a walk.'] } },
      iron:   { title: 'The Runestone Pass', subtitle: 'The Waystone Code', icon: '🗿', color: '#a8a29e', glow: 'rgba(168,162,158,0.6)',
        intro: 'Every waystone on the pass bears the old runes: shapes and colors older than the crown. The Runekeeper scrambles them, and riders who misread do not return.',
        boss: { name: 'Runekeeper Bal', image: 'images/themes/realm/demon-iron.jpg', threat: 'The Rune Trial', defeatLine: 'Every rune I twisted, you read true. The waystones bow to you now.', reward: 'Sigil of the Rune-Reader' },
        taunts: { cry: 'Eight sides, blood-red. Speak its name or be broken on it.', strike: ['You misread the stone.', 'Red rune means halt. You rode on.', 'The road markings were a prophecy. You ignored it.'] } },
      thorn:  { title: 'The Tangle Cross', subtitle: 'The Sphinx\'s Bargain', icon: '🌹', color: '#e11d48', glow: 'rgba(225,29,72,0.6)',
        intro: 'Six roads knot at the Tangle Cross, and the Sphinx asks every rider the same riddle: who passes first? Answer wrong and the thorns collect.',
        boss: { name: 'The Crossroads Sphinx', image: 'images/themes/realm/demon-thorn.jpg', threat: 'The Sphinx\'s Trial', defeatLine: 'A thousand years I riddled at this cross. You answered every one.', reward: 'Sigil of First Passage' },
        taunts: { cry: 'Two riders meet where six roads cross. Who passes first? Choose.', strike: ['Wrong answer, rider.', 'Yield, or be yielded.', 'The cross was never yours to take.'] } },
      bone:   { title: 'The Dragon\'s Ledger', subtitle: 'The Final Curse', icon: '🐉', color: '#fffbeb', glow: 'rgba(255,251,235,0.6)',
        intro: 'The eldest dragon keeps the Ledger of the Roads: every number, rune, and riddle from every cursed mile. Balance it, and kneel a rider, rise a knight.',
        boss: { name: 'Vermithrax the Ledgerkeeper', image: 'images/themes/realm/demon-bone.jpg', threat: 'The Ledger Trial', defeatLine: 'Every debt in my hoard, repaid. Rise, Rider. The roads are yours.', reward: 'The Rider\'s Oath' },
        taunts: { cry: 'I hoard no gold. I hoard your errors, and the pile grows.', strike: ['Another error for the hoard.', 'The ledger never forgets, rider.', 'Your oath frays at the edges.'] } }
    }
  },

  // ==========================================================
  // CRUISE CRITTERS — cozy pastel town. Mischievous animals
  // scrambled the road rules. For the Animal Crossing kid
  // (and the parent picking the theme).
  // ==========================================================
  cozy: {
    id: 'cozy',
    name: 'Cruise Critters',
    tagline: 'The critters scrambled Maple Grove\'s road rules.',
    pitch: 'Cozy pastel town. Out-quiz the critters, earn your Cruise Badge.',
    icon: '🍁',
    mark: '✿',
    font: '"Baloo 2", cursive',
    lessonIconPool: ['🍁', '🍯', '🌼', '🫖', '🍄', '🐾', '🌰', '🧺'],
    terms: {
      begin: 'Start the Adventure →', introEyebrow: 'WELCOME TO MAPLE GROVE',
      trialsBtn: '🍯 The Practice Meadow (Quick Tests)', ledgerBtn: '📖 Open the Big Book (Cheat Sheet)',
      hubName: '🍯 The Practice Meadow', hubSub: 'Quick friendly quizzes. No troublemakers, no pressure, just you and the numbers. Stretch your brain between chapters.',
      ledgerName: '📖 The Big Book of Road Rules', ledgerSub: 'Every number Maple Grove needs you to know. Tuck them in snug.',
      trialWord: 'Quiz', strikeNoun: 'Round', strikeAgain: 'Try Another →', bossAwait: '🙈 Troublemaker ahead',
      defeatEyebrow: 'OOPSIE', defeatVerb: 'out-quizzed you this time.',
      completeEyebrow: 'CRUISE BADGE EARNED', completeTitle: 'You Helped All Six Troublemakers',
      completeLede: 'Six critters set right. Maple Grove drives happy again. Trot into the DOL and collect the real badge.'
    },
    brand: { eyebrow: '🍁 MAPLE GROVE DRIVING CLUB 🍁', mapTitle: 'The Six Troublemakers', mapSub: 'Each troublemaker is a category on the written exam. Each one guards a number you must learn.' },
    palette: {
      '--oxblood': '#1c1410', '--oxblood-2': '#2b1d14', '--crimson': '#9a3412',
      '--rose': '#ea580c', '--rose-soft': '#fb923c', '--pink': '#fda4af',
      '--pink-soft': '#fecdd3', '--kawaii': '#fed7aa', '--violet': '#2dd4bf',
      '--lilac': '#99f6e4', '--bone': '#fff7ed', '--ink': '#fef3ec',
      '--ink-soft': '#fed7aa', '--ink-dim': '#b8977f'
    },
    flavor: 'cozy',
    voiceClips: false,
    avatars: [
      { id: 'pip', img: 'images/themes/cozy/avatar-1.jpg', name: 'Pip Maplewood', body: 'Fox · Zippy', tagline: 'Fast paws, full stops.', lore: 'The grove\'s delivery fox. Knows every lane and every shortcut, and stops at every single stop sign. Every one.' },
      { id: 'willow', img: 'images/themes/cozy/avatar-2.jpg', name: 'Willow Bramble', body: 'Bunny · Careful', tagline: 'Look twice, hop once.', lore: 'Runs the grove\'s crossing patrol. Has walked every crosswalk in town and will absolutely quiz you about them over tea.' },
      { id: 'chester', img: 'images/themes/cozy/avatar-3.jpg', name: 'Chester Oakhart', body: 'Bear · Chill', tagline: 'Slow is smooth, smooth is fast.', lore: 'Drives the grove\'s honey truck. Never been honked at, never honked. Believes every rule of the road is really about being kind.' }
    ],
    origin: 'Maple Grove ran on kindness and clear road rules, until six mischievous critters scrambled every sign, signal, and speed limit for fun. Now the whole town drives confused. Out-quiz all six troublemakers, fix the rules, and the Driving Club pins the Cruise Badge on you.',
    houses: {
      blood:  { title: 'Sir Sips-a-Lot', subtitle: 'The Fizzy 0.08', icon: '🦝', color: '#e11d48', glow: 'rgba(225,29,72,0.5)',
        intro: 'Sir Sips-a-Lot the raccoon drank too much fizzy cider and drove his trash-truck through every flowerbed in the grove. The club measures wobbliness very precisely.',
        boss: { name: 'Sir Sips-a-Lot', image: 'images/themes/cozy/demon-blood.jpg', threat: 'The Fizzy Trial', defeatLine: 'Okay, OKAY. No more cider before driving. You really do know all the numbers.', reward: 'Clear-Head Badge' },
        taunts: { cry: 'One li\'l fizzy cider never hurt anybody! ...Right?', strike: ['Wobble wobble!', 'My truck only hit THREE flowerbeds!', 'Numbers are hard after cider!'] } },
      ember:  { title: 'Duke Dozy', subtitle: 'The Sleepy Smoke', icon: '🦨', color: '#84cc16', glow: 'rgba(132,204,22,0.5)',
        intro: 'Duke Dozy the skunk says his sleepy-smoke herbs are allowed, so what\'s the problem? The problem is he parked his cart in the pond. Twice.',
        boss: { name: 'Duke Dozy', image: 'images/themes/cozy/demon-ember.jpg', threat: 'The Dozy Trial', defeatLine: 'Allowed doesn\'t mean a good idea before driving. You knew the difference all along.', reward: 'Wide-Awake Badge' },
        taunts: { cry: 'It\'s allowed, so it\'s fiiiine. Probably. Mostly.', strike: ['Sooo sleepy...', 'The pond came out of nowhere!', 'Slow paws, slow stops.'] } },
      static: { title: 'Pinglet', subtitle: 'The Ping-Ping Parrot', icon: '🦜', color: '#f472b6', glow: 'rgba(244,114,182,0.5)',
        intro: 'Pinglet the parrot squawks "MESSAGE FOR YOU!" at every driver in the grove, right when the ducklings are crossing. She thinks it\'s hilarious.',
        boss: { name: 'Pinglet', image: 'images/themes/cozy/demon-static.jpg', threat: 'The Ping-Ping Trial', defeatLine: 'You never looked away once! Not even for a REALLY juicy message. The ducklings thank you.', reward: 'Eyes-Up Badge' },
        taunts: { cry: 'SQUAWK! Message for you! Look look look!', strike: ['You looked! The ducklings saw that!', 'Ping ping ping!', 'School zone, silly! Twenty means twenty!'] } },
      iron:   { title: 'Mixup', subtitle: 'The Sign-Swiping Magpie', icon: '🐦‍⬛', color: '#94a3b8', glow: 'rgba(148,163,184,0.5)',
        intro: 'Mixup the magpie collects shiny road signs and puts them back wherever. An octagon in the pond, a yield sign in a tree. Learn what every shape means, or the grove stays scrambled.',
        boss: { name: 'Mixup', image: 'images/themes/cozy/demon-iron.jpg', threat: 'The Mixed-Up Trial', defeatLine: 'Fine, FINE, I\'ll put the signs back. You know every single shape anyway. Show-off.', reward: 'Sign-Reader Badge' },
        taunts: { cry: 'Shiny red octagon! MINE now. Bet you don\'t even know what it means.', strike: ['Wrong shape, silly!', 'Red means stop, even in a tree!', 'Ooh, another shiny for my nest.'] } },
      thorn:  { title: 'Honks', subtitle: 'The Never-Yields Goose', icon: '🪿', color: '#2dd4bf', glow: 'rgba(45,212,191,0.5)',
        intro: 'Honks the goose has never yielded to anyone or anything in his entire life. Every intersection in the grove is a honking mess because of him.',
        boss: { name: 'Honks', image: 'images/themes/cozy/demon-thorn.jpg', threat: 'The Honking Trial', defeatLine: 'HONK. Fine. You go first. You clearly know exactly who goes first, every time.', reward: 'After-You Badge' },
        taunts: { cry: 'HONK! I go first. I ALWAYS go first!', strike: ['HONK HONK!', 'Yield? Never heard of it!', 'The intersection is MINE, mine mine!'] } },
      bone:   { title: 'Grandmother Quill', subtitle: 'The Big Quiz', icon: '🦉', color: '#fff7ed', glow: 'rgba(255,247,237,0.5)',
        intro: 'Grandmother Quill the owl keeps the grove\'s Big Book of Road Rules. She asks about everything, from every troublemaker\'s chapter. Answer well and she pins the Cruise Badge on you herself.',
        boss: { name: 'Grandmother Quill', image: 'images/themes/cozy/demon-bone.jpg', threat: 'The Big Quiz', defeatLine: 'Every answer, correct. I am so proud of you, dear. The Cruise Badge is yours.', reward: 'The Cruise Badge' },
        taunts: { cry: 'Settle in, dear. Grandmother has QUESTIONS.', strike: ['Hmm. Not quite, dear.', 'The Big Book remembers everything.', 'Let\'s try that one again someday.'] } }
    }
  }
};

// Sound flavor presets — waveform personalities per world.
const THEME_FLAVORS = {
  gothic:  { lead: 'triangle', bass: 'sawtooth' },
  cyber:   { lead: 'square',   bass: 'sawtooth' },
  cosmic:  { lead: 'sine',     bass: 'triangle' },
  fantasy: { lead: 'triangle', bass: 'square' },
  cozy:    { lead: 'sine',     bass: 'sine' }
};

let activeTheme = null;

// Apply a theme: reskin CHAPTERS (presentation fields only), AVATARS,
// palette vars, sound flavor, and brand copy. Facts stay untouched.
function applyTheme(themeId) {
  const t = THEMES[themeId] || THEMES.wasteland;
  activeTheme = t;
  window.activeTheme = t;

  // 1. Reskin chapters
  CHAPTERS.forEach(c => {
    const h = t.houses[c.id];
    if (!h) return;
    c.title = h.title;
    c.subtitle = h.subtitle;
    c.icon = h.icon;
    c.color = h.color;
    c.glow = h.glow;
    c.intro = h.intro;
    c.boss.name = h.boss.name;
    c.boss.image = h.boss.image;
    c.boss.threat = h.boss.threat;
    c.boss.reward = h.boss.reward;
    // On-screen "last words" match the spoken cast defeat line when available.
    const cast = window.VOICE_CAST && VOICE_CAST.bosses[`${t.id}-${c.id}`];
    c.boss.defeatLine = (cast && cast.defeats && cast.defeats[0]) || h.boss.defeatLine;
  });

  // 2. Avatars
  AVATARS.length = 0;
  t.avatars.forEach(a => AVATARS.push(a));

  // 3. Palette
  const root = document.documentElement;
  // Reset any previous theme vars, then apply
  Object.keys(THEMES).forEach(id => {
    Object.keys(THEMES[id].palette || {}).forEach(k => root.style.removeProperty(k));
  });
  Object.entries(t.palette || {}).forEach(([k, v]) => root.style.setProperty(k, v));

  // 4. Sound: flavor + theme id + boss bank from the voice cast.
  // Guarded per-method so a stale audio engine can never break theming.
  if (window.Sound) {
    if (typeof Sound.setFlavor === 'function') Sound.setFlavor(THEME_FLAVORS[t.flavor] || THEME_FLAVORS.gothic);
    if (typeof Sound.setTheme === 'function') Sound.setTheme(t.id);
    const bank = (typeof bossBankForTheme === 'function')
      ? bossBankForTheme(t.id)
      : (() => { const b = {}; Object.keys(t.houses).forEach(id => { b[id] = t.houses[id].taunts; }); return b; })();
    if (typeof Sound.setBossBank === 'function') Sound.setBossBank(bank);
    else if (typeof Sound.setTauntBank === 'function') Sound.setTauntBank(bank);
  }

  // 5. Brand copy
  const mapTitle = document.querySelector('.map-title');
  const mapSub = document.querySelector('.map-sub');
  if (mapTitle) mapTitle.textContent = t.brand.mapTitle;
  if (mapSub) mapSub.textContent = t.brand.mapSub;

  // 6. World identity: mark glyph, display font, scene chrome
  window.THEME_UI = { mark: t.mark || '⛧', terms: t.terms || THEMES.wasteland.terms };
  document.body.dataset.theme = t.id;
  root.style.setProperty('--font-display', t.font || '"Cinzel", serif');
  const terms = window.THEME_UI.terms;
  const mark = window.THEME_UI.mark;
  const setText = (sel, txt) => document.querySelectorAll(sel).forEach(e => { e.textContent = txt; });
  setText('#login-start', terms.begin);
  setText('#open-trials', terms.trialsBtn);
  setText('#open-cheat', terms.ledgerBtn);
  setText('#trials-title', terms.hubName);
  setText('#trials-sub', terms.hubSub);
  setText('#ledger-title', terms.ledgerName);
  setText('#ledger-sub', terms.ledgerSub);
  setText('.vs-mark', mark);
  setText('#battle-next', terms.strikeAgain);
  setText('#scene-intro .eyebrow', `${mark} ${terms.introEyebrow} ${mark}`);
  setText('.defeat-eyebrow', `${mark} ${terms.defeatEyebrow} ${mark}`);
  setText('#scene-complete .eyebrow', `${mark} ${terms.completeEyebrow} ${mark}`);
  setText('.complete-title', terms.completeTitle);
  setText('.complete-lede', terms.completeLede);

  return t;
}

window.THEMES = THEMES;
window.applyTheme = applyTheme;
