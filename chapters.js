// ============================================================
// CHAPTERS — the spine of the game.
// Each chapter is a Study → Quiz → Boss Battle arc.
// ============================================================
'use strict';

const CHAPTERS = [
  // ============================================================
  // CHAPTER 1 — BLOOD (DUI / BAC)
  // ============================================================
  {
    id: "blood",
    number: 1,
    title: "House of Blood",
    subtitle: "The 0.08 Threshold",
    suit: "blood",
    icon: "🜂",
    color: "#dc2626",
    glow: "rgba(220,38,38,0.6)",
    intro: "Alcohol is the oldest demon on the road. Washington draws a hard line in red. Cross it and the night ends in cuffs.",
    boss: {
      name: "Sanguina, Queen of Last Calls",
      image: "images/demon-blood.png",
      hp: 100,
      threat: "The Sanguine Trial",
      defeatLine: "I was the toast at every wake. You silenced me with one number.",
      reward: "Sigil of Sobriety"
    },
    lessons: [
      {
        id: "blood-l1",
        title: "The Adult Line",
        keyNumber: "0.08%",
        keyLabel: "Adult BAC limit",
        image: "images/bac.png",
        teach: "Drivers 21 and older: a Blood Alcohol Concentration of 0.08% or higher within two hours of driving is a DUI. No further proof of impairment is required — the number alone convicts.",
        remember: [
          "0.08% = per se DUI for adults 21+",
          "Measured within 2 hours of driving",
          "RCW 46.61.502 — the statute that draws the line"
        ],
        cardId: "blood-001"
      },
      {
        id: "blood-l2",
        title: "Under 21 — Zero Tolerance",
        keyNumber: "0.02%",
        keyLabel: "Under-21 BAC limit",
        image: null,
        icon: "🩸",
        teach: "If you are under 21, ANY BAC of 0.02% or higher within two hours of driving is a Minor DUI. That is roughly the alcohol in a sip of beer.",
        remember: [
          "0.02% = Minor DUI under 21",
          "One sip can put you over",
          "Penalty: up to 90 days jail, $1,000 fine, 90-day suspension"
        ],
        cardId: "blood-002"
      },
      {
        id: "blood-l3",
        title: "The Commercial Driver",
        keyNumber: "0.04%",
        keyLabel: "CDL BAC limit",
        image: null,
        icon: "🛻",
        teach: "Operating a commercial vehicle drops your limit to 0.04% — exactly half the adult limit. Bigger vehicle, bigger responsibility, stricter rules.",
        remember: [
          "0.04% = half the adult limit",
          "Applies any time you drive a commercial vehicle",
          "A CDL holder driving their personal car still faces 0.08%"
        ],
        cardId: "blood-003"
      },
      {
        id: "blood-l4",
        title: "The Aggravated Verdict",
        keyNumber: "0.15%",
        keyLabel: "Aggravated DUI threshold",
        image: null,
        icon: "💀",
        teach: "A BAC of 0.15% or higher — or refusing a breath test — triggers aggravated penalties: mandatory ignition interlock, longer license suspension, and steeper fines.",
        remember: [
          "0.15% = double the adult limit, double the consequences",
          "Refusing the test triggers aggravated penalties too",
          "Mandatory ignition interlock follows the conviction"
        ],
        cardId: "blood-004"
      },
      {
        id: "blood-l5",
        title: "Shatter the Lie — Implied Consent",
        keyNumber: "1 YEAR",
        keyLabel: "License revocation for refusal",
        image: "images/refusal.png",
        teach: "By holding a Washington license, you have already consented to breath or blood testing if lawfully arrested. Refusing the test = automatic 1-year license revocation, and the refusal itself can be used against you in court.",
        remember: [
          "Implied consent is automatic — your license already agreed",
          "Refuse = 1 year revoked (first offense)",
          "Refusal is admissible evidence"
        ],
        cardId: "blood-005"
      }
    ],
    quiz: [
      {
        q: "You are 22 years old. Your BAC reads 0.08% within 2 hours of driving. What is the legal outcome?",
        options: ["Warning only", "Per se DUI — no further proof needed", "DUI only if you appear impaired", "DUI only above 0.10%"],
        answer: 1,
        explain: "0.08% within 2 hours of driving is per se DUI for any driver 21 or older. The number alone is enough."
      },
      {
        q: "You are 19. You had one beer two hours ago and blow a 0.03%. What happens?",
        options: ["Nothing — you are under 0.08%", "Warning only", "Minor DUI — you exceeded the under-21 limit of 0.02%", "Charged as an adult DUI"],
        answer: 2,
        explain: "Under 21, the limit is 0.02%. At 0.03% you are charged with Minor DUI."
      },
      {
        q: "What is the BAC limit for a commercial vehicle driver in Washington?",
        options: ["0.08%", "0.04%", "0.02%", "0.00%"],
        answer: 1,
        explain: "Commercial drivers operate at 0.04% — exactly half the adult limit."
      },
      {
        q: "You refuse a lawful breath test in Washington. What is the automatic consequence?",
        options: ["Nothing — refusal is your right", "$100 fine", "1-year license revocation", "30-day suspension"],
        answer: 2,
        explain: "Under implied consent, refusal triggers automatic 1-year license revocation on the first offense."
      },
      {
        q: "Your BAC measures 0.16%. Beyond a normal DUI, what additional consequence applies?",
        options: ["Nothing extra — it is still just a DUI", "Aggravated penalties including mandatory ignition interlock", "Felony charge automatically", "The case is dismissed because the number is too high"],
        answer: 1,
        explain: "0.15% or higher triggers aggravated DUI penalties including a mandatory ignition interlock device."
      }
    ]
  },

  // ============================================================
  // CHAPTER 2 — EMBER (THC / CANNABIS)
  // ============================================================
  {
    id: "ember",
    number: 2,
    title: "House of Ember",
    subtitle: "The Green Veil",
    suit: "ember",
    icon: "✿",
    color: "#84cc16",
    glow: "rgba(132,204,22,0.6)",
    intro: "Cannabis is legal in Washington. Driving on it is not. The law measures the smoke in your blood and decides your fate.",
    boss: {
      name: "Verdigris, Hierophant of the Green Veil",
      image: "images/demon-ember.png",
      hp: 110,
      threat: "The Ember Trial",
      defeatLine: "They thought I was harmless because I was legal. You showed them the difference.",
      reward: "Mark of Clear Vision"
    },
    lessons: [
      {
        id: "ember-l1",
        title: "The Per Se Line",
        keyNumber: "5 ng/mL",
        keyLabel: "Adult THC limit",
        image: "images/thc.png",
        teach: "For drivers 21 and older, 5.00 nanograms of active THC per milliliter of blood within 2 hours of driving is per se DUI under RCW 46.61.502. Legal to consume — not legal to drive on.",
        remember: [
          "5 ng/mL = per se DUI for adults 21+",
          "Active THC in BLOOD, not urine",
          "Measured within 2 hours of driving"
        ],
        cardId: "ember-001"
      },
      {
        id: "ember-l2",
        title: "Under 21 — No Veil",
        keyNumber: "0.00 ng/mL",
        keyLabel: "Under-21 THC limit",
        image: null,
        icon: "🌿",
        teach: "If you are under 21, the THC limit is zero. Any detectable active THC = Minor DUI. Cannabis is not legal for you in the first place.",
        remember: [
          "Under 21 = absolute zero THC",
          "Any detectable amount = Minor DUI",
          "Same penalty structure as Minor DUI for alcohol"
        ],
        cardId: "ember-002"
      },
      {
        id: "ember-l3",
        title: "Open Container — Sealed Smoke",
        keyNumber: "TRUNK",
        keyLabel: "Where cannabis must travel",
        image: null,
        icon: "📦",
        teach: "Cannabis in a vehicle must be in its original sealed container, OR locked in the trunk or in an area not occupied by passengers. An opened bag in the cup holder is an open container violation — even if you are not high.",
        remember: [
          "Sealed in original packaging, OR",
          "Stored in trunk / non-passenger area",
          "Open in the cabin = ticket, even sober"
        ],
        cardId: null
      },
      {
        id: "ember-l4",
        title: "Combined Influence",
        keyNumber: "1 + 1 = DUI",
        keyLabel: "Alcohol plus cannabis",
        image: null,
        icon: "⚗️",
        teach: "You can be charged with DUI even when you are under both the alcohol limit AND the THC limit — if the combined effect impairs your driving. Officers and judges can stack the substances.",
        remember: [
          "Under 0.08% AND under 5 ng/mL can still be DUI",
          "Combined impairment is the new threshold",
          "Mixing substances multiplies risk, not adds it"
        ],
        cardId: null
      }
    ],
    quiz: [
      {
        q: "What is the adult THC blood limit for driving in Washington?",
        options: ["0 ng/mL", "5 ng/mL active THC", "10 ng/mL", "There is no legal limit"],
        answer: 1,
        explain: "5 ng/mL of active THC in blood within 2 hours of driving is per se DUI for adults 21+."
      },
      {
        q: "You are 18. You used cannabis and blow a THC level of 1 ng/mL. What happens?",
        options: ["Legal — under the 5 ng/mL adult limit", "Minor DUI — under 21 is zero tolerance", "Warning only", "Fine but no DUI"],
        answer: 1,
        explain: "Under 21, ANY detectable active THC is a Minor DUI. Adult limits do not apply."
      },
      {
        q: "Where can cannabis legally travel in a car in Washington?",
        options: ["In the cup holder if it is yours", "Sealed in original container OR in the trunk", "Anywhere as long as you are sober", "Only by passengers"],
        answer: 1,
        explain: "Cannabis must be in its sealed original container, or stored in the trunk or non-passenger area."
      },
      {
        q: "You blow 0.05% BAC and 3 ng/mL THC. Can you be charged with DUI?",
        options: ["No — both numbers are below their limits", "Yes — combined influence can still impair driving", "Only if you cause an accident", "Only if you are under 21"],
        answer: 1,
        explain: "Combined alcohol and cannabis influence can result in DUI even when each substance is under its individual limit."
      },
      {
        q: "Active THC for DUI is measured in:",
        options: ["Urine", "Hair", "Blood", "Saliva swab only"],
        answer: 2,
        explain: "Active THC is measured in blood — not urine, which detects metabolites that linger long after impairment fades."
      }
    ]
  },

  // ============================================================
  // CHAPTER 3 — STATIC (DISTRACTION / E-DUI)
  // ============================================================
  {
    id: "static",
    number: 3,
    title: "House of Static",
    subtitle: "The Phantom Signal",
    suit: "static",
    icon: "⚡",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.6)",
    intro: "Your phone is not your friend behind the wheel. Washington calls this E-DUI — Electronic DUI — and treats it like the drug it is.",
    boss: {
      name: "Glytcha, the Notification Wraith",
      image: "images/demon-static.png",
      hp: 90,
      threat: "The Static Trial",
      defeatLine: "I lived inside every ping. You looked away. That was all it took.",
      reward: "Eye of the Awake"
    },
    lessons: [
      {
        id: "static-l1",
        title: "Inattention Blindness",
        keyNumber: "50%",
        keyLabel: "Visual information missed during phone use",
        image: "images/distraction.png",
        teach: "Studies cited by the WA Driver Guide show that drivers using a phone — even hands-free — miss up to 50% of the visual information around them. Your eyes are open. Your brain is not seeing.",
        remember: [
          "50% of visual info lost during phone use",
          "Hands-free is not risk-free",
          "Your brain literally stops processing what your eyes see"
        ],
        cardId: "static-001"
      },
      {
        id: "static-l2",
        title: "First E-DUI Ticket",
        keyNumber: "$136",
        keyLabel: "First E-DUI fine",
        image: null,
        icon: "📱",
        teach: "Holding a phone in your hand while driving is E-DUI. First offense: $136 fine. Second offense within 5 years: $234. The ticket goes on your insurance.",
        remember: [
          "First offense = $136",
          "Second within 5 years = $234",
          "Both go on your insurance"
        ],
        cardId: null
      },
      {
        id: "static-l3",
        title: "Dangerously Distracted",
        keyNumber: "$99",
        keyLabel: "Secondary distraction fine",
        image: null,
        icon: "🍔",
        teach: "Eating, grooming, reading, or any activity that interferes with safe driving is a secondary offense — $99 ticket. Officers can add it on top of any other traffic stop.",
        remember: [
          "$99 add-on ticket",
          "Eating, makeup, reading, reaching = all qualify",
          "Secondary offense — needs another reason for the stop"
        ],
        cardId: null
      },
      {
        id: "static-l4",
        title: "The One Touch Rule",
        keyNumber: "1 TOUCH",
        keyLabel: "Maximum interaction with a mounted phone",
        image: null,
        icon: "👆",
        teach: "You may use a phone if it is mounted and you activate it with a single touch or swipe. Anything more — scrolling, texting, dialing — is E-DUI even if the phone is mounted.",
        remember: [
          "Phone must be mounted (not in hand)",
          "One touch / one swipe maximum",
          "Scrolling or typing = E-DUI even mounted"
        ],
        cardId: null
      }
    ],
    quiz: [
      {
        q: "According to the WA Driver Guide, what percentage of visual information do drivers miss while using a phone?",
        options: ["10%", "25%", "Up to 50%", "75%"],
        answer: 2,
        explain: "Up to 50% — your brain processes only half of what your eyes see while on a phone."
      },
      {
        q: "What is the fine for a first E-DUI offense in Washington?",
        options: ["$50", "$99", "$136", "$234"],
        answer: 2,
        explain: "First E-DUI is $136 and goes on your insurance record."
      },
      {
        q: "Eating a burger while driving — what offense category is this?",
        options: ["Nothing — eating is legal", "Dangerously Distracted secondary offense ($99)", "E-DUI ($136)", "Felony distraction"],
        answer: 1,
        explain: "Eating qualifies as Dangerously Distracted — a $99 secondary offense added to another stop."
      },
      {
        q: "Your phone is mounted on the dashboard. You scroll through Spotify for a song. Is this legal?",
        options: ["Yes — it is mounted", "Yes — music does not count", "No — only ONE touch or swipe is allowed", "Only legal if stopped at a light"],
        answer: 2,
        explain: "Only ONE touch or swipe is allowed on a mounted phone. Scrolling = E-DUI."
      },
      {
        q: "Hands-free Bluetooth conversations are:",
        options: ["100% safe and legal", "Legal but still cause inattention blindness", "Illegal in Washington", "Only legal for emergencies"],
        answer: 1,
        explain: "Hands-free is legal but not risk-free. Your brain still loses up to 50% of visual processing."
      }
    ]
  },

  // ============================================================
  // CHAPTER 4 — IRON (ROAD SIGNS)
  // ============================================================
  {
    id: "iron",
    number: 4,
    title: "House of Iron",
    subtitle: "The Language of Steel",
    suit: "iron",
    icon: "✶",
    color: "#94a3b8",
    glow: "rgba(148,163,184,0.6)",
    intro: "Every sign on the road speaks two languages: shape and color. Learn both and the road becomes a poem you can read.",
    boss: {
      name: "Skarn, Warden of the Iron Crossroads",
      image: "images/demon-iron.png",
      hp: 105,
      threat: "The Iron Trial",
      defeatLine: "My signs were warnings. You finally listened.",
      reward: "Crest of the Reader"
    },
    lessons: [
      {
        id: "iron-l1",
        title: "STOP — Octagon of Red",
        keyNumber: "8 SIDES",
        keyLabel: "The only octagonal sign",
        image: "images/stop.png",
        teach: "Red octagonal STOP is the only eight-sided sign on the road. You must come to a COMPLETE stop — wheels not moving — behind the stop line, then proceed only when safe.",
        remember: [
          "Octagon = STOP (the only 8-sided sign)",
          "Red = absolute command, must obey",
          "Complete stop = wheels stopped, behind the line"
        ],
        cardId: "iron-001"
      },
      {
        id: "iron-l2",
        title: "YIELD — Inverted Triangle",
        keyNumber: "3 SIDES",
        keyLabel: "Yield triangle",
        image: "images/yield.png",
        teach: "Red and white downward-pointing triangle = YIELD. You must slow, scan, and give way to cross traffic and pedestrians. Stop only if needed to give way.",
        remember: [
          "Downward triangle = YIELD",
          "Red + white border",
          "Slow and give way, stop only if necessary"
        ],
        cardId: "iron-002"
      },
      {
        id: "iron-l3",
        title: "DIAMOND of Dread — Warning",
        keyNumber: "YELLOW",
        keyLabel: "Warning sign color",
        image: "images/warning.png",
        teach: "Yellow diamond signs warn of upcoming hazards — curves, deer, narrow bridges, slick roads. They do not command, they warn. Read them and adjust.",
        remember: [
          "Diamond shape = warning",
          "Yellow background = standard warning",
          "Orange diamond = construction zone warning"
        ],
        cardId: "iron-003"
      },
      {
        id: "iron-l4",
        title: "Color is Law",
        keyNumber: "5 COLORS",
        keyLabel: "Core sign colors",
        image: null,
        icon: "🎨",
        teach: "RED = stop / prohibition. YELLOW = warning. ORANGE = construction. GREEN = guidance / permitted. BLUE = motorist services. BROWN = recreation / parks. WHITE = regulatory rule.",
        remember: [
          "RED forbids. YELLOW warns. ORANGE = work zone.",
          "GREEN guides. BLUE serves. BROWN = parks.",
          "WHITE rectangles = regulatory rules (speed, lane)"
        ],
        cardId: null
      },
      {
        id: "iron-l5",
        title: "Shape is Law",
        keyNumber: "6 SHAPES",
        keyLabel: "Core sign shapes",
        image: null,
        icon: "📐",
        teach: "OCTAGON = stop. TRIANGLE (down) = yield. DIAMOND = warning. PENTAGON = school zone. ROUND = railroad crossing. RECTANGLE = regulatory or guidance.",
        remember: [
          "Octagon only ever means STOP",
          "Pentagon ahead = SCHOOL zone",
          "Round = RAILROAD crossing"
        ],
        cardId: null
      }
    ],
    quiz: [
      {
        q: "How many sides does a STOP sign have?",
        options: ["6", "8", "10", "12"],
        answer: 1,
        explain: "Eight. The octagon is reserved exclusively for STOP."
      },
      {
        q: "You see a yellow diamond sign. What does it mean?",
        options: ["You must stop", "Warning of an upcoming hazard", "Construction zone", "School ahead"],
        answer: 1,
        explain: "Yellow diamonds warn of hazards — curves, deer, bridges, etc."
      },
      {
        q: "What does an orange diamond sign indicate?",
        options: ["Standard hazard", "Construction or work zone", "School zone", "Recreation area"],
        answer: 1,
        explain: "Orange diamonds = construction zone warnings. Fines double in active work zones."
      },
      {
        q: "Which sign shape is reserved for railroad crossings?",
        options: ["Pentagon", "Diamond", "Circle (round)", "Octagon"],
        answer: 2,
        explain: "Round / circular signs are railroad crossing advance warnings."
      },
      {
        q: "A pentagon-shaped sign on the road means:",
        options: ["Stop ahead", "School zone or school crossing", "Railroad ahead", "Construction"],
        answer: 1,
        explain: "Pentagon = school zone or school crossing."
      }
    ]
  },

  // ============================================================
  // CHAPTER 5 — THORN (RIGHT OF WAY)
  // ============================================================
  {
    id: "thorn",
    number: 5,
    title: "House of Thorn",
    subtitle: "The Crossroads of Dawn",
    suit: "thorn",
    icon: "❦",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.6)",
    intro: "Two cars meet. One must yield. The rules of the crossroads are older than the cars themselves.",
    boss: {
      name: "Rosaria, the Six-Eyed Crossroads Queen",
      image: "images/demon-thorn.png",
      hp: 120,
      threat: "The Thorn Trial",
      defeatLine: "Every intersection was my altar. You walked through unbloodied.",
      reward: "Lattice of First Passage"
    },
    lessons: [
      {
        id: "thorn-l1",
        title: "Uncontrolled Intersection",
        keyNumber: "RIGHT WINS",
        keyLabel: "Tie-breaker rule",
        image: "images/intersection.png",
        teach: "At an intersection with no signs or lights, if you arrive at the same time as another driver, the driver on your RIGHT has the right of way. If you arrive first, you go first.",
        remember: [
          "First to arrive = first to go",
          "Tie = driver on your RIGHT wins",
          "Always yield to pedestrians regardless"
        ],
        cardId: "thorn-001"
      },
      {
        id: "thorn-l2",
        title: "Roundabout — Yield to Left",
        keyNumber: "YIELD LEFT",
        keyLabel: "Roundabout rule",
        image: "images/roundabout.png",
        teach: "Entering a roundabout: yield to traffic ALREADY in the circle, which is coming from your LEFT. Travel counter-clockwise. Do not stop inside.",
        remember: [
          "Yield to traffic already in the circle",
          "Traffic comes from your LEFT",
          "Travel counter-clockwise, never stop inside"
        ],
        cardId: "thorn-002"
      },
      {
        id: "thorn-l3",
        title: "Crimson Procession — Emergency Vehicles",
        keyNumber: "PULL RIGHT",
        keyLabel: "Yield rule for sirens",
        image: "images/emergency.png",
        teach: "When you see flashing red/blue lights or hear a siren: pull as far RIGHT as safely possible and STOP. Stay stopped until the vehicle has passed. Never stop in an intersection — clear it first.",
        remember: [
          "Pull RIGHT, stop, and wait",
          "Never stop in an intersection",
          "Stay stopped until the vehicle passes"
        ],
        cardId: "thorn-003"
      },
      {
        id: "thorn-l4",
        title: "Phantom School Bus",
        keyNumber: "STOP BOTH WAYS",
        keyLabel: "Two-lane school bus rule",
        image: "images/bus.png",
        teach: "Two-lane road, school bus stops with red lights flashing: ALL traffic in BOTH directions must stop. Stay stopped until lights stop flashing and bus moves. On a divided highway with a physical median, only traffic in the bus's direction must stop.",
        remember: [
          "Two-lane road = BOTH directions stop",
          "Divided highway w/ median = only bus direction stops",
          "Wait until lights stop flashing"
        ],
        cardId: "thorn-004"
      },
      {
        id: "thorn-l5",
        title: "Garden of Crosswalks",
        keyNumber: "EVERY CORNER",
        keyLabel: "Where crosswalks legally exist",
        image: "images/pedestrian.png",
        teach: "In Washington, every corner is legally a crosswalk — marked OR unmarked. You must yield to any pedestrian crossing in your half of the road, OR close enough to be in danger.",
        remember: [
          "Every corner = a crosswalk (marked or not)",
          "Yield in YOUR half + the half being approached",
          "Pedestrians always over cars at corners"
        ],
        cardId: "thorn-005"
      }
    ],
    quiz: [
      {
        q: "Two cars arrive at an uncontrolled intersection at the same time. Who has the right of way?",
        options: ["The faster car", "The car on the left", "The car on the right", "Whoever honks first"],
        answer: 2,
        explain: "When arriving at the same time, the driver on the RIGHT has right of way."
      },
      {
        q: "You are entering a roundabout. Who do you yield to?",
        options: ["Traffic on your right", "Traffic already in the circle (coming from your left)", "No one — you have right of way", "Pedestrians only"],
        answer: 1,
        explain: "Yield to traffic already in the roundabout — which approaches from your LEFT."
      },
      {
        q: "A siren is behind you. What do you do?",
        options: ["Speed up to get out of the way", "Pull left and stop", "Pull right and stop, clear of intersections", "Continue at normal speed"],
        answer: 2,
        explain: "Pull as far RIGHT as safely possible and stop. Never stop in an intersection — clear it first."
      },
      {
        q: "A school bus with flashing red lights stops on a two-lane road in front of you. What must traffic do?",
        options: ["Only your direction stops", "Only the opposite direction stops", "ALL traffic in BOTH directions stops", "Slow to 20 mph only"],
        answer: 2,
        explain: "On a two-lane road, all traffic in both directions must stop until the lights stop flashing."
      },
      {
        q: "There is no painted crosswalk. Is there still a legal crosswalk at the corner?",
        options: ["No — only painted crosswalks are legal", "Yes — every corner is a legal crosswalk in WA", "Only at signaled intersections", "Only on city streets"],
        answer: 1,
        explain: "In Washington every corner is a legal crosswalk, marked OR unmarked. Drivers must yield."
      }
    ]
  },

  // ============================================================
  // CHAPTER 6 — BONE (SPEED / NUMBERS)
  // ============================================================
  {
    id: "bone",
    number: 6,
    title: "House of Bone",
    subtitle: "The Black Ledger",
    suit: "bone",
    icon: "☽",
    color: "#e0e7ef",
    glow: "rgba(224,231,239,0.6)",
    intro: "Every number Washington has carved into law. Memorize them and the road becomes math you can solve.",
    boss: {
      name: "Ossuara, Keeper of the Black Ledger",
      image: "images/demon-bone.png",
      hp: 130,
      threat: "The Bone Trial",
      defeatLine: "Every number in my ledger was a debt. You paid them all.",
      reward: "Crown of the Final Ledger"
    },
    lessons: [
      {
        id: "bone-l1",
        title: "The Default Speeds",
        keyNumber: "25 / 50 / 60",
        keyLabel: "City / county / highway default mph",
        image: "images/speed.png",
        teach: "Default Washington speed limits when no sign is posted: 25 mph in cities and towns, 50 mph on county roads, 60 mph on state highways. Always obey the posted sign over the default.",
        remember: [
          "25 mph = city / town street",
          "50 mph = county road",
          "60 mph = state highway"
        ],
        cardId: "bone-001"
      },
      {
        id: "bone-l2",
        title: "The Lantern of Twenty",
        keyNumber: "20 mph",
        keyLabel: "School zone speed",
        image: "images/school.png",
        teach: "School zones — and areas around school crossings when children are present or lights are flashing — are 20 mph. Fines DOUBLE in active school zones.",
        remember: [
          "20 mph in active school zones",
          "Fines doubled = enforcement priority",
          "Watch for flashing yellow lights or 'when children are present'"
        ],
        cardId: "bone-002"
      },
      {
        id: "bone-l3",
        title: "The Stopping Window",
        keyNumber: "2 HOURS",
        keyLabel: "Window for BAC/THC tests",
        image: null,
        icon: "⏳",
        teach: "Washington measures BAC and THC within 2 hours of driving. After two hours the per se rule still applies — courts can use retrograde extrapolation to estimate your level at the time you drove.",
        remember: [
          "2-hour window for chemical tests",
          "After 2 hours = retrograde extrapolation",
          "You cannot 'wait it out' to dodge a per se DUI"
        ],
        cardId: null
      },
      {
        id: "bone-l4",
        title: "Following Distance",
        keyNumber: "3 SECONDS",
        keyLabel: "Safe following gap",
        image: null,
        icon: "⏱️",
        teach: "Maintain at least 3 seconds of following distance behind the car ahead in good conditions. Increase to 4+ seconds in rain, snow, fog, or when towing.",
        remember: [
          "3 seconds in clear weather",
          "4+ seconds in rain, snow, fog",
          "Count: 'one-thousand-one, one-thousand-two, one-thousand-three'"
        ],
        cardId: null
      },
      {
        id: "bone-l5",
        title: "The License Renewal",
        keyNumber: "6 / 8",
        keyLabel: "Years between renewals",
        image: null,
        icon: "📜",
        teach: "Standard Washington driver license is valid for 6 years. Enhanced Driver License (EDL) is valid for 8 years. You can renew up to 1 year before expiration.",
        remember: [
          "Standard license = 6 years",
          "Enhanced (EDL) = 8 years",
          "Renew up to 1 year early"
        ],
        cardId: null
      }
    ],
    quiz: [
      {
        q: "There is no posted speed limit sign on a county road. What is the default limit?",
        options: ["25 mph", "35 mph", "50 mph", "60 mph"],
        answer: 2,
        explain: "Default county road speed in Washington is 50 mph."
      },
      {
        q: "You enter an active school zone. What is the speed limit?",
        options: ["15 mph", "20 mph", "25 mph", "30 mph"],
        answer: 1,
        explain: "20 mph in active school zones — and fines are DOUBLED."
      },
      {
        q: "What is the minimum safe following distance in good weather?",
        options: ["1 second", "2 seconds", "3 seconds", "5 seconds"],
        answer: 2,
        explain: "3 seconds minimum in clear conditions. Increase to 4+ in rain or snow."
      },
      {
        q: "Within how many hours of driving does Washington measure BAC for a per se DUI?",
        options: ["1 hour", "2 hours", "4 hours", "6 hours"],
        answer: 1,
        explain: "2 hours. After that, retrograde extrapolation can still establish the per se violation."
      },
      {
        q: "How long is a standard Washington driver license valid?",
        options: ["4 years", "5 years", "6 years", "10 years"],
        answer: 2,
        explain: "Standard WA license = 6 years. Enhanced (EDL) = 8 years."
      }
    ]
  }
];

