/**
 * AVENGERS // RESISTANCE GRID - Main Application Controller
 * Sector-07 Crisis Response Terminal (8-Phase / 15-Minute Global Timer Engine)
 */

(function () {
    'use strict';

    // Application State
    const state = {
        teamName: "STRIKE-FORCE OMEGA",
        currentPhaseIndex: 1, // 1 to 10
        totalPhases: 10,
        rawScore: 0,
        decisionHistory: [], // array of { phaseNumber, title, optionKey, optionTitle, tier, points, consequence }
        globalTimeRemaining: GAME_DATA.GLOBAL_TIME_LIMIT_SECONDS, // 15:00 (900 seconds)
        timerInterval: null,
        isMissionActive: false
    };

    // DOM Elements Cache
    const DOM = {
        // Badges & Controls
        globalTimerBadge: document.getElementById('global-timer-badge'),
        globalTimerVal: document.getElementById('global-timer-val'),
        teamBadgeText: document.getElementById('team-badge-text'),
        soundToggleBtn: document.getElementById('sound-toggle-btn'),
        fullscreenToggleBtn: document.getElementById('fullscreen-toggle-btn'),

        // Phase Progress Bar Container
        phaseProgressBar: document.getElementById('phase-progress-bar'),

        // Screens
        screenBriefing: document.getElementById('screen-briefing'),
        screenDecision: document.getElementById('screen-decision'),
        screenConsequence: document.getElementById('screen-consequence'),
        screenResults: document.getElementById('screen-results'),

        // Screen 1: Briefing
        teamNameInput: document.getElementById('team-name-input'),
        randomCallsignBtn: document.getElementById('random-callsign-btn'),
        beginMissionBtn: document.getElementById('begin-mission-btn'),

        // Screen 2: Decision
        decisionPhaseTag: document.getElementById('decision-phase-tag'),
        decisionTitle: document.getElementById('decision-title'),
        decisionThreatBadge: document.getElementById('decision-threat-badge'),
        situationText: document.getElementById('situation-text'),
        optionsGrid: document.getElementById('options-grid'),

        // Screen 3: Consequence
        consequencePhaseTag: document.getElementById('consequence-phase-tag'),
        consequenceChoiceTitle: document.getElementById('consequence-choice-title'),
        consequenceText: document.getElementById('consequence-text'),
        consequenceNotice: document.getElementById('consequence-notice'),
        consequenceContinueBtn: document.getElementById('consequence-continue-btn'),

        // Screen 4: Results
        resultsHeroCard: document.getElementById('results-hero-card'),
        resultsBadgePill: document.getElementById('results-badge-pill'),
        resultsEndingTitle: document.getElementById('results-ending-title'),
        resultsNarrationText: document.getElementById('results-narration-text'),
        resultsEvalText: document.getElementById('results-eval-text'),
        pathNodesContainer: document.getElementById('path-nodes-container'),
        resultsTotalScore: document.getElementById('results-total-score'),
        resultsTierLabel: document.getElementById('results-tier-label'),
        scoreMeterVal: document.getElementById('score-meter-val'),
        scoreMeterFill: document.getElementById('score-meter-fill'),
        restartMissionBtn: document.getElementById('restart-mission-btn')
    };

    function updateHeaderVisibility() {
        const p1 = document.getElementById('screen-r5-title');
        const hud = document.querySelector('.hud-header');
        const bar = document.querySelector('.phase-progress-bar');
        if (p1 && p1.classList.contains('active')) {
            if (hud) hud.style.display = 'none';
            if (bar) bar.style.display = 'none';
        } else {
            if (hud) hud.style.display = 'flex';
            if (bar) bar.style.display = 'flex';
        }
    }
    window.updateHeaderVisibility = updateHeaderVisibility;

    // Initialize App
    function init() {
        setupEventListeners();
        generateRandomCallsign();
        updatePhasePills(0);
        updateSoundButtonVisual();
        formatGlobalTimerDisplay(state.globalTimeRemaining);
        updateHeaderVisibility();
    }

    // Event Listeners
    function setupEventListeners() {
        // Callsign Reroll
        if (DOM.randomCallsignBtn) {
            DOM.randomCallsignBtn.addEventListener('click', () => {
                tacticalAudio.playReroll();
                generateRandomCallsign();
            });
        }

        // Sound Toggle
        if (DOM.soundToggleBtn) {
            DOM.soundToggleBtn.addEventListener('click', () => {
                const isMuted = tacticalAudio.toggleMute();
                updateSoundButtonVisual();
                if (!isMuted) tacticalAudio.playClick();
            });
        }

        // Fullscreen Toggle
        if (DOM.fullscreenToggleBtn) {
            DOM.fullscreenToggleBtn.addEventListener('click', toggleFullscreen);
        }

        // Begin Mission
        if (DOM.beginMissionBtn) {
            DOM.beginMissionBtn.addEventListener('click', startMission);
        }

        // Enter key in callsign input
        if (DOM.teamNameInput) {
            DOM.teamNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    startMission();
                }
            });
        }

        // Consequence Continue Button
        if (DOM.consequenceContinueBtn) {
            DOM.consequenceContinueBtn.addEventListener('click', () => {
                tacticalAudio.playClick();
                advanceToNextPhase();
            });
        }

        // Restart Mission Button
        if (DOM.restartMissionBtn) {
            DOM.restartMissionBtn.addEventListener('click', () => {
                tacticalAudio.playClick();
                resetMission();
            });
        }

        // Keyboard Shortcuts (1, 2, 3 for Options, Space/Enter for continue)
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    // Keyboard navigation helper
    function handleKeyboardShortcuts(e) {
        if (document.activeElement === DOM.teamNameInput) return;

        // Decision screen option hotkeys
        if (DOM.screenDecision.classList.contains('active')) {
            if (e.key === '1' || e.key === 'a' || e.key === 'A') {
                selectOptionByIndex(0);
            } else if (e.key === '2' || e.key === 'b' || e.key === 'B') {
                selectOptionByIndex(1);
            } else if (e.key === '3' || e.key === 'c' || e.key === 'C') {
                selectOptionByIndex(2);
            }
        }

        // Consequence screen advance
        if (DOM.screenConsequence.classList.contains('active')) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                advanceToNextPhase();
            }
        }
    }

    function selectOptionByIndex(index) {
        const optionCards = DOM.optionsGrid.querySelectorAll('.option-card');
        if (optionCards && optionCards[index]) {
            optionCards[index].click();
        }
    }

    // Generate random Marvel tactical callsign
    function generateRandomCallsign() {
        const callsigns = GAME_DATA.CALLSIGNS;
        const randomIndex = Math.floor(Math.random() * callsigns.length);
        const name = callsigns[randomIndex];
        state.teamName = name;
        if (DOM.teamNameInput) DOM.teamNameInput.value = name;
    }

    // Update sound toggle UI
    function updateSoundButtonVisual() {
        if (!DOM.soundToggleBtn) return;
        if (tacticalAudio.isMuted) {
            DOM.soundToggleBtn.classList.add('muted');
            DOM.soundToggleBtn.title = "Tactical Audio: MUTED (Click to Enable)";
        } else {
            DOM.soundToggleBtn.classList.remove('muted');
            DOM.soundToggleBtn.title = "Tactical Audio: ACTIVE";
        }
    }

    // Fullscreen toggle helper
    function toggleFullscreen() {
        tacticalAudio.playClick();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => { });
            }
        }
    }

    // Switch visible screen
    function showScreen(screenEl) {
        const screens = [DOM.screenBriefing, DOM.screenDecision, DOM.screenConsequence, DOM.screenResults];
        screens.forEach(s => {
            if (s) s.classList.remove('active');
        });
        if (screenEl) {
            screenEl.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        updateHeaderVisibility();
    }

    // Update Top Phase Step Pills (8 phases)
    function updatePhasePills(activePhaseNum) {
        for (let i = 1; i <= state.totalPhases; i++) {
            const pill = document.getElementById(`pill-phase-${i}`);
            if (!pill) continue;

            const statusLabel = pill.querySelector('.pill-status');
            pill.classList.remove('active', 'completed');

            if (i < activePhaseNum) {
                pill.classList.add('completed');
                if (statusLabel) statusLabel.textContent = "DONE";
            } else if (i === activePhaseNum) {
                pill.classList.add('active');
                if (statusLabel) statusLabel.textContent = "ACTIVE";
            } else {
                if (statusLabel) statusLabel.textContent = "STANDBY";
            }
        }
    }

    // Format & Render Global Timer Display
    function formatGlobalTimerDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (DOM.globalTimerVal) {
            DOM.globalTimerVal.textContent = formatted;
        }

        // Urgent State (< 2 minutes left / 120 seconds)
        if (DOM.globalTimerBadge) {
            if (seconds <= 120 && seconds > 0) {
                DOM.globalTimerBadge.classList.add('urgent');
            } else {
                DOM.globalTimerBadge.classList.remove('urgent');
            }
        }
    }

    // Start Global 15-Minute Countdown Timer
    function startGlobalTimer() {
        stopGlobalTimer();
        state.globalTimeRemaining = GAME_DATA.GLOBAL_TIME_LIMIT_SECONDS;
        state.isMissionActive = true;
        formatGlobalTimerDisplay(state.globalTimeRemaining);

        state.timerInterval = setInterval(() => {
            if (state.globalTimeRemaining > 0) {
                state.globalTimeRemaining--;
                formatGlobalTimerDisplay(state.globalTimeRemaining);

                // Urgent timer audio pulse in final 2 minutes
                if (state.globalTimeRemaining <= 120) {
                    tacticalAudio.playTimerTick(state.globalTimeRemaining);
                }

                if (state.globalTimeRemaining === 0) {
                    handleGlobalTimeout();
                }
            }
        }, 1000);
    }

    function stopGlobalTimer() {
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }
    }

    // Handle Global 15-Minute Timeout
    function handleGlobalTimeout() {
        stopGlobalTimer();
        state.isMissionActive = false;
        tacticalAudio.playDefeatSound();

        // For all unplayed phases, assign lowest tier (Third option: 25 marks, 50 for phase 8)
        for (let pIndex = state.currentPhaseIndex; pIndex <= state.totalPhases; pIndex++) {
            const phase = GAME_DATA.PHASES[pIndex - 1];
            const minPoints = phase.isFinale ? 50 : 25;

            state.rawScore += minPoints;
            state.decisionHistory.push({
                phaseNumber: phase.phaseNumber,
                phaseTitle: phase.title,
                optionKey: "TIMEOUT",
                optionTitle: "[FORFEIT // 15-MIN TIME LIMIT EXPIRED]",
                tier: "poor",
                points: minPoints,
                consequence: "Mission time expired before tactical authorization could be confirmed."
            });
        }

        // Route directly to Results Screen
        showFinalResults();
    }

    // Start Mission from Briefing
    function startMission() {
        const inputVal = DOM.teamNameInput ? DOM.teamNameInput.value.trim() : "";
        if (inputVal) {
            state.teamName = inputVal.toUpperCase();
        }
        if (DOM.teamBadgeText) {
            DOM.teamBadgeText.textContent = `UNIT: ${state.teamName}`;
        }

        tacticalAudio.playPhaseStart();
        state.currentPhaseIndex = 1;
        state.rawScore = 0;
        state.decisionHistory = [];

        // Start Persistent 15-Minute Countdown
        startGlobalTimer();

        // Tab-switch monitoring temporarily disabled
        // if (typeof window.startTabSwitchMonitoring === 'function') {
        //     window.startTabSwitchMonitoring();
        // }

        // Load Phase 1
        loadPhase(1);
    }

    // Load and render a Phase Decision (Phases 1 to 8)
    function loadPhase(phaseIndex) {
        const phaseData = GAME_DATA.PHASES[phaseIndex - 1];
        if (!phaseData) return;

        updatePhasePills(phaseIndex);

        // Render meta & situation
        if (DOM.decisionPhaseTag) DOM.decisionPhaseTag.textContent = phaseData.phaseTag;
        if (DOM.decisionTitle) DOM.decisionTitle.textContent = phaseData.title;

        if (DOM.decisionThreatBadge) {
            DOM.decisionThreatBadge.textContent = phaseData.threatBadge;
            DOM.decisionThreatBadge.className = `threat-badge ${phaseData.threatLevel || ''}`;
        }

        if (DOM.situationText) DOM.situationText.textContent = phaseData.situation;

        // Render 3 Option Cards (Clean, plausible, no visual bias)
        if (DOM.optionsGrid) {
            DOM.optionsGrid.innerHTML = '';
            phaseData.options.forEach((opt, idx) => {
                const card = createOptionCard(opt, idx, phaseData);
                DOM.optionsGrid.appendChild(card);
            });
        }

        showScreen(DOM.screenDecision);
    }

    // Create an interactive Option Card element (No visual hint of best/worst)
    function createOptionCard(option, index, phaseData) {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Option ${option.key}: ${option.title}`);

        const keyNumber = index + 1;

        card.innerHTML = `
            <div class="option-card-top">
                <div class="option-key-badge">${option.key}</div>
                <div class="option-directive-label">DIRECTIVE S ${option.key}</div>
            </div>
            <div class="option-title">${option.title}</div>
            <button type="button" class="btn-select-option">
                <span>[${keyNumber}] Authorize Directive</span>
            </button>
        `;

        card.addEventListener('mouseenter', () => tacticalAudio.playHover());
        card.addEventListener('click', () => {
            selectOption(option, phaseData);
        });

        return card;
    }

    // Handle Option Selection
    function selectOption(option, phaseData) {
        tacticalAudio.playOptionSelect();

        // Accumulate raw score (+100/0/-100, or +200/0/-200 for phase 8)
        state.rawScore += option.points;

        // Instant Database Score Transmission (Round 5)
        const maxScore = (GAME_DATA && GAME_DATA.MAX_POSSIBLE_SCORE) || 1100;
        const currentScore = Math.max(0, Math.min(maxScore, state.rawScore));
        const teamId = localStorage.getItem("current_team_id");
        if (teamId && typeof window !== 'undefined' && window.TournamentDB && typeof window.TournamentDB.saveRoundScore === 'function') {
            window.TournamentDB.saveRoundScore(teamId, 5, currentScore)
                .then(res => console.log(`🏆 [Supabase DB] Instant Round 5 score updated: ${currentScore}`, res))
                .catch(err => console.error("❌ [Supabase DB Error] Instant score update failed:", err));
        }

        // Record Decision History
        state.decisionHistory.push({
            phaseNumber: phaseData.phaseNumber,
            phaseTitle: phaseData.title,
            optionKey: option.key,
            optionTitle: option.title,
            tier: option.tier, // 'best', 'moderate', 'poor'
            points: option.points,
            consequence: option.consequence
        });

        // Show Consequence Screen
        showConsequenceScreen(option, phaseData);
    }

    // Render Consequence Screen
    function showConsequenceScreen(option, phaseData) {
        if (DOM.consequencePhaseTag) {
            DOM.consequencePhaseTag.textContent = `PHASE ${phaseData.phaseNumber} OUTCOME  DIRECTIVE AUTHORIZED`;
        }

        if (DOM.consequenceChoiceTitle) {
            DOM.consequenceChoiceTitle.textContent = `OPTION ${option.key}  DIRECTIVE ENGAGED`;
        }

        if (DOM.consequenceText) {
            DOM.consequenceText.textContent = option.consequence;
        }

        if (DOM.consequenceNotice) {
            DOM.consequenceNotice.textContent = `DIRECTIVE REGISTERED  TELEMETRY RECORDED (+${option.points} MARKS)`;
        }

        showScreen(DOM.screenConsequence);
    }

    // Advance to Next Phase (Phases 1-7 advance; Phase 8 completes)
    function advanceToNextPhase() {
        if (state.currentPhaseIndex < state.totalPhases) {
            state.currentPhaseIndex++;
            tacticalAudio.playPhaseStart();
            loadPhase(state.currentPhaseIndex);
        } else {
            showFinalResults();
        }
    }

    // Render Final Results Screen (Out of 900 Max Marks)
    function showFinalResults() {
        stopGlobalTimer();
        updatePhasePills(state.totalPhases + 1); // All completed

        const maxScore = GAME_DATA.MAX_POSSIBLE_SCORE || 900;
        const finalScore = Math.max(0, Math.min(maxScore, state.rawScore));

        // AUTOMATIC SUPABASE DB SCORE TRANSMISSION (ROUND 5)
        if (typeof window !== 'undefined' && window.TournamentDB && typeof window.TournamentDB.saveRoundScore === 'function') {
            const teamId = localStorage.getItem("current_team_id");
            if (teamId) {
                window.TournamentDB.saveRoundScore(teamId, 5, finalScore)
                    .then(res => console.log("🏆 [Supabase DB] Round 5 score saved under Team ID #" + teamId + ":", res))
                    .catch(err => console.error("❌ [Supabase DB] Error saving Round 5 score:", err));
            }
        }

        // Determine Ending Tier (750-900 Full, 500-749 Partial, 0-499 Setback)
        const tier = GAME_DATA.EVALUATION_TIERS.find(t => finalScore >= t.minScore) || GAME_DATA.EVALUATION_TIERS[GAME_DATA.EVALUATION_TIERS.length - 1];

        // Trigger Audio Feedback
        if (finalScore >= 750) {
            tacticalAudio.playVictoryFanfare();
        } else if (finalScore >= 500) {
            tacticalAudio.playPhaseStart();
        } else {
            tacticalAudio.playDefeatSound();
        }

        // Render Hero Card
        if (DOM.resultsBadgePill) {
            DOM.resultsBadgePill.textContent = tier.badgePill;
        }
        if (DOM.resultsEndingTitle) {
            DOM.resultsEndingTitle.textContent = tier.title;
        }
        if (DOM.resultsNarrationText) {
            DOM.resultsNarrationText.textContent = tier.narration;
        }
        if (DOM.resultsEvalText) {
            DOM.resultsEvalText.textContent = tier.evalText;
        }

        // Render Total Score & Tier
        if (DOM.resultsTotalScore) {
            DOM.resultsTotalScore.textContent = finalScore;
        }
        if (DOM.resultsTierLabel) {
            DOM.resultsTierLabel.textContent = tier.title;
            DOM.resultsTierLabel.style.color = tier.accentColor;
        }

        // Score Meter Progress Bar (0 to 900)
        const scorePercent = Math.max(0, Math.min(100, Math.round((finalScore / maxScore) * 100)));
        if (DOM.scoreMeterVal) {
            DOM.scoreMeterVal.textContent = `${finalScore} / ${maxScore} MARKS (${scorePercent}%)`;
        }
        setTimeout(() => {
            if (DOM.scoreMeterFill) {
                DOM.scoreMeterFill.style.width = `${scorePercent}%`;
                if (finalScore >= 750) {
                    DOM.scoreMeterFill.style.background = 'linear-gradient(90deg, #059669, #10b981)';
                } else if (finalScore >= 500) {
                    DOM.scoreMeterFill.style.background = 'linear-gradient(90deg, #d97706, #f59e0b)';
                } else {
                    DOM.scoreMeterFill.style.background = 'linear-gradient(90deg, #b91c1c, #ef4444)';
                }
            }
        }, 150);

        // Render Phase-by-Phase Mission Log Recap (Color-coded Best / Second / Third)
        if (DOM.pathNodesContainer) {
            DOM.pathNodesContainer.innerHTML = '';
            state.decisionHistory.forEach(item => {
                const node = document.createElement('div');
                node.className = 'path-node-item';

                // Format Rating Badge Text & Class
                let badgeText = "BEST";
                let pointsStr = item.points > 0 ? `+${item.points} MARKS` : `${item.points} MARKS`;
                if (item.tier === 'best') {
                    badgeText = `BEST [${pointsStr}]`;
                } else if (item.tier === 'moderate') {
                    badgeText = `SECOND [${pointsStr}]`;
                } else {
                    badgeText = `THIRD [${pointsStr}]`;
                }

                node.innerHTML = `
                    <div class="path-node-top">
                        <span class="path-node-phase">PHASE ${item.phaseNumber}</span>
                        <span class="tier-tag ${item.tier}">${badgeText}</span>
                    </div>
                    <div class="path-node-choice-title">${item.optionTitle}</div>
                    <p class="path-node-consequence-preview">${item.consequence}</p>
                `;
                DOM.pathNodesContainer.appendChild(node);
            });
        }

        showScreen(DOM.screenResults);
    }

    // Reset Mission to Briefing
    function resetMission() {
        stopGlobalTimer();
        state.currentPhaseIndex = 1;
        state.rawScore = 0;
        state.decisionHistory = [];
        state.globalTimeRemaining = GAME_DATA.GLOBAL_TIME_LIMIT_SECONDS;
        formatGlobalTimerDisplay(state.globalTimeRemaining);

        if (DOM.scoreMeterFill) DOM.scoreMeterFill.style.width = '0%';

        updatePhasePills(0);
        generateRandomCallsign();
        showScreen(DOM.screenBriefing);
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

window.showR5Page2 = function () {
    const p1 = document.getElementById('screen-r5-title');
    const p2 = document.getElementById('screen-briefing');
    const dec = document.getElementById('screen-decision');
    if (p1) p1.classList.remove('active');
    if (dec) dec.classList.remove('active');
    if (p2) p2.classList.add('active');
    if (typeof window.updateHeaderVisibility === 'function') {
        window.updateHeaderVisibility();
    }
};

window.startRound5Countdown = function () {
    const briefing = document.getElementById('screen-briefing');
    const countOverlay = document.getElementById('r5-countdown-overlay');
    const countNum = document.getElementById('r5-countdown-number');

    if (briefing) briefing.classList.remove('active');
    if (!countOverlay || !countNum) {
        const dec = document.getElementById('screen-decision');
        if (dec) dec.classList.add('active');
        if (typeof window.updateHeaderVisibility === 'function') {
            window.updateHeaderVisibility();
        }
        return;
    }

    countOverlay.style.display = 'flex';
    let num = 3;
    countNum.textContent = num;
    countNum.style.color = '#00f0ff';

    const timer = setInterval(() => {
        num--;
        if (num > 0) {
            countNum.textContent = num;
        } else if (num === 0) {
            countNum.textContent = "GO!";
            countNum.style.color = "#34d399";
        } else {
            clearInterval(timer);
            countOverlay.style.display = 'none';
            const dec = document.getElementById('screen-decision');
            if (dec) dec.classList.add('active');
            if (typeof window.updateHeaderVisibility === 'function') {
                window.updateHeaderVisibility();
            }
            const beginBtn = document.getElementById('begin-mission-btn');
            if (beginBtn) {
                // Trigger original start mission logic if attached
            }
        }
    }, 1000);
};
