# Permit Legends — Launch Runbook

LIVE NOW: https://permitlegends.com (custom domain, HTTPS enforced; github.io URL still works)
Repo: https://github.com/barrynapier-cloud/wasteland-drivers-academy (public — required for free GitHub Pages; client code ships to browsers anyway, and codes-private.txt was never committed)

Note on Vercel: the first deploy went live, then Vercel's review system
BLOCKED all further deploys on the fresh account (state: BLOCKED via API,
no error shown in CLI). Check vercel.com dashboard for a verification
banner, or add a card to the account to clear it. GitHub Pages is the
production host until then; every `git push` auto-deploys.

## Launch checklist — all DONE

### 1. Domain (2026-07-02)
permitlegends.com purchased on Namecheap, DNS pointed at GitHub Pages
(4 A records + www CNAME), custom domain attached to the repo, HTTPS
certificate issued and enforced. www redirects to the apex.

### 2. Payments (2026-07-04, hardened 2026-07-10)
Live Stripe payment link ($20 one-time) is wired to the buy button in
index.html. On a completed purchase, the Cloudflare Worker
(`webhook/worker.js`) verifies the Stripe signature and writes
`unlocked = true` to the buyer's Firebase profile, which then syncs to
every device they log in on. The buy button appends the signed-in
Firebase UID as `client_reference_id` so the webhook knows whose account
to unlock. Full end-to-end verified (paid -> unlock, forged sig -> no
unlock, unpaid -> no unlock).

### 3. Deploy
No Vercel step. GitHub Pages is the host: every `git push` to `main`
auto-deploys. Version-stamp changed assets (`?v=YYYYMMDDx`) to bust the
Pages cache.

## Access codes (legacy fallback)
Accounts + the Stripe webhook are the real entitlement path now. The
per-device code system still works as belt-and-suspenders:
- 25 valid codes in `codes-private.txt` (gitignored, never deploy or commit it)
- Generate more: `node scripts/gen-codes.mjs 50`
- Codes are checksum-validated client-side and device-local. Fine as a
  backup at $20; account-based unlock is the primary path.

## What is live
- Landing page at / with pricing + the Legend Guarantee (pass or $20 back)
- Game at /play.html: 5 worlds, chapter 1 free, chapters 2-6 and the
  mock exam gated behind the unlock
- /unlock.html code redemption, /science.html research page
- Accounts (username + password via Firebase): progress saves to the
  cloud keyed to the account and follows the player across devices.
  Signed-out players still get a local save. Login is one tap from the
  game's front screen and from the landing page.

## The five worlds
| World | Vibe | Kid |
|---|---|---|
| Wasteland Academy | goth-anime demons | anime kid |
| Neon Circuit | cyberpunk rogue AIs | Fortnite kid |
| Starbound Academy | space cadet school | Minecraft/NASA kid |
| Realm of Roads | fantasy dragons | Zelda/D&D kid |
| Cruise Critters | cozy pastel animals | younger kid / parent pick |

Same Washington fact core under all five. Themes cannot touch the law.

## Marketing angles that write themselves
- "The permit test, but it fights back" (hero line, already on the page)
- Science page = the parent-facing trust page; guarantee closes them
- TikTok: screen-record a boss fight with the voice taunts, caption
  "POV: the 0.08 boss when you actually studied"
- Each world is its own audience hook: post Cruise Critters clips in
  parent groups, Neon Circuit clips on gaming TikTok

## Known limits
- All five worlds have their full ElevenLabs voice cast rendered (36 boss
  clips each + 32 hero clips = 212 total); the browser voice is only a
  fallback if a clip ever fails to load.
- Legacy access codes are device-local and shareable, but they are now
  just a backup; accounts + the Stripe webhook are the real entitlement.
- WA only. The theme engine makes other states a content job, not a
  code job: swap the fact core per state.
