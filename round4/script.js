/**
 * ============================================================================
 * ROUND 4 — CRYPTIC QUEST // THE SIGNAL INCIDENT
 * Master Investigation Engine (Pure Vanilla JavaScript)
 * 100% Visual, Text-Based, and Interactive. Zero Audio, Zero QR.
 * Strict One Attempt Per Team Enforcement for Stages 02-06;
 * Stage 01 supports investigation & multiple reconstruction attempts.
 * Encapsulated in isolated namespace `Round4CrypticQuest`.
 * ============================================================================
 */

const Round4CrypticQuest = (() => {
  'use strict';

  // --------------------------------------------------------------------------
  // 01. CONFIGURATION & EVIDENCE DEFINITIONS
  // --------------------------------------------------------------------------
  const CONFIG = {
    TOTAL_TIME_SECONDS: 30 * 60, // 30 minutes universal timer
    POINTS_NORMAL_CHALLENGE: 100,
    POINTS_FINAL_CHALLENGE: 200,
    PENALTY_WRONG_ANSWER: 10,
    PENALTY_HINT: 20,
    STORAGE_PREFIX: 'r4_signal_',
    STAGE_NAMES: [
      'CORRUPTED TRANSMISSION',
      'TESTIMONY ANALYSIS',
      'GLITCHED TERMINAL',
      'THE ROOM THAT LIES',
      'CRYPTIC LOCK',
      'FINAL RECONSTRUCTION'
    ],
    EVIDENCE_DEFS: [
      { 
        id: 1, 
        tag: 'EVIDENCE #01', 
        title: 'RECOVERED TRANSMISSION', 
        value: 'IF THIS REACHES YOU, THE PLAN HAS CHANGED.', 
        desc: 'Restored from the shifted system transmission.' 
      },
      { 
        id: 2, 
        tag: 'EVIDENCE #02', 
        title: 'ACCESS TIMELINE', 
        value: '21:38 ENTRY / 21:39 EXIT / 21:40 SIGNAL', 
        desc: 'Access log proved Noah exited before the transmission.' 
      },
      { 
        id: 3, 
        tag: 'EVIDENCE #03', 
        title: 'RECOVERED TRANSMISSION RECORD', 
        value: '21:40 DIGITAL MESSAGE (19-9-7-14-1-12)', 
        desc: 'Terminal log sequence connected to the 21:40 transmission.' 
      },
      { 
        id: 4, 
        tag: 'EVIDENCE #04', 
        title: 'SURVEILLANCE RECORD', 
        value: 'CAMERA RECORD — 21:39:19 [STATUS: OFFLINE]', 
        desc: 'Camera archive recorded a frame while marked offline.' 
      },
      { 
        id: 5, 
        tag: 'EVIDENCE #05', 
        title: 'CHRONOLOGICAL LOG', 
        value: 'MASTER BREACH SEQUENCE: 1 → 2 → 4 → 3', 
        desc: 'Master sequence reconstructed across all stages.' 
      },
      { 
        id: 6, 
        tag: 'EVIDENCE #06', 
        title: 'FINAL DEDUCTION', 
        value: 'THE MESSAGE WAS PART OF THE COMMUNICATION DURING THE INCIDENT', 
        desc: 'Reconstructed the role and purpose of the 21:40 transmission.' 
      }
    ]
  };

  // --------------------------------------------------------------------------
  // 02. APPLICATION STATE
  // --------------------------------------------------------------------------
  let state = {
    screen: 'BRIEFING', // BRIEFING | PLAYING | TIME_UP | COMPLETED
    currentChallengeId: 1,
    completedChallenges: [],
    submittedStages: {}, // { [stageId]: { isCorrect: boolean, answer: string, timestamp: number } }
    stage1Attempts: 0,
    score: 0,
    wrongAttempts: 0,
    hintsUsed: 0,
    hintLevel: {}, // { [chalId]: number of hints unlocked (1, 2, 3) }
    evidenceUnlocked: [], // array of evidence IDs (1..6)
    startTime: null,
    completionTime: null,
    status: 'not_started', // "not_started" | "active" | "completed" | "time_up"
    evidenceDrawerOpen: false,
    briefingStep: 1,

    // Stage 01 Forensic inspection state (No shift tool, neutral inspection only)
    c1SelectedChar: null,
    c1SelectedPos: null,

    // Stage 02 Suspect selection
    selectedSuspect: null,

    // Stage 03 Terminal state
    activeTerminalFile: 1,
    c3InspectedIndices: {},

    // Stage 04 Room Inspection
    inspectedRoomObjects: {}, // { [objId]: true }
    selectedRoomObj: null,
    inspectedCount: 0,

    // Stage 05 Lock state (Scrambled initial order)
    lockSequence: [2, 4, 1, 3],

    // Stage 06 Final Reconstruction
    selectedTheory: null
  };

  let timerInterval = null;

  // --------------------------------------------------------------------------
  // PARTICIPANT / TEAM ISOLATION IDENTIFIER
  // --------------------------------------------------------------------------
  function getParticipantId() {
    try {
      const params = new URLSearchParams(window.location.search);
      const idFromParam = params.get('team') || 
                          params.get('teamId') || 
                          params.get('teamName') || 
                          params.get('participant') || 
                          params.get('user') || 
                          params.get('id');
      if (idFromParam) {
        const cleanId = idFromParam.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
        sessionStorage.setItem('r4_current_participant_id', cleanId);
        return cleanId;
      }
      
      const idFromSession = sessionStorage.getItem('r4_current_participant_id') || 
                            sessionStorage.getItem('active_team') || 
                            sessionStorage.getItem('teamName') ||
                            sessionStorage.getItem('teamId');
      if (idFromSession) {
        return idFromSession.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      }

      const idFromLocal = localStorage.getItem('active_team') || 
                          localStorage.getItem('teamName') ||
                          localStorage.getItem('teamId') ||
                          localStorage.getItem('current_team');
      if (idFromLocal) {
        return idFromLocal.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      }

      // Per-session default isolation ID
      let defaultSessionId = sessionStorage.getItem('r4_default_participant_id');
      if (!defaultSessionId) {
        defaultSessionId = 'team_' + Math.random().toString(36).substring(2, 9);
        sessionStorage.setItem('r4_default_participant_id', defaultSessionId);
      }
      return defaultSessionId;
    } catch (e) {
      return 'default_team';
    }
  }

  function getStoragePrefix() {
    const pId = getParticipantId();
    return `r4_${pId}_`;
  }

  // --------------------------------------------------------------------------
  // 03. BACKGROUND AMBIENT PARTICLES
  // --------------------------------------------------------------------------
  const BackgroundAnimation = {
    canvas: null,
    ctx: null,
    particles: [],
    animationFrameId: null,

    init() {
      this.canvas = document.getElementById('r4-bg-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.createParticles();
      this.animate();
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    createParticles() {
      this.particles = [];
      const count = window.innerWidth < 768 ? 20 : 40;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 0.8,
          color: Math.random() > 0.4 ? 'rgba(0, 229, 255, ' : 'rgba(139, 92, 246, '
        });
      }
    },

    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > this.canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > this.canvas.height) p1.vy *= -1;

        this.ctx.beginPath();
        this.ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p1.color + '0.6)';
        this.ctx.fill();

        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - dist / 110)})`;
            this.ctx.lineWidth = 0.6;
            this.ctx.stroke();
          }
        }
      }

      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
  };

  // --------------------------------------------------------------------------
  // 04. STATE PERSISTENCE WITH PARTICIPANT ISOLATION
  // --------------------------------------------------------------------------
  function saveState() {
    try {
      const prefix = getStoragePrefix();
      localStorage.setItem(`${prefix}status`, state.status);
      localStorage.setItem(`${prefix}start_time`, state.startTime ? state.startTime.toString() : '');
      localStorage.setItem(`${prefix}score`, state.score.toString());
      localStorage.setItem(`${prefix}current_challenge`, state.currentChallengeId.toString());
      localStorage.setItem(`${prefix}completed_challenges`, JSON.stringify(state.completedChallenges));
      localStorage.setItem(`${prefix}submitted_stages`, JSON.stringify(state.submittedStages));
      localStorage.setItem(`${prefix}stage1_attempts`, state.stage1Attempts.toString());
      localStorage.setItem(`${prefix}hints_used`, state.hintsUsed.toString());
      localStorage.setItem(`${prefix}hint_level`, JSON.stringify(state.hintLevel));
      localStorage.setItem(`${prefix}wrong_attempts`, state.wrongAttempts.toString());
      localStorage.setItem(`${prefix}evidence`, JSON.stringify(state.evidenceUnlocked));
      localStorage.setItem(`${prefix}inspected_objects`, JSON.stringify(state.inspectedRoomObjects));
      localStorage.setItem(`${prefix}completion_time`, state.completionTime ? state.completionTime.toString() : '');
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }
  }

  function loadState() {
    try {
      const prefix = getStoragePrefix();
      const storedStatus = localStorage.getItem(`${prefix}status`);
      if (storedStatus) {
        state.status = storedStatus;

        const chal = parseInt(localStorage.getItem(`${prefix}current_challenge`), 10);
        state.currentChallengeId = isNaN(chal) ? 1 : chal;

        const comp = localStorage.getItem(`${prefix}completed_challenges`);
        state.completedChallenges = comp ? JSON.parse(comp) : [];

        const sub = localStorage.getItem(`${prefix}submitted_stages`);
        state.submittedStages = sub ? JSON.parse(sub) : {};

        const s1a = parseInt(localStorage.getItem(`${prefix}stage1_attempts`), 10);
        state.stage1Attempts = isNaN(s1a) ? 0 : s1a;

        const sc = parseInt(localStorage.getItem(`${prefix}score`), 10);
        state.score = isNaN(sc) ? 0 : sc;

        const wr = parseInt(localStorage.getItem(`${prefix}wrong_attempts`), 10);
        state.wrongAttempts = isNaN(wr) ? 0 : wr;

        const hu = parseInt(localStorage.getItem(`${prefix}hints_used`), 10);
        state.hintsUsed = isNaN(hu) ? 0 : hu;

        const hl = localStorage.getItem(`${prefix}hint_level`);
        state.hintLevel = hl ? JSON.parse(hl) : {};

        const ev = localStorage.getItem(`${prefix}evidence`);
        state.evidenceUnlocked = ev ? JSON.parse(ev) : [];

        const io = localStorage.getItem(`${prefix}inspected_objects`);
        state.inspectedRoomObjects = io ? JSON.parse(io) : {};

        const st = localStorage.getItem(`${prefix}start_time`);
        state.startTime = st ? parseInt(st, 10) : null;

        const ct = localStorage.getItem(`${prefix}completion_time`);
        state.completionTime = ct ? parseInt(ct, 10) : null;

        return true;
      }
    } catch (err) {
      console.warn('LocalStorage load failed:', err);
    }
    return false;
  }

  function adminReset() {
    try {
      const prefix = getStoragePrefix();
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith(prefix) || 
          key.startsWith(CONFIG.STORAGE_PREFIX) || 
          key.startsWith('round04_') || 
          key.startsWith('round4_') ||
          key.startsWith('r4_')
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Developer reset error:', e);
    }
    
    // Stop any running timer
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    // Reset in-memory state cleanly
    state = {
      screen: 'BRIEFING',
      currentChallengeId: 1,
      completedChallenges: [],
      submittedStages: {},
      stage1Attempts: 0,
      score: 0,
      wrongAttempts: 0,
      hintsUsed: 0,
      hintLevel: {},
      evidenceUnlocked: [],
      startTime: null,
      completionTime: null,
      status: 'not_started',
      evidenceDrawerOpen: false,
      briefingStep: 1,
      c1SelectedChar: null,
      c1SelectedPos: null,
      selectedSuspect: null,
      activeTerminalFile: 1,
      c3InspectedIndices: {},
      inspectedRoomObjects: {},
      selectedRoomObj: null,
      inspectedCount: 0,
      lockSequence: [2, 4, 1, 3],
      selectedTheory: null
    };

    setScreen('BRIEFING');
    setBriefingStep(1);
    updateHUD();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --------------------------------------------------------------------------
  // 05. SCREEN SWITCHER
  // --------------------------------------------------------------------------
  function setScreen(screenName) {
    state.screen = screenName;
    const screens = [
      { name: 'BRIEFING', el: document.getElementById('r4-briefing') },
      { name: 'PLAYING', el: document.getElementById('r4-game') },
      { name: 'TIME_UP', el: document.getElementById('r4-time-up') },
      { name: 'COMPLETED', el: document.getElementById('r4-complete') }
    ];

    screens.forEach(s => {
      if (s.el) {
        if (s.name === screenName) {
          s.el.classList.add('r4-screen-active');
        } else {
          s.el.classList.remove('r4-screen-active');
        }
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --------------------------------------------------------------------------
  // 06. UNIVERSAL 30-MINUTE TIMER
  // --------------------------------------------------------------------------
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    if (!state.startTime) {
      state.startTime = Date.now();
      saveState();
    }

    updateTimerDisplay();
    timerInterval = setInterval(() => {
      updateTimerDisplay();
    }, 500);
  }

  function getRemainingSeconds() {
    if (!state.startTime) return CONFIG.TOTAL_TIME_SECONDS;
    const elapsedMs = Date.now() - state.startTime;
    const remainingMs = Math.max(0, (CONFIG.TOTAL_TIME_SECONDS * 1000) - elapsedMs);
    return Math.floor(remainingMs / 1000);
  }

  function updateTimerDisplay() {
    const remaining = getRemainingSeconds();
    const timerDisplayEl = document.getElementById('r4-timer-display');
    const timerContainerEl = document.getElementById('r4-timer-container');

    if (!timerDisplayEl) return;

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    timerDisplayEl.textContent = formatted;

    if (timerContainerEl) {
      if (remaining <= 5 * 60) {
        timerContainerEl.className = 'r4-hud-badge r4-hud-timer r4-timer-urgent';
      } else if (remaining <= 10 * 60) {
        timerContainerEl.className = 'r4-hud-badge r4-hud-timer r4-timer-warning';
      } else {
        timerContainerEl.className = 'r4-hud-badge r4-hud-timer';
      }
    }

    if (remaining <= 0 && state.status === 'active') {
      handleTimeUp();
    }
  }

  function handleTimeUp() {
    if (timerInterval) clearInterval(timerInterval);
    state.status = 'time_up';
    saveState();

    const scoreEl = document.getElementById('r4-timeup-score');
    const solvedEl = document.getElementById('r4-timeup-solved');
    if (scoreEl) scoreEl.textContent = `${state.score} PTS`;
    if (solvedEl) solvedEl.textContent = `${state.completedChallenges.length} / 6`;

    setScreen('TIME_UP');
  }

  // --------------------------------------------------------------------------
  // 07. HUD & EVIDENCE DRAWER UPDATES
  // --------------------------------------------------------------------------
  function updateHUD() {
    const chalCountEl = document.getElementById('r4-hud-chal-count');
    const scoreValEl = document.getElementById('r4-score-display');
    const evidenceBadgeEl = document.getElementById('r4-evidence-badge-count');

    if (chalCountEl) {
      chalCountEl.textContent = `0${state.currentChallengeId} / 06`;
    }
    if (scoreValEl) {
      scoreValEl.textContent = state.score.toString();
    }
    if (evidenceBadgeEl) {
      evidenceBadgeEl.textContent = `${state.evidenceUnlocked.length}/6`;
    }

    updateProgressBar();
    updateEvidenceDrawer();
  }

  function updateEvidenceDrawer() {
    const drawerGrid = document.getElementById('r4-evidence-drawer-grid');
    if (!drawerGrid) return;

    drawerGrid.innerHTML = '';

    CONFIG.EVIDENCE_DEFS.forEach(def => {
      const isUnlocked = state.evidenceUnlocked.includes(def.id);
      const card = document.createElement('div');
      card.className = `r4-evidence-slot-card ${isUnlocked ? 'r4-evidence-unlocked' : 'r4-evidence-locked'}`;

      if (isUnlocked) {
        card.innerHTML = `
          <div class="r4-ev-slot-header">
            <span class="r4-ev-tag">${def.tag}</span>
            <span class="r4-ev-status-icon">✓</span>
          </div>
          <div class="r4-ev-slot-title">${def.title}</div>
          <div class="r4-ev-slot-val">${def.value}</div>
          <div class="r4-ev-slot-desc">${def.desc}</div>
        `;
      } else {
        card.innerHTML = `
          <div class="r4-ev-slot-header">
            <span class="r4-ev-tag">${def.tag}</span>
            <span class="r4-ev-status-icon">🔒</span>
          </div>
          <div class="r4-ev-slot-title">LOCKED CLUE</div>
          <div class="r4-ev-slot-desc">Solve Stage 0${def.id} to recover this piece of evidence.</div>
        `;
      }

      drawerGrid.appendChild(card);
    });
  }

  function toggleEvidenceDrawer() {
    const drawer = document.getElementById('r4-evidence-drawer');
    if (!drawer) return;
    state.evidenceDrawerOpen = !state.evidenceDrawerOpen;
    if (state.evidenceDrawerOpen) {
      drawer.classList.add('r4-drawer-open');
    } else {
      drawer.classList.remove('r4-drawer-open');
    }
  }

  // --------------------------------------------------------------------------
  // 08. TOP TIMELINE PROGRESS BAR
  // --------------------------------------------------------------------------
  function updateProgressBar() {
    const listEl = document.getElementById('r4-progress-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    CONFIG.STAGE_NAMES.forEach((name, idx) => {
      const chalId = idx + 1;
      const isCompleted = state.completedChallenges.includes(chalId);
      const isSubmittedWrong = state.submittedStages[chalId] && !state.submittedStages[chalId].isCorrect;
      const isCurrent = chalId === state.currentChallengeId;

      const stepItem = document.createElement('div');
      stepItem.className = 'r4-progress-step';
      if (isCompleted) stepItem.classList.add('r4-step-completed');
      if (isSubmittedWrong) stepItem.classList.add('r4-step-failed');
      if (isCurrent) stepItem.classList.add('r4-step-current');

      const numSpan = document.createElement('span');
      numSpan.className = 'r4-step-num';
      numSpan.textContent = isCompleted ? '✓' : (isSubmittedWrong ? '✕' : `0${chalId}`);

      const labelSpan = document.createElement('span');
      labelSpan.className = 'r4-step-label';
      labelSpan.textContent = name;

      stepItem.appendChild(numSpan);
      stepItem.appendChild(labelSpan);
      listEl.appendChild(stepItem);
    });
  }

  // --------------------------------------------------------------------------
  // 09. CASE BRIEFING STEPPER
  // --------------------------------------------------------------------------
  function setBriefingStep(stepNum) {
    state.briefingStep = stepNum;
    
    // Update tabs
    document.querySelectorAll('.r4-briefing-tab').forEach(tab => {
      const step = parseInt(tab.getAttribute('data-briefing-step'), 10);
      if (step === stepNum) {
        tab.classList.add('r4-tab-active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('r4-tab-active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // Update panes
    document.querySelectorAll('.r4-briefing-pane').forEach(pane => {
      const paneNum = parseInt(pane.getAttribute('data-pane'), 10);
      if (paneNum === stepNum) {
        pane.classList.add('r4-pane-active');
      } else {
        pane.classList.remove('r4-pane-active');
      }
    });

    // Update bottom nav buttons
    const prevBtn = document.getElementById('r4-btn-prev-briefing');
    const nextBtn = document.getElementById('r4-btn-next-briefing');

    if (prevBtn) {
      prevBtn.style.display = stepNum > 1 ? 'inline-flex' : 'none';
    }
    if (nextBtn) {
      nextBtn.style.display = stepNum < 8 ? 'inline-flex' : 'none';
    }
  }

  // --------------------------------------------------------------------------
  // 10. ACTIVE CHALLENGE RENDERING (Stages 01 - 06)
  // --------------------------------------------------------------------------
  const CIPHER_DISPLAY_STRING = 'LIWKLVUHDFKHVBRX,WKHSODQKDVFKDQJHG.';

  function renderActiveChallenge() {
    const cardEl = document.getElementById('r4-active-challenge-card');
    const feedbackArea = document.getElementById('r4-game-feedback');
    const continueBanner = document.getElementById('r4-continue-banner');
    if (!cardEl) return;

    if (feedbackArea) feedbackArea.innerHTML = '';
    if (continueBanner) continueBanner.style.display = 'none';

    const currentId = state.currentChallengeId;
    const currentHintLvl = state.hintLevel[currentId] || 0;
    const isStageSubmitted = !!state.submittedStages[currentId];

    let metaType = 'CASE INVESTIGATION';
    let chalTitle = '';
    let chalSubtitle = '';
    let sandboxHTML = '';
    let customSubmitLabel = 'SUBMIT DISCOVERY';
    let inputPlaceholder = 'Enter your finding...';
    let hintsArray = [];

    // ========================================================================
    // CHALLENGE 01: THE CORRUPTED TRANSMISSION
    // Decodes to: "IF THIS REACHES YOU, THE PLAN HAS CHANGED."
    // Ciphertext: "LIWKLVUHDFKHVBRX,WKHSODQKDVFKDQJHG."
    // Supports Multiple Submissions (No lock out on wrong attempt).
    // NO Shift controls, NO Caesar name, NO brute force slider.
    // ========================================================================
    if (currentId === 1) {
      metaType = 'TRANSMISSION RESTORATION';
      chalTitle = 'THE CORRUPTED TRANSMISSION';
      chalSubtitle = 'ROUND 04 // CHALLENGE 01 / 06';
      customSubmitLabel = 'SUBMIT TRANSMISSION →';
      inputPlaceholder = 'ENTER RECOVERED MESSAGE...';

      hintsArray = [
        'BUFFER COMPARISON: A uniform letter transformation applies across every word.',
        'Look at the short words and sentence rhythm: The original message informs the recipient of a changed situation.'
      ];

      const cipherText = CIPHER_DISPLAY_STRING;
      const cipherLettersHTML = cipherText.split('').map((char, idx) => {
        const isSelected = state.c1SelectedPos === (idx + 1);
        if (char === ',' || char === '.') {
          return `<span class="r4-cipher-char ${isSelected ? 'r4-char-selected' : ''}" data-char="${char}" data-char-pos="${idx + 1}" style="color:var(--r4-warning); font-weight:800;">${char}</span>`;
        }
        return `<span class="r4-cipher-char ${isSelected ? 'r4-char-selected' : ''}" data-char="${char}" data-char-pos="${idx + 1}">${char}</span>`;
      }).join('');

      sandboxHTML = `
        <div class="r4-puzzle-box">
          <div class="r4-c1-detected-box">
            <div class="r4-c1-det-title">TRANSMISSION DETECTED</div>
            <p>At 21:40, the restricted control system sent a short encrypted digital message through the network. The destination could not be identified.</p>
            <p>The transmission was intercepted and recovered only partially. Its contents appear to have been deliberately altered. The original message may contain information important to the investigation.</p>
            <p><strong>Your task is to reconstruct the original message.</strong></p>
          </div>

          <!-- Forensic Metadata Panel -->
          <div class="r4-forensic-panel">
            <div class="r4-forensic-title">
              <span class="r4-pulse-dot"></span>
              <span>TRANSMISSION RECORD // FORENSIC BUFFER</span>
            </div>
            <div class="r4-forensic-grid">
              <div class="r4-forensic-item"><span class="r4-f-lbl">SOURCE:</span> <span class="r4-f-val">RESTRICTED CONTROL SYSTEM</span></div>
              <div class="r4-forensic-item"><span class="r4-f-lbl">DESTINATION:</span> <span class="r4-f-val">UNKNOWN RECIPIENT</span></div>
              <div class="r4-forensic-item"><span class="r4-f-lbl">TIME:</span> <span class="r4-f-val">21:40</span></div>
              <div class="r4-forensic-item"><span class="r4-f-lbl">TYPE:</span> <span class="r4-f-val">ENCRYPTED DIGITAL MESSAGE</span></div>
              <div class="r4-forensic-item"><span class="r4-f-lbl">STATUS:</span> <span class="r4-f-val r4-text-warning">CORRUPTED</span></div>
              <div class="r4-forensic-item"><span class="r4-f-lbl">ROUTE:</span> <span class="r4-f-val">EXTERNAL NETWORK GATEWAY</span></div>
            </div>
          </div>

          <!-- Encrypted Cipher Display -->
          <div class="r4-c1-cipher-card">
            <div class="r4-c1-cipher-tag">ENCRYPTED MESSAGE BUFFER</div>
            <div class="r4-c1-cipher-text" id="r4-c1-cipher-display">
              ${cipherLettersHTML}
            </div>
          </div>

          <!-- Recovery Fragments -->
          <div class="r4-c1-fragments-section">
            <div class="r4-c1-fragments-header">
              <span class="r4-c1-frag-title">RECOVERY FRAGMENTS</span>
              <span class="r4-c1-frag-sub">Indirect system traces recovered from the gateway</span>
            </div>
            <div class="r4-c1-fragments-grid">
              <div class="r4-c1-fragment-pill">
                <div class="r4-c1-frag-tag">FRAGMENT A</div>
                <div class="r4-c1-frag-body">BUFFER COMPARISON: LETTER POSITIONS DO NOT MATCH ORIGINAL RECORD.</div>
              </div>
              <div class="r4-c1-fragment-pill">
                <div class="r4-c1-frag-tag">FRAGMENT B</div>
                <div class="r4-c1-frag-body">PATTERN ANALYSIS: SAME RELATIVE DISTANCE DETECTED BETWEEN CHARACTERS.</div>
              </div>
              <div class="r4-c1-fragment-pill">
                <div class="r4-c1-frag-tag">FRAGMENT C</div>
                <div class="r4-c1-frag-body">RECOVERY NOTE: THE MESSAGE APPEARS TO HAVE BEEN TRANSFORMED, NOT RANDOMLY CORRUPTED.</div>
              </div>
            </div>
          </div>

          <div class="r4-c1-system-msg">
            SYSTEM MESSAGE: "Someone moved every letter."
          </div>

          <!-- Forensic Decoding Workspace (No shift slider / No brute force key) -->
          <div class="r4-c1-workspace">
            <div class="r4-c1-ws-title">DECODING WORKSPACE</div>
            <div style="font-size:0.825rem; color:var(--r4-text-secondary); margin-bottom:0.75rem;">
              Investigate the recovered transmission and determine how the original message was transformed.
            </div>

            <!-- Forensic Character Inspection -->
            <div class="r4-c1-char-inspector" id="r4-c1-char-inspector">
              ${state.c1SelectedChar ? `
                <div class="r4-inspector-content">
                  <div class="r4-insp-row"><span class="r4-insp-lbl">SELECTED CHARACTER:</span> <span class="r4-insp-val">[ <strong>${state.c1SelectedChar}</strong> ]</span></div>
                  <div class="r4-insp-row"><span class="r4-insp-lbl">CHARACTER TYPE:</span> <span class="r4-insp-val">${/[a-zA-Z]/.test(state.c1SelectedChar) ? 'LETTER' : 'PUNCTUATION'}</span></div>
                  <div class="r4-insp-row"><span class="r4-insp-lbl">POSITION IN MESSAGE:</span> <span class="r4-insp-val">${String(state.c1SelectedPos).padStart(2, '0')}</span></div>
                  <div class="r4-insp-row"><span class="r4-insp-lbl">RECOVERY STATUS:</span> <span class="r4-insp-val r4-text-warning">TRANSFORMED</span></div>
                </div>
              ` : `
                <div style="color:var(--r4-text-muted); font-size:0.8rem;">Click any character in the transmission above to inspect its forensic position and recovery status.</div>
              `}
            </div>

            <!-- Forensic Analysis Observation Card -->
            <div class="r4-c1-analysis-card">
              <div class="r4-c1-analysis-title">TRANSFORMATION ANALYSIS</div>
              <div class="r4-c1-analysis-grid">
                <div class="r4-analysis-item"><span class="r4-a-lbl">WORD STRUCTURE:</span> <span class="r4-a-val">PRESERVED</span></div>
                <div class="r4-analysis-item"><span class="r4-a-lbl">SPACING:</span> <span class="r4-a-val">PRESERVED</span></div>
                <div class="r4-analysis-item"><span class="r4-a-lbl">PUNCTUATION:</span> <span class="r4-a-val">PRESERVED</span></div>
                <div class="r4-analysis-item"><span class="r4-a-lbl">LETTER RELATIONSHIP:</span> <span class="r4-a-val">CONSISTENT</span></div>
              </div>
              <div class="r4-analysis-note">
                <strong>RECOVERY ASSESSMENT:</strong> THE MESSAGE APPEARS TO USE A CONSISTENT LETTER TRANSFORMATION.
              </div>
            </div>
          </div>

          <div class="r4-stage1-instruction-box">
            <span class="r4-att-icon">🔍</span>
            <div>
              <strong>RESTORE THE ORIGINAL MESSAGE:</strong> The recovered transmission must be reconstructed exactly. Reconstruct the message and submit your findings.
            </div>
          </div>
        </div>
      `;
    }

    // ========================================================================
    // CHALLENGE 02: TESTIMONY ANALYSIS
    // Suspects: ARIA, KAI, MIRA, NOAH
    // Correct: NOAH (Claimed stayed until after 21:40 signal, exit log proves 21:39)
    // ========================================================================
    else if (currentId === 2) {
      metaType = 'TESTIMONY ANALYSIS';
      chalTitle = 'TESTIMONY ANALYSIS';
      chalSubtitle = 'Four statements. One contradiction. The evidence knows who is lying.';
      customSubmitLabel = 'SUBMIT FINAL DECISION →';
      inputPlaceholder = 'ENTER YOUR ANSWER';

      hintsArray = [
        'Cross-reference each person\'s claimed duration against verified physical log stamps.',
        'Check the exact departure timestamp for anyone claiming to have stayed through the 21:40 signal.'
      ];

      const suspects = [
        { id: 'aria', name: 'ARIA', time: '21:35', loc: 'LAB', statement: '"I was in the Lab at 21:35. I never entered the Control Room."' },
        { id: 'kai', name: 'KAI', time: '21:30', loc: 'LIBRARY', statement: '"I left the Library at 21:30. I was nowhere near the Control Room when the signal appeared."' },
        { id: 'mira', name: 'MIRA', time: '21:42', loc: 'CONTROL ROOM', statement: '"I entered the Control Room at 21:42. The terminal was already active when I arrived."' },
        { id: 'noah', name: 'NOAH', time: '21:38', loc: 'HALL', statement: '"I entered the Control Room at 21:38 and stayed there until after the signal."' }
      ];

      const suspectCardsHTML = suspects.map(s => `
        <div class="r4-suspect-card ${state.selectedSuspect === s.id ? 'r4-suspect-selected' : ''}" data-suspect="${s.id}">
          <div class="r4-suspect-header">
            <span class="r4-suspect-name">${s.name}</span>
            <span class="r4-suspect-time">${s.time}</span>
          </div>
          <div class="r4-suspect-loc">📍 ${s.loc}</div>
          <div class="r4-suspect-statement">${s.statement}</div>
        </div>
      `).join('');

      sandboxHTML = `
        <div class="r4-puzzle-box">
          <p style="font-size:0.875rem; color:var(--r4-text-secondary); margin-bottom:1rem;">
            Four people were in the facility during the incident. One statement directly conflicts with the verified system records.
          </p>

          <div class="r4-suspects-grid">
            ${suspectCardsHTML}
          </div>

          <div style="font-family:var(--r4-font-mono); font-size:0.75rem; font-weight:700; color:var(--r4-purple); margin-bottom:0.6rem;">
            RECOVERED SYSTEM EVIDENCE (Click cards to examine details):
          </div>

          <div class="r4-c2-evidence-grid">
            <div class="r4-c2-evidence-card" data-ev-node="sig">
              <div class="r4-c2-ev-header">EVIDENCE A // TIMESTAMP</div>
              <div class="r4-c2-ev-body">The transmission was detected at: <strong>21:40</strong></div>
            </div>
            <div class="r4-c2-evidence-card" data-ev-node="noah-in">
              <div class="r4-c2-ev-header">EVIDENCE B // ACCESS LOG</div>
              <div class="r4-c2-ev-body">Control Room access:<br><strong>21:38 — NOAH ENTERED</strong><br><strong>21:42 — MIRA ENTERED</strong></div>
            </div>
            <div class="r4-c2-evidence-card" data-ev-node="term">
              <div class="r4-c2-ev-header">EVIDENCE C // TERMINAL LOG</div>
              <div class="r4-c2-ev-body">Control-room terminal was already active at <strong>21:37</strong>.</div>
            </div>
            <div class="r4-c2-evidence-card" data-ev-node="noah-out">
              <div class="r4-c2-ev-header">EVIDENCE D // EXIT LOG</div>
              <div class="r4-c2-ev-body"><strong>NOAH'S EXIT: 21:39</strong></div>
            </div>
            <div class="r4-c2-evidence-card" data-ev-node="sec">
              <div class="r4-c2-ev-header">EVIDENCE E // SECURITY NOTE</div>
              <div class="r4-c2-ev-body">Only physical access to Control Room between 21:30 and 21:40 was: <strong>NOAH (21:38)</strong>.</div>
            </div>
          </div>

          <!-- Interactive Evidence Timeline -->
          <div class="r4-c2-timeline-strip">
            <div class="r4-c2-tl-title">🔍 VERIFIED INCIDENT TIMELINE:</div>
            <div class="r4-c2-tl-events">
              <div class="r4-c2-tl-node" data-target-suspect="kai"><strong>21:30</strong> KAI — LEFT LIBRARY</div>
              <div class="r4-c2-tl-node" data-target-suspect="aria"><strong>21:35</strong> ARIA — IN LAB</div>
              <div class="r4-c2-tl-node"><strong>21:37</strong> TERMINAL — ACTIVE</div>
              <div class="r4-c2-tl-node" data-target-suspect="noah"><strong>21:38</strong> NOAH — ENTERED CONTROL ROOM</div>
              <div class="r4-c2-tl-node" data-target-suspect="noah"><strong>21:39</strong> NOAH — EXITED CONTROL ROOM</div>
              <div class="r4-c2-tl-node"><strong>21:40</strong> SIGNAL DETECTED</div>
              <div class="r4-c2-tl-node" data-target-suspect="mira"><strong>21:42</strong> MIRA — ENTERED CONTROL ROOM</div>
            </div>
          </div>

          <div style="text-align:center; font-weight:700; color:var(--r4-cyan); font-size:0.9rem; margin-top:1rem;">
            🔍 FIND THE CONTRADICTION: "Which person's statement directly contradicts the system evidence?"
          </div>

          <div class="r4-c2-suspect-buttons-grid">
            <button type="button" class="r4-btn r4-btn-ghost r4-c2-suspect-btn ${state.selectedSuspect === 'aria' ? 'r4-suspect-selected' : ''}" data-c2-suspect="aria">ARIA</button>
            <button type="button" class="r4-btn r4-btn-ghost r4-c2-suspect-btn ${state.selectedSuspect === 'kai' ? 'r4-suspect-selected' : ''}" data-c2-suspect="kai">KAI</button>
            <button type="button" class="r4-btn r4-btn-ghost r4-c2-suspect-btn ${state.selectedSuspect === 'mira' ? 'r4-suspect-selected' : ''}" data-c2-suspect="mira">MIRA</button>
            <button type="button" class="r4-btn r4-btn-ghost r4-c2-suspect-btn ${state.selectedSuspect === 'noah' ? 'r4-suspect-selected' : ''}" data-c2-suspect="noah">NOAH</button>
          </div>

          <div class="r4-subtle-note-box" style="margin-top:1rem;">
            <span>💡 Select ONE suspect and click Submit when ready.</span>
          </div>
        </div>
      `;
    }

    // ========================================================================
    // CHALLENGE 03: THE GLITCHED TERMINAL
    // Correct Keyword: SIGNAL (19-9-7-14-1-12)
    // ========================================================================
    else if (currentId === 3) {
      metaType = 'TERMINAL EXPLORATION';
      chalTitle = 'THE GLITCHED TERMINAL';
      chalSubtitle = 'ROUND 04 // CHALLENGE 03 / 06';
      customSubmitLabel = 'SUBMIT FINAL ANSWER →';
      inputPlaceholder = 'ENTER YOUR ANSWER';

      hintsArray = [
        'One file gives you a sequence. Another gives you a memory index. Cross-reference the numbers with the memory map.',
        'Inspect positions 19, 9, 7, 14, 1, 12 on the memory index table to reconstruct the missing keyword.'
      ];

      let fileBodyHTML = '';
      if (state.activeTerminalFile === 1) {
        fileBodyHTML = `
          <div style="color:var(--r4-cyan); margin-bottom:0.5rem; font-weight:700;">[ FILE_01.LOG ] • DATA STREAM</div>
          <div style="font-size:0.85rem; color:var(--r4-text-muted); margin-bottom:0.75rem;">STATUS: STREAM INTACT // SOURCE: UNKNOWN</div>
          <div style="font-size:1.4rem; font-weight:800; color:var(--r4-warning); letter-spacing:0.18em; padding:0.75rem 0;">
            19 - 9 - 7 - 14 - 1 - 12
          </div>
          <div style="color:var(--r4-text-secondary); font-style:italic; margin-top:0.75rem;">
            "ORDER MATTERS."
          </div>
        `;
      } else if (state.activeTerminalFile === 2) {
        let indexCells = '';
        for (let i = 1; i <= 26; i++) {
          const numStr = String(i).padStart(2, '0');
          const letter = String.fromCharCode(64 + i);
          const isInspected = !!state.c3InspectedIndices[i];
          indexCells += `
            <div class="r4-c3-index-cell ${isInspected ? 'r4-idx-inspected' : ''}" data-idx-num="${i}">
              <span class="r4-idx-digit">${numStr}</span>
              ${isInspected ? `<span class="r4-idx-letter">&rarr; ${letter}</span>` : ''}
            </div>
          `;
        }
        fileBodyHTML = `
          <div style="color:var(--r4-purple); margin-bottom:0.5rem; font-weight:700;">[ FILE_02.DAT ] • SYSTEM MAP</div>
          <div style="font-size:0.85rem; color:var(--r4-text-muted); margin-bottom:0.5rem;">INDEX TABLE // MEMORY STATUS: PARTIALLY RECOVERED</div>
          <div style="font-size:0.8rem; color:var(--r4-cyan); margin-bottom:0.5rem;">
            "SELECT AN INDEX POSITION TO INSPECT THE MEMORY BLOCK."
          </div>
          <div class="r4-c3-index-grid">
            ${indexCells}
          </div>
          <div style="font-size:0.75rem; color:var(--r4-text-muted); margin-top:0.5rem;" id="r4-c3-index-status">
            Click any index position to inspect status block.
          </div>
        `;
      } else if (state.activeTerminalFile === 3) {
        fileBodyHTML = `
          <div style="color:var(--r4-danger); margin-bottom:0.5rem; font-weight:700;">[ FILE_03.SYS ] • SECURITY FRAGMENT</div>
          <div style="font-size:0.85rem; color:var(--r4-text-muted); margin-bottom:0.75rem;">RECOVERY STATUS: PARTIAL</div>
          <div style="font-style:italic; color:#FDE68A; line-height:1.7; margin-bottom:0.75rem;">
            "The terminal did not store the message."<br>
            "It stored what was needed to trace it."
          </div>
          <div class="r4-c3-record-box">
            <div style="font-size:0.8rem; color:var(--r4-cyan); font-weight:700; margin-bottom:0.3rem;">RECOVERED RECORD:</div>
            <div>TIME: 21:40</div>
            <div>SOURCE: CONTROL NETWORK</div>
            <div>RECIPIENT: UNKNOWN</div>
            <div>STATUS: TRANSMITTED</div>
          </div>
        `;
      }

      sandboxHTML = `
        <div class="r4-puzzle-box">
          <div class="r4-c3-intro-banner">
            <strong>THE GLITCHED TERMINAL</strong><br>
            "The recovery system has partially restored three corrupted files. Something important was lost during the incident. Examine the recovered files, reconstruct the missing information, and determine what the terminal was trying to recover."
          </div>

          <div class="r4-fake-terminal">
            <div class="r4-terminal-titlebar">
              <div class="r4-terminal-dots">
                <span class="r4-term-dot" style="background:#EF4444;"></span>
                <span class="r4-term-dot" style="background:#F59E0B;"></span>
                <span class="r4-term-dot" style="background:#22C55E;"></span>
              </div>
              <span>root@signal-incident:~# /var/log/recovery</span>
              <span>STATUS: DEGRADED</span>
            </div>

            <div class="r4-terminal-files-row">
              <button type="button" class="r4-term-file-btn ${state.activeTerminalFile === 1 ? 'r4-term-file-active' : ''}" data-file="1">📄 FILE_01.LOG</button>
              <button type="button" class="r4-term-file-btn ${state.activeTerminalFile === 2 ? 'r4-term-file-active' : ''}" data-file="2">📄 FILE_02.DAT</button>
              <button type="button" class="r4-term-file-btn ${state.activeTerminalFile === 3 ? 'r4-term-file-active' : ''}" data-file="3">📄 FILE_03.SYS</button>
            </div>

            <div class="r4-terminal-screen-body">
              ${fileBodyHTML}
            </div>
          </div>

          <div class="r4-c3-target-section">
            <div class="r4-c3-target-title">RECOVERY TARGET</div>
            <p>The recovered files point to one key piece of the incident. What was the terminal trying to recover?</p>
          </div>

          <div class="r4-subtle-note-box" style="margin-top:1rem;">
            <span>💡 Inspect files and submit your answer when ready.</span>
          </div>
        </div>
      `;
    }

    // ========================================================================
    // CHALLENGE 04: THE ROOM THAT LIES
    // Correct Object: CAMERA (Recorded frame 21:39:19 while marked offline)
    // ========================================================================
    else if (currentId === 4) {
      metaType = 'OBSERVATION & CONTRADICTION';
      chalTitle = 'THE ROOM THAT LIES';
      chalSubtitle = 'ROUND 04 // CHALLENGE 04 / 06';
      customSubmitLabel = 'SUBMIT FINAL DECISION →';
      inputPlaceholder = 'ENTER YOUR ANSWER';

      hintsArray = [
        'Compare each object\'s reported state with its timestamped activity log.',
        'Look closely at the surveillance systems: Can an offline record capture timestamped evidence at 21:39:19?'
      ];

      const roomObjects = [
        { 
          id: 'clock', 
          icon: '⏱️', 
          name: 'CLOCK', 
          state: '21:42', 
          header: 'ROOM CLOCK RECORD', 
          detail: '21:30 — Clock synchronized<br>21:35 — Normal operation<br>21:40 — Normal operation<br>21:42 — Current room time<br><br><strong>STATUS: NO CLOCK ANOMALY DETECTED</strong>' 
        },
        { 
          id: 'terminal', 
          icon: '💻', 
          name: 'TERMINAL', 
          state: 'ACTIVE', 
          header: 'TERMINAL STATUS', 
          detail: 'CURRENT STATE: ACTIVE<br><br>21:37 — Terminal initialized<br>21:39 — System activity detected<br>21:40 — Signal transmission recorded<br>21:41 — Terminal remains active<br><br><strong>STATUS: SYSTEM ACTIVITY CONFIRMED</strong>' 
        },
        { 
          id: 'security', 
          icon: '🛡️', 
          name: 'SECURITY', 
          state: 'GREEN', 
          header: 'SECURITY SYSTEM', 
          detail: 'CURRENT STATUS: GREEN<br><br>21:30–21:42<br>No alarm triggered.<br>No forced-entry alert.<br>No emergency lockdown.<br><br><strong>STATUS: NO SECURITY ALERT RECORDED</strong>' 
        },
        { 
          id: 'files', 
          icon: '📁', 
          name: 'FILE COUNT', 
          state: '07 FILES', 
          header: 'FILE SYSTEM STATUS', 
          detail: 'CURRENT FILE COUNT: 07 FILES<br><br>21:30 — 07 files<br>21:35 — 07 files<br>21:40 — 07 files<br>21:42 — 07 files<br>No file creation or deletion detected.<br><br><strong>STATUS: FILE COUNT CONSISTENT</strong>' 
        },
        { 
          id: 'camera', 
          icon: '📹', 
          name: 'CAMERA', 
          state: 'OFFLINE', 
          header: 'CAMERA SYSTEM', 
          detail: 'CURRENT STATUS: OFFLINE<br><br><strong>RECOVERED CAMERA HISTORY:</strong><br>21:38:42 — CAMERA ACTIVE<br>21:39:17 — MOTION DETECTED<br>21:39:19 — FRAME CAPTURED<br>21:40:00 — SIGNAL DETECTED<br>21:41:03 — CAMERA CONNECTION LOST<br><br><strong>RECOVERED FRAME:</strong><br>TIMESTAMP: 21:39:19<br>LOCATION: CONTROL ROOM<br>SUBJECT: UNIDENTIFIED<br>FRAME STATUS: PARTIALLY CORRUPTED' 
        },
        { 
          id: 'access_log', 
          icon: '📜', 
          name: 'ACCESS LOG', 
          state: '21:39 USER', 
          header: 'ACCESS RECORD', 
          detail: '21:39:04 UNKNOWN USER AUTHENTICATED<br>METHOD: EXTERNAL NETWORK GATEWAY<br>PHYSICAL DOOR: NO ENTRY RECORDED<br><br><strong>STATUS: REMOTE ACCESS</strong>' 
        },
        { 
          id: 'note', 
          icon: '📝', 
          name: 'NOTE', 
          state: '"LEFT 21:30"', 
          header: 'RECOVERED NOTE', 
          detail: '"LEFT 21:30"<br><br>AUTHOR: UNKNOWN<br>VERIFICATION: NONE<br><br><strong>STATUS: UNVERIFIED RECORD</strong>' 
        },
        { 
          id: 'door', 
          icon: '🚪', 
          name: 'DOOR LOCK', 
          state: 'LOCKED', 
          header: 'DOOR SECURITY RECORD', 
          detail: 'CURRENT STATE: LOCKED<br><br>21:38 — Physical entry recorded<br>21:39 — Door secured<br>21:42 — Door remains locked<br>No forced-entry damage detected.<br><br><strong>STATUS: LOCK SYSTEM OPERATIONAL</strong>' 
        }
      ];

      const inspectedCount = Object.keys(state.inspectedRoomObjects || {}).length;
      const selectedItem = roomObjects.find(o => o.id === state.selectedRoomObj) || roomObjects[4];

      const objectCardsHTML = roomObjects.map(obj => {
        const isInspected = !!(state.inspectedRoomObjects && state.inspectedRoomObjects[obj.id]);
        const isSelected = state.selectedRoomObj === obj.id;
        return `
          <div class="r4-room-object ${isSelected ? 'r4-room-obj-selected' : ''} ${isInspected ? 'r4-obj-inspected' : ''}" data-room-obj="${obj.id}">
            <div class="r4-room-obj-icon">${obj.icon}</div>
            <div class="r4-room-obj-name">${obj.name}</div>
            <div class="r4-room-obj-state">${obj.state}</div>
            ${isInspected ? '<div class="r4-inspected-badge">✓ INSPECTED</div>' : ''}
          </div>
        `;
      }).join('');

      const optionButtonsHTML = roomObjects.map(obj => `
        <button type="button" class="r4-btn r4-btn-ghost r4-c4-select-btn ${state.selectedRoomObj === obj.id ? 'r4-c4-btn-selected' : ''}" data-c4-target="${obj.id}">
          ${obj.name}
        </button>
      `).join('');

      sandboxHTML = `
        <div class="r4-puzzle-box">
          <div class="r4-c4-briefing-box">
            <p>The Control Room was believed to be empty when the signal was transmitted. Recovered records show unusual activity shortly before 21:40. Investigators now need to determine which room record can provide direct evidence of what was happening INSIDE the Control Room immediately before the signal.</p>
          </div>

          <div class="r4-c4-counter-bar">
            <span>SURVEILLANCE &amp; ROOM RECONSTRUCTION</span>
            <span style="color:var(--r4-cyan); font-weight:800;">OBJECTS INSPECTED: ${inspectedCount} / 8</span>
          </div>

          <div class="r4-room-grid">
            ${objectCardsHTML}
          </div>

          <div class="r4-room-inspector-pane">
            <div style="font-family:var(--r4-font-mono); font-weight:700; color:var(--r4-cyan); margin-bottom:0.4rem;">
              [INSPECTION READOUT — ${selectedItem.header}]:
            </div>
            <div style="line-height:1.6;">
              ${selectedItem.detail}
            </div>
          </div>

          <div class="r4-c4-final-section">
            <div class="r4-c4-final-question">
              <strong>FINAL INVESTIGATION:</strong><br>
              "Which room record provides the strongest direct evidence of what was happening inside the Control Room immediately before the signal?"
            </div>
            <div style="font-size:0.8rem; color:var(--r4-text-secondary); margin-bottom:0.6rem;">
              SELECT ONE OBJECT:
            </div>
            <div class="r4-c4-options-grid">
              ${optionButtonsHTML}
            </div>
          </div>

          <div class="r4-subtle-note-box" style="margin-top:1rem;">
            <span>💡 Inspect objects and submit your decision when ready.</span>
          </div>
        </div>
      `;
    }

    // ========================================================================
    // CHALLENGE 05: THE CRYPTIC LOCK (Evidence Sequencing)
    // Sequence: 1 (21:37 Terminal), 2 (21:38 Noah Entry), 4 (21:39 Camera), 3 (21:40 Signal) -> 1 2 4 3
    // ========================================================================
    else if (currentId === 5) {
      metaType = 'EVIDENCE SEQUENCING';
      chalTitle = 'THE CRYPTIC LOCK';
      chalSubtitle = 'ROUND 04 // CHALLENGE 05 / 06';
      customSubmitLabel = 'SUBMIT FINAL SEQUENCE →';
      inputPlaceholder = 'ENTER YOUR ANSWER';

      hintsArray = [
        'Review the timestamps of each incident event: Shifted transmission intercept, terminal activity initialization, remote gateway authentication & camera frame, and digital message broadcast.',
        'Use the shift arrows (◀ ▶) to reposition evidence slots into chronological order from earliest to latest.'
      ];

      const evidenceItems = [
        { id: 1, tag: 'POSITION 01', text: 'FRAGMENT 01: IF THIS REACHES YOU, THE PLAN HAS CHANGED. [Transmission Intercept]' },
        { id: 2, tag: 'POSITION 02', text: 'FRAGMENT 02: 21:37 [Terminal Activity Initialized]' },
        { id: 4, tag: 'POSITION 03', text: 'FRAGMENT 03: 21:39 [Remote Gateway Authentication & Camera Frame 21:39:19]' },
        { id: 3, tag: 'POSITION 04', text: 'FRAGMENT 04: 21:40 [21:40 DIGITAL MESSAGE Transmitted to Unknown Destination]' }
      ];

      const renderedSlots = state.lockSequence.map((id, index) => {
        const item = evidenceItems.find(e => e.id === id) || evidenceItems[index];
        return `
          <div class="r4-lock-item-card" data-seq-id="${item.id}" data-seq-idx="${index}">
            <span class="r4-lock-slot-tag">ORDER STEP #0${index + 1}</span>
            <div class="r4-lock-item-val">${item.text}</div>
            <div class="r4-lock-shift-btns">
              <button type="button" class="r4-lock-btn-shift" data-shift-dir="-1" data-shift-idx="${index}" ${index === 0 ? 'disabled' : ''}>◀</button>
              <button type="button" class="r4-lock-btn-shift" data-shift-dir="1" data-shift-idx="${index}" ${index === 3 ? 'disabled' : ''}>▶</button>
            </div>
          </div>
        `;
      }).join('');

      sandboxHTML = `
        <div class="r4-puzzle-box">
          <div class="r4-c5-intro-box">
            <p>Four verified pieces of evidence have been recovered from different points of the investigation. They are NOT displayed in chronological order.</p>
            <p><strong>Your task is to reconstruct the sequence of the incident:</strong><br>
            FIRST EVENT &rarr; SECOND EVENT &rarr; THIRD EVENT &rarr; FINAL EVENT</p>
          </div>

          <div style="font-size:0.875rem; color:var(--r4-cyan); font-weight:700; margin-bottom:1rem; text-align:center;">
            "What is the chronological order in which these events occurred during the breach?"
          </div>

          <div class="r4-lock-slots-grid" id="r4-lock-grid">
            ${renderedSlots}
          </div>

          <div class="r4-subtle-note-box" style="margin-top:1rem;">
            <span>💡 Arrange cards in order and submit your sequence when ready.</span>
          </div>
        </div>
      `;
    }

    // ========================================================================
    // CHALLENGE 06: FINAL RECONSTRUCTION
    // Reconstruct the role/purpose of the 21:40 Message
    // Correct: Hypothesis C
    // Neutral placeholder: "ENTER YOUR ANSWER"
    // ========================================================================
    else if (currentId === 6) {
      metaType = 'FINAL RECONSTRUCTION';
      chalTitle = 'FINAL RECONSTRUCTION';
      chalSubtitle = 'ROUND 04 // CHALLENGE 06 / 06';
      customSubmitLabel = 'SUBMIT FINAL VERDICT →';
      inputPlaceholder = 'ENTER YOUR ANSWER';

      hintsArray = [
        'Review the breach vector at 21:39 and the terminal timeline at 21:37: Note how the timing of the 21:40 message connects with the remote access.',
        'Examine the timing of the message alongside the remote gateway and camera records: Does the transmission align with an ongoing coordination effort?'
      ];

      const theories = [
        {
          id: 'option_a',
          badge: 'HYPOTHESIS A',
          title: 'THE MESSAGE WAS A WARNING',
          body: 'The message may have been sent to warn another person that circumstances had changed. Its wording supports the idea that the sender was informing the recipient about a change in the situation. However, this explanation must be compared with the timing and other recovered evidence.'
        },
        {
          id: 'option_b',
          badge: 'HYPOTHESIS B',
          title: 'THE MESSAGE WAS A DISTRACTION',
          body: 'The message may have been intended to draw attention away from what was happening during the incident. This could explain why an unusual message was transmitted at 21:40, but the surrounding system and surveillance records must also be explained.'
        },
        {
          id: 'option_c',
          badge: 'HYPOTHESIS C',
          title: 'THE MESSAGE WAS PART OF THE COMMUNICATION DURING THE INCIDENT',
          body: 'The recovered message indicates that someone was communicating information about a change in the situation. Its timing is significant: the message was transmitted at 21:40, after remote activity had already been recorded and during the same sequence of events documented by the terminal and surveillance evidence. This suggests that the message was connected to the ongoing incident rather than being an unrelated system event.'
        }
      ];

      const theoryCardsHTML = theories.map(t => `
        <div class="r4-theory-card ${state.selectedTheory === t.id ? 'r4-theory-selected' : ''}" data-theory="${t.id}">
          <div class="r4-theory-header">
            <span class="r4-theory-title">${t.title}</span>
            <span class="r4-theory-badge">${t.badge}</span>
          </div>
          <div class="r4-theory-breakdown">
            <p style="font-size:0.85rem; color:var(--r4-text-secondary); line-height:1.5;">${t.body}</p>
          </div>
          <div class="r4-theory-select-bar">
            <span class="r4-radio-circle ${state.selectedTheory === t.id ? 'r4-radio-checked' : ''}"></span>
            <span style="font-size:0.8rem; font-weight:700;">${state.selectedTheory === t.id ? 'SELECTED CONCLUSION' : 'CLICK TO SELECT'}</span>
          </div>
        </div>
      `).join('');

      sandboxHTML = `
        <div class="r4-puzzle-box">
          <div class="r4-evidence-wall">
            <div class="r4-evidence-wall-title">📁 ASSEMBLED CASE EVIDENCE WALL</div>
            <div class="r4-wall-items-grid">
              <div class="r4-wall-item"><strong>#01 TRANSMISSION:</strong> IF THIS REACHES YOU, THE PLAN HAS CHANGED.</div>
              <div class="r4-wall-item"><strong>#02 TIMELINE:</strong> 21:38 Entry / 21:39 Exit / 21:40 Signal</div>
              <div class="r4-wall-item"><strong>#03 TRANSMISSION:</strong> 21:40 DIGITAL MESSAGE (RECOVERED SEQUENCE: 19-9-7-14-1-12)</div>
              <div class="r4-wall-item"><strong>#04 SURVEILLANCE:</strong> Camera Frame 21:39:19 [Offline]</div>
            </div>
          </div>

          <div style="font-size:0.9rem; color:var(--r4-cyan); font-weight:700; margin-bottom:0.5rem; text-align:center;">
            FINAL DEDUCTIVE VERDICT
          </div>
          <div style="font-size:0.85rem; color:var(--r4-text-secondary); text-align:center; margin-bottom:1rem;">
            "After examining the complete recovered evidence, determine what role the 21:40 message played in the Signal Incident.<br>Which conclusion best explains why this message was transmitted during the incident?"
          </div>

          <div class="r4-theories-grid">
            ${theoryCardsHTML}
          </div>

          <div class="r4-subtle-note-box" style="margin-top:1.25rem;">
            <span>💡 Review all hypotheses and submit your verdict when ready.</span>
          </div>
        </div>
      `;
    }

    // Build Hint Display HTML
    let activeHintHTML = '';
    if (currentHintLvl > 0 && hintsArray.length > 0) {
      const shownHints = hintsArray.slice(0, currentHintLvl).map((h, i) => `
        <div style="margin-bottom:${i < currentHintLvl - 1 ? '0.5rem' : '0'};">
          <strong>HINT ${i + 1}:</strong> ${h}
        </div>
      `).join('');

      activeHintHTML = `
        <div class="r4-hint-revealed-box" role="note">
          <span class="r4-hint-icon">💡</span>
          <div>${shownHints}</div>
        </div>
      `;
    }

    const maxHints = hintsArray.length;
    const canUseMoreHints = currentHintLvl < maxHints && !isStageSubmitted;

    // Assemble Main Card
    cardEl.innerHTML = `
      <div class="r4-chal-meta-row">
        <span class="r4-chal-type-badge">${metaType}</span>
        <span class="r4-chal-points-badge">+${currentId === 6 ? CONFIG.POINTS_FINAL_CHALLENGE : CONFIG.POINTS_NORMAL_CHALLENGE} PTS</span>
      </div>

      <h2 class="r4-chal-title">${chalTitle}</h2>
      <p class="r4-chal-subtitle">${chalSubtitle}</p>

      ${sandboxHTML}

      <div class="r4-chal-actions">
        <form id="r4-answer-form" class="r4-answer-row" novalidate>
          <div class="r4-answer-input-box">
            <input 
              type="text" 
              id="r4-answer-input" 
              class="r4-input r4-answer-input" 
              placeholder="${inputPlaceholder}" 
              autocomplete="off" 
              spellcheck="false" 
              ${isStageSubmitted ? 'disabled' : 'required'}
              aria-label="Your Finding"
            >
          </div>
          <button type="submit" id="r4-btn-submit-answer" class="r4-btn r4-btn-primary" ${isStageSubmitted ? 'disabled' : ''}>
            ${customSubmitLabel}
          </button>
        </form>

        <!-- Inline Continue / Stage Result Banner (Positioned Directly Below Submit Button) -->
        <div id="r4-continue-banner" class="r4-continue-card-inline" style="display:none;"></div>

        <div class="r4-action-buttons-row">
          <button 
            type="button" 
            id="r4-btn-use-hint" 
            class="r4-btn r4-btn-secondary" 
            ${!canUseMoreHints ? 'disabled' : ''}
          >
            💡 ${currentHintLvl > 0 ? (canUseMoreHints ? `NEXT HINT (${currentHintLvl}/${maxHints}) -20 PTS` : 'ALL HINTS UNLOCKED') : 'REQUEST HINT ( -20 PTS )'}
          </button>
        </div>

        ${activeHintHTML}
      </div>
    `;

    attachChallengeEvents(currentId);

    // If stage was already submitted, show locked state banner
    if (isStageSubmitted) {
      const subInfo = state.submittedStages[currentId];
      if (subInfo.isCorrect) {
        const def = CONFIG.EVIDENCE_DEFS[currentId - 1];
        showContinueBanner('✓ DISCOVERY VERIFIED', def.tag, def.value, def.desc, currentId);
      } else {
        showLockedBanner(currentId);
      }
    }
  }

  // --------------------------------------------------------------------------
  // 11. ATTACH CHALLENGE INTERACTION EVENTS
  // --------------------------------------------------------------------------
  function attachChallengeEvents(currentId) {
    const isStageSubmitted = !!state.submittedStages[currentId];
    const inputEl = document.getElementById('r4-answer-input');
    const answerForm = document.getElementById('r4-answer-form');
    const hintBtn = document.getElementById('r4-btn-use-hint');

    // Hint Modal Trigger
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        if (!isStageSubmitted) openHintModal(currentId);
      });
    }

    // Form Submit Listener
    if (answerForm) {
      answerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (isStageSubmitted) return;
        const val = inputEl ? inputEl.value : '';
        submitCurrentChallenge(val);
      });
    }

    // Challenge 01 Events (Neutral Character Inspection)
    if (currentId === 1) {
      document.querySelectorAll('.r4-cipher-char').forEach(charEl => {
        charEl.addEventListener('click', () => {
          const char = charEl.getAttribute('data-char');
          const pos = parseInt(charEl.getAttribute('data-char-pos'), 10);
          state.c1SelectedChar = char;
          state.c1SelectedPos = pos;
          renderActiveChallenge();
        });
      });
    }

    // Challenge 02 Events (Suspect selection)
    if (currentId === 2) {
      document.querySelectorAll('.r4-suspect-card').forEach(card => {
        card.addEventListener('click', () => {
          if (isStageSubmitted) return;
          const suspect = card.getAttribute('data-suspect');
          state.selectedSuspect = suspect;
          document.querySelectorAll('.r4-suspect-card').forEach(c => c.classList.remove('r4-suspect-selected'));
          document.querySelectorAll('.r4-c2-suspect-btn').forEach(b => b.classList.remove('r4-suspect-selected'));
          card.classList.add('r4-suspect-selected');
          document.querySelectorAll(`.r4-c2-suspect-btn[data-c2-suspect="${suspect}"]`).forEach(b => b.classList.add('r4-suspect-selected'));
          if (inputEl) inputEl.value = suspect.toUpperCase();
        });
      });

      document.querySelectorAll('.r4-c2-suspect-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (isStageSubmitted) return;
          const suspect = btn.getAttribute('data-c2-suspect');
          state.selectedSuspect = suspect;
          document.querySelectorAll('.r4-suspect-card').forEach(c => {
            if (c.getAttribute('data-suspect') === suspect) c.classList.add('r4-suspect-selected');
            else c.classList.remove('r4-suspect-selected');
          });
          document.querySelectorAll('.r4-c2-suspect-btn').forEach(b => {
            if (b.getAttribute('data-c2-suspect') === suspect) b.classList.add('r4-suspect-selected');
            else b.classList.remove('r4-suspect-selected');
          });
          if (inputEl) inputEl.value = suspect.toUpperCase();
        });
      });

      // Evidence cards timestamp highlighting
      document.querySelectorAll('.r4-c2-evidence-card').forEach(card => {
        card.addEventListener('click', () => {
          const node = card.getAttribute('data-ev-node');
          document.querySelectorAll('.r4-c2-evidence-card').forEach(c => c.classList.remove('r4-ev-active'));
          card.classList.add('r4-ev-active');

          document.querySelectorAll('.r4-c2-tl-node').forEach(n => n.classList.remove('r4-node-active'));
          if (node === 'sig') {
            document.querySelectorAll('.r4-c2-tl-node').forEach(n => {
              if (n.textContent.includes('21:40')) n.classList.add('r4-node-active');
            });
          } else if (node === 'noah-in') {
            document.querySelectorAll('.r4-c2-tl-node').forEach(n => {
              if (n.textContent.includes('21:38') || n.textContent.includes('21:42')) n.classList.add('r4-node-active');
            });
          } else if (node === 'term') {
            document.querySelectorAll('.r4-c2-tl-node').forEach(n => {
              if (n.textContent.includes('21:37')) n.classList.add('r4-node-active');
            });
          } else if (node === 'noah-out') {
            document.querySelectorAll('.r4-c2-tl-node').forEach(n => {
              if (n.textContent.includes('21:39')) n.classList.add('r4-node-active');
            });
          } else if (node === 'sec') {
            document.querySelectorAll('.r4-c2-tl-node').forEach(n => {
              if (n.textContent.includes('21:38')) n.classList.add('r4-node-active');
            });
          }
        });
      });

      // Timeline node clicks
      document.querySelectorAll('.r4-c2-tl-node').forEach(node => {
        node.addEventListener('click', () => {
          const suspect = node.getAttribute('data-target-suspect');
          if (suspect && !isStageSubmitted) {
            state.selectedSuspect = suspect;
            document.querySelectorAll('.r4-suspect-card').forEach(c => {
              if (c.getAttribute('data-suspect') === suspect) c.classList.add('r4-suspect-selected');
              else c.classList.remove('r4-suspect-selected');
            });
            document.querySelectorAll('.r4-c2-suspect-btn').forEach(b => {
              if (b.getAttribute('data-c2-suspect') === suspect) b.classList.add('r4-suspect-selected');
              else b.classList.remove('r4-suspect-selected');
            });
            if (inputEl) inputEl.value = suspect.toUpperCase();
          }
        });
      });
    }

    // Challenge 03 Events (Terminal file switching & Index inspection)
    if (currentId === 3) {
      document.querySelectorAll('.r4-term-file-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const fileNum = parseInt(btn.getAttribute('data-file'), 10);
          state.activeTerminalFile = fileNum;
          renderActiveChallenge();
        });
      });

      document.querySelectorAll('.r4-c3-index-cell').forEach(cell => {
        cell.addEventListener('click', () => {
          const num = parseInt(cell.getAttribute('data-idx-num'), 10);
          state.c3InspectedIndices[num] = true;
          const letter = String.fromCharCode(64 + num);
          const statusEl = document.getElementById('r4-c3-index-status');
          if (statusEl) {
            statusEl.innerHTML = `<span style="color:var(--r4-cyan);">INDEX ${String(num).padStart(2, '0')} &rarr; MEMORY VALUE: <strong>${letter}</strong> (STATUS: VERIFIED)</span>`;
          }
          renderActiveChallenge();
        });
      });
    }

    // Challenge 04 Events (Room object inspection & selection)
    if (currentId === 4) {
      document.querySelectorAll('.r4-room-object').forEach(obj => {
        obj.addEventListener('click', () => {
          const objId = obj.getAttribute('data-room-obj');
          state.selectedRoomObj = objId;
          if (!state.inspectedRoomObjects) state.inspectedRoomObjects = {};
          state.inspectedRoomObjects[objId] = true;
          saveState();
          renderActiveChallenge();
        });
      });

      document.querySelectorAll('.r4-c4-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (isStageSubmitted) return;
          const target = btn.getAttribute('data-c4-target');
          state.selectedRoomObj = target;
          if (inputEl) inputEl.value = target.toUpperCase();
          renderActiveChallenge();
        });
      });
    }

    // Challenge 05 Events (Lock position shifting)
    if (currentId === 5) {
      document.querySelectorAll('.r4-lock-btn-shift').forEach(btn => {
        btn.addEventListener('click', () => {
          if (isStageSubmitted) return;
          const idx = parseInt(btn.getAttribute('data-shift-idx'), 10);
          const dir = parseInt(btn.getAttribute('data-shift-dir'), 10);
          const targetIdx = idx + dir;

          if (targetIdx >= 0 && targetIdx < state.lockSequence.length) {
            const temp = state.lockSequence[idx];
            state.lockSequence[idx] = state.lockSequence[targetIdx];
            state.lockSequence[targetIdx] = temp;
            if (inputEl) inputEl.value = state.lockSequence.join(' ');
            renderActiveChallenge();
          }
        });
      });
    }

    // Challenge 06 Events (Theory inspection & selection)
    if (currentId === 6) {
      document.querySelectorAll('.r4-theory-card').forEach(card => {
        card.addEventListener('click', () => {
          if (isStageSubmitted) return;
          const theory = card.getAttribute('data-theory');
          state.selectedTheory = theory;
          document.querySelectorAll('.r4-theory-card').forEach(c => c.classList.remove('r4-theory-selected'));
          card.classList.add('r4-theory-selected');
          if (inputEl) inputEl.value = theory.replace('_', ' ').toUpperCase();
          renderActiveChallenge();
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // 12. SUBMISSION & VERIFICATION ENGINE
  // --------------------------------------------------------------------------
  function submitCurrentChallenge(rawInput) {
    if (state.status !== 'active') return;

    const currentId = state.currentChallengeId;
    if (state.submittedStages[currentId]) return; // Already submitted / completed

    const trimmed = (rawInput || '').trim();
    const normalized = trimmed.toLowerCase().replace(/\s+/g, ' ');
    const compact = normalized.replace(/[^a-z0-9]/g, '');

    let isCorrect = false;
    let earnedPoints = CONFIG.POINTS_NORMAL_CHALLENGE;
    let successTitle = 'TRANSMISSION RESTORED ✓';
    let evidenceTitle = 'RECOVERED EVIDENCE #01';
    let evidenceVal = 'IF THIS REACHES YOU, THE PLAN HAS CHANGED.';
    let successSubtitle = 'The recovered transmission has been added to the case file.';

    // ========================================================================
    // VALIDATE CHALLENGE 01 (Supports multiple submissions)
    // Correct: "IF THIS REACHES YOU, THE PLAN HAS CHANGED."
    // ========================================================================
    if (currentId === 1) {
      const targetCompact = 'ifthisreachesyoutheplanhaschanged';
      if (compact === targetCompact || normalized === 'if this reaches you, the plan has changed.' || normalized === 'if this reaches you the plan has changed') {
        isCorrect = true;
        successTitle = 'TRANSMISSION RESTORED ✓';
        evidenceTitle = 'EVIDENCE 01 UNLOCKED';
        evidenceVal = 'IF THIS REACHES YOU, THE PLAN HAS CHANGED.';
        successSubtitle = 'The recovered transmission has been added to the case file.';
        unlockEvidence(1);
      }

      if (isCorrect) {
        state.score += earnedPoints;
        if (!state.completedChallenges.includes(1)) {
          state.completedChallenges.push(1);
        }
        state.submittedStages[1] = {
          isCorrect: true,
          answer: trimmed,
          timestamp: Date.now()
        };
        showContinueBanner(successTitle, evidenceTitle, evidenceVal, successSubtitle, 1);
        updateHUD();
        saveState();
        renderActiveChallenge();
        return;
      } else {
        // Stage 01 incorrect attempt does NOT lock out the participant!
        state.stage1Attempts += 1;
        state.wrongAttempts += 1;
        state.score = Math.max(0, state.score - CONFIG.PENALTY_WRONG_ANSWER);
        saveState();
        updateHUD();

        const feedbackArea = document.getElementById('r4-game-feedback');
        if (feedbackArea) {
          feedbackArea.innerHTML = `
            <div class="r4-feedback-box r4-feedback-error">
              <span class="r4-feedback-icon">✕</span>
              <div>
                <strong>TRANSMISSION NOT RESTORED</strong><br>
                The submitted reconstruction does not match the recovered evidence. Inspect the message structure and try again.
              </div>
            </div>
          `;
        }
        return;
      }
    }

    // ========================================================================
    // VALIDATE CHALLENGE 02 (Multiple Choice - One Attempt)
    // Correct: "NOAH"
    // ========================================================================
    else if (currentId === 2) {
      if (state.selectedSuspect === 'noah' || compact.includes('noah')) {
        isCorrect = true;
        successTitle = 'CONTRADICTION FOUND ✓';
        evidenceTitle = 'EVIDENCE 02 UNLOCKED';
        evidenceVal = 'ACCESS TIMELINE (21:38 ENTRY / 21:39 EXIT / 21:40 SIGNAL)';
        successSubtitle = 'Noah claimed he remained inside until after the signal, but exit logs prove departure at 21:39.';
        unlockEvidence(2);
      }
    }

    // ========================================================================
    // VALIDATE CHALLENGE 03 (Text / Keyword - One Attempt)
    // Correct: "SIGNAL"
    // ========================================================================
    else if (currentId === 3) {
      if (compact === 'signal') {
        isCorrect = true;
        successTitle = 'RECOVERY CONFIRMED ✓';
        evidenceTitle = 'EVIDENCE 03 UNLOCKED';
        evidenceVal = '21:40 DIGITAL MESSAGE';
        successSubtitle = 'Terminal record connected to the 21:40 transmission.';
        unlockEvidence(3);
      }
    }

    // ========================================================================
    // VALIDATE CHALLENGE 04 (Observation / Selection - One Attempt)
    // Correct: "CAMERA"
    // ========================================================================
    else if (currentId === 4) {
      if (state.selectedRoomObj === 'camera' || compact.includes('camera')) {
        isCorrect = true;
        successTitle = 'INVESTIGATION CONCLUSION VERIFIED ✓';
        evidenceTitle = 'EVIDENCE #04 RECOVERED';
        evidenceVal = 'CAMERA RECORD — 21:39:19';
        successSubtitle = 'The recovered camera record confirms a subject was physically present inside the Control Room at 21:39:19. IDENTITY: UNRESOLVED.';
        unlockEvidence(4);
      }
    }

    // ========================================================================
    // VALIDATE CHALLENGE 05 (Sequencing - One Attempt)
    // Correct: 1 2 4 3
    // ========================================================================
    else if (currentId === 5) {
      const seqStr = state.lockSequence.join('');
      if (seqStr === '1243' || compact === '1243' || compact.includes('1243')) {
        isCorrect = true;
        successTitle = 'CHRONOLOGY ACCEPTED ✓';
        evidenceTitle = 'EVIDENCE 05 UNLOCKED';
        evidenceVal = 'MASTER BREACH SEQUENCE: 1 → 2 → 4 → 3';
        successSubtitle = 'Incident timeline reconstructed across all evidence points.';
        unlockEvidence(5);
      }
    }

    // ========================================================================
    // VALIDATE CHALLENGE 06 (Final Verdict - One Attempt)
    // Correct: Hypothesis C (Communication regarding plan change during incident)
    // ========================================================================
    else if (currentId === 6) {
      earnedPoints = CONFIG.POINTS_FINAL_CHALLENGE;
      const isOptionC = state.selectedTheory === 'option_c' || 
                        compact.includes('optionc') || 
                        compact.includes('hypothesisc') || 
                        compact.includes('communication') || 
                        compact.includes('partofthecommunication') ||
                        compact.includes('planhaschanged');

      if (isOptionC) {
        isCorrect = true;
        successTitle = 'FINAL DEDUCTION VERIFIED ✓';
        evidenceTitle = 'EVIDENCE 06 UNLOCKED';
        evidenceVal = 'THE MESSAGE WAS PART OF THE COMMUNICATION DURING THE INCIDENT';
        successSubtitle = 'The 21:40 transmission was an active communication payload sent during the incident, alerting the unknown recipient to an operational plan change.';
        unlockEvidence(6);
      }
    }

    // Record submission permanently for stages 2-6
    state.submittedStages[currentId] = {
      isCorrect: isCorrect,
      answer: trimmed,
      timestamp: Date.now()
    };

    // Process Submission Outcome for stages 2-6
    if (isCorrect) {
      state.score += earnedPoints;
      if (!state.completedChallenges.includes(currentId)) {
        state.completedChallenges.push(currentId);
      }

      showContinueBanner(successTitle, evidenceTitle, evidenceVal, successSubtitle, currentId);
      updateHUD();
      saveState();

      if (currentId === 6) {
        state.status = 'completed';
        state.completionTime = Date.now();
        saveState();
        setTimeout(() => {
          triggerVictoryFlow();
        }, 2200);
      }
    } else {
      state.wrongAttempts += 1;
      state.score = Math.max(0, state.score - CONFIG.PENALTY_WRONG_ANSWER);
      saveState();
      updateHUD();

      showLockedBanner(currentId);

      if (currentId === 6) {
        state.status = 'completed';
        state.completionTime = Date.now();
        saveState();
        setTimeout(() => {
          triggerVictoryFlow();
        }, 2500);
      }
    }

    renderActiveChallenge();
  }

  function showContinueBanner(title, evTag, evVal, subtitle, stageId) {
    const continueBanner = document.getElementById('r4-continue-banner');
    if (!continueBanner) return;

    continueBanner.innerHTML = `
      <div class="r4-continue-header">${title}</div>
      <div class="r4-continue-evidence-box">
        <span class="r4-continue-ev-tag">${evTag}</span>
        <div class="r4-continue-ev-val">${evVal}</div>
      </div>
      <p style="font-size:0.9rem; color:var(--r4-text-secondary); margin-bottom:1.25rem;">
        ${subtitle}
      </p>
      ${stageId < 6 ? `
        <button type="button" id="r4-btn-continue-stage" class="r4-btn r4-btn-primary r4-btn-lg r4-btn-glow">
          CONTINUE TO STAGE 0${stageId + 1} &rarr;
        </button>
      ` : `
        <div style="font-family:var(--r4-font-mono); font-size:0.85rem; color:var(--r4-success); font-weight:700;">
          FINALIZING CASE REPORT...
        </div>
      `}
    `;

    continueBanner.style.display = 'block';

    const nextBtn = document.getElementById('r4-btn-continue-stage');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        state.currentChallengeId = stageId + 1;
        saveState();
        renderActiveChallenge();
        updateHUD();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function showLockedBanner(stageId) {
    const continueBanner = document.getElementById('r4-continue-banner');
    if (!continueBanner) return;

    let lockedMessage = 'Your answer has been permanently recorded. This challenge has been locked.';
    if (stageId === 2) {
      lockedMessage = '✕ ANSWER RECORDED: Your selection has been locked. The investigation continues.';
    } else if (stageId === 3) {
      lockedMessage = '✕ ANSWER RECORDED: Your investigation continues. Your final submission has been locked.';
    } else if (stageId === 4) {
      lockedMessage = 'INVESTIGATION DECISION LOCKED: Your conclusion has been recorded. The investigation must continue with the evidence currently recovered.';
    } else if (stageId === 5) {
      lockedMessage = '✕ SEQUENCE LOCKED: Your chronological reconstruction has been permanently locked.';
    } else if (stageId === 6) {
      lockedMessage = 'VERDICT RECORDED: Your final deduction has been recorded.';
    }

    continueBanner.innerHTML = `
      <div class="r4-continue-header" style="color:var(--r4-danger);">🔒 DECISION LOCKED</div>
      <p style="font-size:0.9rem; color:var(--r4-text-secondary); margin-bottom:1.25rem;">
        ${lockedMessage}
      </p>
      ${stageId < 6 ? `
        <button type="button" id="r4-btn-continue-stage" class="r4-btn r4-btn-secondary r4-btn-lg">
          CONTINUE TO STAGE 0${stageId + 1} &rarr;
        </button>
      ` : `
        <button type="button" id="r4-btn-view-report" class="r4-btn r4-btn-primary r4-btn-lg">
          VIEW FINAL REPORT &rarr;
        </button>
      `}
    `;

    continueBanner.style.display = 'block';

    const nextBtn = document.getElementById('r4-btn-continue-stage');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        state.currentChallengeId = stageId + 1;
        saveState();
        renderActiveChallenge();
        updateHUD();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const reportBtn = document.getElementById('r4-btn-view-report');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => {
        triggerVictoryFlow();
      });
    }
  }

  function unlockEvidence(evidenceId) {
    if (!state.evidenceUnlocked.includes(evidenceId)) {
      state.evidenceUnlocked.push(evidenceId);
      updateEvidenceDrawer();
    }
  }

  // --------------------------------------------------------------------------
  // 13. HINT SYSTEM (Progressive Subtle Hints)
  // --------------------------------------------------------------------------
  let pendingHintChallengeId = null;

  function openHintModal(chalId) {
    if (state.status !== 'active') return;
    pendingHintChallengeId = chalId;
    const modalEl = document.getElementById('r4-hint-modal');
    if (modalEl) modalEl.removeAttribute('hidden');
  }

  function closeHintModal() {
    pendingHintChallengeId = null;
    const modalEl = document.getElementById('r4-hint-modal');
    if (modalEl) modalEl.setAttribute('hidden', '');
  }

  function confirmUseHint() {
    if (!pendingHintChallengeId || state.status !== 'active') return;

    const chalId = pendingHintChallengeId;
    const currentLvl = state.hintLevel[chalId] || 0;
    
    // Increment hint level and hints used
    state.hintLevel[chalId] = currentLvl + 1;
    state.hintsUsed += 1;
    
    // Explicit -20 PTS deduction directly subtracted from score
    state.score -= CONFIG.PENALTY_HINT;
    
    saveState();
    closeHintModal();
    updateHUD();
    renderActiveChallenge();
  }

  // --------------------------------------------------------------------------
  // 14. CASE DOSSIER MODAL (Review Briefing during Investigation)
  // --------------------------------------------------------------------------
  function openDossierModal() {
    const modalEl = document.getElementById('r4-dossier-modal');
    if (modalEl) modalEl.removeAttribute('hidden');
  }

  function closeDossierModal() {
    const modalEl = document.getElementById('r4-dossier-modal');
    if (modalEl) modalEl.setAttribute('hidden', '');
  }

  // --------------------------------------------------------------------------
  // 15. VICTORY & FINAL REPORT FLOW
  // --------------------------------------------------------------------------
  function triggerVictoryFlow() {
    if (timerInterval) clearInterval(timerInterval);

    const elapsedSeconds = state.startTime && state.completionTime ? 
      Math.floor((state.completionTime - state.startTime) / 1000) : 
      (CONFIG.TOTAL_TIME_SECONDS - getRemainingSeconds());

    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    const timeTakenFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const scoreEl = document.getElementById('r4-complete-score');
    const timeEl = document.getElementById('r4-complete-time');
    const chalEl = document.getElementById('r4-complete-challenges');

    if (scoreEl) scoreEl.textContent = `${state.score} PTS`;
    if (timeEl) timeEl.textContent = timeTakenFormatted;
    if (chalEl) chalEl.textContent = `${state.completedChallenges.length} / 6`;

    // AUTOMATIC SUPABASE DB SCORE TRANSMISSION (ROUND 4)
    if (typeof window !== 'undefined' && window.TournamentDB && typeof window.TournamentDB.saveRoundScore === 'function') {
      const teamId = localStorage.getItem("current_team_id");
      if (teamId) {
        window.TournamentDB.saveRoundScore(teamId, 4, state.score)
          .then(res => console.log("🏆 [Supabase DB] Round 4 score saved under Team ID #" + teamId + ":", res))
          .catch(err => console.error("❌ [Supabase DB] Error saving Round 4 score:", err));
      }
    }

    setScreen('COMPLETED');
  }

  // --------------------------------------------------------------------------
  // 15B. NEXT ROUND HANDOFF
  // --------------------------------------------------------------------------
  function handleNextRoundHandoff() {
    const elapsedSeconds = state.startTime && state.completionTime ? 
      Math.floor((state.completionTime - state.startTime) / 1000) : 
      (CONFIG.TOTAL_TIME_SECONDS - getRemainingSeconds());

    const payload = {
      round: 4,
      roundName: 'The Signal Incident',
      score: state.score,
      stagesCompleted: state.completedChallenges.length,
      totalStages: 6,
      timeSpentSeconds: elapsedSeconds,
      status: state.status,
      evidenceUnlocked: [...state.evidenceUnlocked]
    };

    // Dispatch integration events for next round
    window.dispatchEvent(new CustomEvent('round4:completed', { detail: payload }));
    window.dispatchEvent(new CustomEvent('round:completed', { detail: payload }));

    // Support integration hooks
    if (typeof window.onRound4Complete === 'function') {
      window.onRound4Complete(payload);
    } else if (typeof window.proceedToNextRound === 'function') {
      window.proceedToNextRound(payload);
    } else if (typeof window.navigateToRound5 === 'function') {
      window.navigateToRound5(payload);
    } else {
      console.log('[ROUND 04] Handoff dispatched to next round:', payload);
      window.location.href = '../Round5/index.html';
    }
  }

  // --------------------------------------------------------------------------
  // 16. EVENT LISTENERS INITIALIZATION
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    // Briefing Tabs & Navigation
    document.querySelectorAll('.r4-briefing-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const step = parseInt(tab.getAttribute('data-briefing-step'), 10);
        setBriefingStep(step);
      });
    });

    const prevBriefingBtn = document.getElementById('r4-btn-prev-briefing');
    const nextBriefingBtn = document.getElementById('r4-btn-next-briefing');

    if (prevBriefingBtn) {
      prevBriefingBtn.addEventListener('click', () => {
        if (state.briefingStep > 1) {
          setBriefingStep(state.briefingStep - 1);
        }
      });
    }

    if (nextBriefingBtn) {
      nextBriefingBtn.addEventListener('click', () => {
        if (state.briefingStep < 8) {
          setBriefingStep(state.briefingStep + 1);
        }
      });
    }

    // Start Stage 01 Button
    const startStage01Btn = document.getElementById('r4-btn-begin-stage01');
    if (startStage01Btn) {
      startStage01Btn.addEventListener('click', () => {
        if (state.status === 'completed') {
          triggerVictoryFlow();
          return;
        }
        if (state.status === 'time_up') {
          handleTimeUp();
          return;
        }

        state.status = 'active';
        startTimer();
        saveState();
        setScreen('PLAYING');
        updateHUD();
        renderActiveChallenge();
      });
    }

    // Case Dossier Modal
    const openDossierBtn = document.getElementById('r4-btn-open-dossier');
    const closeDossierBtn = document.getElementById('r4-btn-close-dossier');
    const resumeDossierBtn = document.getElementById('r4-btn-dossier-resume');
    const dossierBackdrop = document.getElementById('r4-dossier-backdrop');

    if (openDossierBtn) openDossierBtn.addEventListener('click', openDossierModal);
    if (closeDossierBtn) closeDossierBtn.addEventListener('click', closeDossierModal);
    if (resumeDossierBtn) resumeDossierBtn.addEventListener('click', closeDossierModal);
    if (dossierBackdrop) dossierBackdrop.addEventListener('click', closeDossierModal);

    // Evidence Locker Drawer Toggle
    const evidenceToggleBtn = document.getElementById('r4-btn-toggle-evidence');
    const closeEvidenceBtn = document.getElementById('r4-btn-close-evidence');
    if (evidenceToggleBtn) evidenceToggleBtn.addEventListener('click', toggleEvidenceDrawer);
    if (closeEvidenceBtn) closeEvidenceBtn.addEventListener('click', toggleEvidenceDrawer);

    // Hint Modal Confirm / Cancel
    const confirmHintBtn = document.getElementById('r4-btn-confirm-hint');
    const cancelHintBtn = document.getElementById('r4-btn-cancel-hint');
    const hintBackdrop = document.getElementById('r4-hint-backdrop');

    if (confirmHintBtn) confirmHintBtn.addEventListener('click', confirmUseHint);
    if (cancelHintBtn) cancelHintBtn.addEventListener('click', closeHintModal);
    if (hintBackdrop) hintBackdrop.addEventListener('click', closeHintModal);

    // Continue to Next Round Buttons (Screen 03 & Screen 04)
    const completeContinueBtn = document.getElementById('r4-btn-complete-continue');
    const timeupContinueBtn = document.getElementById('r4-btn-timeup-continue');

    if (completeContinueBtn) completeContinueBtn.addEventListener('click', handleNextRoundHandoff);
    if (timeupContinueBtn) timeupContinueBtn.addEventListener('click', handleNextRoundHandoff);

    // Developer Test Mode Reset Button
    const devResetBtn = document.getElementById('r4-btn-dev-reset');
    if (devResetBtn) {
      devResetBtn.addEventListener('click', () => {
        if (confirm('DEVELOPER RESET: Clear all test progress and reset to initial briefing state?')) {
          adminReset();
        }
      });
    }

    // Escape and Shortcut Key Handling
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeHintModal();
        closeDossierModal();
        if (state.evidenceDrawerOpen) toggleEvidenceDrawer();
      }

      // Quick Admin Reset Shortcut: Ctrl + Shift + R
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        adminReset();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 17. INITIALIZATION WITH ATTEMPT RESTORATION
  // --------------------------------------------------------------------------
  function init() {
    BackgroundAnimation.init();
    setupEventListeners();

    // Check if Developer Test Mode is requested via URL query param
    const search = window.location.search ? window.location.search.toLowerCase() : '';
    if (search.includes('devreset=true') || search.includes('dev=true') || search.includes('test=true') || search.includes('debug=true')) {
      const devBar = document.getElementById('r4-dev-mode-bar');
      if (devBar) devBar.style.display = 'flex';
    }

    // Load any existing session
    const hasExistingState = loadState();

    // 1. If already completed
    if (state.status === 'completed') {
      triggerVictoryFlow();
      return;
    }

    // 2. If already expired
    if (state.status === 'time_up') {
      handleTimeUp();
      return;
    }

    // 3. If attempt is active
    if (state.status === 'active') {
      const remainingSeconds = getRemainingSeconds();
      if (remainingSeconds <= 0) {
        handleTimeUp();
      } else {
        setScreen('PLAYING');
        startTimer();
        updateHUD();
        renderActiveChallenge();
      }
      return;
    }

    // 4. Default: Briefing screen
    state.status = 'not_started';
    setScreen('BRIEFING');
    setBriefingStep(1);
  }

  return {
    init,
    adminReset,
    submitCurrentChallenge,
    getState: () => ({ ...state })
  };
})();

// Expose global helper for easy testing
window.adminReset = Round4CrypticQuest.adminReset;
window.resetRound4 = Round4CrypticQuest.adminReset;
window.Round4Reset = Round4CrypticQuest.adminReset;

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Round4CrypticQuest.init();
});