// ============================================================
// AUTO-DECORATE — attach signImage + lessonId hints to questions
// based on simple keyword matches. Keeps the quiz data clean.
// ============================================================
const SIGN_HINTS = [
  { test: /\bstop sign\b|\bSTOP sign\b|how many sides/i, image: "images/sign-stop.png", label: "STOP" },
  { test: /\byield\b/i,                                  image: "images/sign-yield.png", label: "YIELD" },
  { test: /yellow diamond/i,                             image: "images/sign-warning.png", label: "Yellow Diamond" },
  { test: /orange diamond|work zone|construction/i,      image: "images/sign-construction.png", label: "Construction" },
  { test: /pentagon|school zone/i,                       image: "images/sign-school.png", label: "School Zone" },
  { test: /railroad|round.*sign|circular.*sign/i,        image: "images/sign-railroad.png", label: "Railroad" },
  { test: /school zone.*speed|20\s*mph/i,                image: "images/sign-speed-20.png", label: "20 MPH" },
  { test: /50\s*mph|county road/i,                       image: "images/sign-speed-50.png", label: "50 MPH" }
];

function pickSignImage(text) {
  for (const s of SIGN_HINTS) {
    if (s.test.test(text)) return { image: s.image, label: s.label };
  }
  return null;
}

// Walk all chapters and attach (a) lessonId for the first matching lesson
// in the chapter (so Hint can show study material), and (b) optional signImage.
(function decorateQuestions() {
  CHAPTERS.forEach(chap => {
    chap.quiz.forEach((q, idx) => {
      // Sign image based on question text
      const sign = pickSignImage(q.q);
      if (sign && !q.signImage) {
        q.signImage = sign.image;
        q.signLabel = sign.label;
      }
      // Hint: map by index to lesson, or fall back to first lesson
      if (!q.lessonId) {
        const lesson = chap.lessons[idx] || chap.lessons[0];
        if (lesson) q.lessonId = lesson.id;
      }
    });
  });
})();
