// ============================================================
// WASTELAND DRIVERS ACADEMY — Game v2
// Login → Intro → Map → Chapter Intro → Study → Quiz → Battle → Victory
// ============================================================
'use strict';

// ---------- State (in-memory only, fresh each session) ----------
const player = {
  name: "",
  avatar: null,       // "images/avatar-1.png" etc.
  xp: 0,
  level: 1,
  bestStreak: 0,
  sigils: [],         // [{chapterId, name, icon, color}]
  completed: {},      // { chapterId: true }
  stats: {},          // { chapterId: {answered, correct} } — mastery, fed by every mode
  mistakes: []        // [{chapterId, q}] — every miss, cleared by answering right anywhere
};

let currentChapter = null;
let currentLessonIdx = 0;
let lastScene = "scene-map"; // for back-from-ledger
const revealedKeys = new Set(); // study cards whose key number has been unveiled

// Quiz state
let quizState = null;
// Battle state
let battleState = null;

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const chapterById = (id) => CHAPTERS.find(c => c.id === id);
const lessonById = (chap, id) => chap.lessons.find(l => l.id === id);

function showScene(id) {
  document.querySelectorAll('.scene').forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ---------- Purchase gate + persistence (localStorage) ----------
function validCode(code) {
  const m = /^LEGEND-([A-Z0-9]{4})-([A-Z0-9]{4})$/.exec((code || '').trim().toUpperCase());
  if (!m) return false;
  const body = m[1] + m[2];
  return body.split('').reduce((a, ch) => a + ch.charCodeAt(0) * 7, 0) % 97 === 55;
}
function isPaid() {
  try { return validCode(localStorage.getItem('pl_unlock') || ''); } catch (e) { return false; }
}

function saveProgress() {
  try {
    localStorage.setItem('pl_save', JSON.stringify({
      name: player.name, avatar: player.avatar, themeId: player.themeId || 'wasteland',
      xp: player.xp, level: player.level, bestStreak: player.bestStreak,
      sigils: player.sigils, completed: player.completed, stats: player.stats,
      mistakes: player.mistakes, revealed: Array.from(revealedKeys)
    }));
  } catch (e) { /* private mode etc — play on without saves */ }
}
function loadProgress() {
  try { const raw = localStorage.getItem('pl_save'); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
}
function clearProgress() { try { localStorage.removeItem('pl_save'); } catch (e) {} }

// ---------- Learning ledger ----------
// Every answered question in every mode flows through here.
// Misses land in player.mistakes; a later correct answer anywhere redeems them.
const mistakeKey = (chapterId, q) => `${chapterId}::${q.q}`;

function recordAnswer(chapterId, q, isRight) {
  if (!chapterId || !q) return;
  const s = player.stats[chapterId] || (player.stats[chapterId] = { answered: 0, correct: 0 });
  s.answered++;
  // Persist after every answer — misses and mastery survive the session.
  setTimeout(saveProgress, 0);
  if (isRight) {
    s.correct++;
    const key = mistakeKey(chapterId, q);
    const idx = player.mistakes.findIndex(m => m.key === key);
    if (idx !== -1) player.mistakes.splice(idx, 1); // redeemed
  } else {
    const key = mistakeKey(chapterId, q);
    if (!player.mistakes.some(m => m.key === key)) {
      player.mistakes.push({ key, chapterId, q });
    }
  }
}

function chapterMastery(chapterId) {
  const s = player.stats[chapterId];
  if (!s || !s.answered) return null;
  return Math.round((s.correct / s.answered) * 100);
}

// XP / Level math
function xpForLevel(lv) { return 100 + (lv - 1) * 60; }
function applyXp(amount) {
  player.xp += amount;
  let leveled = false;
  while (player.xp >= xpForLevel(player.level)) {
    player.xp -= xpForLevel(player.level);
    player.level++;
    leveled = true;
  }
  return leveled;
}

// ============================================================
// LOGIN SCENE
// ============================================================
const AVATARS = [
  {
    id: "vex",
    img: "images/avatar-1.png",
    name: "Vex Halloran",
    body: "Petite · Wiry",
    tagline: "Speed is grace.",
    lore: "Dead-mall bike messenger. Knows every alley, every shortcut, every cracked sign in the city. Reads the road like sheet music."
  },
  {
    id: "mira",
    img: "images/avatar-2.png",
    name: "Mira Korvus",
    body: "Tall · Athletic",
    tagline: "Discipline is the only prayer.",
    lore: "Church-choir runaway turned trail-runner. Counts mile markers like rosary beads. Brakes late, signals early, never panics."
  },
  {
    id: "saoirse",
    img: "images/avatar-3.png",
    name: "Saoirse Veil",
    body: "Soft · Curvy",
    tagline: "The road is a circle and I am at its center.",
    lore: "Tarot-reading roadside witch. Sees the right-of-way as fate. Reads bumpers, signs, and weather like cards on a velvet cloth."
  },
  {
    id: "silas",
    img: "images/avatar-4.png",
    name: "Silas Mourne",
    body: "Lean · Sharp",
    tagline: "Every wreck was once a wrong answer.",
    lore: "Graveyard-shift tow truck kid. Has hauled a hundred wrecks off the county roads and remembers the mistake behind every one. Drives like he refuses to become cargo."
  }
];

function renderAvatarGrid() {
  const grid = $('avatar-grid');
  grid.innerHTML = '';
  player.avatar = null;
  player.avatarMeta = null;
  AVATARS.forEach((a, i) => {
    const tile = el('div', 'avatar-pick');
    tile.dataset.id = a.id;
    tile.dataset.img = a.img;
    tile.style.setProperty('--idx', i);
    tile.style.backgroundImage = `url('${a.img}')`;
    tile.innerHTML = `
      <div class="avatar-shine"></div>
      <div class="avatar-meta">
        <span class="avatar-body">${esc(a.body)}</span>
        <span class="avatar-name">${esc(a.name)}</span>
        <span class="avatar-tag">${esc(a.tagline)}</span>
      </div>`;
    tile.addEventListener('click', () => {
      document.querySelectorAll('.avatar-pick').forEach(p => p.classList.remove('selected'));
      tile.classList.add('selected');
      player.avatar = a.img;
      player.avatarMeta = a;
      sfx('select');
      checkLoginReady();
    });
    grid.appendChild(tile);
  });
  checkLoginReady();
}

function renderAdventureGrid() {
  const grid = $('adventure-grid');
  if (!grid || typeof THEMES === 'undefined') return;
  grid.innerHTML = '';
  Object.values(THEMES).forEach((t, i) => {
    const tile = el('div', 'adventure-pick');
    tile.dataset.id = t.id;
    tile.style.setProperty('--idx', i);
    tile.innerHTML = `
      <span class="adventure-icon">${t.icon}</span>
      <span class="adventure-name">${esc(t.name)}</span>
      <span class="adventure-pitch">${esc(t.pitch)}</span>`;
    tile.addEventListener('click', () => {
      document.querySelectorAll('.adventure-pick').forEach(p => p.classList.remove('selected'));
      tile.classList.add('selected');
      player.themeId = t.id;
      applyTheme(t.id);
      renderAvatarGrid(); // avatars belong to the world
      sfx('select');
      checkLoginReady();
    });
    grid.appendChild(tile);
  });
  // Default: the original
  const first = grid.querySelector('[data-id="wasteland"]');
  if (first) { first.classList.add('selected'); player.themeId = 'wasteland'; }
}

function resumeSavedRun(save) {
  applyTheme(save.themeId || 'wasteland');
  Object.assign(player, {
    name: save.name, avatar: save.avatar, themeId: save.themeId || 'wasteland',
    xp: save.xp || 0, level: save.level || 1, bestStreak: save.bestStreak || 0,
    sigils: save.sigils || [], completed: save.completed || {},
    stats: save.stats || {}, mistakes: save.mistakes || []
  });
  player.avatarMeta = AVATARS.find(a => a.img === save.avatar) || AVATARS[0];
  revealedKeys.clear();
  (save.revealed || []).forEach(id => revealedKeys.add(id));
  syncHud();
  renderMap();
  showScene('scene-map');
}

function initLogin() {
  renderAdventureGrid();
  renderAvatarGrid();

  // Saved run? Offer to resume — cross-session return visits are where
  // spaced retrieval actually happens.
  const save = loadProgress();
  if (save && save.name) {
    const card = document.querySelector('.login-card');
    const banner = el('div', 'resume-banner');
    banner.innerHTML = `
      <p class="resume-text">⚡ <strong>${esc(save.name)}</strong> — Lv ${save.level || 1} · ${(save.sigils || []).length} sigils · ${(save.mistakes || []).length} marks to atone</p>
      <button class="primary-btn" id="login-resume">Resume the Run →</button>
      <button class="ghost-btn small" id="login-fresh">Start Over</button>
    `;
    card.insertBefore(banner, card.querySelector('.login-form'));
    $('login-resume').addEventListener('click', () => { sfx('start'); resumeSavedRun(save); });
    $('login-fresh').addEventListener('click', () => { clearProgress(); banner.remove(); sfx('ui'); });
  }

  $('login-name').addEventListener('input', (e) => {
    player.name = e.target.value.trim();
    checkLoginReady();
  });
  $('login-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !$('login-start').disabled) $('login-start').click();
  });
  $('login-start').addEventListener('click', () => {
    if (!player.name || !player.avatar) return;
    const meta = player.avatarMeta || {};
    // Theme the intro myth
    const t = (typeof THEMES !== 'undefined' && THEMES[player.themeId]) ? THEMES[player.themeId] : null;
    if (t) {
      $('intro-origin').textContent = t.origin;
      $('intro-myth-line').textContent = 'Six bosses. Six trials. One license at the end.';
      const eyebrow = document.querySelector('#scene-intro .eyebrow');
      if (eyebrow) eyebrow.textContent = t.brand.eyebrow;
    }
    $('intro-greeting').textContent = `Welcome, ${player.name}.`;
    const loreEl = $('intro-driver-lore');
    if (loreEl && meta.name) {
      loreEl.innerHTML = `You ride as <strong>${esc(meta.name)}</strong> — ${esc(meta.body)}. <em>“${esc(meta.tagline)}”</em><br><span class="intro-driver-bio">${esc(meta.lore)}</span>`;
      loreEl.classList.remove('hidden');
    }
    showScene('scene-intro');
  });
}
function checkLoginReady() {
  $('login-start').disabled = !(player.name && player.avatar);
}

// ============================================================
// INTRO SCENE
// ============================================================
function initIntro() {
  $('intro-continue').addEventListener('click', () => {
    syncHud();
    renderMap();
    showScene('scene-map');
  });
}

// ============================================================
// MAP SCENE
// ============================================================
function syncHud() {
  if (player.name) saveProgress();
  $('hud-avatar').style.backgroundImage = `url('${player.avatar}')`;
  $('hud-name').textContent = player.name;
  $('hud-level').textContent = player.level;
  $('hud-xp').textContent = `${player.xp} / ${xpForLevel(player.level)}`;
  $('hud-sigils').textContent = player.sigils.length;
  $('hud-streak').textContent = player.bestStreak;
}

function renderMap() {
  const grid = $('map-grid');
  grid.innerHTML = '';
  CHAPTERS.forEach((c, i) => {
    const tile = el('div', 'chapter-tile');
    tile.style.setProperty('--tc', c.color);
    tile.style.setProperty('--idx', i);
    const chainUnlocked = (i === 0) || player.completed[CHAPTERS[i - 1].id];
    const payLocked = i > 0 && !isPaid();
    const isUnlocked = chainUnlocked && !payLocked;
    const isComplete = !!player.completed[c.id];
    if (!isUnlocked) tile.classList.add('locked');
    if (payLocked) tile.classList.add('paylocked');
    if (isComplete) tile.classList.add('completed');
    const mastery = chapterMastery(c.id);
    tile.innerHTML = `
      <div class="ct-demon" style="background-image:url('${esc(c.boss.image)}')"></div>
      <p class="ct-num">Chapter ${c.number}</p>
      <div class="ct-icon">${c.icon}</div>
      <h3 class="ct-title">${esc(c.title)}</h3>
      <p class="ct-sub">${esc(c.subtitle)}</p>
      <p class="ct-boss">Boss · ${esc(c.boss.name)}</p>
      ${mastery != null ? `
      <div class="ct-mastery" title="Accuracy across every mode">
        <div class="ct-mastery-bar"><div class="ct-mastery-fill" style="width:${mastery}%"></div></div>
        <span class="ct-mastery-pct">${mastery}%</span>
      </div>` : ''}
      ${isComplete ? '<div class="ct-seal">⛧ SEALED ⛧</div>' : ''}
    `;
    if (isUnlocked) {
      tile.addEventListener('click', () => enterChapter(c.id));
    } else if (payLocked) {
      const badge = el('div', 'ct-paybadge', '🔓 Unlock all worlds · $20');
      tile.appendChild(badge);
      tile.addEventListener('click', () => { window.location.href = 'index.html#pricing'; });
    }
    grid.appendChild(tile);
  });
}

function initMap() {
  $('hud-logout').addEventListener('click', () => {
    if (!confirm("Restart your initiation? All sigils and XP reset.")) return;
    Object.assign(player, { name: "", avatar: null, xp: 0, level: 1, bestStreak: 0, sigils: [], completed: {}, stats: {}, mistakes: [] });
    $('login-name').value = "";
    document.querySelectorAll('.avatar-pick').forEach(p => p.classList.remove('selected'));
    checkLoginReady();
    showScene('scene-login');
  });
  $('open-cheat').addEventListener('click', () => openLedger('scene-map'));
  $('open-trials').addEventListener('click', () => { sfx('ui'); Quests.openHub(); });
  initAudioToggles();
}

// ---------- Audio helpers (safe no-ops if engine absent) ----------
function sfx(name, arg) {
  if (window.Sound && Sound.fx && typeof Sound.fx[name] === 'function') {
    arg === undefined ? Sound.fx[name]() : Sound.fx[name](arg);
  }
}
function initAudioToggles() {
  const sfxBtn = $('toggle-sfx');
  const voiceBtn = $('toggle-voice');
  if (sfxBtn) sfxBtn.addEventListener('click', () => {
    const on = !(window.Sound && Sound.isSfxOn());
    if (window.Sound) Sound.setSfx(on);
    sfxBtn.textContent = on ? '🔊' : '🔇';
    sfxBtn.classList.toggle('off', !on);
    if (on) sfx('ui');
  });
  if (voiceBtn) voiceBtn.addEventListener('click', () => {
    const on = !(window.Sound && Sound.isVoiceOn());
    if (window.Sound) Sound.setVoice(on);
    voiceBtn.textContent = on ? '🗣' : '🤐';
    voiceBtn.classList.toggle('off', !on);
  });
}

// ============================================================
// CHAPTER INTRO
// ============================================================
function enterChapter(id) {
  currentChapter = chapterById(id);
  if (!currentChapter) return;
  const c = currentChapter;
  const wrap = $('chapter-intro-inner');
  wrap.style.setProperty('--tc', c.color);
  wrap.innerHTML = `
    <div class="ci-icon">${c.icon}</div>
    <p class="eyebrow">⛧ Chapter ${c.number} ⛧</p>
    <h2 class="ci-title">${esc(c.title)}</h2>
    <p class="ci-sub">${esc(c.subtitle)}</p>
    <p class="ci-intro-text">${esc(c.intro)}</p>
    <div class="ci-boss-card">
      <img class="ci-boss-img" src="${esc(c.boss.image)}" alt="" onerror="this.style.display='none'" />
      <div class="ci-boss-meta">
        <p class="ci-boss-label">☠ Demon awaiting</p>
        <p class="ci-boss-name">${esc(c.boss.name)}</p>
        <p class="ci-boss-reward">Reward · ${esc(c.boss.reward)}</p>
      </div>
    </div>
    <div class="ci-arc">
      <div class="ci-arc-step"><strong>${c.lessons.length}</strong>Study Cards</div>
      <div class="ci-arc-step"><strong>${c.quiz.length}</strong>Quiz Trials</div>
      <div class="ci-arc-step"><strong>1</strong>Boss Battle</div>
    </div>
    <div class="ci-actions">
      <button class="ghost-btn" id="ci-back">← Map</button>
      <button class="primary-btn" id="ci-begin">Begin Study →</button>
    </div>
  `;
  $('ci-back').addEventListener('click', () => showScene('scene-map'));
  $('ci-begin').addEventListener('click', () => startStudy());
  showScene('scene-chapter-intro');
}

// ============================================================
// STUDY SCENE
// ============================================================
function startStudy() {
  currentLessonIdx = 0;
  renderLesson();
  showScene('scene-study');
}

function renderLesson() {
  const c = currentChapter;
  const total = c.lessons.length;
  const lesson = c.lessons[currentLessonIdx];

  $('study-counter').textContent = `${currentLessonIdx + 1} / ${total}`;
  $('study-bar-fill').style.width = `${((currentLessonIdx + 1) / total) * 100}%`;
  $('study-chapter').textContent = `${c.icon} ${c.title}`;

  const artHtml = lesson.image
    ? `<div class="study-art" style="background-image:url('${lesson.image}')"></div>`
    : `<div class="study-art no-art"><div class="study-art-icon">${esc(lesson.icon || c.icon)}</div></div>`;

  // Active recall: the key number starts veiled. Read the label, guess the
  // number, then tap to check yourself. Stays revealed once seen.
  const isRevealed = revealedKeys.has(lesson.id);

  $('study-stage').innerHTML = `
    ${artHtml}
    <div class="study-content">
      <p class="study-eyebrow">Lesson ${currentLessonIdx + 1} · ${esc(c.title)}</p>
      <h2 class="study-title">${esc(lesson.title)}</h2>
      <div class="study-key${isRevealed ? '' : ' veiled'}" id="study-key">
        <p class="study-key-num">${esc(lesson.keyNumber)}</p>
        <p class="study-key-label">${esc(lesson.keyLabel)}</p>
        ${isRevealed ? '' : '<button class="study-key-veil" id="study-key-veil">Guess the number — tap to unveil</button>'}
      </div>
      <p class="study-teach">${esc(lesson.teach)}</p>
      <ul class="study-remember">
        ${lesson.remember.map(r => `<li>${esc(r)}</li>`).join('')}
      </ul>
    </div>
  `;

  if (!isRevealed) {
    $('study-key-veil').addEventListener('click', () => {
      revealedKeys.add(lesson.id);
      const key = $('study-key');
      key.classList.remove('veiled');
      key.classList.add('unveiling');
      const veil = $('study-key-veil');
      if (veil) veil.remove();
      sfx('sigil');
    });
  }

  $('study-prev').disabled = (currentLessonIdx === 0);
  $('study-next').textContent = (currentLessonIdx + 1 >= total) ? "Begin Quiz Trial →" : "Next Lesson →";
}

function initStudy() {
  $('study-back').addEventListener('click', () => showScene('scene-map'));
  $('study-prev').addEventListener('click', () => {
    if (currentLessonIdx > 0) { currentLessonIdx--; renderLesson(); }
  });
  $('study-next').addEventListener('click', () => {
    const total = currentChapter.lessons.length;
    if (currentLessonIdx + 1 >= total) {
      startQuiz();
    } else {
      currentLessonIdx++;
      renderLesson();
    }
  });
}

// ============================================================
// QUIZ CHALLENGE SCENE
// ============================================================
function startQuiz() {
  quizState = {
    chapter: currentChapter,
    questions: currentChapter.quiz,
    index: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreakInRun: 0,
    xpThisRun: 0,
    hintsUsed: 0
  };
  renderQuizQuestion();
  showScene('scene-quiz');
}

function renderQuizQuestion() {
  const q = quizState.questions[quizState.index];
  const total = quizState.questions.length;

  $('quiz-counter').textContent = `Q ${quizState.index + 1} / ${total}`;
  $('quiz-bar-fill').style.width = `${(quizState.index / total) * 100}%`;
  $('quiz-streak-display').textContent = quizState.streak;
  $('quiz-xp-display').textContent = quizState.xpThisRun;

  const signBlock = q.signImage
    ? `<div class="q-sign">
         <img src="${q.signImage}" alt="${esc(q.signLabel || 'sign')}" />
         <p class="q-sign-label">⛧ ${esc(q.signLabel || 'Sign')} ⛧</p>
       </div>`
    : '';

  const hintBtn = q.lessonId
    ? `<div class="hint-row">
         <button class="hint-btn" id="quiz-hint">📖 Reveal the Lesson</button>
       </div>`
    : '';

  $('quiz-stage').innerHTML = `
    <p class="quiz-topic">⛧ ${esc(quizState.chapter.title)} · Trial ${quizState.index + 1} ⛧</p>
    ${signBlock}
    <p class="quiz-q">${esc(q.q)}</p>
    ${hintBtn}
    <div class="quiz-options" id="quiz-options"></div>
    <div class="quiz-feedback hidden" id="quiz-feedback"></div>
    <div class="quiz-actions">
      <button class="primary-btn hidden" id="quiz-next">Next →</button>
    </div>
  `;

  const opts = $('quiz-options');
  q.options.forEach((text, i) => {
    const b = el('button', 'quiz-option');
    b.innerHTML = `<span class="letter">${String.fromCharCode(65 + i)}</span><span>${esc(text)}</span>`;
    b.addEventListener('click', () => answerQuiz(i, q));
    opts.appendChild(b);
  });

  if (q.lessonId) {
    $('quiz-hint').addEventListener('click', () => openHint(quizState.chapter, q.lessonId, 'quiz-hint'));
  }
}

function answerQuiz(chosen, q) {
  const buttons = document.querySelectorAll('#quiz-options .quiz-option');
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer) b.classList.add('correct');
    else if (i === chosen) b.classList.add('wrong');
  });

  const isRight = (chosen === q.answer);
  recordAnswer(quizState.chapter.id, q, isRight);
  const fb = $('quiz-feedback');
  fb.classList.remove('hidden', 'correct', 'wrong');

  if (isRight) {
    quizState.correct++;
    quizState.streak++;
    if (quizState.streak > quizState.bestStreakInRun) quizState.bestStreakInRun = quizState.streak;
    const base = 10;
    const bonus = quizState.streak >= 3 ? Math.min(10, (quizState.streak - 2) * 2) : 0;
    const gained = base + bonus;
    quizState.xpThisRun += gained;
    player.xp += gained; // accrue toward level — handled at chapter complete via applyXp recalc anyway, but show responsively
    fb.classList.add('correct');
    fb.innerHTML = `<strong>Correct.</strong> ${esc(q.explain)}<br><span style="color:#6ee7b7;font-family:var(--font-mono);font-size:11px;letter-spacing:0.15em;text-transform:uppercase">+${gained} XP${bonus ? ` · Streak Bonus +${bonus}` : ''}</span>`;
    sfx('correct');
    if (quizState.streak >= 2) sfx('combo', quizState.streak);
    if (quizState.streak >= 3) showStreakPop(quizState.streak);
  } else {
    quizState.wrong++;
    quizState.streak = 0;
    fb.classList.add('wrong');
    fb.innerHTML = `<strong>Wrong.</strong> ${esc(q.explain)}`;
    sfx('wrong');
  }

  $('quiz-streak-display').textContent = quizState.streak;
  $('quiz-xp-display').textContent = quizState.xpThisRun;

  const nextBtn = $('quiz-next');
  nextBtn.classList.remove('hidden');
  nextBtn.textContent = (quizState.index + 1 >= quizState.questions.length) ? "To the Battle →" : "Next →";
  nextBtn.onclick = () => {
    quizState.index++;
    if (quizState.index >= quizState.questions.length) {
      endQuizAndStartBattle();
    } else {
      renderQuizQuestion();
    }
  };
}

