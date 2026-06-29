// ============================================================
// BATTLE QUESTIONS — expanded variant pool per chapter
// Distinct from study quiz. 8-10 rewordings per boss fight.
// Same facts as Washington Driver Guide; varied phrasing,
// shuffled distractors, and scenario framings.
// ============================================================

const BATTLE_QUESTIONS = {

  // ====================== BLOOD / DUI ======================
  blood: [
    {
      q: "You're 24. A roadside test puts you at 0.08% BAC within 2 hours of driving. Outcome?",
      options: ["You walk — barely under enforcement", "Per se DUI — the number is the case", "DUI only if officer documents impairment", "Verbal warning"],
      answer: 1,
      explain: "0.08% within 2 hours is per se DUI for adults 21+. The reading alone is sufficient."
    },
    {
      q: "Adult per se DUI threshold in Washington:",
      options: ["0.05%", "0.06%", "0.08%", "0.10%"],
      answer: 2,
      explain: "0.08% BAC is the per se line for drivers 21+."
    },
    {
      q: "You're 19. You blew 0.03%. What charge applies?",
      options: ["No charge — under 0.08%", "Open container only", "Minor DUI — under-21 limit is 0.02%", "Adult DUI"],
      answer: 2,
      explain: "Anyone under 21 is held to 0.02%. 0.03% triggers Minor DUI."
    },
    {
      q: "What is the under-21 BAC limit in WA?",
      options: ["0.00%", "0.02%", "0.04%", "0.05%"],
      answer: 1,
      explain: "0.02% — zero tolerance line for drivers under 21."
    },
    {
      q: "A commercial truck driver is pulled over at 0.05% BAC. Result?",
      options: ["No DUI — under 0.08%", "DUI — commercial limit is 0.04%", "Warning only", "Off-duty only"],
      answer: 1,
      explain: "Commercial drivers' limit is 0.04% — half the adult limit."
    },
    {
      q: "You refuse the breathalyzer. What happens automatically on first refusal?",
      options: ["Nothing", "$200 fine only", "1-year license revocation", "30-day suspension"],
      answer: 2,
      explain: "Implied consent: refusal triggers automatic 1-year revocation on first offense."
    },
    {
      q: "Your BAC tests at 0.17%. Beyond standard DUI, what extra penalty applies?",
      options: ["None — it's still one DUI", "Aggravated DUI penalties + mandatory ignition interlock", "Automatic felony", "Charge dropped"],
      answer: 1,
      explain: "0.15% or higher = aggravated penalties including mandatory ignition interlock."
    },
    {
      q: "WA measures BAC for per se DUI within how many hours of driving?",
      options: ["1 hour", "2 hours", "4 hours", "6 hours"],
      answer: 1,
      explain: "2 hours from time of driving — that's the per se window."
    },
    {
      q: "You took two prescribed sleep pills. You're under 0.08%. Can you still be charged with DUI?",
      options: ["No — under the limit", "No — it's prescribed", "Yes — DUI covers any impairing substance, prescribed or not", "Only if illegal"],
      answer: 2,
      explain: "DUI covers ANY impairing substance — alcohol, cannabis, prescription, OTC. Prescription is not a shield."
    },
    {
      q: "Your friend gets pulled over. He had one beer. He's 22. Should he refuse the breath test?",
      options: ["Yes — refusal protects him", "No — refusal alone = 1-year revocation", "Doesn't matter", "Only refuse if drunk"],
      answer: 1,
      explain: "Refusing is its own penalty. 1-year revocation kicks in regardless of guilt."
    }
  ],

  // ====================== EMBER / CANNABIS ======================
  ember: [
    {
      q: "Adult per se THC blood limit while driving in Washington:",
      options: ["1 ng/mL", "5 ng/mL active THC", "10 ng/mL", "No limit exists"],
      answer: 1,
      explain: "5 ng/mL active THC in blood within 2 hours of driving = per se DUI for adults 21+."
    },
    {
      q: "You're 18. Trace amounts of THC show up. What charge?",
      options: ["None — under 5 ng/mL", "Minor DUI — any detectable THC under 21", "Warning only", "Civil infraction"],
      answer: 1,
      explain: "Under 21 = zero tolerance. ANY detectable active THC is Minor DUI."
    },
    {
      q: "How must cannabis be transported in a vehicle?",
      options: ["Loose in glovebox is fine", "Sealed original container OR in trunk", "Anywhere if driver is sober", "Passenger may hold it open"],
      answer: 1,
      explain: "Sealed in original container, or stored in trunk / non-passenger area."
    },
    {
      q: "Active THC for DUI is tested in which fluid?",
      options: ["Urine", "Hair", "Blood", "Sweat"],
      answer: 2,
      explain: "Blood — urine catches metabolites that linger long past impairment."
    },
    {
      q: "You blow 0.06% BAC AND test at 3 ng/mL THC. Both numbers are individually under-limit. DUI?",
      options: ["No — both under their lines", "Yes — combined impairment can still establish DUI", "Only if you crashed", "Only if under 21"],
      answer: 1,
      explain: "Combined alcohol + cannabis can establish DUI even when each substance alone is below per se."
    },
    {
      q: "You used cannabis 6 hours ago and feel fine. Could you still be over 5 ng/mL?",
      options: ["No — it metabolizes in 2 hours", "Possibly yes — active THC clears unpredictably", "Only with edibles", "Only with concentrates"],
      answer: 1,
      explain: "Active THC clears unpredictably. Feeling fine doesn't guarantee you're under 5 ng/mL."
    },
    {
      q: "Cannabis in a car: which is legal placement?",
      options: ["Open in cup holder", "Half-empty in passenger seat", "Sealed original container in cabin", "Joint in ashtray"],
      answer: 2,
      explain: "Sealed in original container is fine. Open containers are not."
    },
    {
      q: "Your passenger lights up at a stoplight. Are you (the driver) at risk?",
      options: ["No — not your hand", "Yes — open container + secondhand contamination", "Only if cops smell it", "No if windows are down"],
      answer: 1,
      explain: "Passenger consumption is illegal AND can affect the driver's testing. Don't ride with it lit."
    },
    {
      q: "Hands-free edible while driving: legal?",
      options: ["Yes — no smoke", "No — driving while consuming cannabis is illegal regardless of method", "Only above 21", "Only on private roads"],
      answer: 1,
      explain: "Method doesn't matter. Consuming cannabis while operating a vehicle is illegal."
    },
    {
      q: "You're a passenger, not driving. THC blood limit applies to you?",
      options: ["Yes — same as driver", "No — only the driver", "Only if under 21", "Only after midnight"],
      answer: 1,
      explain: "Per se THC limits apply to the DRIVER. Passenger consumption is a separate open-container issue."
    }
  ],

  // ====================== STATIC / E-DUI ======================
  static: [
    {
      q: "WA Driver Guide: percentage of visual info missed while using a phone?",
      options: ["10%", "25%", "Up to 50%", "70%"],
      answer: 2,
      explain: "Up to 50% — the brain processes only half of what eyes see during phone use."
    },
    {
      q: "First-offense E-DUI fine in Washington:",
      options: ["$50", "$99", "$136", "$234"],
      answer: 2,
      explain: "$136 — and it goes on your insurance record."
    },
    {
      q: "Second E-DUI offense within 5 years — fine?",
      options: ["$99", "$136", "$234", "$500"],
      answer: 2,
      explain: "$234 on the second offense within 5 years."
    },
    {
      q: "Eating fast food while driving in WA. Offense category?",
      options: ["Legal", "Dangerously Distracted ($99) secondary offense", "E-DUI ($136)", "Felony"],
      answer: 1,
      explain: "Eating = Dangerously Distracted, $99 secondary added to another stop."
    },
    {
      q: "Your phone is mounted. You scroll a playlist while driving. Legal?",
      options: ["Yes — mounted is fine", "Yes — music doesn't count", "No — only ONE touch / swipe allowed", "Only at red lights"],
      answer: 2,
      explain: "Mounted phone: only ONE touch or swipe. Scrolling = E-DUI."
    },
    {
      q: "Holding your phone at a red light to read a text:",
      options: ["Legal — you're stopped", "Legal if no one is behind you", "Still E-DUI — stopped in traffic counts", "Legal once a minute"],
      answer: 2,
      explain: "Stopped in traffic still counts. E-DUI applies."
    },
    {
      q: "Hands-free Bluetooth call while driving — risk assessment:",
      options: ["100% safe", "Legal but still causes inattention blindness", "Illegal", "Only legal for emergencies"],
      answer: 1,
      explain: "Legal but not risk-free. Brain still loses up to 50% visual processing."
    },
    {
      q: "Putting makeup on at a stoplight, two cars ahead of you:",
      options: ["Legal — stopped", "Dangerously Distracted secondary offense", "E-DUI", "Open container"],
      answer: 1,
      explain: "Grooming while operating = Dangerously Distracted. $99 secondary."
    },
    {
      q: "A passenger holds your phone to navigate. You glance at it. Legal?",
      options: ["No — driver glance is still E-DUI", "Yes — passenger holds it", "Yes — navigation exempt", "Only on highways"],
      answer: 0,
      explain: "Driver use of any handheld device — even held by another — is E-DUI."
    },
    {
      q: "GPS-only nav running on a mounted phone. Untouched. Legal?",
      options: ["No — phones banned mounted", "Yes — mounted nav allowed, hands off", "Only if Bluetooth", "Only off-highway"],
      answer: 1,
      explain: "Mounted nav with hands off is fine. One touch / swipe rule still applies."
    }
  ],

  // ====================== IRON / SIGNS ======================
  iron: [
    {
      q: "How many sides on a STOP sign?",
      options: ["6", "7", "8", "10"],
      answer: 2,
      explain: "Eight. The octagon is reserved exclusively for STOP."
    },
    {
      q: "What sign shape is reserved only for STOP?",
      options: ["Diamond", "Pentagon", "Octagon", "Triangle"],
      answer: 2,
      explain: "Octagon = STOP. Memorized."
    },
    {
      q: "Yellow diamond sign means:",
      options: ["Mandatory stop", "Hazard warning ahead", "Construction zone", "School zone"],
      answer: 1,
      explain: "Yellow diamonds warn of upcoming hazards — curves, deer, bridges."
    },
    {
      q: "Orange diamond sign means:",
      options: ["General warning", "Construction or work zone", "School zone", "Tourist info"],
      answer: 1,
      explain: "Orange = construction. Fines double in active work zones."
    },
    {
      q: "Round (circular) sign on a road indicates:",
      options: ["Roundabout", "Railroad crossing ahead", "Yield", "Tourist site"],
      answer: 1,
      explain: "Circular signs are railroad crossing advance warnings."
    },
    {
      q: "Pentagon-shaped sign indicates:",
      options: ["Stop ahead", "School zone / school crossing", "Railroad", "Hospital"],
      answer: 1,
      explain: "Pentagon = school zone or school crossing."
    },
    {
      q: "A triangle sign with the point down means:",
      options: ["Stop", "Yield", "Warning", "Construction"],
      answer: 1,
      explain: "Inverted triangle = YIELD."
    },
    {
      q: "You see a yellow pentagon sign. Speed expectation:",
      options: ["No change", "Be ready for 20 mph school zone", "55 mph highway", "Stop completely"],
      answer: 1,
      explain: "School zone pentagon = anticipate 20 mph active zone."
    },
    {
      q: "An orange diamond with workers on it appears. Fines for violations here are:",
      options: ["Same as normal", "Doubled", "Tripled", "Waived"],
      answer: 1,
      explain: "Fines DOUBLE in active work zones."
    },
    {
      q: "A round sign with 'RR' on it tells you:",
      options: ["Rural road", "Railroad crossing — be alert", "Right turn required", "Roundabout 200 ft"],
      answer: 1,
      explain: "RR = railroad crossing advance warning. Be ready to stop."
    },
    {
      q: "Sign color for general warning:",
      options: ["Red", "Yellow", "Orange", "Green"],
      answer: 1,
      explain: "Yellow signals a general warning. Orange is work zone specifically."
    }
  ],

  // ====================== THORN / RIGHT OF WAY ======================
  thorn: [
    {
      q: "Two cars reach an uncontrolled intersection at the same moment. Right of way?",
      options: ["Faster car", "Car on the LEFT", "Car on the RIGHT", "Whichever honks"],
      answer: 2,
      explain: "Simultaneous arrival → driver on the RIGHT goes first."
    },
    {
      q: "Entering a roundabout — yield to:",
      options: ["Anyone on your right", "Traffic already in the circle (from your LEFT)", "No one", "Pedestrians only"],
      answer: 1,
      explain: "Yield to traffic already circulating — it approaches from your LEFT."
    },
    {
      q: "Siren and lights behind you. Correct action:",
      options: ["Speed up to clear road", "Pull LEFT and stop", "Pull RIGHT and stop, clear of intersections", "Continue at normal speed"],
      answer: 2,
      explain: "Pull as far RIGHT as safely possible. Never stop in an intersection."
    },
    {
      q: "School bus flashing RED lights on a two-lane road, in front of you. You must:",
      options: ["Only your side stops", "Only oncoming side stops", "ALL traffic both directions stops", "Slow to 20 mph and proceed"],
      answer: 2,
      explain: "Two-lane road + red flashers = ALL traffic both directions stops."
    },
    {
      q: "Corner with no painted crosswalk. Pedestrian steps off. Do you yield?",
      options: ["No — no paint, no crosswalk", "Yes — every corner is a legal crosswalk in WA", "Only on city streets", "Only at signals"],
      answer: 1,
      explain: "WA: every corner is a legal crosswalk, painted OR unmarked."
    },
    {
      q: "You're at a T-intersection on the side road. The through road has no stop signs. Who yields?",
      options: ["Through-road traffic", "You — entering from the side road", "Whoever is slower", "First to arrive"],
      answer: 1,
      explain: "Side road / T-stem yields to through traffic."
    },
    {
      q: "Four-way stop. You and another car arrive at the same time. Who goes?",
      options: ["Car on the LEFT", "Car on the RIGHT", "Bigger vehicle", "Whoever rolls forward first"],
      answer: 1,
      explain: "Tie → car on the RIGHT. Same rule as uncontrolled intersections."
    },
    {
      q: "You're turning LEFT at a green light. Oncoming car is going straight. Who has right of way?",
      options: ["You — green light", "Oncoming car going straight", "Whoever signals first", "Pedestrians only"],
      answer: 1,
      explain: "Left turner ALWAYS yields to oncoming traffic going straight, even on green."
    },
    {
      q: "Funeral procession passes through a red light. What do you do?",
      options: ["Cut through the gap", "Yield — processions move as one unit", "Honk", "Call police"],
      answer: 1,
      explain: "Yield to funeral processions. They move as a single unit through signals."
    },
    {
      q: "Pedestrian with white cane stepping off curb. Required action:",
      options: ["Honk to warn them", "Stop fully — white cane = legal right of way", "Slow and pass", "Wait at the line"],
      answer: 1,
      explain: "White cane = full legal right of way. Stop completely."
    }
  ],

  // ====================== BONE / SPEED & NUMBERS ======================
  bone: [
    {
      q: "Active school zone speed limit:",
      options: ["15 mph", "20 mph", "25 mph", "30 mph"],
      answer: 1,
      explain: "20 mph in active school zones. Fines DOUBLE."
    },
    {
      q: "Default speed on a county road with no posted sign:",
      options: ["25 mph", "35 mph", "50 mph", "60 mph"],
      answer: 2,
      explain: "50 mph default on county roads."
    },
    {
      q: "Default residential / business district speed in WA:",
      options: ["20 mph", "25 mph", "30 mph", "35 mph"],
      answer: 1,
      explain: "25 mph default in residential and business districts."
    },
    {
      q: "Minimum safe following distance in good weather:",
      options: ["1 second", "2 seconds", "3 seconds", "5 seconds"],
      answer: 2,
      explain: "3-second rule in clear weather. 4+ in rain, snow, fog."
    },
    {
      q: "Standard WA driver license valid for:",
      options: ["4 years", "5 years", "6 years", "10 years"],
      answer: 2,
      explain: "Standard license = 6 years. Enhanced (EDL) = 8."
    },
    {
      q: "Enhanced Driver License (EDL) valid for:",
      options: ["4 years", "6 years", "8 years", "10 years"],
      answer: 2,
      explain: "EDL = 8 years."
    },
    {
      q: "BAC measurement window for per se DUI:",
      options: ["1 hour", "2 hours", "4 hours", "6 hours"],
      answer: 1,
      explain: "2 hours. After that, retrograde extrapolation may still establish it."
    },
    {
      q: "Speed in active school zone — fines compared to normal:",
      options: ["Same", "Doubled", "Tripled", "Quadrupled"],
      answer: 1,
      explain: "Fines DOUBLE in active school zones AND construction zones."
    },
    {
      q: "Default speed on a state highway with no posted sign:",
      options: ["50 mph", "55 mph", "60 mph", "65 mph"],
      answer: 2,
      explain: "60 mph default on state highways."
    },
    {
      q: "Minimum age to apply for a WA instruction permit (no driver ed):",
      options: ["15", "15 1/2", "16", "18"],
      answer: 1,
      explain: "15 1/2 with no driver education course. Younger if enrolled."
    },
    {
      q: "How many seconds should headlight beams reveal ahead at highway speed?",
      options: ["Enough for 1 second of travel", "Enough for 3 seconds", "Enough for 4-5 seconds (low beam range)", "Doesn't matter"],
      answer: 2,
      explain: "Low beams reach roughly 4-5 seconds of travel. Slow down if you outdrive them."
    }
  ]
};

