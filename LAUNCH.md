# Permit Legends — Launch Runbook

LIVE NOW: https://permitlegends.com (custom domain, HTTPS enforced; github.io URL still works)
Repo: https://github.com/barrynapier-cloud/wasteland-drivers-academy (public — required for free GitHub Pages; client code ships to browsers anyway, and codes-private.txt was never committed)

Note on Vercel: the first deploy went live, then Vercel's review system
BLOCKED all further deploys on the fresh account (state: BLOCKED via API,
no error shown in CLI). Check vercel.com dashboard for a verification
banner, or add a card to the account to clear it. GitHub Pages is the
production host until then; every `git push` auto-deploys.

## Your 3 remaining clicks (approx 10 minutes total)

### 1. Domain — DONE (2026-07-02)
permitlegends.com purchased on Namecheap, DNS pointed at GitHub Pages
(4 A records + www CNAME), custom domain attached to the repo, HTTPS
certificate issued and enforced. www redirects to the apex.

### 2. Create the Stripe Payment Link ($20)
1. Stripe Dashboard > Payment Links > New
2. Product: "Permit Legends — Full Unlock", $20 one-time
3. After payment: redirect to
   `https://permitlegends.com/unlock.html?code=LEGEND-CKX4-FNQA`
   (or the github.io URL until the domain is attached; the code is from
   codes-private.txt and the URL auto-unlocks the buyer's device)
4. Copy the payment link URL

### 3. Paste the link into the site
In index.html, replace `REPLACE_WITH_STRIPE_PAYMENT_LINK` with your payment link,
then run `vercel deploy --prod` (or ask Claude to do it).

## Access codes
- 25 valid codes in `codes-private.txt` (gitignored, never deploy or commit it)
- Generate more: `node scripts/gen-codes.mjs 50`
- Codes are checksum-validated client-side. A determined nerd could
  reverse-engineer one; at $20 that is not your enemy tonight. Upgrade
  path when revenue justifies it: Vercel serverless function + Stripe
  webhook for per-purchase unique codes.

## What is live
- Landing page at / with pricing + the Legend Guarantee (pass or $20 back)
- Game at /play.html: 5 worlds, chapter 1 free, chapters 2-6 and the
  mock exam gated behind the unlock
- /unlock.html code redemption, /science.html research page
- Progress persists per device (localStorage): resume banner, mistakes,
  mastery, across sessions

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

## Known limits (v1, all fixable later)
- Access code is device-local and shareable (see upgrade path above)
- New-world boss voices use the browser voice; the Wasteland world has
  the 30 real ElevenLabs clips. Rendering the other 120 lines costs
  about 36 credits when you want it.
- WA only. The theme engine makes other states a content job, not a
  code job: swap the fact core per state.