function showStreakPop(n) {
  const pop = document.createElement('div');
  pop.className = 'streak-pop';
  pop.textContent = `${n}× COMBO`;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 1300);
}

function endQuizAndStartBattle() {
  if (quizState.bestStreakInRun > player.bestStreak) player.bestStreak = quizState.bestStreakInRun;
  startBattle();
}

function initQuiz() {
  $('quiz-back').addEventListener('click', () => {
    if (confirm("Abandon this trial? Your progress in this chapter resets.")) showScene('scene-map');
  });
}

// ============================================================
// HINT MODAL
// ============================================================
function openHint(chapter, lessonId, triggerId) {
  const lesson = lessonById(chapter, lessonId);
  if (!lesson) return;
  const card = $('hint-card');
  // Keep the close button as the first child
  const closeBtn = $('hint-close');
  // Clear everything except the close button
  Array.from(card.children).forEach(child => { if (child !== closeBtn) child.remove(); });

  const artHtml = lesson.image
    ? `<div class="hint-art" style="background-image:url('${lesson.image}')"></div>`
    : `<div class="hint-art no-art">${esc(lesson.icon || chapter.icon)}</div>`;

  const content = document.createElement('div');
  content.innerHTML = `
    <p class="hint-eyebrow">📖 Lesson · ${esc(chapter.title)}</p>
    <h3 class="hint-title">${esc(lesson.title)}</h3>
    ${artHtml}
    <div class="hint-key">
      <p class="hint-key-num">${esc(lesson.keyNumber)}</p>
      <p class="hint-key-label">${esc(lesson.keyLabel)}</p>
    </div>
    <p class="hint-teach">${esc(lesson.teach)}</p>
    <ul class="hint-remember">
      ${lesson.remember.map(r => `<li>${esc(r)}</li>`).join('')}
    </ul>
    <p class="hint-foot">Close to return to your trial</p>
  `;
  // Append children of the temp div
  while (content.firstChild) card.appendChild(content.firstChild);

  $('hint-modal').classList.add('open');
  if (triggerId) {
    const btn = document.getElementById(triggerId);
    if (btn) btn.classList.add('used');
  }
  if (quizState) quizState.hintsUsed++;
  if (battleState) battleState.hintsUsed++;
}
function closeHint() { $('hint-modal').classList.remove('open'); }
function initHint() {
  $('hint-close').addEventListener('click', closeHint);
  $('hint-bg').addEventListener('click', closeHint);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeHint();
  });
}

