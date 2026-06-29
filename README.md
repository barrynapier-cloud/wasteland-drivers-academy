# Wasteland Drivers Academy

A goth-anime-kawaii driving-school RPG for the Washington State written driver exam. Sanrio × Sanctum. Three drivers. Six demons. One license.

## What it is

Every chapter of this game is a category on the Washington Driver Guide. Every demon is a number you must learn. Every law, sign, and figure is lifted straight from the official guide — pass the demons here, pass the exam there.

## Stack

Pure static HTML / CSS / JS. No framework. No build step. No localStorage (sandbox-blocked) — all state is in-memory.

- `index.html` — scenes: login, intro, map, chapter intro, study, quiz, battle, defeat, complete
- `styles.css` — design system, animations, battle stage
- `app.js` — scene routing, player state, battle logic
- `chapters.js` — six chapters with lessons, quizzes, boss data
- `battle-questions.js` — 60+ question variants pulled randomly per battle
- `data.js` — supporting fixtures
- `images/` — anime avatars, demon portraits, wasteland-styled signs

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
