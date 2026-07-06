// Build the native web bundle: copy the game into www/ with the game
// (play.html) as the entrypoint and the paid-build flag injected.
import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'fs';

rmSync('www', { recursive: true, force: true });
mkdirSync('www', { recursive: true });

const files = ['styles.css','app.js','audio.js','data.js','chapters.js','battle-questions.js','themes.js','quests.js','voices.js','account.js','unlock.html','science.html','manifest.json'];
for (const f of files) cpSync(f, `www/${f}`);
for (const d of ['images','audio','icons']) cpSync(d, `www/${d}`, { recursive: true });

// play.html becomes index.html: native app boots straight into the game.
let play = readFileSync('play.html','utf8');
// Paid-upfront store build: everything unlocked, no IAP code needed.
play = play.replace('<script src="account.js', '<script>window.PL_NATIVE_PAID = true;</script>\n  <script src="account.js');
// No service worker inside the native shell (Capacitor serves locally).
play = play.replace(/<script>\s*if \('serviceWorker'[\s\S]*?<\/script>/, '');
writeFileSync('www/index.html', play);
console.log('www/ built: game-first entrypoint, PL_NATIVE_PAID=true');