// ============================================================
// BATTLE SCENE
// ============================================================
function startBattle() {
  const c = currentChapter;
  const boss = c.boss;

  // Pull from expanded battle pool when available; fall back to chapter quiz.
  const pool = (typeof BATTLE_QUESTIONS !== 'undefined' && BATTLE_QUESTIONS[c.id] && BATTLE_QUESTIONS[c.id].length)
    ? BATTLE_QUESTIONS[c.id]
    : c.quiz;
  const playerMaxHp = 100;

  battleState = {
    chapter: c,
    boss,
    bossHp: boss.hp,
    bossMaxHp: boss.hp,
    playerHp: playerMaxHp,
    playerMaxHp,
    // Shuffle a sizable pool; concat shuffled copies so battle doesn't run dry.
    questions: shuffle(pool).concat(shuffle(pool)),
    qIdx: 0,
    streak: 0,
    bestStreakInBattle: 0,
    xpThisBattle: 0,
    hintsUsed: 0,
    defeated: false,
    fallen: false
  };

  $('battle-arena').style.setProperty('--bc', c.color);
  $('battle-arena').classList.remove('flash', 'flash-red');
  $('battle-demon-img').src = boss.image;
  $('battle-demon-img').alt = boss.name;
  $('battle-demon-name').textContent = boss.name;
  $('battle-demon').classList.remove('hit', 'defeated', 'demon-attack');
  $('battle-hero-img').src = player.avatar;
  $('battle-hero-name').textContent = player.name;
  $('battle-hero').classList.remove('attack', 'struck');
  $('battle-threat').textContent = boss.threat || '';
  $('battle-combo').textContent = `1.0`;
  $('battle-streak').textContent = `streak 0`;
  updateBattleHp();
  updatePlayerHp();
  renderBattleQuestion();
  showScene('scene-battle');
  // Demon announces itself.
  sfx('start');
  if (window.Sound) setTimeout(() => Sound.bossCry(c.id), 450);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function updateBattleHp() {
  const pct = Math.max(0, (battleState.bossHp / battleState.bossMaxHp) * 100);
  $('battle-hp-fill').style.width = `${pct}%`;
  $('battle-hp-text').textContent = `${Math.max(0, Math.round(battleState.bossHp))} / ${battleState.bossMaxHp}`;
}

function updatePlayerHp() {
  const pct = Math.max(0, (battleState.playerHp / battleState.playerMaxHp) * 100);
  $('battle-hero-hp-fill').style.width = `${pct}%`;
  $('battle-hero-hp-text').textContent = `${Math.max(0, Math.round(battleState.playerHp))} / ${battleState.playerMaxHp}`;
}

function renderBattleQuestion() {
  const q = battleState.questions[battleState.qIdx % battleState.questions.length];
  const ui = $('battle-ui');

  // Remove any existing stage-sign before re-render
  const existing = document.querySelector('.battle-stage-sign');
  if (existing) existing.remove();

  $('battle-topic').textContent = `⛧ ${battleState.boss.threat} · Strike ${battleState.qIdx + 1} ⛧`;
  $('battle-q').textContent = q.q;
  $('battle-feedback').classList.add('hidden');
  $('battle-feedback').innerHTML = '';
  $('battle-next').classList.add('hidden');

  // Render sign image floating over the demon side if applicable
  if (q.signImage) {
    const img = document.createElement('img');
    img.src = q.signImage;
    img.alt = q.signLabel || 'sign';
    img.className = 'battle-stage-sign';
    const demonSide = document.querySelector('.fighter-demon');
    if (demonSide) demonSide.appendChild(img);
  }

  const opts = $('battle-options');
  opts.innerHTML = '';
  q.options.forEach((text, i) => {
    const b = el('button', 'battle-option');
    b.innerHTML = `<span class="letter">${String.fromCharCode(65 + i)}</span><span>${esc(text)}</span>`;
    b.addEventListener('click', () => answerBattle(i, q));
    opts.appendChild(b);
  });

  // Hint button (re-add into UI)
  const oldHint = document.getElementById('battle-hint-row');
  if (oldHint) oldHint.remove();
  if (q.lessonId) {
    const row = el('div', 'hint-row');
    row.id = 'battle-hint-row';
    const btn = el('button', 'hint-btn');
    btn.id = 'battle-hint';
    btn.innerHTML = '📖 Reveal the Lesson';
    btn.addEventListener('click', () => openHint(battleState.chapter, q.lessonId, 'battle-hint'));
    row.appendChild(btn);
    opts.parentNode.insertBefore(row, opts);
  }
}

function answerBattle(chosen, q) {
  const buttons = document.querySelectorAll('#battle-options .battle-option');
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer) b.classList.add('correct');
    else if (i === chosen) b.classList.add('wrong');
  });

  const isRight = (chosen === q.answer);
  recordAnswer(battleState.chapter.id, q, isRight);
  const fb = $('battle-feedback');
  fb.classList.remove('hidden', 'correct', 'wrong');

  if (isRight) {
    battleState.streak++;
    if (battleState.streak > battleState.bestStreakInBattle) battleState.bestStreakInBattle = battleState.streak;
    const multiplier = 1 + Math.min(1.5, (battleState.streak - 1) * 0.25); // 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, max 2.5
    const baseDmg = 14;
    const dmg = Math.round(baseDmg * multiplier);
    const isCrit = battleState.streak >= 3;
    battleState.bossHp -= dmg;
    battleState.xpThisBattle += Math.round(dmg * 0.6);
    triggerAttack(dmg, isCrit);
    fb.classList.add('correct');
    fb.innerHTML = `<strong>Strike landed.</strong> ${esc(q.explain)}<br><span style="color:#6ee7b7;font-family:var(--font-mono);font-size:11px;letter-spacing:0.15em;text-transform:uppercase">−${dmg} HP${isCrit ? ' · CRITICAL' : ''}</span>`;
    if (battleState.streak >= 2) { showStreakPop(battleState.streak); sfx('combo', battleState.streak); }

    $('battle-combo').textContent = `${multiplier.toFixed(2)}`;
    $('battle-streak').textContent = `streak ${battleState.streak}`;

    if (battleState.bossHp <= 0) {
      battleState.defeated = true;
      setTimeout(() => endBattleVictory(), 1400);
      return;
    }
  } else {
    battleState.streak = 0;
    // Boss strikes back
    const bossDmg = 12 + Math.floor(Math.random() * 7); // 12-18
    battleState.playerHp = Math.max(0, battleState.playerHp - bossDmg);
    triggerBossStrike(bossDmg);
    fb.classList.add('wrong');
    fb.innerHTML = `<strong>Missed.</strong> ${esc(q.explain)}<br><span style="color:#ff8094;font-family:var(--font-mono);font-size:11px;letter-spacing:0.15em;text-transform:uppercase">−${bossDmg} HP · Combo broken</span>`;
    $('battle-combo').textContent = `1.0`;
    $('battle-streak').textContent = `streak 0`;

    if (battleState.playerHp <= 0) {
      battleState.fallen = true;
      setTimeout(() => endBattleDefeat(), 1500);
      return;
    }
  }

  if (!battleState.defeated && !battleState.fallen) {
    $('battle-next').classList.remove('hidden');
    $('battle-next').onclick = () => {
      battleState.qIdx++;
      renderBattleQuestion();
    };
  }
}

