# Wasteland Drivers Academy

A goth-anime-kawaii driving-school RPG for the Washington State written driver exam. Sanrio × Sanctum. Three drivers. Six demons. One license.

## What it is

Every chapter of this game is a category on the Washington Driver Guide. Every demon is a number you must learn. Every law, sign, and figure is lifted straight from the official guide — pass the demons here, pass the exam there.

## Stack

Pure static HTML / CSS / JS. No framework. No build step. No localStorage (sandbox-blocked) — all state is in-memory.

- `index.html` — scenes: login, intro, map, chapter intro, study, quiz, battle, defeat, complete, trials hub, trial run, trial result
- `styles.css` — design system, animations, battle stage
- `app.js` — scene routing, player state, battle logic
- `chapters.js` — six chapters with lessons, quizzes, boss data
- `battle-questions.js` — 60+ question variants pulled randomly per battle
- `quests.js` — Trials of the Wastes: Rapid Fire, Chapter Pop Quiz, Trial of Redemption, and the Final Reckoning mock exam
- `audio.js` — procedural sound engine (Web Audio) + demon voiceovers (SpeechSynthesis)
- `data.js` — supporting fixtures
- `images/` — anime avatars, demon portraits, wasteland-styled signs

## Sound & voice

All audio is synthesized at runtime. No asset files, no network, works offline.

- **Sound effects** — Web Audio API. UI clicks, correct/wrong stings, hero slashes, critical hits, boss counterstrikes, combo risers, victory fanfare, defeat dirge, level-up, sigil shimmer, and a Rapid Fire countdown.
- **Demon voiceovers** — pre-rendered ElevenLabs voice clips in `audio/` (30 lines, one distinct voice cast per demon). Each boss announces itself with a battle cry, taunts you on every counterstrike, and speaks its defeat line when it falls. If a clip is ever missing, the engine falls back to the browser SpeechSynthesis voice automatically, so the game still talks with no files at all.
  - Voice casting: Blood = Vesper, Ember = Alistair, Static = Imogen, Iron = Vlad, Thorn = Elena, Bone = Sloane.
  - `audio/manifest.json` lists every line and its voice id; re-render any line by feeding the manifest back through ElevenLabs.
- Two toggles in the map HUD: 🔊 sound effects and 🗣 demon voice. Audio unlocks on first interaction (browser autoplay policy).

## Trials of the Wastes (quick tests)

Reachable from the map. Bite-size knowledge checks that draw from the same question banks as the boss fights, with no HP or demons.

- **Rapid Fire** — 60-second clock, answer as many as you can, streaks multiply the score. A wrong answer freezes the clock and holds the explanation until you resume — misses teach, speed stays free.
- **Chapter Pop Quiz** — five fast questions on any unlocked house, graded, no boss battle.
- **Trial of Redemption** — drills only the questions you have missed, anywhere in the game. Answer one right and its mark is erased from the ledger. Empty ledger = clean conscience.
- **The Final Reckoning** — a mock written exam. 25 questions balanced across all six houses, no hints, no explanations, 80% to pass (same bar as the DOL). The verdict screen breaks your score down per house, flags your weakest house, and feeds every miss into the Trial of Redemption.

## Learning engine

The RPG is a costume; underneath it runs on retrieval practice.

- **Mistake ledger** — every wrong answer in every mode (quiz, battle, trial, exam) is recorded. A later correct answer to the same question, anywhere, redeems it.
- **Mastery tracking** — per-house accuracy across all modes, shown as a mastery bar on each map tile.
- **Active recall in study** — each lesson's key number starts veiled (label visible, number and supporting text blurred). Guess first, then tap to unveil. Guessing before seeing the answer measurably improves retention, even when the guess is wrong.
- **House tags** — cross-house questions show which house they belong to, so a miss tells you exactly what to re-study.
- **Keyboard play** — answer with A–D or 1–4, advance with Enter/Space, page study cards with arrow keys. Enter unveils a veiled number before it advances.

## Drivers

| Name           | Body              | Tagline                                          |
| -------------- | ----------------- | ------------------------------------------------ |
| Vex Halloran   | Petite · Wiry     | Speed is grace.                                  |
| Mira Korvus    | Tall · Athletic   | Discipline is the only prayer.                   |
| Saoirse Veil   | Soft · Curvy      | The road is a circle and I am at its center.    |

## The Six Houses

1. **Blood** — DUI, BAC, refusal. Boss: *The Refuser.* Reward: Sigil of Sobriety.
2. **Ember** — Distraction, devices. Boss: *The Static Eye.* Reward: Mark of Clear Vision.
3. **Static** — Pedestrians, school zones. Boss: *The Veil.* Reward: Eye of the Awake.
4. **Iron** — Signs, signals, markings. Boss: *The Iron Reader.* Reward: Crest of the Reader.
5. **Thorn** — Right-of-way, intersections. Boss: *Thorn-Crowned.* Reward: Lattice of First Passage.
6. **Bone** — Final exam. Boss: *The Final Ledger.* Reward: Crown of the Final Ledger.

## Run locally

```bash
python3 -m http.server 8765
# open http://localhost:8765
```

## Deploy

Static drop — works on any static host (Vercel, Netlify, S3, GitHub Pages). No server required.
