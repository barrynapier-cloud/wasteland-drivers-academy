# Permit Legends — App Store Runbook

One codebase, three surfaces:
- **Web** (permitlegends.com): freemium, $20 Stripe unlock. Live.
- **PWA**: installable from the browser, offline play. Live with the next deploy.
- **iOS + Android apps**: Capacitor shells in `ios/` and `android/` (local only,
  gitignored). Sold **paid upfront at $19.99** — the build ships fully unlocked
  (`PL_NATIVE_PAID=true`), so no Apple/Google IAP code is ever needed.

Accounts (email code, optional) sync progress and unlock across all three.

## Dev loop
```bash
npm run sync          # rebuild www/ from repo root + copy into ios/ + android/
npm run open:ios      # opens Xcode
npm run open:android  # opens Android Studio
```
`scripts/build-www.mjs` makes play.html the app entrypoint and injects the
paid flag. Never commit `www/`, `ios/`, `android/` (gitignored).

## One-time machine setup (your side, ~1 hour)
1. **Xcode**: install from the Mac App Store (the full app, not just CLT),
   then `sudo xcode-select -s /Applications/Xcode.app` and
   `sudo gem install cocoapods` (or `brew install cocoapods`).
2. **Android Studio**: install from developer.android.com; first launch
   installs the SDK.

## Accounts (one-time, your card)
- **Apple Developer Program**: developer.apple.com, $99/yr, enroll as
  individual or your LLC. Takes 1-2 days to approve.
- **Google Play Console**: play.google.com/console, $25 one-time.

## Android submission (do this one first — easier)
1. `npm run sync && npm run open:android`
2. Android Studio: Build > Generate Signed App Bundle. Create a keystore,
   SAVE IT + its passwords somewhere safe (lose it = can never update the app).
3. Play Console: create app "Permit Legends", price $19.99, education category.
4. Upload the .aab, fill the listing (icon: `icons/icon-512.png`, screenshots:
   take from the phone or emulator), content rating questionnaire (E for
   everyone; note the alcohol-education content honestly — it teaches DUI law).
5. Submit. First review typically 1-3 days. New personal accounts may need
   a 14-day closed test with 12 testers first (Google policy for accounts
   created after Nov 2023) — the LLC/org account type avoids this.

## iOS submission
1. `npm run sync && npm run open:ios`
2. Xcode: set your Team under Signing & Capabilities, bump the version,
   Product > Archive > Distribute App > App Store Connect.
3. App Store Connect: create the app, price $19.99 (Tier 20), category
   Education (primary) / Games-Trivia (secondary).
4. Listing notes that matter for review:
   - Guideline 4.2 (minimum functionality): mention offline play, save
     system, voice acting, five game worlds — this is a game, not a wrapped
     website. The offline bundle is the strongest argument.
   - The DUI/cannabis content is EDUCATIONAL (state exam material). Set the
     age rating questionnaire accordingly (references to alcohol/drugs:
     infrequent/mild, educational context). Expect 17+ or 12+ depending on
     answers; that is fine.
5. Submit for review. Typically 24-48h.

## Pricing logic (why paid-upfront, not IAP)
Digital unlocks inside store apps must use Apple/Google billing (15% cut
under $1M). A paid-upfront app needs zero billing code and zero webhook
work. Web stays freemium with Stripe at 3%; the stores are a distribution
channel where 15% is the cost of discoverability.

## Cross-platform accounts
`account.js` (email 6-digit code via Supabase). Store-app buyers get
`unlocked=true` written to their account on first login (the build is paid).
Web buyers get it from the Stripe redirect code or (phase 2) the webhook.
Backend status: client layer is live but DORMANT until the Supabase project
is provisioned and `PL_BACKEND.url/key` are filled in account.js — at which
point the ☁ Save button appears automatically.