// Boss claws the hero. Shake, slash, sparks, dmg popup.
function triggerBossStrike(dmg) {
  sfx('bossStrike');
  if (window.Sound && battleState) setTimeout(() => Sound.bossTaunt(battleState.chapter.id), 200);
  const hero = $('battle-hero');
  const demon = $('battle-demon');
  const arena = $('battle-arena');
  const fx = $('battle-effects');

  // Demon lunges forward
  demon.classList.remove('demon-attack'); void demon.offsetWidth; demon.classList.add('demon-attack');
  setTimeout(() => demon.classList.remove('demon-attack'), 700);

  // Red arena flash
  arena.classList.remove('flash-red'); void arena.offsetWidth; arena.classList.add('flash-red');
  setTimeout(() => arena.classList.remove('flash-red'), 400);

  // Boss slash effect on the hero side (after slight lunge delay)
  setTimeout(() => {
    const slash = el('div', 'boss-slash');
    fx.appendChild(slash);
    setTimeout(() => slash.remove(), 650);

    // Red sparks burst on the hero side
    for (let i = 0; i < 8; i++) {
      const s = el('div', 'battle-spark red');
      const dx = (Math.random() - 0.5) * 200;
      const dy = -Math.random() * 160 - 20;
      s.style.setProperty('--dx', `${dx}px`);
      s.style.setProperty('--dy', `${dy}px`);
      s.style.top = '30%';
      s.style.left = `${16 + (Math.random() - 0.5) * 6}%`;
      fx.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }

    // Hero gets struck — shake
    hero.classList.remove('struck'); void hero.offsetWidth; hero.classList.add('struck');

    // HP bar shake
    const hpEl = $('battle-hero-hp-fill').parentElement;
    hpEl.classList.remove('shake'); void hpEl.offsetWidth; hpEl.classList.add('shake');

    // Damage popup over hero
    const popup = el('div', 'player-dmg-popup');
    popup.textContent = `−${dmg}`;
    fx.appendChild(popup);
    setTimeout(() => popup.remove(), 950);

    updatePlayerHp();
  }, 250);
}

