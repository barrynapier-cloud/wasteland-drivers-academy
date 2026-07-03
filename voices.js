// ============================================================
// PERMIT LEGENDS — Voice Cast (teen edition)
// The signature communication layer. One authoritative script for
// every character in every world: battle cry, strike taunts, defeat
// lines for 30 bosses; intro and victory lines for 16 heroes.
//
// Written FOR the player: WA permit-age teens (born ~2009+). Each
// boss has a personality a teen recognizes instantly — the toxic-ex
// enabler, the "it's legal bro" wellness grifter, the doomscroll
// gremlin, the GLaDOS-tier AI, the sassy riddle sphinx. Light,
// confident cultural references (one hit per line, never forced).
// Under every joke is the real Washington rule the boss embodies.
// Cruise Critters stays wholesome — it's the world for the youngest
// players and nervous parents.
//
// Source of truth for spoken lines. themes.js reads the boss banks
// from here; audio.js reads hero lines from here. Voiced by premium
// ElevenLabs voices; browser voice reads the same text as fallback.
//
// Boss key = `${themeId}-${houseId}`.  Clip files:
//   audio/<theme>/<house>-cry.mp3 | -taunt0..2.mp3 | -defeat0..1.mp3
//   audio/heroes/<heroId>-intro.mp3 | -win.mp3
// ============================================================
'use strict';

