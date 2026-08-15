// ==========================================================================
// RED LIGHT CODE RACE // PURE VANILLA JAVASCRIPT GAME ENGINE
// 100% Standalone - No Node, No NPM, No Vite, No Build Step Required
// ==========================================================================

// --- Challenge Code Snippets ---
const CODE_SNIPPETS = [
  {
    id: 'html-boilerplate',
    title: 'HTML5 Standard Boilerplate',
    difficulty: 'EASY',
    language: 'html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber Race</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main class="container">
    <h1>Red Light Code Race</h1>
    <p>Type fast, stop on red!</p>
  </main>
  <script src="main.js"></script>
</body>
</html>`,
    description: 'The fundamental HTML5 boilerplate structure required for modern web applications.'
  },
  {
    id: 'cyber-login-form',
    title: 'Cyberpunk Auth Interface',
    difficulty: 'MEDIUM',
    language: 'html',
    code: `<form class="cyber-card p-6 bg-slate-900 border border-cyan-500/50 rounded-xl">
  <h2 class="text-xl font-bold text-cyan-400 mb-4">NET ACCESS</h2>
  <div class="mb-4">
    <label for="handle" class="block text-xs uppercase tracking-wider text-slate-400">Agent Handle</label>
    <input type="text" id="handle" name="handle" required class="w-full bg-slate-950 border border-slate-700 px-3 py-2 text-emerald-400 focus:outline-none focus:border-cyan-400" />
  </div>
  <button type="submit" class="w-full py-2 bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400">
    AUTHENTICATE
  </button>
</form>`,
    description: 'Tactical login interface snippet using Tailwind classes.'
  },
  {
    id: 'full-html5-app',
    title: 'Modern SPA Shell',
    difficulty: 'HARD',
    language: 'html',
    code: `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cyber Matrix Protocol</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 flex flex-col min-h-screen">
  <header class="h-16 border-b border-slate-800 flex items-center justify-between px-6">
    <span class="font-mono text-emerald-400 font-bold">SYSTEM // ACTIVE</span>
  </header>
  <div id="app" class="flex-1 p-8 grid grid-cols-2 gap-4">
    <div class="bg-slate-900 border border-slate-800 rounded-lg p-4"></div>
  </div>
</body>
</html>`,
    description: 'Full Single Page Application HTML markup layout with external scripts.'
  }
];

// --- Web Audio API Sound Synthesizer ---
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  playGreenLight() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx.currentTime + 0.2); // C6

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      // Audio fallback
    }
  }

  playRedLight() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime); // A3
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.25); // A2

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      // Audio fallback
    }
  }

  playKeyPress() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // Audio fallback
    }
  }

  playRedWarningKey() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      // Audio fallback
    }
  }

  playViolation() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.setValueAtTime(220, now + 0.15);
      osc1.frequency.setValueAtTime(440, now + 0.3);

      osc2.frequency.setValueAtTime(480, now);
      osc2.frequency.setValueAtTime(240, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      // Audio fallback
    }
  }

  playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const startTime = this.ctx.currentTime + idx * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {
      // Audio fallback
    }
  }
}

const soundFx = new SoundManager();

// --- HTML5 Canvas Confetti Particle System ---
function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const width = (canvas.width = window.innerWidth * dpr);
  const height = (canvas.height = window.innerHeight * dpr);

  const colors = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899', '#38bdf8'];
  const particleCount = 120;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width * (0.4 + Math.random() * 0.2),
      y: height * 0.65,
      vx: (Math.random() - 0.5) * 22 * dpr,
      vy: (-Math.random() * 18 - 8) * dpr,
      size: (Math.random() * 8 + 4) * dpr,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      decay: Math.random() * 0.015 + 0.008,
      gravity: 0.45 * dpr,
    });
  }

  let animationFrameId;

  function render() {
    ctx.clearRect(0, 0, width, height);
    let activeCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity <= 0) continue;

      activeCount++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }

    if (activeCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  render();
}

// --- Application State ---
const state = {
  gameState: 'IDLE', // 'IDLE' | 'PLAYING' | 'FINISHED'
  lightState: 'GREEN', // 'GREEN' | 'RED'
  playerName: 'NET_RUNNER_01',
  selectedSnippetIndex: 0,
  userCode: '',
  redLightViolations: 0,
  redKeyPresses: 0,
  redKeyPenalty: 0,
  scoreWiped: false,
  isMuted: false,
  
  // Timing & Telemetry
  raceStartTime: null,
  liveElapsedTime: 0,
  finalTimeTaken: 0,
  finalScore: 0,
  
  // Ghost Multiplayer Racers
  ghosts: [
    { id: '1', name: 'CYBER_SAMURAI_99', colorClass: 'color-samurai', progress: 0, cpm: 320, violations: 0, isStopped: false },
    { id: '2', name: 'NEON_CODER_X', colorClass: 'color-neon', progress: 0, cpm: 280, violations: 0, isStopped: false },
    { id: '3', name: 'GLITCH_HACKER', colorClass: 'color-glitch', progress: 0, cpm: 350, violations: 0, isStopped: false }
  ]
};

// Timer & Interval references
let lightTimeoutId = null;
let liveTimerIntervalId = null;
let continuousCheckIntervalId = null;
let ghostSimulationIntervalId = null;

// DOM Element References
const elements = {
  // HUD
  playerNameDisplay: document.getElementById('player-name-display'),
  playerNameBtn: document.getElementById('player-name-btn'),
  playerNameInput: document.getElementById('player-name-input'),
  scoreValue: document.getElementById('hud-score-value'),
  correctValue: document.getElementById('hud-correct-value'),
  accuracyValue: document.getElementById('hud-accuracy-value'),
  violationsValue: document.getElementById('hud-violations-value'),
  violationsCard: document.getElementById('hud-violations-card'),
  signalBeacon: document.getElementById('signal-beacon'),
  signalText: document.getElementById('signal-beacon-text'),
  btnStartGame: document.getElementById('btn-start-game'),
  btnResetGame: document.getElementById('btn-reset-game'),
  btnToggleMute: document.getElementById('btn-toggle-mute'),
  
  // Sub-header Telemetry
  snippetSelectorContainer: document.getElementById('snippet-selector-container'),
  telemetrySpeed: document.getElementById('telemetry-speed'),
  telemetryTime: document.getElementById('telemetry-time'),
  
  // Arena
  arenaCard: document.getElementById('arena-card'),
  arenaTitle: document.getElementById('arena-title'),
  arenaLanguage: document.getElementById('arena-language'),
  arenaStatusBadge: document.getElementById('arena-status-badge'),
  refCharsCount: document.getElementById('ref-chars-count'),
  refLineNumbers: document.getElementById('ref-line-numbers'),
  refCodeDisplay: document.getElementById('ref-code-display'),
  workspaceLineNumbers: document.getElementById('workspace-line-numbers'),
  workspaceTextarea: document.getElementById('workspace-textarea'),
  workspaceStatusText: document.getElementById('workspace-status-text'),
  btnSubmitCode: document.getElementById('btn-submit-code'),
  violationFlashOverlay: document.getElementById('violation-flash-overlay'),
  violationFlashTotal: document.getElementById('violation-flash-total'),
  
  // Leaderboard
  leaderboardList: document.getElementById('leaderboard-list'),
  
  // Modal
  missionModal: document.getElementById('mission-complete-modal'),
  modalPlayerName: document.getElementById('modal-player-name'),
  modalGradeBadge: document.getElementById('modal-grade-badge'),
  modalFinalScore: document.getElementById('modal-final-score'),
  modalTimeTaken: document.getElementById('modal-time-taken'),
  modalCorrectChars: document.getElementById('modal-correct-chars'),
  modalAccuracy: document.getElementById('modal-accuracy'),
  modalViolations: document.getElementById('modal-violations'),
  modalViolationsCard: document.getElementById('modal-violations-card'),
  btnTryAgain: document.getElementById('btn-try-again'),
  btnNextRace: document.getElementById('btn-next-race'),
  btnShareTelemetry: document.getElementById('btn-share-telemetry'),
};

// --- Helper Functions ---
function getActiveSnippet() {
  return CODE_SNIPPETS[state.selectedSnippetIndex];
}

function getCorrectCharactersCount() {
  const activeSnippet = getActiveSnippet();
  const refChars = activeSnippet.code.split('');
  const userChars = state.userCode.split('');
  let count = 0;
  for (let i = 0; i < Math.min(refChars.length, userChars.length); i++) {
    if (refChars[i] === userChars[i]) count++;
  }
  return count;
}

function calculateAccuracy() {
  const activeSnippet = getActiveSnippet();
  const correctCount = getCorrectCharactersCount();
  if (state.userCode.length === 0) return 100;
  return Math.min(100, Math.round((correctCount / Math.max(state.userCode.length, activeSnippet.code.length)) * 100));
}

function calculateLiveScore() {
  if (state.gameState !== 'PLAYING' || state.scoreWiped) return 0;
  const correctCount = getCorrectCharactersCount();
  if (correctCount === 0) return 0;
  const elapsed = Math.max(0.5, state.liveElapsedTime);
  const speedBonus = Math.round((correctCount / elapsed) * 50);
  const baseScore = (correctCount * 10) + speedBonus;
  const rawScore = baseScore - (state.redLightViolations * 50) - state.redKeyPenalty;
  return Math.max(0, Math.round(rawScore));
}

function calculateLiveCpm() {
  if (state.liveElapsedTime <= 0) return 0;
  return Math.round((state.userCode.length / state.liveElapsedTime) * 60);
}

// --- Render Methods ---
function renderSnippetTabs() {
  if (!elements.snippetSelectorContainer) return;
  elements.snippetSelectorContainer.innerHTML = '';
  CODE_SNIPPETS.forEach((snippet, index) => {
    const btn = document.createElement('button');
    btn.className = `snippet-btn ${state.selectedSnippetIndex === index ? 'active' : ''}`;
    btn.textContent = snippet.title;
    btn.disabled = state.gameState !== 'IDLE';
    btn.addEventListener('click', () => {
      if (state.gameState === 'IDLE') {
        state.selectedSnippetIndex = index;
        renderSnippetTabs();
        renderReferenceCode();
        updateHUD();
      }
    });
    elements.snippetSelectorContainer.appendChild(btn);
  });
}

function renderReferenceCode() {
  const activeSnippet = getActiveSnippet();
  const refChars = activeSnippet.code.split('');
  const userChars = state.userCode.split('');
  
  // Calculate line numbers
  const refLines = activeSnippet.code.split('\n');
  const userLines = state.userCode.split('\n');
  const maxLineCount = Math.max(refLines.length, userLines.length, 14);
  
  let lineNumbersHtml = '';
  for (let i = 1; i <= maxLineCount; i++) {
    lineNumbersHtml += `<div>${i}</div>`;
  }
  elements.refLineNumbers.innerHTML = lineNumbersHtml;
  elements.workspaceLineNumbers.innerHTML = lineNumbersHtml;

  // Character-by-character syntax / diff highlight
  let highlightedHtml = '';
  for (let i = 0; i < refChars.length; i++) {
    const char = refChars[i];
    let styleClass = 'char-untyped';
    const isCurrentCursor = (i === userChars.length && state.gameState === 'PLAYING');

    if (i < userChars.length) {
      if (userChars[i] === char) {
        styleClass = 'char-correct';
      } else {
        styleClass = 'char-error';
      }
    }

    let displayChar = char;
    if (char === '\n') {
      displayChar = '↵\n';
    } else if (char === '&') {
      displayChar = '&amp;';
    } else if (char === '<') {
      displayChar = '&lt;';
    } else if (char === '>') {
      displayChar = '&gt;';
    } else if (char === '"') {
      displayChar = '&quot;';
    }

    highlightedHtml += `<span class="${styleClass} ${isCurrentCursor ? 'char-cursor' : ''}">${displayChar}</span>`;
  }

  elements.refCodeDisplay.innerHTML = highlightedHtml;
  elements.refCharsCount.textContent = `${activeSnippet.code.length} CHARS`;
  elements.arenaTitle.textContent = `ARENA PROTOCOL // ${activeSnippet.title}`;
  elements.arenaLanguage.textContent = activeSnippet.language.toUpperCase();
}

function updateHUD() {
  const activeSnippet = getActiveSnippet();
  const correctChars = getCorrectCharactersCount();
  const totalChars = activeSnippet.code.length;
  const accuracy = calculateAccuracy();
  const score = state.gameState === 'FINISHED' ? state.finalScore : calculateLiveScore();
  const cpm = calculateLiveCpm();

  // Metric displays
  elements.scoreValue.textContent = score;
  elements.correctValue.innerHTML = `${correctChars}<span style="color:#64748b;font-size:0.75rem;font-weight:400;">/${totalChars}</span>`;
  elements.accuracyValue.textContent = `${accuracy}%`;
  elements.violationsValue.textContent = state.redLightViolations;

  if (state.redLightViolations > 0) {
    elements.violationsCard.classList.add('has-violations');
  } else {
    elements.violationsCard.classList.remove('has-violations');
  }

  // Telemetry Bar
  elements.telemetrySpeed.textContent = `${cpm} CPM`;
  elements.telemetryTime.textContent = `${state.liveElapsedTime.toFixed(1)}s`;

  // Start / Reset buttons visibility
  if (state.gameState === 'IDLE') {
    elements.btnStartGame.style.display = 'inline-flex';
    elements.btnResetGame.style.display = 'none';
  } else {
    elements.btnStartGame.style.display = 'none';
    elements.btnResetGame.style.display = 'inline-flex';
  }

  // Signal Beacon status
  elements.signalBeacon.className = 'signal-beacon-pill';
  if (state.gameState === 'IDLE') {
    elements.signalBeacon.classList.add('signal-idle');
    elements.signalText.textContent = 'SIGNAL STANDBY';
  } else if (state.lightState === 'GREEN') {
    elements.signalBeacon.classList.add('signal-green');
    elements.signalText.textContent = 'GREEN LIGHT // WRITE';
  } else {
    elements.signalBeacon.classList.add('signal-red');
    elements.signalText.textContent = 'RED LIGHT // STOP!';
  }

  // Arena Card Glow & Badges
  elements.arenaCard.className = 'arena-card';
  if (state.gameState === 'IDLE') {
    elements.arenaCard.classList.add('arena-idle');
  } else if (state.lightState === 'GREEN') {
    elements.arenaCard.classList.add('arena-green');
  } else {
    elements.arenaCard.classList.add('arena-red');
  }

  if (state.lightState === 'GREEN') {
    elements.arenaStatusBadge.className = 'arena-status-badge badge-green';
    elements.arenaStatusBadge.innerHTML = `<span class="signal-indicator-dot" style="background:#10b981;animation:pulse-dot 1.2s infinite"></span> INPUT UNLOCKED`;
    elements.workspaceStatusText.textContent = 'STATUS: READY FOR SUBMISSION';
  } else {
    elements.arenaStatusBadge.className = 'arena-status-badge badge-red';
    elements.arenaStatusBadge.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> WORKSPACE LOCKED`;
    elements.workspaceStatusText.textContent = 'STATUS: LOCKED ON RED';
  }

  // Textarea state & placeholder
  elements.workspaceTextarea.readOnly = (state.gameState !== 'PLAYING' || state.lightState === 'RED');
  elements.workspaceTextarea.disabled = (state.gameState !== 'PLAYING');
  
  if (state.gameState === 'IDLE') {
    elements.workspaceTextarea.placeholder = 'Press "START RACE" above to initiate signal telemetry...';
  } else if (state.lightState === 'RED') {
    elements.workspaceTextarea.placeholder = '🔒 WORKSPACE LOCKED (RED LIGHT). STOP TYPING!';
  } else {
    elements.workspaceTextarea.placeholder = 'Start typing reference code here...';
  }

  // Submit button enablement
  const canSubmit = (state.gameState === 'PLAYING' && state.lightState === 'GREEN' && state.userCode.trim().length > 0);
  elements.btnSubmitCode.disabled = !canSubmit;
}

function renderLeaderboard() {
  const activeSnippet = getActiveSnippet();
  const playerProgress = Math.min(100, (state.userCode.length / activeSnippet.code.length) * 100);

  const allRacers = [
    { id: 'player', name: `${state.playerName} (YOU)`, progress: playerProgress, violations: state.redLightViolations, isPlayer: true, colorClass: 'color-player' },
    ...state.ghosts.map(g => ({ id: g.id, name: g.name, progress: g.progress, violations: g.violations, isPlayer: false, colorClass: g.colorClass }))
  ].sort((a, b) => b.progress - a.progress);

  elements.leaderboardList.innerHTML = '';

  allRacers.forEach((racer, index) => {
    const row = document.createElement('div');
    row.className = `racer-row ${racer.isPlayer ? 'is-player' : ''}`;

    const rankNumber = `#0${index + 1}`;
    const rankFirstClass = index === 0 ? 'rank-first' : '';

    row.innerHTML = `
      <div class="racer-info-bar">
        <div class="racer-left-meta">
          <span class="racer-rank-badge ${rankFirstClass}">${rankNumber}</span>
          <span class="racer-name">${racer.name}</span>
          ${racer.isPlayer ? '<span class="racer-you-badge">YOU</span>' : ''}
        </div>
        <div style="display:flex;align-items:center;gap:12px;color:#94a3b8;font-size:0.6875rem;">
          ${racer.violations > 0 ? `<span style="color:#f87171;font-weight:700;">⚠ ${racer.violations} ERR</span>` : ''}
          <span style="font-weight:700;color:#f8fafc;">${Math.round(racer.progress)}%</span>
        </div>
      </div>
      <div class="racer-track-container">
        <div class="racer-progress-bar ${racer.colorClass}" style="width: ${Math.min(100, Math.max(0, racer.progress))}%"></div>
      </div>
    `;

    elements.leaderboardList.appendChild(row);
  });
}