function triggerAttack(dmg, isCrit) {
  sfx(isCrit ? 'crit' : 'slash');
  // Hero animation
  const hero = $('battle-hero');
  hero.classList.remove('attack'); void hero.offsetWidth; hero.classList.add('attack');

  // Arena flash
  const arena = $('battle-arena');
  arena.classList.remove('flash'); void arena.offsetWidth; arena.classList.add('flash');

  // Slash effect
  const fx = $('battle-effects');
  const slash = el('div', 'battle-slash');
  fx.appendChild(slash);
  setTimeout(() => slash.remove(), 600);

  // Sparks burst on the demon side (right)
  for (let i = 0; i < 10; i++) {
    const s = el('div', 'battle-spark');
    const dx = (Math.random() - 0.5) * 220;
    const dy = -Math.random() * 180 - 20;
    s.style.setProperty('--dx', `${dx}px`);
    s.style.setProperty('--dy', `${dy}px`);
    s.style.top = '28%';
    s.style.right = `${18 + (Math.random() - 0.5) * 6}%`;
    fx.appendChild(s);
    setTimeout(() => s.remove(), 850);
  }

  // Damage popup
  const popup = el('div', 'dmg-popup' + (isCrit ? ' crit' : ''));
  popup.textContent = `−${dmg}`;
  fx.appendChild(popup);
  setTimeout(() => popup.remove(), 950);

  // Demon hit
  const demon = $('battle-demon');
  demon.classList.remove('hit'); void demon.offsetWidth; demon.classList.add('hit');

  updateBattleHp();
}