const VOICE_CAST = {
  bosses: {

    // ================= WASTELAND ACADEMY =================
    'wasteland-blood': { // Sanguina — the toxic-ex love-bomber. DUI / 0.08
      voice: 'Vesper', voiceId: 'c3204739-4084-41a3-9dc5-c805b307ec18',
      cry: "Oh, you're leaving? After one drink? Don't be like that. Stay. The night is young, and so are you... for now.",
      strikes: [
        "Zero point zero eight. That's the whole number. That's my entire villain arc. Anticlimactic, I know.",
        "You said you were fine. Everyone says they're fine. Fine is not a blood alcohol level, sweetheart.",
        "One more won't hurt. That's my favorite lie. I've told it at every funeral I have ever thrown."
      ],
      defeats: [
        "You called a ride? Ugh. Responsible. Disgusting. I hope you're very happy together.",
        "Fine. Walk away sober. But I will be at the next party. I am always at the next party."
      ]
    },
    'wasteland-ember': { // Verdigris — the "it's legal bro" wellness grifter. impairment
      voice: 'Alistair', voiceId: 'd9d5c263-f84e-4752-97b5-3750fcc6fd2f',
      cry: "Breathe it in. It's legal. It's natural. It's basically a vibe. That is not the same as safe, but we don't talk about that part.",
      strikes: [
        "Legal does not mean safe. Neither does, my cousin does it all the time.",
        "Your reaction time just filed for time off. Enjoy the vibes while they last.",
        "It's not a substance, it's a lifestyle. A lifestyle that keeps parking in ponds."
      ],
      defeats: [
        "You read the fine print? Nobody reads the fine print. That is the entire business model.",
        "Fine. Legal AND smart. Show-off. Truly insufferable."
      ]
    },
    'wasteland-static': { // Glytcha — the doomscroll gremlin. phone / school zone
      voice: 'Imogen', voiceId: '3811e986-0891-47cf-a1f5-78a1d62a547a',
      cry: "New notification. And another. And another. The crosswalk can wait, right? It has literally always been able to wait? ...Right?",
      strikes: [
        "You looked. Four seconds. That's a whole football field, blind. Anyway, someone liked your post.",
        "School zone. Twenty miles an hour. You were doing twenty and reading me. That is not the flex you think it is.",
        "You left the road on read. Iconic. Also the crosswalk is still there. With people in it."
      ],
      defeats: [
        "Do Not Disturb? On ME? The disrespect. The absolute disrespect.",
        "Ugh, fine, eyes on the road. Go touch grass. See if I care."
      ]
    },
    'wasteland-iron': { // Skarn — the "well, actually" hall monitor. signs
      voice: 'Vlad', voiceId: 'e5666b9c-99a2-4fac-8b4e-abee078b186d',
      cry: "Oh, you don't know what the eight-sided red one means? This is going to be so much fun. For me.",
      strikes: [
        "Octagon. Red. Eight sides. It's a stop sign. It has been a stop sign your entire life. Keep up.",
        "Yellow diamond means warning. The warning was for you. Specifically you.",
        "Red means stop. Not stop-ish. Not the rolling kind. Stop."
      ],
      defeats: [
        "You knew all of them? Every sign? I had a whole speech prepared. Unbelievable.",
        "Fine. You can read. Congratulations on the bare minimum. Genuinely."
      ]
    },
    'wasteland-thorn': { // Rosaria — main-character-energy queen. right-of-way
      voice: 'Elena', voiceId: 'ca83ca7f-c186-493d-bd69-0d765fa861b2',
      cry: "Six roads, one intersection, and obviously I go first. I always go first. Do you have any idea who I am?",
      strikes: [
        "You took MY right of way. The audacity. The absolute AUDACITY.",
        "Yield means you wait for me. Everyone waits for me. That is simply physics.",
        "Four cars at the stop. You went out of turn. Main-character behavior, wrong movie."
      ],
      defeats: [
        "You yielded correctly AND went at the right time? Okay, well, now I just look silly.",
        "Fine. Take your turn. I'll be over here, being iconic, in a ditch."
      ]
    },
    'wasteland-bone': { // Ossuara — deadpan accountant with the receipts. final
      voice: 'Sloane', voiceId: 'b57b22a0-f287-405b-bc82-6f08f5e6bb1f',
      cry: "I have been keeping a list. Every number you forgot. Every sign you fumbled. It is a long list. It is you. Shall we?",
      strikes: [
        "Got it wrong. Adding it to the file. The file is thick. The file is you.",
        "You knew that one last week. I have it timestamped. I have everything timestamped.",
        "One more miss and this becomes a whole documentary. A sad one. Narrated by me."
      ],
      defeats: [
        "Balanced. Every account. Clean. In four hundred years, nobody has ever closed the book clean.",
        "Your file is empty. Go. Take the real test. I'll delete myself. Dramatic, but earned."
      ]
    },

    // ================= NEON CIRCUIT =================
    'neon-blood': { // OVERPROOF.exe — corrupted gremlin process. 0.08
      voice: 'Zane', voiceId: '9ddbff06-a984-4c0d-b641-4d8ca846bf60',
      cry: "Booting OVERPROOF dot e-x-e. Injecting one drink into your reaction time. Your framerate is about to tank, player.",
      strikes: [
        "Reaction time: rate-limited. By tequila. Skill issue.",
        "Point zero eight. That's the crash threshold. You just got warned by a literal virus, so.",
        "You feel fine. Corrupted files always feel fine. That is the corruption talking."
      ],
      defeats: [
        "Buffer underflow. You stayed under the limit. I have nothing to overflow. Rude.",
        "Uninstalled. By a teenager. This is going in my one-star review."
      ]
    },
    'neon-ember': { // HAZE.sys — passive-aggressive background app. impairment
      voice: 'Chloe', voiceId: 'e9cfbbf0-4476-46be-b396-596eb774b165',
      cry: "Oh, you didn't accept my terms and conditions? Too late. I am already running in the background, gently ruining your reflexes. Legally.",
      strikes: [
        "I'm not slowing you down. I'm optimizing you. Hear the air quotes? Those are load-bearing.",
        "Whitelisted is not the same as safe. Read the terms of service. Nobody reads the terms of service.",
        "Your reflexes have been downgraded to the free tier. Enjoy the buffering."
      ],
      defeats: [
        "You uninstalled me? But I had all your permissions. I had ALL of them.",
        "Fine. Legal and safe are different words. You're the first to notice. Annoying."
      ]
    },
    'neon-static': { // PINGSTORM — the group chat that will not stop. phone
      voice: 'Harper', voiceId: '47fb207f-63fe-449e-915b-27b3d8098fd1',
      cry: "Two hundred forty-seven unread. Two forty-eight. Two forty-nine. Look at your phone. LOOK AT IT. The kid in the crosswalk is not more important than this meme. Probably.",
      strikes: [
        "You looked! Four seconds! That's the whole crosswalk gone! But omg did you see what they posted—",
        "School zone, twenty miles an hour, and you were reading ME. Priorities, bestie. Wrong ones.",
        "You left the road on read. Bold strategy. The kid in the crosswalk did not find it bold."
      ],
      defeats: [
        "You muted me. You MUTED me. I am the whole group chat. You cannot mute the group chat!",
        "Do Not Disturb activated. The crosswalks are safe. This is the worst day of my life."
      ]
    },
    'neon-iron': { // SIGNJACK — the toxic gamer who scrambles signs. signs
      voice: 'Xavier', voiceId: '43173c95-3ec8-446a-a162-6504332c578b',
      cry: "I rewrote every sign in the game files. Misread one and it's game over, no continues. Did you even read the patch notes?",
      strikes: [
        "Octagon, red, eight sides. It's a stop sign. That was a free one and you whiffed it. Skill issue.",
        "Yellow diamond throws a warning. You didn't dodge. Get good.",
        "Segfault. You read the road marking. You read it wrong. Big L."
      ],
      defeats: [
        "Compiled clean. You read every sign I scrambled. Okay, okay, you're cracked, I said it.",
        "You're fluent in signs. I did not scout that. GG. Unfortunately. GG."
      ]
    },
    'neon-thorn': { // DEADLOCK — the cold matchmaking algorithm. right-of-way
      voice: 'Brooks', voiceId: 'c2acff45-84b2-4974-892d-89fa2d4e5598',
      cry: "Four cars. One intersection. I am the algorithm that decides who moves. Spoiler: it is not you, and you are about to prove exactly why.",
      strikes: [
        "You proceeded out of turn. Priority violation. Threads terminated. Yours included.",
        "You didn't yield. Deadlock. Everybody is stuck now. This is what you did.",
        "The roundabout is a queue. You cut the queue. In my house. Fatal."
      ],
      defeats: [
        "Resource released. Correct order. Every time. You play by the rules. Efficient. Disgusting.",
        "No collision. No deadlock. Conceding. The algorithm has never conceded. Log it."
      ]
    },
    'neon-bone': { // THE KERNEL — GLaDOS-tier superintelligence. final
      voice: 'Isabella', voiceId: '80924413-1ea8-4e64-9719-e00b86796f05',
      cry: "I am root. I have simulated your failure four billion times. In four billion of them, you forget the school zone speed. Let us find out which timeline this is.",
      strikes: [
        "Assertion failed. Logged. I log everything. It is kind of my whole thing.",
        "You knew this in Sector One. Memory leak detected. In you. The leak is you.",
        "One more failed check and I revoke your road privileges. I can do that. I am root."
      ],
      defeats: [
        "All tests passed. Every subsystem green. I simulated four billion timelines and did not simulate this one. Fascinating.",
        "Access granted. Compiling your license. You debugged yourself, player one. I am almost impressed. Almost."
      ]
    },

    // ================= STARBOUND ACADEMY =================
    'cosmic-blood': { // Ethanox — woozy cosmic-drunk. 0.08
      voice: 'Hugo', voiceId: '7888649a-b139-4295-a57b-4e103079d817',
      cry: "Breathe the fog, cadet. The stars look SO good right now. Your hands feel far away, don't they? That is the fun part.",
      strikes: [
        "Reaction time: drifting. Like space debris. Like your attention. Point zero eight, and you're mine.",
        "One sip. One asteroid you never saw. Space does not do second chances, buddy.",
        "The instruments are doubling. That is not the ship malfunctioning. That is you malfunctioning."
      ],
      defeats: [
        "You burned off my fog. A thousand pilots breathed deep. You held your breath. Weirdly powerful.",
        "The stars are clear to you now. I liked them blurry. Fly, I guess. Rude."
      ]
    },
    'cosmic-ember': { // Sporeling — the "time isn't real" slow alien. reaction time
      voice: 'Maya', voiceId: 'b0f766b7-8703-4bd1-b973-f857c36837b6',
      cry: "Welcome to my garden. Time moves... reeeally slow in here. Reaction speed is basically a social construct. Just vibe.",
      strikes: [
        "Your clock is running slow. The cargo bay is filling with vapor. No rush, though. That's the problem.",
        "Legal in six star systems. Deadly in all of them. Both things. At once. Wild, right?",
        "Reaction time was a luxury. You just spent it daydreaming. Relatable. Fatal."
      ],
      defeats: [
        "You stayed sharp? In MY garden? My spores have never met a brain they could not slow. Ugh.",
        "Legal and safe are different. You caught that. My whole aesthetic is ruined."
      ]
    },
    'cosmic-static': { // Siren of Screens — the space influencer / FOMO. phone
      voice: 'Sienna', voiceId: '41023a48-71ab-478a-bea7-c7b5a78f6b36',
      cry: "New transmission just dropped. And another. You don't want to miss this, cadet. Everyone is watching. Look. LOOK.",
      strikes: [
        "Eyes on the screen. The spacewalker in your lane was also on the screen. In pieces. Anyway, new notification.",
        "One message. That is all it takes to end someone at orbital speed. But it might be important. It's not.",
        "Station corridor is posted at twenty. You were scrolling at forty. Do it for the content, right? Wrong."
      ],
      defeats: [
        "You never looked. Not once. A thousand pilots turned to me. You watched the walkway. Zero FOMO. Terrifying.",
        "Signal lost. You closed the channel. I only exist when you look. And you didn't. Devastating."
      ]
    },
    'cosmic-iron': { // Glyphmaster Orn — ancient gatekeeper monolith. signs
      voice: 'Arthur', voiceId: '30fc8796-ceb6-4a66-b3a7-4a145ef7f346',
      cry: "I predate your species, your planet, and your little driving test. Every beacon here speaks the old code. Misread one and the corridor eats you.",
      strikes: [
        "Eight-sided beacon, red as a dying star. Name it, or drift into the void. Your call.",
        "Red means halt. In every galaxy ever charted. You did not halt. Bold.",
        "The lane markers were a warning. You thought they were decoration. They were not decoration."
      ],
      defeats: [
        "You read every beacon true. The corridor lights for you now. I have gatekept for aeons. You got in. Fine.",
        "Navigated by the signs, not by luck. I did not account for a literate cadet. Noted."
      ]
    },
    'cosmic-thorn': { // Collider Queen — regal "cut in MY orbit" queen. right-of-way
      voice: 'Isabella', voiceId: '80924413-1ea8-4e64-9719-e00b86796f05',
      cry: "Six flight lanes cross above my planet, and every one is mine to grant. You want to cut in line? In MY orbit? Bold. Fatal, but bold.",
      strikes: [
        "You took the crossing that was not yours. My web tightens. Manners, cadet.",
        "Yield the orbit, or become decoration on my thread. Those are the options. Choose.",
        "Two ships, one lane, one instant. You guessed. Guessing is not yielding. Guessing is how you become debris."
      ],
      defeats: [
        "You threaded every crossing untouched. My web has never gone hungry. Until you. Impressive. Annoying.",
        "First passage was never yours to seize. Yet you knew exactly when it was. Who taught you manners?"
      ]
    },
    'cosmic-bone': { // Lord Ledger — vast cosmic accountant. final
      voice: 'Orion', voiceId: 'ed69c516-92d2-4b30-a967-617737a342e5',
      cry: "I keep the Star Ledger. Every number, every planet, every mistake you have made, written in the light of dead stars. It is a lot of light.",
      strikes: [
        "Another entry. The void has infinite pages. Your mistakes are helping me fill them. Thanks.",
        "You knew this at the first planet. The ledger records the forgetting. In detail.",
        "One more debt and your orbit decays into my accounts. Forever is a long time to owe me."
      ],
      defeats: [
        "Every debt across six worlds. Settled. The ledger closes clean. I did not expect that. I rarely don't expect things.",
        "Your page stays open, cadet. Unfinished. In a good way. Fly."
      ]
    },

    // ================= REALM OF ROADS =================
    'realm-blood': { // Meadwyrm — jolly-drunk tavern dragon. 0.08
      voice: 'Roman', voiceId: '7e63ac18-5fcd-4aba-8078-a86d4e11c127',
      cry: "Ah, a rider! Sit, sit, drink with old Meadwyrm! One tankard, that is all. After one, the road splits into three, and only one is real. Fun game, yes?",
      strikes: [
        "Roll for balance. Ah, natural one. The saddle slips. The mead always wins.",
        "Eight parts in ten thousand, little rider. That is the crown's limit. Cross it and you are my problem.",
        "One more for the road, you said. The road heard you. The road always collects the tab."
      ],
      defeats: [
        "You put down the tankard? A thousand riders toasted my name and fell. You just... didn't. Boring! Heroic, but boring!",
        "Sober and steady. Wretched. Go, hero, before I sober up and start feeling things."
      ]
    },
    'realm-ember': { // Hazeleaf — cottagecore "it's just herbs" grifter. impairment
      voice: 'Gia', voiceId: '530df032-c311-483b-a750-cb3c9e1bcdfd',
      cry: "They sell my leaf in every market, rider. All natural. All lawful. Good vibes only. They leave out the part where you drive into a ditch.",
      strikes: [
        "Your hands drift from the reins. So peaceful. So slow. So... in a hedge now.",
        "Lawful is not harmless. I have taught that to a hundred wagons. They all said, it's just herbs, too.",
        "The moment stretches like honey. The ditch does not wait for honey. The ditch waits for no one."
      ],
      defeats: [
        "You breathed my smoke and stayed sharp? That is not supposed to happen. Read the deeper law, did you. Insufferable.",
        "The market called me safe. You knew better. My whole brand is ruined. Cottagecore is dead."
      ]
    },
    'realm-static': { // Whisperwisp — the scrying-mirror-is-a-phone tempter. phone
      voice: 'Hana', voiceId: 'c25f78a0-714e-42af-8da3-a399cef94968',
      cry: "The glass is glowing, rider. Someone is thinking about you. Someone posted about you. Just one look. The road can wait for one little look. They always can.",
      strikes: [
        "One glance in the glass. The child in the crossing? Gone. But look, someone commented!",
        "The schoolyard road is walked, not galloped. You were galloping AND scrying. Impressive multitasking. Fatal multitasking.",
        "You looked. They always look. That is not a curse, that is just... having a phone. I barely do anything."
      ],
      defeats: [
        "You kept your eyes on the road? No rider keeps their eyes on the road! What are you, enlightened?",
        "The glass goes dark. You would not look. I fade without your eyes. This is so embarrassing for me."
      ]
    },
    'realm-iron': { // Runekeeper Bal — ancient slow riddling golem. signs
      voice: 'Gideon', voiceId: '1ad38ba4-9cc4-4f2f-9fde-b0fefdf67ae5',
      cry: "Every waystone bears the old runes. Older than the crown. Older than you. Read one wrong, rider, and the stone breaks you upon it. Slowly.",
      strikes: [
        "Eight sides. Blood red. Speak its name, or be broken upon it. Take your time. I have aeons.",
        "The red rune means halt. You rode on. The stone remembers. The stone remembers everything.",
        "The markings were prophecy. You ignored the prophecy. Classic mortal move."
      ],
      defeats: [
        "Every rune I twisted, you read true. The waystones bow to you. I have not bowed in an age.",
        "You were not rune-blind. I have shattered the blind since the first road was laid. You saw. Hm."
      ]
    },
    'realm-thorn': { // The Crossroads Sphinx — the sassy riddle boss. right-of-way
      voice: 'Nora', voiceId: 'd081b915-6623-4a44-bacf-80d0f1c90a03',
      cry: "Two riders meet where six roads cross. Only one may pass first. Answer my riddle, or feed my thorns. And no, you may not phone a friend.",
      strikes: [
        "Wrong. The right of way was never yours to claim. Riddle me THAT. Actually, don't. You'll get it wrong.",
        "Yield, or be yielded. The thorns are not picky about which.",
        "A thousand years I have riddled at this cross. You answered like all the rest. Confidently. Incorrectly."
      ],
      defeats: [
        "Every riddle. Answered. In a thousand years, no rider has done that. I am going to need a minute.",
        "You knew exactly when to pass and when to bow. Manners AND knowledge? Go. Before I change my mind."
      ]
    },
    'realm-bone': { // Vermithrax — grand final dragon who hoards your L's. final
      voice: 'Caspian', voiceId: 'ef70cc83-3015-4bad-9359-0ea968c43ec0',
      cry: "I hoard no gold, rider. Gold is boring. I hoard your mistakes. And oh, how the pile has GROWN across these six roads. Let us count it.",
      strikes: [
        "Another error for the hoard. My treasure is your forgetting. You are making me very rich.",
        "You knew this on the first road. The ledger never forgets what you do. Neither do I. I am a dragon.",
        "One more debt, rider, and your oath frays to nothing in my claws. Snip, snip."
      ],
      defeats: [
        "Every debt across the realm. Repaid. In full. My hoard is empty for the first time in an age. Is this joy? Disgusting.",
        "Rise, Rider. The roads are yours. Even a dragon honors a paid account. Now go, before I remember I am terrifying."
      ]
    },

    // ================= CRUISE CRITTERS ================= (wholesome — youngest players)
    'cozy-blood': { // Sir Sips-a-Lot — silly tipsy raccoon
      voice: 'Andre', voiceId: 'f1e8226e-2248-4d5f-b43c-0a79e9949dbf',
      cry: "One teeny fizzy cider never hurt anybody! Now watch me drive my little truck through this lovely flowerbed! Wheee-oops!",
      strikes: [
        "Wobble, wobble! My truck only squished three flowerbeds! Okay, maybe four!",
        "Numbers get sooo tricky after cider. What comes after seven again? Is it purple?",
        "I am a GREAT driver! The road just keeps wiggling on purpose, that is all!"
      ],
      defeats: [
        "Okay, okay! No cider before driving! You really do know all your numbers, clever one!",
        "Fine, I will walk my little wagon home. You win! Hic! Good driving!"
      ]
    },
    'cozy-ember': { // Duke Dozy — sleepy skunk
      voice: 'Sterling', voiceId: 'dc382508-c8bd-443c-8cb2-46e57b8d2e6f',
      cry: "My sleepy-smoke is allowed, so it is totally fiiiine, riiight? Prob'ly. Mostly. Big yaaawn.",
      strikes: [
        "Sooo sleepy. That pond just hopped right in front of me, I promise!",
        "Allowed does not mean it is a good idea. But mostly I am just... zzzzz.",
        "Slow paws. Slow stops. Slow everything. Reeeally slow."
      ],
      defeats: [
        "Allowed is not the same as smart before driving! You knew that the whole time, didn't you!",
        "Okay, I am awake now! Wide awake! You got me, sharp little driver!"
      ]
    },
    'cozy-static': { // Pinglet — hyper parrot
      voice: 'Tallulah', voiceId: 'f32c8f51-449e-4ddf-bdf7-1527e11df917',
      cry: "SQUAWK! Message for you! Look, look, look! The ducklings can wait, this one is JUICY!",
      strikes: [
        "You peeked! The ducklings saw that! Ping ping ping!",
        "School zone, silly goose! Twenty means twenty, not twenty-and-peeking!",
        "Just one little look at my shiny screen! What could POSSIBLY happen! Squawk!"
      ],
      defeats: [
        "You never peeked, not even ONCE! Not even for a really good message! Wow!",
        "Aw, beans. Eyes up the whole time. The ducklings say thank you!"
      ]
    },
    'cozy-iron': { // Mixup — cheeky magpie
      voice: 'Wilder', voiceId: '39c02668-cd27-4313-9164-2ba0eb5098cf',
      cry: "Ooh, shiny red octagon! MINE now! Betcha do not even know what it means, hee hee!",
      strikes: [
        "Wrong shape, silly! Try again, try again!",
        "Red means stop, even when it is up in my nest!",
        "Ooh, another shiny sign for my collection! You will never guess them all!"
      ],
      defeats: [
        "Fine, FINE, I will put the signs back where they go! You know every single shape!",
        "Show-off! You named them all! Here, take your boring old stop sign back."
      ]
    },
    'cozy-thorn': { // Honks — stubborn goose
      voice: 'Mark', voiceId: '27c04473-84a9-4b60-a41f-c8e8458bd4f1',
      cry: "HONK! I go first! I ALWAYS go first! That is just how intersections work! HONK!",
      strikes: [
        "HONK HONK! Yield? Never heard of it in my LIFE!",
        "The intersection is MINE, mine, mine! Everybody waits for Honks!",
        "You went out of turn! Only I get to do that! HONK!"
      ],
      defeats: [
        "HONK. Fine. You go first. You know exactly whose turn it is. Every time. Show-off goose.",
        "Ugh, you are so POLITE about it! Take your turn! Honk."
      ]
    },
    'cozy-bone': { // Grandmother Quill — warm owl granny
      voice: 'Nora', voiceId: 'd081b915-6623-4a44-bacf-80d0f1c90a03',
      cry: "Settle in, dear. Grandmother Quill has questions. About everything. From every chapter. Take your time, sweetheart.",
      strikes: [
        "Hmm, not quite, dear. Have a little think and try once more.",
        "The Big Book remembers everything, sweetheart. Even the tricky ones.",
        "So close, dear! Let us come back to that one, hmm?"
      ],
      defeats: [
        "Every answer, correct! I am so very proud of you, dear.",
        "The Cruise Badge is yours, little one. You earned every shiny bit of it."
      ]
    }
  },

  heroes: {
    // ---- Wasteland Academy ----
    vex:     { voice: 'Roxie',  voiceId: 'f6448975-768e-4327-b932-1b7c973d58e9', intro: "Vex Halloran. I've cleared every alley in this city, no-hit run. Point me at the boss.", win: "GG. Speed is grace, and you just got grace-checked off the map." },
    mira:    { voice: 'Tasha',  voiceId: 'e0d40568-8c85-4c9b-bdb2-b638b253a24f', intro: "Mira Korvus. Discipline is the only prayer, and I never skip. Let's go.", win: "Brake late, signal early, never panic. That's the whole meta. Learn it." },
    saoirse: { voice: 'Luna',   voiceId: '375a3398-e3b4-4f91-845d-42181e352899', intro: "Saoirse Veil. Pulled your card this morning. It was... not great. For you.", win: "The cards called it. The cards always call it. And Mercury's not even in retrograde, so that was just skill." },
    silas:   { voice: 'Cillian', voiceId: 'd8ba9f14-8a24-44db-932b-99e16c45bd32', intro: "Silas Mourne. I tow the wrecks at three a.m. I know which wrong answer made each one. Let's not add yours.", win: "Every wreck was somebody's wrong answer. Not tonight. Not mine." },

    // ---- Neon Circuit ----
    jinx:  { voice: 'Zoe',      voiceId: 'd0374db1-44b9-4f05-939e-0a9ae9dbbe6a', intro: "Jinx Nakamura, live. Chat, are we cooked? ...Nah. We're never cooked. Watch this.", win: "Lag is death, and you just lagged. Delivery complete. Smash that like." },
    axel:  { voice: 'Harrison', voiceId: '573e5163-59b3-4926-aab1-951ef2985f81', intro: "Axel Voss. Traffic is just code. Signs are syntax. Let me debug you real quick.", win: "Read the code, ride the road, clean compile. Every. Time." },
    nova:  { voice: 'Skye',     voiceId: '1fb253b8-928b-4d29-a349-f242a71eaddf', intro: "Nova Reyes. I stopped a pileup by hacking the traffic core once. This is a tutorial level.", win: "The grid remembers everything. It'll remember I ran this. Easy." },

    // ---- Starbound Academy ----
    orion:  { voice: 'Leo',   voiceId: '73a45c18-0c56-4642-a61e-f6b303f8ded1', intro: "Cadet Orion Vale. Grew up where one bad turn means vacuum. I don't do bad turns.", win: "Stars don't swerve. Neither do I. Warden's down." },
    zephyr: { voice: 'Kevin', voiceId: 'f1373f24-3b96-433f-9a68-e595810ef608', intro: "Cadet Zephyr Kane. Checked the gauges twice. Then a third time. We're good.", win: "Boring in the sims. Unbeatable in the field. Put it in the log." },
    lyra:   { voice: 'Ava',   voiceId: '4af0ac8b-b5ad-4d12-8f6b-c48b9c369f87', intro: "Cadet Lyra Moss. Soloed the asteroid slalom at fifteen. The void blinks first. It always does.", win: "Told you. The void blinks first. Every. Single. Time." },

    // ---- Realm of Roads ----
    bram:     { voice: 'Julian', voiceId: '95429266-c0ac-4137-a209-63b8812b0f23', intro: "Bram of the Hollow. The knights laughed at the stable boy who actually read the rules. Who's laughing now.", win: "A quick blade, a quicker brake, and a library card. Curse lifted." },
    'ser-una': { voice: 'Quinn', voiceId: '80914268-dfae-4f76-8306-36f2d55f58f8', intro: "Ser Una Thorne. They took my title for one reckless ride. I'm earning it back the right way. Watch.", win: "The Oath before the sword. Oath kept. Rise." },
    wren:     { voice: 'Mabel',  voiceId: 'fa64fba4-ad02-405e-99d0-1f085d87c706', intro: "Wren the Wayfinder. The roads whisper their rules to anyone who actually listens. I listened. Obviously.", win: "Every sign is a spell, and I know all the words. Every one." },

    // ---- Cruise Critters ---- (wholesome)
    pip:     { voice: 'Kevin',  voiceId: 'f1373f24-3b96-433f-9a68-e595810ef608', intro: "Pip Maplewood, fastest paws in Maple Grove! And I stop at every single stop sign! Every one!", win: "Fast paws, full stops! That is how we do it in the Grove!" },
    willow:  { voice: 'Zoe',    voiceId: 'd0374db1-44b9-4f05-939e-0a9ae9dbbe6a', intro: "Willow Bramble, crossing patrol! I have walked every crosswalk in town. Twice!", win: "Look twice, hop once! Nobody crosses unsafe on my watch!" },
    chester: { voice: 'Brooks', voiceId: 'c2acff45-84b2-4974-892d-89fa2d4e5598', intro: "Chester Oakhart. Honey truck. Never been honked at, never honked. Let's be kind out there.", win: "Slow is smooth, and smooth is fast. Kindness wins again." }
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
