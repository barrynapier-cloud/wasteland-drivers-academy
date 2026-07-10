// ============================================================
// WASTELAND DRIVERS ACADEMY — Trials of the Wastes
// Side-quest hub: bite-size knowledge tests separate from the
// chapter arc. Draws from the existing battle/quiz question banks.
//   • Rapid Fire — 60 seconds, beat the clock, chase a high score.
//   • Chapter Pop Quiz — 5 fast questions on any unlocked chapter.
//   • Trial of Redemption — drill ONLY the questions you've missed.
//   • The Final Reckoning — mock exam, 25 questions, 80% to pass.
// State is in-memory only (best scores reset each session).
// ============================================================
'use strict';

const Quests = (() => {
  // Session-best scores (in-memory, matches the no-localStorage rule).
  const best = { rapid: 0, pop: {}, exam: null };
  let q = null;       // active quest run
  let timerId = null;

  // ---- Build a combined question pool across every chapter ----
  // Free tier draws from chapter 1 only; the unlock opens the full bank.
  function paidTier() { return (typeof isPaid === 'function') ? isPaid() : true; }

  function allBattleQuestions() {
    const out = [];
    const allow = paidTier() ? null : ['blood'];
    if (typeof BATTLE_QUESTIONS !== 'undefined') {
      Object.keys(BATTLE_QUESTIONS).forEach(cid => {
        if (allow && !allow.includes(cid)) return;
        BATTLE_QUESTIONS[cid].forEach(item => out.push({ ...item, chapterId: cid }));
      });
    }
    // Fold in chapter quiz questions too — more variety, sign images included.
    if (typeof CHAPTERS !== 'undefined') {
      CHAPTERS.forEach(c => {
        if (allow && !allow.includes(c.id)) return;
        c.quiz.forEach(item => out.push({ ...item, chapterId: c.id }));
      });
    }
    return out;
  }

  function chapterPool(chapterId) {
    const out = [];
    if (typeof BATTLE_QUESTIONS !== 'undefined' && BATTLE_QUESTIONS[chapterId]) {
      BATTLE_QUESTIONS[chapterId].forEach(item => out.push({ ...item, chapterId }));
    }
    const c = CHAPTERS.find(x => x.id === chapterId);
    if (c) c.quiz.forEach(item => out.push({ ...item, chapterId }));
    return out;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const houseOf = (cid) => CHAPTERS.find(c => c.id === cid);
  const houseChip = (cid) => {
    const c = houseOf(cid);
    return c ? `<span class="trial-house-chip" style="--tc:${c.color}">${c.icon} ${esc(c.title.replace('House of ', ''))}</span>` : '';
  };

  // ============================================================
  // HUB
  // ============================================================
  function openHub() {
    // Pop-quiz chapters require BOTH progression and entitlement: chapter 1
    // is free, everything after needs the unlock (else a free player who
    // clears chapter 1 could reach chapter 2's paid question pool here).
    const unlocked = CHAPTERS.filter((c, i) => (i === 0 || player.completed[CHAPTERS[i - 1].id]) && (i === 0 || paidTier()));
    const nMistakes = player.mistakes.length;
    const wrap = document.getElementById('trials-grid');
    wrap.innerHTML = `
      <div class="trial-card" data-mode="rapid" style="--tc:#f59e0b">
        <div class="trial-icon">⏱</div>
        <h3 class="trial-name">Rapid Fire</h3>
        <p class="trial-desc">60 seconds. Answer as many as you can. Streaks multiply your score. No demons, just speed.</p>
        <p class="trial-best">Best this session · <strong>${best.rapid}</strong></p>
        <button class="primary-btn small trial-go">Start Run →</button>
      </div>
      <div class="trial-card" data-mode="pop" style="--tc:#a855f7">
        <div class="trial-icon">📖</div>
        <h3 class="trial-name">Chapter Pop Quiz</h3>
        <p class="trial-desc">Five fast questions on one house. Prove the lesson stuck. No boss, no HP, just knowledge.</p>
        <div class="trial-chapter-picks" id="trial-chapter-picks"></div>
      </div>
      <div class="trial-card ${nMistakes ? '' : 'trial-card-dim'}" data-mode="redeem" style="--tc:#6ee7b7">
        <div class="trial-icon">⚰️</div>
        <h3 class="trial-name">Trial of Redemption</h3>
        <p class="trial-desc">${nMistakes
          ? `Every question you've missed waits here. Answer it right and the mark is erased. Face what beat you.`
          : `No sins to atone — yet. Miss a question anywhere and it lands in this ledger.`}</p>
        <p class="trial-best">Marks against you · <strong>${nMistakes}</strong></p>
        <button class="primary-btn small trial-go" ${nMistakes ? '' : 'disabled'}>${nMistakes ? 'Atone →' : 'Nothing to Atone'}</button>
      </div>
      <div class="trial-card ${paidTier() ? '' : 'trial-card-dim'}" data-mode="exam" style="--tc:#fff7eb">
        <div class="trial-icon">🕯</div>
        <h3 class="trial-name">The Final Reckoning</h3>
        <p class="trial-desc">A mock written exam. 25 questions across all six houses, no hints, no lessons. Score 80% and you'd pass the real one.</p>
        <p class="trial-best">${paidTier() ? (best.exam != null ? `Best this session · <strong>${best.exam}%</strong>` : `Untested · <strong>—</strong>`) : 'Walking in without a mock is how people fail the real one · <strong>$20</strong>'}</p>
        <button class="primary-btn small trial-go">${paidTier() ? 'Sit the Exam →' : "🔓 Don't Test Blind →"}</button>
      </div>
    `;

    wrap.querySelector('[data-mode="rapid"] .trial-go')
      .addEventListener('click', () => { if (window.Sound) Sound.fx.start(); startRapid(); });
    const redeemBtn = wrap.querySelector('[data-mode="redeem"] .trial-go');
    if (nMistakes) redeemBtn.addEventListener('click', () => { if (window.Sound) Sound.fx.start(); startRedemption(); });
    wrap.querySelector('[data-mode="exam"] .trial-go')
      .addEventListener('click', () => {
        if (!paidTier()) { window.location.href = 'index.html#pricing'; return; }
        if (window.Sound) Sound.fx.start(); startExam();
      });

    const picks = document.getElementById('trial-chapter-picks');
    unlocked.forEach(c => {
      const b = document.createElement('button');
      b.className = 'trial-chip';
      b.style.setProperty('--tc', c.color);
      const bestPct = best.pop[c.id] != null ? ` · ${best.pop[c.id]}/5` : '';
      b.innerHTML = `${c.icon} ${esc(c.title.replace('House of ', ''))}${bestPct}`;
      b.addEventListener('click', () => { if (window.Sound) Sound.fx.start(); startPop(c.id); });
      picks.appendChild(b);
    });

    showScene('scene-trials');
  }

  // ============================================================
  // RAPID FIRE — 60s clock
  // ============================================================
  function startRapid() {
    clearInterval(timerId);
    q = {
      mode: 'rapid',
      pool: shuffle(allBattleQuestions()),
      idx: 0, score: 0, correct: 0, answered: 0,
      streak: 0, bestStreak: 0,
      timeLeft: 60, locked: false
    };
    runTimer();
    renderQuestion();
    showScene('scene-trial-run');
  }

  function runTimer() {
    updateClock();
    timerId = setInterval(() => {
      q.timeLeft--;
      updateClock();
      if (q.timeLeft <= 5 && q.timeLeft > 0 && window.Sound) Sound.fx.tick();
      if (q.timeLeft <= 0) {
        clearInterval(timerId);
        if (window.Sound) Sound.fx.timesUp();
        endRapid();
      }
    }, 1000);
  }

  function updateClock() {
    const clock = document.getElementById('trial-clock');
    if (!clock) return;
    clock.textContent = `0:${String(Math.max(0, q.timeLeft)).padStart(2, '0')}`;
    clock.classList.toggle('low', q.timeLeft <= 10);
  }

  // ============================================================
  // CHAPTER POP QUIZ — 5 questions, graded
  // ============================================================
  function startPop(chapterId) {
    clearInterval(timerId);
    const c = houseOf(chapterId);
    q = {
      mode: 'pop',
      chapterId,
      chapterTitle: c ? c.title : 'Chapter',
      color: c ? c.color : '#a855f7',
      pool: shuffle(chapterPool(chapterId)).slice(0, 5),
      idx: 0, score: 0, correct: 0, answered: 0,
      streak: 0, bestStreak: 0, locked: false
    };
    renderQuestion();
    showScene('scene-trial-run');
  }

  // ============================================================
  // TRIAL OF REDEMPTION — drill only your misses
  // ============================================================
  function startRedemption() {
    clearInterval(timerId);
    const marks = shuffle(player.mistakes).slice(0, 8);
    q = {
      mode: 'redeem',
      color: '#6ee7b7',
      pool: marks.map(m => ({ ...m.q, chapterId: m.chapterId })),
      startedWith: player.mistakes.length,
      idx: 0, score: 0, correct: 0, answered: 0,
      streak: 0, bestStreak: 0, locked: false
    };
    renderQuestion();
    showScene('scene-trial-run');
  }

  // ============================================================
  // THE FINAL RECKONING — mock exam, 25 Q, 80% to pass
  // ============================================================
  function startExam() {
    clearInterval(timerId);
    // Balanced sample: ~5 from each house, shuffled, capped at 25.
    let pool = [];
    CHAPTERS.forEach(c => { pool = pool.concat(shuffle(chapterPool(c.id)).slice(0, 5)); });
    pool = shuffle(pool).slice(0, 25);
    q = {
      mode: 'exam',
      color: '#fff7eb',
      pool,
      houseStats: {},          // per-house {a, c} for the breakdown
      idx: 0, score: 0, correct: 0, answered: 0,
      streak: 0, bestStreak: 0, locked: false
    };
    renderQuestion();
    showScene('scene-trial-run');
  }

  // ============================================================
  // Shared question renderer
  // ============================================================
  function renderQuestion() {
    q.locked = false;
    const item = q.pool[q.idx % q.pool.length];
    const stage = document.getElementById('trial-run-stage');
    const hud = document.getElementById('trial-run-hud');

    const isRapid = q.mode === 'rapid';
    if (isRapid) {
      hud.innerHTML = `<button class="ghost-btn small" id="trial-quit">← Quit</button>
         <div class="trial-clock-wrap"><span class="trial-clock" id="trial-clock">1:00</span></div>
         <div class="trial-run-stats">
           <span class="trial-score">★ <strong id="trial-score">${q.score}</strong></span>
           <span class="trial-run-streak">🔥 <strong id="trial-streak">${q.streak}</strong></span>
         </div>`;
      updateClock();
    } else {
      hud.innerHTML = `<button class="ghost-btn small" id="trial-quit">← Quit</button>
         <div class="trial-pop-progress">
           <span>Q ${q.idx + 1} / ${q.pool.length}</span>
           <div class="trial-pop-bar"><div class="trial-pop-bar-fill" style="width:${(q.idx / q.pool.length) * 100}%;--tc:${q.color}"></div></div>
         </div>
         <span class="trial-score">✓ <strong id="trial-score">${q.correct}</strong></span>`;
    }

    document.getElementById('trial-quit').addEventListener('click', quit);

    const signBlock = item.signImage
      ? `<div class="q-sign"><img src="${esc(item.signImage)}" alt="${esc(item.signLabel || 'sign')}" /><p class="q-sign-label">${tmark()} ${esc(item.signLabel || 'Sign')} ${tmark()}</p></div>`
      : '';
    const tag = { rapid: 'Rapid Fire', pop: `${esc(q.chapterTitle || '')} · Pop Quiz`, redeem: 'Trial of Redemption', exam: 'The Final Reckoning' }[q.mode];
    // Cross-house modes show which house the question belongs to — it tells
    // the player where to re-study, and context aids recall.
    const chip = (q.mode !== 'pop' && item.chapterId) ? houseChip(item.chapterId) : '';

    stage.innerHTML = `
      <p class="trial-run-topic">${tmark()} ${tag} ${tmark()}</p>
      ${chip ? `<div class="trial-house-row">${chip}</div>` : ''}
      ${signBlock}
      <p class="trial-q">${esc(item.q)}</p>
      <div class="trial-options" id="trial-options"></div>
      <div class="trial-feedback hidden" id="trial-feedback"></div>
      <button class="primary-btn hidden" id="trial-next">Next →</button>
    `;

    const opts = document.getElementById('trial-options');
    item.options.forEach((text, i) => {
      const b = document.createElement('button');
      b.className = 'trial-option';
      b.innerHTML = `<span class="letter">${String.fromCharCode(65 + i)}</span><span>${esc(text)}</span>`;
      b.addEventListener('click', () => answer(i, item));
      opts.appendChild(b);
    });
  }

  function answer(chosen, item) {
    if (q.locked) return;
    q.locked = true;
    q.answered++;

    const buttons = document.querySelectorAll('#trial-options .trial-option');
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === item.answer) b.classList.add('correct');
      else if (i === chosen) b.classList.add('wrong');
    });

    const isRight = chosen === item.answer;
    if (typeof recordAnswer === 'function') recordAnswer(item.chapterId, item, isRight);
    if (q.mode === 'exam' && item.chapterId) {
      const hs = q.houseStats[item.chapterId] || (q.houseStats[item.chapterId] = { a: 0, c: 0 });
      hs.a++; if (isRight) hs.c++;
    }

    const fb = document.getElementById('trial-feedback');

    if (isRight) {
      q.correct++;
      q.streak++;
      if (q.streak > q.bestStreak) q.bestStreak = q.streak;
      if (q.mode === 'rapid') {
        const mult = 1 + Math.min(4, q.streak - 1);
        q.score += 100 * mult;
        document.getElementById('trial-score').textContent = q.score;
      } else {
        document.getElementById('trial-score').textContent = q.correct;
      }
      if (window.Sound) {
        Sound.fx.correct();
        if (q.streak >= 2) Sound.fx.combo(q.streak);
      }
      if (q.streak >= 3 && typeof showStreakPop === 'function') showStreakPop(q.streak);
      // Exam mode: highlight only, no explanations — like the real test.
      if (q.mode !== 'exam') {
        fb.classList.remove('hidden', 'wrong'); fb.classList.add('correct');
        fb.innerHTML = `<strong>Correct.</strong> ${esc(item.explain || '')}${q.mode === 'redeem' ? '<br><span class="redeem-note">✦ Mark erased from the ledger</span>' : ''}`;
      }
    } else {
      q.streak = 0;
      if (window.Sound) Sound.fx.wrong();
      if (q.mode !== 'exam') {
        fb.classList.remove('hidden', 'correct'); fb.classList.add('wrong');
        fb.innerHTML = `<strong>Wrong.</strong> ${esc(item.explain || '')}`;
      }
    }
    if (q.mode === 'rapid') document.getElementById('trial-streak').textContent = q.streak;

    // Flow control per mode:
    //  • Rapid + correct → fast auto-advance, keep the run hot.
    //  • Rapid + wrong  → freeze the clock so the explanation actually gets read.
    //  • Everything else → tap to continue.
    if (q.mode === 'rapid' && isRight) {
      q.idx++;
      setTimeout(() => { if (q && q.mode === 'rapid' && q.timeLeft > 0) renderQuestion(); }, 650);
    } else if (q.mode === 'rapid') {
      clearInterval(timerId); // clock stops — read the lesson, no time lost
      const next = document.getElementById('trial-next');
      next.classList.remove('hidden');
      next.textContent = 'Resume the Clock →';
      next.onclick = () => {
        q.idx++;
        if (q.timeLeft > 0) { runTimer(); renderQuestion(); }
        else endRapid();
      };
    } else {
      const next = document.getElementById('trial-next');
      next.classList.remove('hidden');
      next.textContent = (q.idx + 1 >= q.pool.length)
        ? (q.mode === 'exam' ? 'Face the Verdict →' : 'See Score →')
        : 'Next →';
      next.onclick = () => {
        q.idx++;
        if (q.idx >= q.pool.length) {
          if (q.mode === 'pop') endPop();
          else if (q.mode === 'redeem') endRedemption();
          else endExam();
        } else renderQuestion();
      };
    }
  }

  // ============================================================
  // End screens
  // ============================================================
  function endRapid() {
    if (q.score > best.rapid) best.rapid = q.score;
    const acc = q.answered ? Math.round((q.correct / q.answered) * 100) : 0;
    const xp = Math.round(q.score / 20);
    if (typeof applyXp === 'function') { applyXp(xp); if (typeof syncHud === 'function') syncHud(); }
    if (q.bestStreak > player.bestStreak) player.bestStreak = q.bestStreak;
    if (window.Sound) Sound.fx.victory();

    document.getElementById('trial-result').innerHTML = `
      <p class="eyebrow" style="color:#f59e0b">⏱ Rapid Fire · Time</p>
      <h2 class="trial-result-title">${q.score} points</h2>
      <div class="trial-result-stats">
        <div><strong>${q.correct}</strong><span>Correct</span></div>
        <div><strong>${acc}%</strong><span>Accuracy</span></div>
        <div><strong>${q.bestStreak}</strong><span>Best Streak</span></div>
        <div><strong>+${xp}</strong><span>XP</span></div>
      </div>
      <p class="trial-result-foot">${q.score >= best.rapid ? `${tmark()} New session best ${tmark()}` : `Session best · ${best.rapid}`}</p>
      <div class="trial-result-actions">
        <button class="primary-btn" id="trial-again">Run Again ↺</button>
        <button class="ghost-btn" id="trial-hub">← Trials</button>
      </div>
    `;
    wireResult(() => startRapid());
    showScene('scene-trial-result');
  }

  function endPop() {
    const total = q.pool.length;
    best.pop[q.chapterId] = Math.max(best.pop[q.chapterId] || 0, q.correct);
    const xp = q.correct * 8;
    if (typeof applyXp === 'function') { applyXp(xp); if (typeof syncHud === 'function') syncHud(); }
    if (q.bestStreak > player.bestStreak) player.bestStreak = q.bestStreak;
    const passed = q.correct >= 4;
    if (window.Sound) passed ? Sound.fx.victory() : Sound.fx.defeat();

    document.getElementById('trial-result').innerHTML = `
      <p class="eyebrow" style="color:${q.color}">📖 ${esc(q.chapterTitle)} · Pop Quiz</p>
      <h2 class="trial-result-title">${q.correct} / ${total}</h2>
      <p class="trial-result-grade">${passed ? `${tmark()} The lesson holds ${tmark()}` : 'Re-read the chapter. The numbers slipped.'}</p>
      <div class="trial-result-stats">
        <div><strong>${Math.round((q.correct / total) * 100)}%</strong><span>Score</span></div>
        <div><strong>${q.bestStreak}</strong><span>Best Streak</span></div>
        <div><strong>+${xp}</strong><span>XP</span></div>
      </div>
      <div class="trial-result-actions">
        <button class="primary-btn" id="trial-again">Retry ↺</button>
        <button class="ghost-btn" id="trial-hub">← Trials</button>
      </div>
    `;
    wireResult(() => startPop(q.chapterId));
    showScene('scene-trial-result');
  }

  function endRedemption() {
    const drilled = q.pool.length;
    const redeemed = q.correct; // each correct answer erased its mark
    const remaining = player.mistakes.length;
    const xp = redeemed * 12;   // atonement pays better than fresh questions
    if (typeof applyXp === 'function') { applyXp(xp); if (typeof syncHud === 'function') syncHud(); }
    if (q.bestStreak > player.bestStreak) player.bestStreak = q.bestStreak;
    const clean = remaining === 0;
    if (window.Sound) clean ? Sound.fx.victory() : Sound.fx.sigil();

    document.getElementById('trial-result').innerHTML = `
      <p class="eyebrow" style="color:#6ee7b7">⚰️ Trial of Redemption</p>
      <h2 class="trial-result-title">${redeemed} / ${drilled} redeemed</h2>
      <p class="trial-result-grade">${clean
        ? `${tmark()} The ledger is clean. Nothing haunts you. ${tmark()}`
        : `${remaining} mark${remaining === 1 ? '' : 's'} still against you. Return and atone.`}</p>
      <div class="trial-result-stats">
        <div><strong>${redeemed}</strong><span>Erased</span></div>
        <div><strong>${remaining}</strong><span>Remaining</span></div>
        <div><strong>+${xp}</strong><span>XP</span></div>
      </div>
      <div class="trial-result-actions">
        ${remaining ? '<button class="primary-btn" id="trial-again">Atone Again ↺</button>' : ''}
        <button class="ghost-btn" id="trial-hub">← Trials</button>
      </div>
    `;
    wireResult(remaining ? (() => startRedemption()) : null);
    showScene('scene-trial-result');
  }

  function endExam() {
    const total = q.pool.length;
    const pct = total ? Math.round((q.correct / total) * 100) : 0;
    if (best.exam == null || pct > best.exam) best.exam = pct;
    const passed = pct >= 80;
    const missed = q.answered - q.correct;
    const xp = q.correct * 4 + (passed ? 60 : 0);
    if (typeof applyXp === 'function') { applyXp(xp); if (typeof syncHud === 'function') syncHud(); }
    if (q.bestStreak > player.bestStreak) player.bestStreak = q.bestStreak;
    if (window.Sound) passed ? Sound.fx.victory() : Sound.fx.defeat();

    // Per-house breakdown, weakest first flagged
    const rows = CHAPTERS
      .map(c => ({ c, s: q.houseStats[c.id] }))
      .filter(r => r.s && r.s.a > 0)
      .map(r => ({ ...r, pct: Math.round((r.s.c / r.s.a) * 100) }));
    const weakest = rows.length ? rows.reduce((a, b) => (b.pct < a.pct ? b : a)) : null;
    const breakdown = rows.map(r => `
      <div class="exam-house-row${weakest && r.c.id === weakest.c.id && r.pct < 100 ? ' weakest' : ''}">
        <span class="exam-house-name" style="color:${r.c.color}">${r.c.icon} ${esc(r.c.title.replace('House of ', ''))}</span>
        <div class="exam-house-bar"><div class="exam-house-fill" style="width:${r.pct}%;background:${r.c.color}"></div></div>
        <span class="exam-house-pct">${r.s.c}/${r.s.a}</span>
      </div>`).join('');

    document.getElementById('trial-result').innerHTML = `
      <p class="eyebrow" style="color:#fff7eb">🕯 The Final Reckoning</p>
      <h2 class="trial-result-title">${pct}%</h2>
      <p class="trial-result-grade">${passed
        ? `${tmark()} VERDICT: PASS. You would survive the DOL. ${tmark()}`
        : `VERDICT: FALL — the real exam demands 80%. You scored ${pct}%.`}</p>
      <div class="exam-breakdown">${breakdown}</div>
      ${weakest && weakest.pct < 100 ? `<p class="trial-result-foot">Weakest house · <strong style="color:${weakest.c.color}">${esc(weakest.c.title)}</strong> — re-study it, then atone.</p>` : ''}
      ${missed ? `<p class="trial-result-foot">${missed} miss${missed === 1 ? '' : 'es'} added to the Trial of Redemption.</p>` : ''}
      <div class="trial-result-stats">
        <div><strong>${q.correct}/${total}</strong><span>Correct</span></div>
        <div><strong>${q.bestStreak}</strong><span>Best Streak</span></div>
        <div><strong>+${xp}</strong><span>XP</span></div>
      </div>
      <div class="trial-result-actions">
        <button class="primary-btn" id="trial-again">Resit ↺</button>
        <button class="ghost-btn" id="trial-hub">← Trials</button>
      </div>
    `;
    wireResult(() => startExam());
    showScene('scene-trial-result');
  }

  function wireResult(again) {
    const againBtn = document.getElementById('trial-again');
    if (againBtn && again) againBtn.addEventListener('click', () => { if (window.Sound) Sound.fx.start(); again(); });
    document.getElementById('trial-hub').addEventListener('click', () => { if (window.Sound) Sound.fx.ui(); openHub(); });
  }

  function quit() {
    clearInterval(timerId);
    if (window.Sound) Sound.fx.ui();
    openHub();
  }

  function init() {
    const back = document.getElementById('trials-back');
    if (back) back.addEventListener('click', () => {
      if (window.Sound) Sound.fx.ui();
      if (typeof syncHud === 'function') syncHud();
      showScene('scene-map');
    });
  }

  return { openHub, init };
})();