// ============================================================
// VICTORY SCENE
// ============================================================
function endBattleVictory() {
  const c = battleState.chapter;
  const boss = battleState.boss;

  // Defeat animation
  $('battle-demon').classList.add('defeated');
  sfx('victory');
  if (window.Sound) setTimeout(() => Sound.bossDefeat(c.id, boss.defeatLine), 500);

  // Apply rewards
  const battleXp = battleState.xpThisBattle;
  const quizXp = quizState ? quizState.xpThisRun : 0;
  const totalXp = battleXp + quizXp + 50; // +50 chapter clear bonus
  // Subtract any xp we previewed in quiz so we don't double-count
  if (quizXp) player.xp = Math.max(0, player.xp - quizXp);
  const leveled = applyXp(totalXp);

  if (battleState.bestStreakInBattle > player.bestStreak) player.bestStreak = battleState.bestStreakInBattle;
  player.completed[c.id] = true;
  player.sigils.push({
    chapterId: c.id,
    name: boss.reward,
    icon: c.icon,
    color: c.color,
    boss: boss.name
  });

  setTimeout(() => {
    if (leveled) sfx('levelup'); else sfx('sigil');
    const stage = $('victory-stage');
    stage.style.setProperty('--tc', c.color);
    stage.innerHTML = `
      ${leveled ? `<div class="levelup-banner">★ Level Up — now Lv ${player.level} ★</div>` : ''}
      <div class="victory-burst">
        <div class="victory-rays"></div>
        <div class="victory-sigil">${c.icon}</div>
      </div>
      <p class="eyebrow">⛧ House of ${esc(c.title.replace('House of ',''))} · Cleared ⛧</p>
      <h2 class="victory-title">${esc(boss.reward)} Earned</h2>
      <p class="victory-line">"${esc(boss.defeatLine)}"<br><span style="color:var(--pink);font-style:normal;font-family:var(--font-mono);font-size:11px;letter-spacing:0.2em">— ${esc(boss.name)}, vanquished</span></p>
      <div class="victory-rewards">
        <div class="victory-reward"><strong>+${totalXp}</strong><span>XP Earned</span></div>
        <div class="victory-reward"><strong>${battleState.bestStreakInBattle}</strong><span>Best Combo</span></div>
        <div class="victory-reward"><strong>${player.sigils.length} / ${CHAPTERS.length}</strong><span>Sigils</span></div>
      </div>
      <div class="victory-actions">
        <button class="primary-btn" id="victory-continue">${player.sigils.length >= CHAPTERS.length ? 'Complete the Initiation →' : 'Return to Map →'}</button>
      </div>
    `;
    $('victory-continue').addEventListener('click', () => {
      if (player.sigils.length >= CHAPTERS.length) {
        showComplete();
      } else {
        syncHud();
        renderMap();
        showScene('scene-map');
      }
    });
    showScene('scene-victory');
  }, 1500);
}