// --- Game Logic & Penalty Engine ---
function triggerViolation(reason) {
  // 1. Clear workspace code completely
  state.userCode = '';
  elements.workspaceTextarea.value = '';

  // 2. Clear entire score / mark as requested ("AND THE MARK ALSO")
  state.scoreWiped = true;
  state.finalScore = 0;
  state.redKeyPenalty = 0;

  // 3. Increment violations
  state.redLightViolations++;

  // 4. Reset red trackers
  state.redKeyPresses = 0;

  // 5. Show brief red flash animation & sound
  elements.violationFlashTotal.textContent = `CODE & SCORE CLEARED | TOTAL VIOLATIONS: ${state.redLightViolations}`;
  elements.violationFlashOverlay.style.display = 'flex';
  soundFx.playViolation();

  setTimeout(() => {
    elements.violationFlashOverlay.style.display = 'none';
  }, 1200);

  renderReferenceCode();
  updateHUD();
  renderLeaderboard();
}

function scheduleNextLightChange() {
  if (state.gameState !== 'PLAYING') return;

  const isCurrentlyGreen = (state.lightState === 'GREEN');
  const nextState = isCurrentlyGreen ? 'RED' : 'GREEN';

  // Random duration: GREEN (4000ms - 9000ms), RED (3000ms - 7000ms)
  const nextDuration = nextState === 'GREEN'
    ? Math.floor(Math.random() * 5000) + 4000
    : Math.floor(Math.random() * 4000) + 3000;

  lightTimeoutId = setTimeout(() => {
    state.lightState = nextState;
    state.redKeyPresses = 0;
    state.redInteractionStartTime = null;

    if (nextState === 'GREEN') {
      soundFx.playGreenLight();
      if (elements.workspaceTextarea) {
        elements.workspaceTextarea.focus();
      }
    } else {
      soundFx.playRedLight();
    }

    updateHUD();
    renderReferenceCode();
    scheduleNextLightChange();
  }, nextDuration);
}

