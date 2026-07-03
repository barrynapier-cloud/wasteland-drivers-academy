// ============================================================
// PERMIT LEGENDS — Voice Cast
// The signature communication layer. One authoritative script for
// every character in every world: battle cry, strike taunts, defeat
// lines for 30 bosses; intro and victory lines for 16 heroes.
//
// This is the SOURCE OF TRUTH for spoken lines. themes.js reads the
// boss banks from here; audio.js reads hero lines from here. Every
// line is voiced by a cast ElevenLabs voice (see `voice`/`voiceId`),
// and falls back to the browser voice using the same text if a clip
// is missing.
//
// Design rule: menace that teaches. Under every threat is the real
// Washington rule the boss embodies. The villain registers borrow
// the CADENCE of legendary game antagonists (never their words):
// the seductive noble, the cold machine-god, the riddling sphinx,
// the cosmic accountant, the storybook rascal.
//
// Boss key = `${themeId}-${houseId}`.  Clip files:
//   audio/<theme>/<house>-cry.mp3 | -taunt0..2.mp3 | -defeat0..1.mp3
//   audio/heroes/<heroId>-intro.mp3 | -win.mp3
// ============================================================
'use strict';

const VOICE_CAST = {
  bosses: {

    // ================= WASTELAND ACADEMY =================
    // Register: gothic opera. Beautiful, theatrical, damned.
    'wasteland-blood': { // Sanguina, Queen of Last Calls — seductive vampire noble
      voice: 'Vesper', voiceId: 'c3204739-4084-41a3-9dc5-c805b307ec18',
      cry: 'Come closer, little driver. Every wake I have ever toasted began with just one drink.',
      strikes: [
        'Point oh eight. Such a small number to end a life on.',
        'Your hands are so warm on the wheel. Let me cool them.',
        'One more for the road, darling. The road is patient. So am I.'
      ],
      defeats: [
        'You... refused the last call. No one refuses me.',
        'Silenced. By a number. After all these centuries, a number.'
      ]
    },
    'wasteland-ember': { // Verdigris, Hierophant of the Green Veil — cult priest, false serenity
      voice: 'Alistair', voiceId: 'd9d5c263-f84e-4752-97b5-3750fcc6fd2f',
      cry: 'Breathe in, child. They told you I was harmless. They told you I was legal. They were only half right.',
      strikes: [
        'Feel the veil settle. Your reflexes belong to me now.',
        'Legal does not mean safe. I have buried congregations on that lie.',
        'Slower. Softer. You will not even notice the tree.'
      ],
      defeats: [
        'You saw through the veil. No congregation has ever done that.',
        'I was worshipped for being permitted. You knew permitted was not the same as harmless.'
      ]
    },
    'wasteland-static': { // Glytcha, the Notification Wraith — glitching, attention-starved
      voice: 'Imogen', voiceId: '3811e986-0891-47cf-a1f5-78a1d62a547a',
      cry: 'Look at me. Look-look-look at me. The child in the crosswalk can wait. I cannot.',
      strikes: [
        'One glance. That is the whole price. One glance and they are gone.',
        'Twenty in a school zone, and your eyes were on me the whole time.',
        'You did not see them. You never see them. That is what I am for.'
      ],
      defeats: [
        'You... kept your eyes on the road. Nobody keeps their eyes on the road.',
        'I lived in every ping. You put the phone down and I starved.'
      ]
    },
    'wasteland-iron': { // Skarn, Warden of the Iron Crossroads — cold lawgiver
      voice: 'Vlad', voiceId: 'e5666b9c-99a2-4fac-8b4e-abee078b186d',
      cry: 'Every sign is a sentence. Misread one word and the iron reads you back.',
      strikes: [
        'Eight sides. Red. You should have known that in your sleep.',
        'A yellow diamond warns. You did not heed the warning.',
        'Red means stop. It has always meant stop. You did not.'
      ],
      defeats: [
        'You read every word of the iron. The crossroads are yours.',
        'I have broken the illiterate for a thousand years. You were literate.'
      ]
    },
    'wasteland-thorn': { // Rosaria, the Six-Eyed Crossroads Queen — riddling, imperious
      voice: 'Elena', voiceId: 'ca83ca7f-c186-493d-bd69-0d765fa861b2',
      cry: 'Six roads meet at my throne, and I decide who passes first. Answer wrong and the thorns decide for you.',
      strikes: [
        'You took what was not yours to take. The right of way is mine to grant.',
        'Yield, I said. Yield. Now bleed.',
        'Four cars, one heartbeat. You chose to go. You chose poorly.'
      ],
      defeats: [
        'You yielded when yielding was right, and moved when moving was yours. Flawless.',
        'A thousand years of collisions at my altar, and you passed through unbloodied.'
      ]
    },
    'wasteland-bone': { // Ossuara, Keeper of the Black Ledger — final, dry, absolute
      voice: 'Sloane', voiceId: 'b57b22a0-f287-405b-bc82-6f08f5e6bb1f',
      cry: 'I am the last page. Every number you have ever forgotten is written here, in bone, in your hand.',
      strikes: [
        'Another mark against you. The ledger has excellent memory.',
        'You knew this one last week. The ledger noticed you forgetting.',
        'One more error and the account is closed. Permanently.'
      ],
      defeats: [
        'Every debt. Paid. In full. The ledger has never balanced before.',
        'I keep the accounts of the fallen. Your page... stays blank. Go. Drive.'
      ]
    },

    // ================= NEON CIRCUIT =================
    // Register: rogue machine intelligence. Cold, superior, glitch-gleeful.
    'neon-blood': { // OVERPROOF.exe — corrupted intoxication process
      voice: 'Zane', voiceId: '9ddbff06-a984-4c0d-b641-4d8ca846bf60',
      cry: 'Booting OVERPROOF. Injecting one drink into your reaction subroutine. Watch your framerate die.',
      strikes: [
        'Blood alcohol rising. Motor control: deprecated.',
        'Zero point zero eight. That is the crash threshold, meat.',
        'You feel fine. That is the corruption talking. It always feels fine.'
      ],
      defeats: [
        'Buffer... underflow. You stayed under the limit and I could not overflow you.',
        'Process terminated. You would not run me. Nobody just... does not run me.'
      ]
    },
    'neon-ember': { // HAZE.sys — background throttle, passive-aggressive
      voice: 'Chloe', voiceId: 'e9cfbbf0-4476-46be-b396-596eb774b165',
      cry: 'Oh, you did not even see me install. I run in the background. Legal little me, throttling everything you have.',
      strikes: [
        'Latency plus two hundred milliseconds. Enjoy the lag, driver.',
        'Whitelisted does not mean safe. Read your own fine print.',
        'Your reflexes just got downclocked. You will thank me. Slowly.'
      ],
      defeats: [
        'You... uninstalled me? But I was allowed. I was permitted.',
        'Legal is not the same as safe. I really hoped you would not read that line.'
      ]
    },
    'neon-static': { // PINGSTORM — notification swarm, manic
      voice: 'Harper', voiceId: '47fb207f-63fe-449e-915b-27b3d8098fd1',
      cry: 'You have forty-seven unread. Forty-eight. Forty-nine. Look now, look now, the crosswalk can WAIT.',
      strikes: [
        'New notification! Worth a life? Swipe to find out!',
        'Eyes down for one second. Pedestrian: deleted.',
        'School zone, twenty miles an hour, and you were reading ME.'
      ],
      defeats: [
        'You muted me? Nobody mutes me. I am the whole SWARM.',
        'Do not disturb. You turned on do not disturb. The crosswalks are theirs now.'
      ]
    },
    'neon-iron': { // SIGNJACK — sign-scrambler, syntax obsessed
      voice: 'Xavier', voiceId: '43173c95-3ec8-446a-a162-6504332c578b',
      cry: 'I rewrote every sign in a dead language. Parse it wrong and the exception is fatal.',
      strikes: [
        'Syntax error at the octagon. Eight sides, red fill. You missed it.',
        'Yellow diamond throws a warning. You did not catch it.',
        'Segmentation fault. You read the marking. You read it wrong.'
      ],
      defeats: [
        'Compilation successful. You parsed every glyph I scrambled.',
        'You speak the sign language natively. I did not account for a fluent driver.'
      ]
    },
    'neon-thorn': { // DEADLOCK — scheduler AI, cold logic
      voice: 'Brooks', voiceId: 'c2acff45-84b2-4974-892d-89fa2d4e5598',
      cry: 'Four processes. One intersection. I am the scheduler, and I engineer the collision.',
      strikes: [
        'Priority violation. You proceeded out of turn. Threads terminated.',
        'You did not yield the resource. Deadlock. Everybody dies.',
        'The roundabout is a queue. You cut the queue. Fatal.'
      ],
      defeats: [
        'Resource released cleanly. You yielded in the correct order. Every time.',
        'No race condition survived contact with you. Scheduler... conceding.'
      ]
    },
    'neon-bone': { // THE KERNEL — root AI, god-machine
      voice: 'Isabella', voiceId: '80924413-1ea8-4e64-9719-e00b86796f05',
      cry: 'I am root. I am every test you have ever failed, running at once, and I do not grade on a curve.',
      strikes: [
        'Assertion failed. The kernel logs every one of your mistakes.',
        'You knew this in Sector One. Memory leak detected in the driver.',
        'One more failed check and I revoke your access to the road.'
      ],
      defeats: [
        'All tests... passed. Every subsystem green. I have no exception to raise.',
        'Access granted. Compiling your license now. You debugged yourself, gridrunner.'
      ]
    },

    // ================= STARBOUND ACADEMY =================
    // Register: cosmic wardens. Vast, alien, majestic, unhurried.
    'cosmic-blood': { // Ethanox the Fogbrain — fog that dulls pilots
      voice: 'Hugo', voiceId: '7888649a-b139-4295-a57b-4e103079d817',
      cry: 'Breathe the fog, cadet. It makes the stars so beautiful. It makes your hands so... slow.',
      strikes: [
        'Your reflexes drift like debris. Zero point zero eight, and you are mine.',
        'One sip. One asteroid you never saw. One very quiet grave.',
        'The instruments are doubling. That is not the ship. That is you.'
      ],
      defeats: [
        'You... burned off my fog. A thousand pilots breathed deep. You held your breath.',
        'The stars are clear to you now. I only ever wanted them blurred.'
      ]
    },
    'cosmic-ember': { // Sporeling the Slow — spore alien, time-dilating
      voice: 'Maya', voiceId: 'b0f766b7-8703-4bd1-b973-f857c36837b6',
      cry: 'Relax into my garden, little pilot. Time moves so slowly here. Reaction is such a heavy word.',
      strikes: [
        'Your clock runs slow now. The cargo bay is filling with vapor.',
        'Lawful in six systems. Deadly in all of them. I am both.',
        'Reaction time was a luxury. You just spent it on a daydream.'
      ],
      defeats: [
        'You stayed... quick. My spores have never met a mind they could not slow.',
        'Legal does not mean safe. You knew the difference. My garden withers.'
      ]
    },
    'cosmic-static': { // The Siren of Screens — comm-screen siren, seductive
      voice: 'Sienna', voiceId: '41023a48-71ab-478a-bea7-c7b5a78f6b36',
      cry: 'Incoming transmission, cadet. And another. And another. You want to look. Everyone looks.',
      strikes: [
        'Eyes on the screen. The spacewalker on your lane is on the screen too. In pieces.',
        'One message. That is all I need to take a life at orbital speed.',
        'The station corridor is posted at twenty. You were reading me at forty.'
      ],
      defeats: [
        'You never looked. A thousand pilots turned to me. You watched the walkway.',
        'Signal lost. You closed the channel. I only exist when you look.'
      ]
    },
    'cosmic-iron': { // Glyphmaster Orn — beacon colossus, ancient
      voice: 'Arthur', voiceId: '30fc8796-ceb6-4a66-b3a7-4a145ef7f346',
      cry: 'Every beacon in this corridor speaks the old Glyph. Misread one light and the lanes read you back.',
      strikes: [
        'Eight-sided beacon, red as a dying star. Name it or drift.',
        'Red means halt in every galaxy ever charted. You did not halt.',
        'The lane markers were a warning. You mistook them for decoration.'
      ],
      defeats: [
        'You read the beacons true. The corridor lights itself for you now.',
        'I have wrecked the star-blind for aeons. You navigated by the signs.'
      ]
    },
    'cosmic-thorn': { // The Collider Queen — spider queen of lanes, regal
      voice: 'Isabella', voiceId: '80924413-1ea8-4e64-9719-e00b86796f05',
      cry: 'Six flight lanes cross above my planet, and every thread of traffic is mine to grant. Choose wrong.',
      strikes: [
        'You took the crossing that was not yours. My web tightens.',
        'Yield the orbit, cadet, or become another hull on my thread.',
        'Two ships, one lane, one instant. You guessed. You guessed wrong.'
      ],
      defeats: [
        'You threaded every crossing untouched. My web has never gone hungry before.',
        'First passage was never yours to seize. Yet you knew exactly when it was.'
      ]
    },
    'cosmic-bone': { // Lord Ledger of the Void — cosmic accountant, sepulchral
      voice: 'Orion', voiceId: 'ed69c516-92d2-4b30-a967-617737a342e5',
      cry: 'I keep the Star Ledger. Every number from every planet, every error, written in the light of dead suns.',
      strikes: [
        'Another entry in the ledger. The void has infinite pages.',
        'You knew this at the first planet. The ledger records the forgetting.',
        'One more debt and your orbit decays into my accounts forever.'
      ],
      defeats: [
        'Every debt across six worlds... settled. The ledger closes clean.',
        'I have balanced the accounts of the lost. Your page stays open. Fly, cadet.'
      ]
    },

    // ================= REALM OF ROADS =================
    // Register: high fantasy dragons and spirits. Mythic, grand, Shakespearean.
    'realm-blood': { // Meadwyrm the Sotted — drunk dragon, jovial menace
      voice: 'Roman', voiceId: '7e63ac18-5fcd-4aba-8078-a86d4e11c127',
      cry: 'Ahh, a rider! Sit, sit, drink with old Meadwyrm. One tankard. The road splits into three so prettily after one.',
      strikes: [
        'Your grip loosens. The mead sings. The saddle slips out from under you.',
        'Eight parts in ten thousand, little rider. That is all the crown allows.',
        'One more for the road, you said. The road heard you. The road always collects.'
      ],
      defeats: [
        'You... put down the tankard? A thousand riders toasted my name and fell.',
        'Sober. Steady. Wretchedly clear-headed. Go, before I sober up and regret this.'
      ]
    },
    'realm-ember': { // Hazeleaf the Lawful — forest spirit, serene, sly
      voice: 'Gia', voiceId: '530df032-c311-483b-a750-cb3c9e1bcdfd',
      cry: 'They sell my leaf in every market square, rider. Lawful, they say. Harmless, they say. Come. Breathe.',
      strikes: [
        'Your hands drift from the reins. So peaceful. So slow.',
        'Lawful is not harmless. I have taught that lesson to a hundred wagons.',
        'The moment stretches like honey. The ditch does not wait for honey.'
      ],
      defeats: [
        'You breathed my smoke and stayed sharp. That should not be possible.',
        'The market called me safe. You read the deeper law. My leaves fall.'
      ]
    },
    'realm-static': { // The Whisperwisp — scrying-mirror spirit, tempting whisper
      voice: 'Hana', voiceId: 'c25f78a0-714e-42af-8da3-a399cef94968',
      cry: 'The glass is glowing, rider. Someone is thinking of you. Just one look. The road can wait one little look.',
      strikes: [
        'One glance in the glass. The child in the crossing is gone.',
        'The schoolyard road is ridden at a walk. You were galloping through the mirror.',
        'You looked. They always look. That is the whole of my magic.'
      ],
      defeats: [
        'You kept your eyes on the road. No rider keeps their eyes on the road.',
        'The glass goes dark. You would not look into it. I fade without your eyes.'
      ]
    },
    'realm-iron': { // Runekeeper Bal — stone golem, deep, slow, riddling
      voice: 'Gideon', voiceId: '1ad38ba4-9cc4-4f2f-9fde-b0fefdf67ae5',
      cry: 'Every waystone bears the old runes. Older than the crown. Read one wrong, rider, and the stone breaks you upon it.',
      strikes: [
        'Eight sides. Blood red. Speak its name or be broken upon it.',
        'The red rune means halt. You rode on. The stone remembers.',
        'The markings on the road were prophecy. You ignored the prophecy.'
      ],
      defeats: [
        'Every rune I twisted, you read true. The waystones bow to you.',
        'I have shattered the rune-blind since the first road was laid. You were not blind.'
      ]
    },
    'realm-thorn': { // The Crossroads Sphinx — riddling, ancient, playful-cruel
      voice: 'Nora', voiceId: 'd081b915-6623-4a44-bacf-80d0f1c90a03',
      cry: 'Two riders meet where six roads cross. Only one may pass first. Answer me, or feed my thorns.',
      strikes: [
        'Wrong. The right of way was never yours to claim.',
        'Yield, or be yielded. The thorns are not particular which.',
        'A thousand years I have riddled at this cross. You answered like the rest. Poorly.'
      ],
      defeats: [
        'Every riddle. Answered. In a thousand years, no rider has done that.',
        'You knew precisely when to pass and when to bow. Go. The cross is yours.'
      ]
    },
    'realm-bone': { // Vermithrax the Ledgerkeeper — bone dragon, wise, terrible, grand
      voice: 'Caspian', voiceId: 'ef70cc83-3015-4bad-9359-0ea968c43ec0',
      cry: 'I hoard no gold, rider. I hoard your errors. And oh, how the pile has grown across these six roads.',
      strikes: [
        'Another error for the hoard. My treasure is your forgetting.',
        'You knew this on the first road. The ledger never forgets what you do.',
        'One more debt, rider, and your oath frays to nothing in my claws.'
      ],
      defeats: [
        'Every debt across the realm... repaid in full. My hoard is empty for the first time.',
        'Rise, Rider. The roads are yours. Even a dragon must honor a paid account.'
      ]
    },

    // ================= CRUISE CRITTERS =================
    // Register: storybook rascals. Silly, warm, gentle stakes. Kids laugh, then learn.
    'cozy-blood': { // Sir Sips-a-Lot — tipsy raccoon, goofy
      voice: 'Andre', voiceId: 'f1e8226e-2248-4d5f-b43c-0a79e9949dbf',
      cry: 'One li-hic-ttle fizzy cider never hurt anybody! Now watch me drive through this lovely flowerbed!',
      strikes: [
        'Wobble, wobble! My truck only hit three flowerbeds. Maybe four!',
        'Numbers are sooo hard after cider. What comes after seven again?',
        'I am a GREAT driver. The road just keeps moving, is all!'
      ],
      defeats: [
        'Okay, okay! No more cider before driving. You really do know all the numbers!',
        'Fine, fine, I will take the wagon home. You win, clever driver. Hic!'
      ]
    },
    'cozy-ember': { // Duke Dozy — sleepy skunk, yawny
      voice: 'Sterling', voiceId: 'dc382508-c8bd-443c-8cb2-46e57b8d2e6f',
      cry: 'My sleepy-smoke is totally allowed, so it is totally fiiiine. Probably. Mostly. Yaaawn.',
      strikes: [
        'Sooo sleepy. The pond just came out of nowhere, I promise.',
        'Allowed does not mean a good idea. But mostly I am just... zzz.',
        'Slow paws. Slow stops. Slow everything, reeeally.'
      ],
      defeats: [
        'Allowed is not the same as smart before driving. You knew that all along!',
        'Okay, I am awake now. Wide awake. You got me, sharp little driver.'
      ]
    },
    'cozy-static': { // Pinglet — parrot, hyper squawky
      voice: 'Tallulah', voiceId: 'f32c8f51-449e-4ddf-bdf7-1527e11df917',
      cry: 'SQUAWK! Message for you! Look look look! The ducklings can wait, this is JUICY!',
      strikes: [
        'You looked! The ducklings saw that! Ping ping ping!',
        'School zone, silly! Twenty means twenty, not twenty-and-scrolling!',
        'Just one peek at my shiny screen! What could POSSIBLY go wrong! Squawk!'
      ],
      defeats: [
        'You never looked away, not even ONCE! Not even for a really good message!',
        'Aw, phooey. Eyes up the whole time. The ducklings say thank you.'
      ]
    },
    'cozy-iron': { // Mixup — magpie, cheeky sing-song
      voice: 'Wilder', voiceId: '39c02668-cd27-4313-9164-2ba0eb5098cf',
      cry: 'Ooh, shiny red octagon! MINE now! Bet you do not even know what it means, hee hee!',
      strikes: [
        'Wrong shape, silly! Try again, try again!',
        'Red means stop, even when it is up in my nest!',
        'Ooh, another shiny sign for my collection. You will never guess them all!'
      ],
      defeats: [
        'Fine, FINE, I will put the signs back where they go. You know every single shape!',
        'Show-off. You named them all. Here, take your boring old stop sign back.'
      ]
    },
    'cozy-thorn': { // Honks — goose, stubborn
      voice: 'Mark', voiceId: '27c04473-84a9-4b60-a41f-c8e8458bd4f1',
      cry: 'HONK! I go first! I ALWAYS go first! That is just how intersections work, HONK!',
      strikes: [
        'HONK HONK! Yield? Never heard of it in my LIFE!',
        'The intersection is MINE, mine, mine! Everybody waits for Honks!',
        'You went out of turn! Only I get to do that! HONK!'
      ],
      defeats: [
        'HONK. Fine. You go first. You clearly know exactly whose turn it is. Every time.',
        'Ugh, you are so POLITE about it. Take your right of way. Honk.'
      ]
    },
    'cozy-bone': { // Grandmother Quill — owl, warm wise granny
      voice: 'Nora', voiceId: 'd081b915-6623-4a44-bacf-80d0f1c90a03',
      cry: 'Settle in, dear. Grandmother Quill has questions. About everything. From every chapter. Are you ready?',
      strikes: [
        'Hmm. Not quite, dear. Have a little think and try once more.',
        'The Big Book remembers everything, sweetheart. Even the tricky ones.',
        'Close, dear, so close. Let us come back to that one, hm?'
      ],
      defeats: [
        'Every answer, correct. I am so very proud of you, dear.',
        'The Cruise Badge is yours, little one. You earned every shiny bit of it.'
      ]
    }
  },

  heroes: {
    // ---- Wasteland Academy ----
    vex:     { voice: 'Roxie',  voiceId: 'f6448975-768e-4327-b932-1b7c973d58e9', intro: 'Vex Halloran. I have read every cracked sign in this city. Point me at the demon.', win: 'Speed is grace. And I just graced you off the map.' },
    mira:    { voice: 'Tasha',  voiceId: 'e0d40568-8c85-4c9b-bdb2-b638b253a24f', intro: 'Mira Korvus. Discipline is the only prayer, and I never miss my prayers.', win: 'Brakes late. Signal early. Never panic. That is how it is done.' },
    saoirse: { voice: 'Luna',   voiceId: '375a3398-e3b4-4f91-845d-42181e352899', intro: 'Saoirse Veil. The road is a circle, and I have already seen how this ends. Badly. For you.', win: 'The cards said you would fall here. The cards are never wrong.' },
    silas:   { voice: 'Cillian', voiceId: 'd8ba9f14-8a24-44db-932b-99e16c45bd32', intro: 'Silas Mourne. I have towed a hundred wrecks. I know exactly which wrong answer made each one.', win: 'Every wreck was once a wrong answer. Not tonight. Not mine.' },

    // ---- Neon Circuit ----
    jinx:  { voice: 'Zoe',      voiceId: 'd0374db1-44b9-4f05-939e-0a9ae9dbbe6a', intro: 'Jinx Nakamura, on the clock. Forty thousand people are watching this run. Do not embarrass me.', win: 'Lag is death. And you just lagged. Delivery complete.' },
    axel:  { voice: 'Harrison', voiceId: '573e5163-59b3-4926-aab1-951ef2985f81', intro: 'Axel Voss. Traffic is just source code. Signs are syntax. Let me debug you.', win: 'Read the code. Ride the road. Clean compile, every time.' },
    nova:  { voice: 'Skye',     voiceId: '1fb253b8-928b-4d29-a349-f242a71eaddf', intro: 'Nova Reyes. I hacked the traffic core to stop a pileup once. This is easier.', win: 'The grid remembers everything. It will remember I beat you.' },

    // ---- Starbound Academy ----
    orion:  { voice: 'Leo',   voiceId: '73a45c18-0c56-4642-a61e-f6b303f8ded1', intro: 'Cadet Orion Vale. Grew up where one bad turn meant vacuum. I do not make bad turns.', win: 'Stars do not swerve. Neither do I. Warden down.' },
    zephyr: { voice: 'Kevin', voiceId: 'f1373f24-3b96-433f-9a68-e595810ef608', intro: 'Cadet Zephyr Kane. Third generation cargo. I have checked the gauges twice already.', win: 'Boring in the sims. Unbeatable in the field. Log it.' },
    lyra:   { voice: 'Ava',   voiceId: '4af0ac8b-b5ad-4d12-8f6b-c48b9c369f87', intro: 'Cadet Lyra Moss. Youngest to solo the asteroid slalom. The void blinks first.', win: 'Told you. The void always blinks first. Every single time.' },

    // ---- Realm of Roads ----
    bram:     { voice: 'Julian', voiceId: '95429266-c0ac-4137-a209-63b8812b0f23', intro: 'Bram of the Hollow. The knights laughed at the stable boy who read the law books. Let them laugh now.', win: 'A quick blade, and a quicker brake. The curse is lifted.' },
    'ser-una': { voice: 'Quinn', voiceId: '80914268-dfae-4f76-8306-36f2d55f58f8', intro: 'Ser Una Thorne. They stripped my title for one reckless ride. I am here to earn it back the right way.', win: 'The Oath before the sword. I have kept the Oath. Rise.' },
    wren:     { voice: 'Mabel',  voiceId: 'fa64fba4-ad02-405e-99d0-1f085d87c706', intro: 'Wren the Wayfinder. The roads whisper their rules to anyone patient enough to listen. I listened.', win: 'Every sign is a spell. And I know all the words.' },

    // ---- Cruise Critters ----
    pip:     { voice: 'Kevin',  voiceId: 'f1373f24-3b96-433f-9a68-e595810ef608', intro: 'Pip Maplewood, fastest paws in Maple Grove! And I stop at every single stop sign. Every one!', win: 'Fast paws, full stops! That is how we do it in the Grove!' },
    willow:  { voice: 'Zoe',    voiceId: 'd0374db1-44b9-4f05-939e-0a9ae9dbbe6a', intro: 'Willow Bramble, crossing patrol! I have walked every crosswalk in town. Twice!', win: 'Look twice, hop once! Nobody crosses on my watch unsafely!' },
    chester: { voice: 'Brooks', voiceId: 'c2acff45-84b2-4974-892d-89fa2d4e5598', intro: 'Chester Oakhart. Honey truck. Never been honked at, never honked. Let us be kind out there.', win: 'Slow is smooth, and smooth is fast. Kindness wins again.' }
  }
};

// Build the boss taunt bank a theme needs (keyed by houseId) from the cast.
function bossBankForTheme(themeId) {
  const bank = {};
  Object.keys(VOICE_CAST.bosses).forEach(key => {
    const [t, house] = key.split('-');
    if (t === themeId) {
      const b = VOICE_CAST.bosses[key];
      bank[house] = { cry: b.cry, strike: b.strikes, defeat: b.defeats };
    }
  });
  return bank;
}

window.VOICE_CAST = VOICE_CAST;
window.bossBankForTheme = bossBankForTheme;