// ============================================================
// DEFEAT SCENE
// ============================================================
function endBattleDefeat() {
  const c = battleState.chapter;
  const boss = battleState.boss;
  sfx('defeat');
  $('defeat-title').textContent = `${boss.name} cut you down.`;
  $('defeat-lede').textContent = `${boss.threat || 'The trial broke you.'} Re-read the lesson — then come back stronger.`;
  showScene('scene-defeat');
}

function initDefeatScene() {
  $('defeat-retry').addEventListener('click', () => {
    startBattle();
  });
  $('defeat-study').addEventListener('click', () => {
    startStudy();
  });
  $('defeat-map').addEventListener('click', () => {
    syncHud();
    renderMap();
    showScene('scene-map');
  });
}

// ============================================================
// COMPLETE SCENE
// ============================================================
function showComplete() {
  const wrap = $('complete-sigils');
  wrap.innerHTML = '';
  player.sigils.forEach(s => {
    const sig = el('div', 'complete-sigil');
    sig.style.borderColor = s.color;
    sig.style.boxShadow = `0 0 30px ${s.color}`;
    sig.style.color = s.color;
    sig.textContent = s.icon;
    sig.title = s.name;
    wrap.appendChild(sig);
  });
  $('complete-xp').textContent = ((player.level - 1) * 100) + player.xp; // rough total
  $('complete-level').textContent = player.level;
  $('complete-best').textContent = player.bestStreak;
  showScene('scene-complete');
}