function startGame() {
  state.gameState = 'PLAYING';
  state.lightState = 'GREEN';
  state.userCode = '';
  state.redLightViolations = 0;
  state.redKeyPresses = 0;
  state.redKeyPenalty = 0;
  state.scoreWiped = false;
  state.raceStartTime = Date.now();
  state.liveElapsedTime = 0;

  elements.workspaceTextarea.value = '';
  elements.missionModal.classList.add('hidden');

  soundFx.playGreenLight();

  // Start live timer interval
  if (liveTimerIntervalId) clearInterval(liveTimerIntervalId);
  liveTimerIntervalId = setInterval(() => {
    if (state.gameState === 'PLAYING' && state.raceStartTime) {
      state.liveElapsedTime = (Date.now() - state.raceStartTime) / 1000;
      updateHUD();
    }
  }, 100);

  // Start Ghost simulation interval
  if (ghostSimulationIntervalId) clearInterval(ghostSimulationIntervalId);
  ghostSimulationIntervalId = setInterval(() => {
    if (state.gameState !== 'PLAYING') return;

    state.ghosts.forEach(racer => {
      if (state.lightState === 'RED') {
        const randomViolation = Math.random() < 0.03;
        if (randomViolation) {
          racer.progress = Math.max(0, racer.progress - 15);
          racer.violations += 1;
        }
        racer.isStopped = true;
      } else {
        const increment = (racer.cpm / 60) * (0.3 + Math.random() * 0.4);
        racer.progress = Math.min(98, racer.progress + increment);
        racer.isStopped = false;
      }
    });

    renderLeaderboard();
  }, 400);

  // Schedule first light cycle
  clearTimeout(lightTimeoutId);
  scheduleNextLightChange();

  renderSnippetTabs();
  renderReferenceCode();
  updateHUD();
  renderLeaderboard();

  setTimeout(() => {
    elements.workspaceTextarea.focus();
  }, 50);
}

