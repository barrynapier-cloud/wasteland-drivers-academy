# Permit Legends — Security Posture

Last reviewed: 2026-07-10. Independent adversarial review by OpenAI Codex
(gpt-5.6-sol) plus in-house testing. This file tracks what's hardened and
what's a known, accepted tradeoff.

## Threat model
A $20 one-time study game for teens. No PII beyond an optional username +
password and gameplay progress. No payment data on our infrastructure
(Stripe hosts checkout). Calibrate accordingly: the goal is "no data leaks
between kids, no trivial free-unlock, no XSS," not bank-grade.

## Fixed (verified)
- **Per-user data isolation.** Firestore rules: a player can read/write only
  `profiles/{their-uid}`. Verified by live test — a second account gets 403
  on both read and write of another user's doc.
- **Entitlement is server-only.** `unlocked` cannot be written by any client
  (`affectedKeys().hasOnly(clientFields)` excludes it; create can't include
  it). Only the Admin SDK (server / future webhook) sets it. Closes the
  "PATCH your own doc to unlock free" bypass. account.js never sends it.
- **No cross-user save bleed.** Local saves are namespaced `pl_save__<uid>`;
  a second kid signing in on a shared device no longer inherits/uploads the
  previous player's run. Guest saves stay separate.
- **No remote clobber on flaky reads.** fetchProfile distinguishes 404 (fresh
  account) from network/permission errors, and never overwrites cloud data on
  an uncertain read. Writes use an updateMask (save + metadata only).
- **XSS.** All user-influenced values are escaped before innerHTML; sign-image
  URLs are escaped in every `src`. Names render via textContent.
- **Service worker.** Awaits cache writes; only serves the app shell for page
  navigations, never HTML in place of a missing .js/.css.
- **Secrets.** No credential is committed or in git history. The only key in
  the client is the Firebase web apiKey (public by design). Admin service
  account + ElevenLabs key live in ~/.claude, chmod 600, gitignored.

## Known, accepted tradeoffs (v1)
- **Paywall is deterrence, not enforcement.** Unlock codes are a public
  checksum (~1/97 of random strings pass); anyone who reads the public repo
  can mint one. The game content ships in the public static bundle. HARD
  enforcement requires (a) moving content server-side [overkill for this
  game] and (b) server-granted entitlement. We do (b) next; (a) we accept.
- **Cross-device PAID unlock needs the webhook.** Today a buyer is unlocked on
  their purchase device (local code) and any device where an admin marked
  their account. Automatic cross-device unlock-on-purchase = the webhook
  below. (Eddie's tester account was admin-granted.)

## Next security build — the Stripe → Firebase webhook
A Firebase Cloud Function (needs the Blaze plan; ~free at this volume):
1. Stripe Checkout created server-side with the buyer's Firebase UID in
   `client_reference_id` (NOT email — synthetic/unverified emails are
   spoofable; Codex #7).
2. On `checkout.session.completed`, verify the Stripe signature, then the
   function (Admin SDK, bypasses rules) sets `unlocked: true` on that UID.
3. Optionally mint a per-purchase single-use redemption token.
This delivers: real paywall enforcement, automatic cross-device unlock,
per-purchase codes, and receipt email — retiring the shared-code system.

## To rotate credentials (do before heavy marketing)
- Firebase admin key: console → Project settings → Service accounts →
  generate new key, delete old. The live site uses only the public web key,
  so rotation breaks nothing.
- ElevenLabs key: dashboard → regenerate. Update ~/.claude/.permitlegends-creds.