function initComplete() {
  $('complete-replay').addEventListener('click', () => {
    Object.assign(player, { xp: 0, level: 1, sigils: [], completed: {}, bestStreak: 0, stats: {}, mistakes: [] });
    syncHud();
    renderMap();
    showScene('scene-map');
  });
  $('complete-ledger').addEventListener('click', () => openLedger('scene-complete'));
}

// ============================================================
// LEDGER (cheat sheet)
// ============================================================
function openLedger(returnTo) {
  lastScene = returnTo || 'scene-map';
  const grid = $('ledger-grid');
  grid.innerHTML = '';
  if (typeof NUMBERS !== 'undefined' && Array.isArray(NUMBERS)) {
    NUMBERS.forEach(n => {
      const card = el('div', 'ledger-card');
      card.innerHTML = `
        <p class="ledger-num">${esc(n.num)}</p>
        <p class="ledger-label">${esc(n.label)}</p>
      `;
      grid.appendChild(card);
    });
  }
  showScene('scene-ledger');
}
function initLedger() {
  $('ledger-back').addEventListener('click', () => showScene(lastScene));
  $('ledger-print').addEventListener('click', () => window.print());
}

// ============================================================
// KEYBOARD — A–D / 1–4 answer, Enter advances, arrows page study
// ============================================================
function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if ($('hint-modal').classList.contains('open')) return; // Escape handled in initHint
    const active = document.querySelector('.scene.active');
    if (!active) return;

    // Answer with A–D or 1–4
    const k = e.key.toLowerCase();
    let idx = -1;
    if (k.length === 1 && k >= 'a' && k <= 'd') idx = k.charCodeAt(0) - 97;
    else if (k.length === 1 && k >= '1' && k <= '4') idx = Number(k) - 1;
    if (idx >= 0) {
      const opts = active.querySelectorAll('.quiz-option:not(:disabled), .battle-option:not(:disabled), .trial-option:not(:disabled)');
      if (opts.length > idx) { opts[idx].click(); e.preventDefault(); }
      return;
    }

    // Advance with Enter / Space — but a veiled key number unveils first,
    // otherwise Enter would page past the card without the recall moment.
    if (e.key === 'Enter' || e.key === ' ') {
      const veil = active.querySelector('#study-key-veil');
      if (veil) { veil.click(); e.preventDefault(); return; }
      for (const id of ['quiz-next', 'battle-next', 'trial-next', 'study-next']) {
        const btn = active.querySelector(`#${id}`);
        if (btn && !btn.classList.contains('hidden') && !btn.disabled) {
          btn.click(); e.preventDefault(); return;
        }
      }
      return;
    }

    // Study paging
    if (active.id === 'scene-study') {
      if (e.key === 'ArrowRight') { $('study-next').click(); e.preventDefault(); }
      else if (e.key === 'ArrowLeft' && !$('study-prev').disabled) { $('study-prev').click(); e.preventDefault(); }
    }
  });
}

// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initIntro();
  initMap();
  initStudy();
  initQuiz();
  initHint();
  initDefeatScene();
  initComplete();
  initLedger();
  if (window.Quests) Quests.init();
  initKeyboard();
  // start on login
  showScene('scene-login');
});