function resetGame() {
  state.gameState = 'IDLE';
  state.lightState = 'GREEN';
  state.userCode = '';
  state.redLightViolations = 0;
  state.redKeyPresses = 0;
  state.redKeyPenalty = 0;
  state.scoreWiped = false;
  state.raceStartTime = null;
  state.liveElapsedTime = 0;

  clearTimeout(lightTimeoutId);
  clearInterval(liveTimerIntervalId);
  clearInterval(ghostSimulationIntervalId);

  state.ghosts.forEach(g => {
    g.progress = 0;
    g.violations = 0;
    g.isStopped = false;
  });

  elements.workspaceTextarea.value = '';
  elements.missionModal.classList.add('hidden');

  renderSnippetTabs();
  renderReferenceCode();
  updateHUD();
  renderLeaderboard();
}

function submitCode() {
  if (state.gameState !== 'PLAYING' || state.lightState !== 'GREEN') return;

  const endTime = Date.now();
  const timeTaken = Math.max(0.5, (endTime - (state.raceStartTime || endTime)) / 1000);
  state.finalTimeTaken = timeTaken;

  if (state.scoreWiped) {
    state.finalScore = 0;
  } else {
    const activeSnippet = getActiveSnippet();
    const refChars = activeSnippet.code.split('');
    const userChars = state.userCode.split('');
    let correctCount = 0;

    for (let i = 0; i < Math.min(refChars.length, userChars.length); i++) {
      if (refChars[i] === userChars[i]) correctCount++;
    }

    const speedBonus = Math.round((correctCount / timeTaken) * 50);
    const baseScore = (correctCount * 10) + speedBonus;
    const rawScore = baseScore - (state.redLightViolations * 50) - state.redKeyPenalty;
    state.finalScore = Math.max(0, Math.round(rawScore));
  }

  state.gameState = 'FINISHED';
  clearTimeout(lightTimeoutId);
  clearInterval(liveTimerIntervalId);
  clearInterval(ghostSimulationIntervalId);

  soundFx.playVictory();
  launchConfetti();
  showMissionCompleteModal();
  updateHUD();
}