// ============================================================
// Auto-decorate battle questions with signImage + lessonId
// Same logic as chapters.js so /stop sign/, /yield/, etc. attach.
// ============================================================
(function decorateBattleQuestions() {
  if (typeof CHAPTERS === 'undefined') return;

  const SIGN_HINTS = [
    { rx: /stop sign|how many sides|octagon/i,                      img: 'images/sign-stop.png',         label: 'STOP sign' },
    { rx: /yield|inverted triangle|triangle.*down/i,                img: 'images/sign-yield.png',        label: 'YIELD sign' },
    { rx: /yellow diamond|general warning|hazard warning/i,         img: 'images/sign-warning.png',      label: 'Warning diamond' },
    { rx: /orange diamond|work zone|construction/i,                 img: 'images/sign-construction.png', label: 'Construction zone' },
    { rx: /pentagon|school zone|school cross/i,                     img: 'images/sign-school.png',       label: 'School zone' },
    { rx: /railroad|round.*sign|circular.*sign|\bRR\b/i,            img: 'images/sign-railroad.png',     label: 'Railroad crossing' },
    { rx: /school zone.*speed|20 mph/i,                             img: 'images/sign-speed-20.png',     label: '20 MPH zone' },
    { rx: /50 mph|county road/i,                                    img: 'images/sign-speed-50.png',     label: '50 MPH' }
  ];

  Object.keys(BATTLE_QUESTIONS).forEach(chapterId => {
    const chapter = CHAPTERS.find(c => c.id === chapterId);
    if (!chapter) return;

    BATTLE_QUESTIONS[chapterId].forEach((q, idx) => {
      // Sign decoration
      if (!q.signImage) {
        for (const h of SIGN_HINTS) {
          if (h.rx.test(q.q) || (q.options || []).some(o => h.rx.test(o))) {
            q.signImage = h.img;
            q.signLabel = h.label;
            break;
          }
        }
      }
      // Lesson reference for hint button — round-robin across chapter lessons
      if (!q.lessonId && chapter.lessons && chapter.lessons.length) {
        const lesson = chapter.lessons[idx % chapter.lessons.length];
        q.lessonId = lesson.id;
      }
    });
  });
})();
