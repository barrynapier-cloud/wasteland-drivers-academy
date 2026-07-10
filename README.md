# Permit Legends

A browser RPG that teaches the Washington State written driver exam. Beat the bosses, pass the test. Every number, sign, and law in the game is lifted straight from the official Washington Driver Guide — clear the game here, pass the exam there.

One fact core, five fully reskinned worlds. Chapter 1 is free; the full run is a $20 one-time unlock.

## The five worlds

Same questions, same six-chapter structure, totally different lore, art, characters, fonts, and voices:

1. **Wasteland Academy** — goth-anime demon-slaying (the original)
2. **Neon Circuit** — cyberpunk rogue-AI grid
3. **Starbound Academy** — space-cadet sci-fi
4. **Realm of Roads** — high-fantasy dragons and knights
5. **Cruise Critters** — cozy pastel town (aimed younger)

The fact core is sacred: only presentation (names, palette, marks, terms, fonts, boss/hero art and voices) is themed. Numbers and law never change between worlds.

## Stack

Pure static HTML / CSS / JS. No framework, no build step. Hosted on GitHub Pages at [permitlegends.com](https://permitlegends.com) — every push to `main` auto-deploys. The `CNAME` file in the repo root holds the custom-domain binding; do not delete it.

- `index.html` — marketing landing page (pricing, guarantee, log-in link)
- `play.html` — the game itself (scenes: login, intro, world/driver select, map, study, quiz, battle, defeat, complete, trials hub)
- `styles.css` — design system + per-world card systems, animations, battle stage
- `app.js` — scene routing, player state, battle logic, save/entitlement plumbing
- `chapters.js` — six chapters: lessons, quizzes, boss data (the fact core)
- `battle-questions.js` — question variants pulled randomly per battle
- `quests.js` — quick-test hub: Rapid Fire, Chapter Pop Quiz, Trial of Redemption, Final Reckoning mock exam
- `themes.js` — the five-world skin engine (palette, lore, terms, marks, fonts, cast) applied over the fact core
- `voices.js` — written source of truth for every boss/hero line (drives both audio clips and the browser-voice fallback)
- `audio.js` — Web Audio sound engine + voice playback
- `account.js` — Firebase account layer (login, cross-device cloud save, entitlement)
- `data.js` — supporting fixtures (e.g. the number ledger)
- `images/`, `audio/`, `icons/` — per-world art, 200+ voice clips, PWA icons

## Accounts & saving

`account.js` talks to Firebase (Auth + Firestore). Kids sign in with a username + password (no real email needed — a synthetic `<name>@players.permitlegends.com` address is used under the hood). Progress saves to the cloud keyed to the account and follows them across devices; a signed-out player still gets a local save. Firestore rules are owner-only and make the paid `unlocked` flag server-writable only. Login is one tap from the front screen of the game and from the landing page.

## Payments

$20 one-time via a Stripe payment link. On success, a Cloudflare Worker (`webhook/worker.js`) verifies the Stripe signature and writes `unlocked = true` to the buyer's Firebase profile, which syncs to every device they log in on. A legacy per-device unlock code still exists as a belt-and-suspenders fallback. See `LAUNCH.md` for the full runbook and `SECURITY.md` for the security posture.

## Sound & voice

Every world has a full cast: 30 bosses (battle cry + strike taunts + defeat lines) and 16 heroes (intro on select + victory line), 200+ pre-rendered ElevenLabs clips, plus a synthesized Web Audio effects engine. `audio/manifest.json` lists which clips are present; anything missing falls back to the same written line via browser speech, so partial rollouts never go silent. Two HUD toggles: sound effects and character voice.

## Quick tests (trials hub)

Reachable from the map, drawing on the same question banks as the boss fights:

- **Rapid Fire** — 60-second clock; a wrong answer freezes the clock and holds the explanation until you resume.
- **Chapter Pop Quiz** — five fast questions on any unlocked chapter.
- **Trial of Redemption** — drills only the questions you have missed anywhere; a later correct answer clears the mark.
- **The Final Reckoning** — a 25-question mock exam balanced across all chapters, 80% to pass (the DOL bar), with a per-chapter score breakdown that flags your weakest area.

## Learning engine

The RPG is a costume; underneath it runs on retrieval practice — mistake ledger, per-chapter mastery bars, active-recall veiled numbers in study, cross-chapter tags on every miss, and full keyboard play. Rationale and citations live on the in-app Science page (`science.html`).

## App-store builds

A PWA layer (`manifest.json` + `sw.js` + `icons/`) makes the web app installable. Capacitor shells for iOS and Android are scaffolded locally (gitignored) for a paid-upfront store release. See `STORES.md`.

## Run locally

```bash
python3 -m http.server 8765
# open http://localhost:8765/play.html
```