function getGrade(score, accuracy, violations) {
  if (score >= 400 && accuracy >= 98 && violations === 0) return { title: 'SSS RANK', class: 'grade-sss' };
  if (score >= 250 && accuracy >= 90) return { title: 'S RANK', class: 'grade-s' };
  if (score >= 150) return { title: 'A RANK', class: 'grade-a' };
  if (score >= 80) return { title: 'B RANK', class: 'grade-b' };
  return { title: 'C RANK', class: 'grade-c' };
}

function showMissionCompleteModal() {
  const accuracy = calculateAccuracy();
  const correctCount = getCorrectCharactersCount();
  const grade = getGrade(state.finalScore, accuracy, state.redLightViolations);

  elements.modalPlayerName.textContent = state.playerName;
  elements.modalFinalScore.textContent = state.finalScore;
  elements.modalGradeBadge.textContent = grade.title;
  elements.modalGradeBadge.className = `modal-grade-pill ${grade.class}`;

  elements.modalTimeTaken.textContent = `${state.finalTimeTaken.toFixed(1)}s`;
  elements.modalCorrectChars.textContent = correctCount;
  elements.modalAccuracy.textContent = `${accuracy}%`;
  elements.modalViolations.textContent = state.redLightViolations;

  if (state.redLightViolations > 0) {
    elements.modalViolationsCard.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    elements.modalViolationsCard.style.background = 'rgba(127, 29, 29, 0.2)';
    elements.modalViolations.style.color = '#ef4444';
  } else {
    elements.modalViolationsCard.style.borderColor = 'var(--border-subtle)';
    elements.modalViolationsCard.style.background = 'rgba(2, 6, 23, 0.65)';
    elements.modalViolations.style.color = '#f8fafc';
  }

  elements.missionModal.classList.remove('hidden');
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  // Start / Reset / Mute Buttons
  elements.btnStartGame.addEventListener('click', startGame);
  elements.btnResetGame.addEventListener('click', resetGame);
  
  elements.btnToggleMute.addEventListener('click', () => {
    const isMuted = soundFx.toggleMute();
    state.isMuted = isMuted;
    if (isMuted) {
      elements.btnToggleMute.classList.remove('btn-mute-active');
      elements.btnToggleMute.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      elements.btnToggleMute.title = 'Unmute SFX';
    } else {
      elements.btnToggleMute.classList.add('btn-mute-active');
      elements.btnToggleMute.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
      elements.btnToggleMute.title = 'Mute SFX';
    }
  });

  // Player Name Editing
  elements.playerNameBtn.addEventListener('click', () => {
    elements.playerNameBtn.style.display = 'none';
    elements.playerNameInput.style.display = 'inline-block';
    elements.playerNameInput.value = state.playerName;
    elements.playerNameInput.focus();
    elements.playerNameInput.select();
  });

  function savePlayerName() {
    const val = elements.playerNameInput.value.trim().toUpperCase();
    if (val) {
      state.playerName = val;
      elements.playerNameDisplay.textContent = val;
    }
    elements.playerNameInput.style.display = 'none';
    elements.playerNameBtn.style.display = 'inline-flex';
    renderLeaderboard();
  }

  elements.playerNameInput.addEventListener('blur', savePlayerName);
  elements.playerNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      savePlayerName();
    }
  });

  // Workspace Keydown Interception (STRICT PENALTY ENGINE)
  elements.workspaceTextarea.addEventListener('keydown', (e) => {
    if (state.gameState !== 'PLAYING') return;

    if (state.lightState === 'RED') {
      // 1. Intercept key during RED light (prevent typing into textarea)
      e.preventDefault();
      e.stopPropagation();

      state.redKeyPresses++;

      // 2. 6th character on RED (>5): Clear entire code AND score/mark!
      if (state.redKeyPresses > 5) {
        triggerViolation('6TH RED KEYPRESS DETECTED: ENTIRE CODE & SCORE WIPED');
        return;
      }

      // 3. First 5 characters (1 to 5): Deduct score for each character typed on RED!
      state.redKeyPenalty += 10; // -10 PTS for each red keypress
      soundFx.playRedWarningKey();
      updateHUD();
    } else {
      // Handle Tab key inside textarea
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = elements.workspaceTextarea.selectionStart;
        const end = elements.workspaceTextarea.selectionEnd;
        const val = elements.workspaceTextarea.value;
        elements.workspaceTextarea.value = val.substring(0, start) + '  ' + val.substring(end);
        elements.workspaceTextarea.selectionStart = elements.workspaceTextarea.selectionEnd = start + 2;
        state.userCode = elements.workspaceTextarea.value;
        if (state.scoreWiped && state.userCode.length > 0) {
          state.scoreWiped = false;
        }
        renderReferenceCode();
        updateHUD();
        renderLeaderboard();
        soundFx.playKeyPress();
        return;
      }

      // Normal typing click on GREEN
      soundFx.playKeyPress();
    }
  });

  // Intercept Paste / Cut on RED
  elements.workspaceTextarea.addEventListener('paste', (e) => {
    if (state.lightState === 'RED') {
      e.preventDefault();
      triggerViolation('PASTE INTERCEPTED ON RED');
    }
  });

  elements.workspaceTextarea.addEventListener('cut', (e) => {
    if (state.lightState === 'RED') {
      e.preventDefault();
      triggerViolation('CUT INTERCEPTED ON RED');
    }
  });

  // Textarea input handling
  elements.workspaceTextarea.addEventListener('input', (e) => {
    if (state.gameState === 'PLAYING' && state.lightState === 'GREEN') {
      state.userCode = e.target.value;
      if (state.scoreWiped && state.userCode.length > 0) {
        state.scoreWiped = false;
      }
      renderReferenceCode();
      updateHUD();
      renderLeaderboard();
    }
  });

  // Bidirectional Scroll Synchronization
  elements.workspaceTextarea.addEventListener('scroll', () => {
    if (elements.refCodeDisplay) {
      elements.refCodeDisplay.scrollTop = elements.workspaceTextarea.scrollTop;
    }
    if (elements.workspaceLineNumbers) {
      elements.workspaceLineNumbers.scrollTop = elements.workspaceTextarea.scrollTop;
    }
    if (elements.refLineNumbers) {
      elements.refLineNumbers.scrollTop = elements.workspaceTextarea.scrollTop;
    }
  });

  elements.refCodeDisplay.addEventListener('scroll', () => {
    if (elements.workspaceTextarea) {
      elements.workspaceTextarea.scrollTop = elements.refCodeDisplay.scrollTop;
    }
  });

  // Submit Code button
  elements.btnSubmitCode.addEventListener('click', submitCode);

  // Modal Action Buttons
  elements.btnTryAgain.addEventListener('click', () => {
    elements.missionModal.classList.add('hidden');
    startGame();
  });

  elements.btnNextRace.addEventListener('click', () => {
    elements.missionModal.classList.add('hidden');
    state.selectedSnippetIndex = (state.selectedSnippetIndex + 1) % CODE_SNIPPETS.length;
    startGame();
  });

  elements.btnShareTelemetry.addEventListener('click', () => {
    const accuracy = calculateAccuracy();
    const text = `🎮 RED LIGHT CODE RACE Results for ${state.playerName}!\n🏆 Score: ${state.finalScore} PTS\n⏱ Time: ${state.finalTimeTaken.toFixed(1)}s\n🎯 Accuracy: ${accuracy}%\n⚠️ Violations: ${state.redLightViolations}\nCan you beat my cyber race score?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Race telemetry copied to clipboard!');
    }
  });
}

// --- Initialization ---
function init() {
  setupEventListeners();
  renderSnippetTabs();
  renderReferenceCode();
  updateHUD();
  renderLeaderboard();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
