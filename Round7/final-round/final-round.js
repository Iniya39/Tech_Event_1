// ============================================================
// THOR VS DOCTOR DOOM — ROUND 7: THE TIMELINE CORE
// UNIFIED GAME ENGINE & PUZZLE CONTROLLER
// ============================================================

/**
 * Global Round 7 State
 */
const FinalRoundState = {
    totalDurationSeconds: 1800, // 30:00 Minutes Total (30 Minutes)
    timeRemaining: 1800,
    timerInterval: null,
    isTimerRunning: false,
    isGameOver: false,
    finalRoundStarted: false,

    currentPuzzleIndex: 0,
    completedPuzzlesCount: 0,
    totalPuzzlesCount: 15,
    previousStage: 0,

    // Sudoku & Morse Cheat-Sheet Access State (Max 3 Views)
    sudokuSolved: false,
    cheatSheetAccessCount: 0,
    maxCheatSheetAccess: 3, // Player can access cheat sheet a maximum of 3 times after solving Sudoku
    sudokuPenaltySeconds: 30, // 30 seconds deducted per wrong Sudoku answer

    // Zoom & Pan state for Stage 2 Image inspection
    imageZoom: 1,
    imagePanX: 0,
    imagePanY: 0,
    isDraggingImage: false,
    dragStartX: 0,
    dragStartY: 0,

    // Audio Context for Morse Audio Synthesis
    audioCtx: null,
    isAudioPlaying: false
};

// Easy 9x9 Sudoku Matrix (Digits 1-9)
const SUDOKU_SOLUTION = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

// Easy board with 10 missing cells distributed across rows/boxes
const SUDOKU_INITIAL = [
    [5, 3, null, 6, 7, null, 9, 1, 2],
    [6, null, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, null],
    [8, 5, 9, 7, null, 1, 4, 2, 3],
    [4, 2, null, 8, 5, 3, 7, null, 1],
    [7, null, 3, 9, 2, 4, 8, 5, 6],
    [null, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, null, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, null, 7, 9]
];

// Cached DOM Elements
const DOM = {
    // HUD
    roundBadge: null,
    stageTitle: null,
    timerBox: null,
    timerDisplay: null,
    currentProgressVal: null,
    totalProgressVal: null,
    progressBarFill: null,
    btnOptions: null,

    // Main Puzzle Card
    puzzleCard: null,
    puzzleSubTag: null,
    puzzleStageIndicator: null,
    puzzlePrompt: null,
    puzzleDynamicArea: null,
    puzzleInput: null,
    btnSubmit: null,
    feedbackMsg: null,

    // Modals
    finalRulesModal: null,
    btnStartFinalRound: null,

    morseIntroModal: null,
    btnCloseMorseIntro: null,

    sudokuModal: null,
    btnCloseSudoku: null,
    sudokuGrid: null,
    sudokuFeedback: null,
    btnVerifySudoku: null,

    optionsModal: null,
    btnCloseOptions: null,
    btnOpenMorseRef: null,
    morseOptionsBadge: null,
    morseRefModal: null,
    btnCloseMorseRef: null,
    morseAccessCounter: null,
    morseGridContainer: null,

    // Result & Cinematic
    resultModal: null,
    resultTitle: null,
    resultSubtitle: null,
    statScore: null,
    statCompleted: null,
    statTime: null,
    btnLaunchCinematic: null,
    cinematicOverlay: null,
    cinematicSpeaker: null,
    cinematicSpeech: null,
    btnCinematicNext: null
};

/**
 * Compiles the complete 15-puzzle pipeline from modular data files
 */
function getCompiledPuzzles() {
    const puzzles = [];

    // 1. Stage 1 MAT Puzzles (1 to 5)
    if (typeof round1Questions !== 'undefined' && Array.isArray(round1Questions)) {
        round1Questions.forEach(q => {
            puzzles.push({
                ...q,
                stage: 1,
                stageName: "STAGE 1 — MAT-STYLE PATTERN DECODING",
                validator: (input) => {
                    if (typeof validateRound1Answer === 'function') {
                        return validateRound1Answer(q.id, input);
                    }
                    return false;
                }
            });
        });
    }

    // 2. Stage 2 Hidden Message Image Puzzles (16 to 18)
    if (typeof round2Questions !== 'undefined' && Array.isArray(round2Questions)) {
        round2Questions.forEach(q => {
            puzzles.push({
                ...q,
                stage: 2,
                stageName: "STAGE 2 — HIDDEN MESSAGE IMAGE ANALYSIS",
                validator: (input) => {
                    if (typeof validateRound2Answer === 'function') {
                        return validateRound2Answer(q.id, input);
                    }
                    return false;
                }
            });
        });
    } else if (typeof round2ImageConfig !== 'undefined') {
        puzzles.push({
            ...round2ImageConfig,
            stage: 2,
            stageName: "STAGE 2 — HIDDEN MESSAGE IMAGE ANALYSIS",
            validator: (input) => {
                if (typeof validateRound2Answer === 'function') {
                    return validateRound2Answer(16, input);
                }
                return false;
            }
        });
    }

    // 3. Stage 3 Morse of the Multiverse Puzzles (19 to 25)
    if (typeof round3MorseQuestions !== 'undefined' && Array.isArray(round3MorseQuestions)) {
        round3MorseQuestions.forEach(q => {
            puzzles.push({
                ...q,
                stage: 3,
                stageName: "STAGE 3 — MORSE OF THE MULTIVERSE",
                validator: (input) => {
                    if (typeof validateRound3MorseAnswer === 'function') {
                        return validateRound3MorseAnswer(q.id, input);
                    }
                    return false;
                }
            });
        });
    }

    return puzzles;
}

let compiledPuzzlesList = [];

/**
 * Initializes the Round 7 Environment and starts gameplay
 */
function startFinalRound() {
    initDOMReferences();
    compiledPuzzlesList = getCompiledPuzzles();
    FinalRoundState.totalPuzzlesCount = compiledPuzzlesList.length || 15;
    FinalRoundState.currentPuzzleIndex = 0;
    FinalRoundState.completedPuzzlesCount = 0;
    FinalRoundState.timeRemaining = FinalRoundState.totalDurationSeconds;
    FinalRoundState.isGameOver = false;
    FinalRoundState.finalRoundStarted = false;
    FinalRoundState.previousStage = 0;
    FinalRoundState.sudokuSolved = false;

    if (DOM.totalProgressVal) {
        DOM.totalProgressVal.textContent = FinalRoundState.totalPuzzlesCount;
    }

    renderSudokuGrid();
    populateMorseReferenceTable();
    attachEventHandlers();

    // Render Initial Puzzle & Timer Display (Timer paused until player clicks START FINAL ROUND)
    updateTimerDisplay();
    showPuzzle(FinalRoundState.currentPuzzleIndex);

    // Display Initial Rules Modal
    if (DOM.finalRulesModal) {
        DOM.finalRulesModal.classList.add("active");
    }
}

/**
 * Initializes DOM elements lookup
 */
function initDOMReferences() {
    DOM.roundBadge = document.getElementById("round-badge");
    DOM.stageTitle = document.getElementById("stage-title");
    DOM.timerBox = document.getElementById("timer-box");
    DOM.timerDisplay = document.getElementById("timer-display");
    DOM.currentProgressVal = document.getElementById("current-progress-val");
    DOM.totalProgressVal = document.getElementById("total-progress-val");
    DOM.progressBarFill = document.getElementById("progress-bar-fill");
    DOM.btnOptions = document.getElementById("btn-options");

    DOM.puzzleCard = document.getElementById("puzzle-card");
    DOM.puzzleSubTag = document.getElementById("puzzle-sub-tag");
    DOM.puzzleStageIndicator = document.getElementById("puzzle-stage-indicator");
    DOM.puzzlePrompt = document.getElementById("puzzle-prompt");
    DOM.puzzleDynamicArea = document.getElementById("puzzle-dynamic-area");
    DOM.puzzleInput = document.getElementById("puzzle-input");
    DOM.btnSubmit = document.getElementById("btn-submit");
    DOM.feedbackMsg = document.getElementById("feedback-msg");

    DOM.finalRulesModal = document.getElementById("final-rules-modal");
    DOM.btnStartFinalRound = document.getElementById("btn-start-final-round");

    DOM.morseIntroModal = document.getElementById("morse-intro-modal");
    DOM.btnCloseMorseIntro = document.getElementById("btn-close-morse-intro");

    DOM.sudokuModal = document.getElementById("sudoku-modal");
    DOM.btnCloseSudoku = document.getElementById("btn-close-sudoku");
    DOM.sudokuGrid = document.getElementById("sudoku-grid");
    DOM.sudokuFeedback = document.getElementById("sudoku-feedback");
    DOM.btnVerifySudoku = document.getElementById("btn-verify-sudoku");
    DOM.sudokuLiveTimer = document.getElementById("sudoku-live-timer");

    DOM.optionsModal = document.getElementById("options-modal");
    DOM.btnCloseOptions = document.getElementById("btn-close-options");
    DOM.btnOpenMorseRef = document.getElementById("btn-open-morse-ref");
    DOM.morseOptionsBadge = document.getElementById("morse-options-badge");
    DOM.morseRefModal = document.getElementById("morse-ref-modal");
    DOM.btnCloseMorseRef = document.getElementById("btn-close-morse-ref");
    DOM.morseAccessCounter = document.getElementById("morse-access-counter");
    DOM.morseGridContainer = document.getElementById("morse-ref-grid");

    DOM.resultModal = document.getElementById("result-modal");
    DOM.resultTitle = document.getElementById("result-title");
    DOM.resultSubtitle = document.getElementById("result-subtitle");
    DOM.statScore = document.getElementById("stat-score");
    DOM.statCompleted = document.getElementById("stat-completed");
    DOM.statTime = document.getElementById("stat-time");
    DOM.btnLaunchCinematic = document.getElementById("btn-launch-cinematic");

    DOM.cinematicOverlay = document.getElementById("cinematic-overlay");
    DOM.cinematicSpeaker = document.getElementById("cinematic-speaker");
    DOM.cinematicSpeech = document.getElementById("cinematic-speech");
    DOM.btnCinematicNext = document.getElementById("btn-cinematic-next");
}

/**
 * Starts or Resumes the Global 30-Minute Timer
 */
function startTimer() {
    resumeTimer();
}

function resumeTimer() {
    if (!FinalRoundState.finalRoundStarted || FinalRoundState.isGameOver) return;
    if (FinalRoundState.isTimerRunning) return;

    FinalRoundState.isTimerRunning = true;
    updateTimerDisplay();

    if (FinalRoundState.timerInterval) {
        clearInterval(FinalRoundState.timerInterval);
    }

    FinalRoundState.timerInterval = setInterval(() => {
        if (FinalRoundState.isGameOver) {
            pauseTimer();
            return;
        }

        FinalRoundState.timeRemaining--;

        if (FinalRoundState.timeRemaining <= 60 && DOM.timerBox) {
            DOM.timerBox.classList.add("time-warning");
        }

        if (FinalRoundState.timeRemaining <= 0) {
            FinalRoundState.timeRemaining = 0;
            pauseTimer();
            handleTimeExpiry();
        }

        updateTimerDisplay();
    }, 1000);
}

/**
 * Pauses the Global Timer without resetting or losing elapsed time
 */
function pauseTimer() {
    if (FinalRoundState.timerInterval) {
        clearInterval(FinalRoundState.timerInterval);
        FinalRoundState.timerInterval = null;
    }
    FinalRoundState.isTimerRunning = false;
}

/**
 * Formats seconds into MM:SS display
 */
function updateTimerDisplay() {
    const minutes = Math.floor(FinalRoundState.timeRemaining / 60);
    const seconds = FinalRoundState.timeRemaining % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    if (DOM.timerDisplay) {
        DOM.timerDisplay.textContent = formatted;
    }
    if (DOM.sudokuLiveTimer) {
        DOM.sudokuLiveTimer.textContent = formatted;
    }
}

/**
 * Renders the active puzzle based on index
 * @param {number} index 
 */
function showPuzzle(index) {
    if (index >= compiledPuzzlesList.length) {
        finishFinalRound();
        return;
    }

    const puzzle = compiledPuzzlesList[index];
    if (!puzzle) return;

    const currentStage = puzzle.stage;

    // Stage 3 Morse of the Multiverse Handling:
    // 1. Show Morse Cheat Sheet option inside [ OPTIONS ] ONLY during Stage 3
    // 2. Display Morse Instructions Popup and pause timer every time Stage 3 is entered from outside
    if (currentStage === 3) {
        if (DOM.btnOpenMorseRef) {
            DOM.btnOpenMorseRef.style.display = "flex";
        }

        if (FinalRoundState.previousStage !== 3) {
            pauseTimer();
            if (DOM.morseIntroModal) {
                DOM.morseIntroModal.classList.add("active");
            }
        }
    } else {
        if (DOM.btnOpenMorseRef) {
            DOM.btnOpenMorseRef.style.display = "none";
        }
    }

    FinalRoundState.previousStage = currentStage;

    // Reset feedback and input
    if (DOM.feedbackMsg) {
        DOM.feedbackMsg.textContent = "";
        DOM.feedbackMsg.className = "feedback-message";
    }
    if (DOM.puzzleInput) {
        DOM.puzzleInput.value = "";
        DOM.puzzleInput.placeholder = puzzle.inputPlaceholder || "Enter answer...";
        DOM.puzzleInput.disabled = false;
        DOM.puzzleInput.focus();
    }
    if (DOM.btnSubmit) {
        DOM.btnSubmit.disabled = false;
    }

    // Update Header and HUD
    if (DOM.stageTitle) DOM.stageTitle.textContent = puzzle.stageName || "TIMELINE CORE";
    if (DOM.puzzleSubTag) DOM.puzzleSubTag.textContent = puzzle.title || `ANOMALY 0${index + 1}`;
    if (DOM.puzzleStageIndicator) DOM.puzzleStageIndicator.textContent = `STAGE ${puzzle.stage} OF 3`;
    if (DOM.puzzlePrompt) DOM.puzzlePrompt.innerHTML = puzzle.prompt || "";

    // Update Progress Indicator
    updateProgressUI();

    // Render Stage-Specific Visual Terminal
    renderStageContent(puzzle);
}

/**
 * Renders stage-specific interactive components
 */
function renderStageContent(puzzle) {
    if (!DOM.puzzleDynamicArea) return;
    DOM.puzzleDynamicArea.innerHTML = "";

    if (puzzle.stage === 1) {
        // Stage 1: MAT Sequence / Transformation Terminal
        const display = document.createElement("div");
        display.className = "pattern-display-terminal";
        display.innerHTML = puzzle.displayContent || "";
        DOM.puzzleDynamicArea.appendChild(display);
    }
    else if (puzzle.stage === 2) {
        // Stage 2: Hidden Message Image Analysis Viewport with Pan & Zoom
        const wrapper = document.createElement("div");
        wrapper.className = "image-puzzle-wrapper";

        const toolbar = document.createElement("div");
        toolbar.className = "image-inspection-toolbar";
        toolbar.innerHTML = `
            <span class="toolbar-hint">🔍 Drag to Pan &bull; Use Controls to Zoom</span>
            <div class="toolbar-controls">
                <button type="button" class="btn-tool" id="btn-zoom-in" title="Zoom In">+</button>
                <button type="button" class="btn-tool" id="btn-zoom-out" title="Zoom Out">-</button>
                <button type="button" class="btn-tool" id="btn-zoom-reset" title="Reset View">Reset</button>
            </div>
        `;

        const viewport = document.createElement("div");
        viewport.className = "image-viewport";
        viewport.id = "image-viewport";

        const img = document.createElement("img");
        img.src = puzzle.imageSrc;
        img.alt = puzzle.imageAlt || "Timeline Core Hidden Message";
        img.id = "inspectable-image";
        img.onerror = function() {
            if (puzzle.fallbackImageSrc && img.getAttribute("data-failed") !== "true") {
                img.setAttribute("data-failed", "true");
                img.src = puzzle.fallbackImageSrc;
            }
        };

        viewport.appendChild(img);
        wrapper.appendChild(toolbar);
        wrapper.appendChild(viewport);
        DOM.puzzleDynamicArea.appendChild(wrapper);

        setupImageInspectionControls(viewport, img);
    }
    else if (puzzle.stage === 3) {
        // Stage 3: Morse Code Transmission Terminal
        const terminal = document.createElement("div");
        terminal.className = "morse-signal-terminal";

        const morseText = document.createElement("div");
        morseText.className = "morse-code-text";
        morseText.textContent = puzzle.morseCode || "";

        const audioBtn = document.createElement("button");
        audioBtn.type = "button";
        audioBtn.className = "morse-audio-btn";
        audioBtn.id = "btn-morse-audio";
        audioBtn.innerHTML = `🔊 Play Signal Audio Pulse`;
        audioBtn.addEventListener("click", () => playMorseAudio(puzzle.audioSequence || puzzle.morseCode, audioBtn));

        terminal.appendChild(morseText);
        terminal.appendChild(audioBtn);
        DOM.puzzleDynamicArea.appendChild(terminal);
    }
}

/**
 * Handles Image Viewport Pan and Zoom Controls
 */
function setupImageInspectionControls(viewport, img) {
    FinalRoundState.imageZoom = 1;
    FinalRoundState.imagePanX = 0;
    FinalRoundState.imagePanY = 0;

    const applyTransform = () => {
        img.style.transform = `translate(${FinalRoundState.imagePanX}px, ${FinalRoundState.imagePanY}px) scale(${FinalRoundState.imageZoom})`;
    };

    const zoomInBtn = document.getElementById("btn-zoom-in");
    const zoomOutBtn = document.getElementById("btn-zoom-out");
    const zoomResetBtn = document.getElementById("btn-zoom-reset");

    if (zoomInBtn) {
        zoomInBtn.addEventListener("click", () => {
            FinalRoundState.imageZoom = Math.min(FinalRoundState.imageZoom + 0.35, 3.5);
            applyTransform();
        });
    }
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener("click", () => {
            FinalRoundState.imageZoom = Math.max(FinalRoundState.imageZoom - 0.35, 0.8);
            applyTransform();
        });
    }
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener("click", () => {
            FinalRoundState.imageZoom = 1;
            FinalRoundState.imagePanX = 0;
            FinalRoundState.imagePanY = 0;
            applyTransform();
        });
    }

    // Drag to Pan
    viewport.addEventListener("mousedown", (e) => {
        FinalRoundState.isDraggingImage = true;
        FinalRoundState.dragStartX = e.clientX - FinalRoundState.imagePanX;
        FinalRoundState.dragStartY = e.clientY - FinalRoundState.imagePanY;
    });

    window.addEventListener("mousemove", (e) => {
        if (!FinalRoundState.isDraggingImage) return;
        FinalRoundState.imagePanX = e.clientX - FinalRoundState.dragStartX;
        FinalRoundState.imagePanY = e.clientY - FinalRoundState.dragStartY;
        applyTransform();
    });

    window.addEventListener("mouseup", () => {
        FinalRoundState.isDraggingImage = false;
    });

    // Mouse wheel zoom
    viewport.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.2 : 0.2;
        FinalRoundState.imageZoom = Math.min(Math.max(FinalRoundState.imageZoom + delta, 0.8), 3.5);
        applyTransform();
    }, { passive: false });
}

/**
 * Validates player answer submission
 */
function checkAnswer() {
    if (FinalRoundState.isGameOver) return;

    const puzzle = compiledPuzzlesList[FinalRoundState.currentPuzzleIndex];
    if (!puzzle) return;

    const userInput = DOM.puzzleInput ? DOM.puzzleInput.value : "";
    if (!userInput || !userInput.trim()) {
        showIncorrect("Please enter an answer before transmitting.");
        return;
    }

    const isCorrect = puzzle.validator(userInput);

    if (isCorrect) {
        showCorrect();
    } else {
        showIncorrect();
    }
}

/**
 * Displays positive feedback and advances to next puzzle
 */
function showCorrect() {
    FinalRoundState.completedPuzzlesCount++;
    updateProgressUI();

    if (DOM.puzzleCard) {
        DOM.puzzleCard.classList.add("correct-feedback");
    }
    if (DOM.feedbackMsg) {
        DOM.feedbackMsg.textContent = "✓ FREQUENCY HARMONIZED — TIMELINE STABILIZED";
        DOM.feedbackMsg.className = "feedback-message success";
    }
    if (DOM.puzzleInput) DOM.puzzleInput.disabled = true;
    if (DOM.btnSubmit) DOM.btnSubmit.disabled = true;

    // Small cinematic pacing delay before loading next puzzle
    setTimeout(() => {
        if (DOM.puzzleCard) DOM.puzzleCard.classList.remove("correct-feedback");
        nextPuzzle();
    }, 900);
}

/**
 * Displays error feedback and maintains current puzzle state
 */
function showIncorrect(customMsg) {
    if (DOM.puzzleCard) {
        DOM.puzzleCard.classList.add("incorrect-feedback");
        setTimeout(() => DOM.puzzleCard.classList.remove("incorrect-feedback"), 500);
    }
    if (DOM.feedbackMsg) {
        DOM.feedbackMsg.textContent = customMsg || "✗ TEMPORAL DISRUPTION DETECTED — FREQUENCY MISMATCH. TRY AGAIN.";
        DOM.feedbackMsg.className = "feedback-message error";
    }
    if (DOM.puzzleInput) {
        DOM.puzzleInput.select();
        DOM.puzzleInput.focus();
    }
}

/**
 * Transitions to the next puzzle
 */
function nextPuzzle() {
    FinalRoundState.currentPuzzleIndex++;
    if (FinalRoundState.currentPuzzleIndex >= compiledPuzzlesList.length) {
        finishFinalRound();
    } else {
        showPuzzle(FinalRoundState.currentPuzzleIndex);
    }
}

/**
 * Updates HUD Progress elements
 */
function updateProgressUI() {
    if (DOM.currentProgressVal) {
        DOM.currentProgressVal.textContent = FinalRoundState.completedPuzzlesCount;
    }
    if (DOM.progressBarFill) {
        const percent = (FinalRoundState.completedPuzzlesCount / FinalRoundState.totalPuzzlesCount) * 100;
        DOM.progressBarFill.style.width = `${percent}%`;
    }
}

/**
 * Calculates Single Combined Score across all three stages
 * @returns {number} Score from 0 to 100
 */
function calculateFinalScore() {
    if (FinalRoundState.totalPuzzlesCount === 0) return 0;
    const score = Math.round((FinalRoundState.completedPuzzlesCount / FinalRoundState.totalPuzzlesCount) * 100);
    return Math.min(Math.max(score, 0), 100);
}

/**
 * Handles 7-minute timer expiration (00:00)
 */
function handleTimeExpiry() {
    FinalRoundState.isGameOver = true;

    if (DOM.puzzleInput) DOM.puzzleInput.disabled = true;
    if (DOM.btnSubmit) DOM.btnSubmit.disabled = true;

    if (DOM.feedbackMsg) {
        DOM.feedbackMsg.textContent = "⚠ TIME'S UP — TIMELINE CORE BREACH IMMINENT";
        DOM.feedbackMsg.className = "feedback-message error";
    }

    setTimeout(() => {
        showFinalResult(false);
    }, 1200);
}

/**
 * Concludes Round 7 successfully when all 15 puzzles are solved
 */
function finishFinalRound() {
    FinalRoundState.isGameOver = true;
    if (FinalRoundState.timerInterval) {
        clearInterval(FinalRoundState.timerInterval);
    }

    setTimeout(() => {
        showFinalResult(true);
    }, 600);
}

/**
 * Displays the Unified Results Modal
 * @param {boolean} isSuccess 
 */
function showFinalResult(isSuccess) {
    const finalScore = calculateFinalScore();
    const minutes = Math.floor(FinalRoundState.timeRemaining / 60);
    const seconds = FinalRoundState.timeRemaining % 60;
    const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (DOM.resultTitle) {
        DOM.resultTitle.textContent = isSuccess ? "TIMELINE CORE ACCESS GRANTED" : "TEMPORAL LOCKOUT — TIME'S UP";
        DOM.resultTitle.style.color = isSuccess ? "var(--thor-cyan)" : "var(--warning-red)";
    }

    if (DOM.resultSubtitle) {
        DOM.resultSubtitle.textContent = isSuccess
            ? "ALL QUANTUM AND MORSE ANOMALIES RESOLVED &bull; REALITY STABILIZED"
            : "TIMELINE CORE DESTABILIZATION &bull; EVALUATION TERMINATED";
    }

    if (DOM.statScore) DOM.statScore.textContent = `${finalScore} / 100`;
    if (DOM.statCompleted) DOM.statCompleted.textContent = `${FinalRoundState.completedPuzzlesCount} / ${FinalRoundState.totalPuzzlesCount}`;
    if (DOM.statTime) DOM.statTime.textContent = timeFormatted;

    // AUTOMATIC SUPABASE DB SCORE TRANSMISSION (ROUND 7)
    if (typeof window !== 'undefined' && window.TournamentDB && typeof window.TournamentDB.saveRoundScore === 'function') {
        const teamId = localStorage.getItem("current_team_id");
        if (teamId) {
            window.TournamentDB.saveRoundScore(teamId, 7, finalScore)
                .then(res => console.log("🏆 [Supabase DB] Round 7 score saved under Team ID #" + teamId + ":", res))
                .catch(err => console.error("❌ [Supabase DB] Error saving Round 7 score:", err));
        }
    }

    if (DOM.resultModal) {
        DOM.resultModal.classList.add("active");
    }
}

/**
 * Opens Options Modal
 */
function openOptions() {
    if (DOM.optionsModal) {
        DOM.optionsModal.classList.add("active");
    }
}

/**
 * Closes Options Modal
 */
function closeOptions() {
    if (DOM.optionsModal) {
        DOM.optionsModal.classList.remove("active");
    }
}

/**
 * Closes the initial Final Round Rules Modal and starts the 30-minute timer
 */
function handleStartFinalRoundClick() {
    if (DOM.finalRulesModal) {
        DOM.finalRulesModal.classList.remove("active");
    }
    FinalRoundState.finalRoundStarted = true;
    startTimer();
}

/**
 * Closes the Morse of the Multiverse Instructions Modal and resumes timer
 */
function closeMorseIntro() {
    if (DOM.morseIntroModal) {
        DOM.morseIntroModal.classList.remove("active");
    }
    resumeTimer();
}

/**
 * Renders the 9x9 interactive Sudoku Matrix into #sudoku-grid
 */
function renderSudokuGrid() {
    if (!DOM.sudokuGrid) return;
    DOM.sudokuGrid.innerHTML = "";

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement("div");
            cell.className = "sudoku-cell";
            cell.setAttribute("data-row", r);
            cell.setAttribute("data-col", c);

            const initialVal = SUDOKU_INITIAL[r][c];
            if (initialVal !== null) {
                cell.classList.add("prefilled");
                cell.textContent = initialVal;
            } else {
                const input = document.createElement("input");
                input.type = "text";
                input.maxLength = 1;
                input.className = "sudoku-input";
                input.setAttribute("data-row", r);
                input.setAttribute("data-col", c);
                input.setAttribute("aria-label", `Sudoku Row ${r + 1} Column ${c + 1}`);

                input.addEventListener("input", (e) => {
                    e.target.value = e.target.value.replace(/[^1-9]/g, '');
                });

                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        verifySudokuAnswer();
                    }
                });

                cell.appendChild(input);
            }

            DOM.sudokuGrid.appendChild(cell);
        }
    }
}

/**
 * Opens Sudoku Gate Modal
 */
function openSudokuModal() {
    if (DOM.sudokuFeedback) {
        DOM.sudokuFeedback.textContent = "";
        DOM.sudokuFeedback.className = "sudoku-feedback";
    }
    if (DOM.sudokuModal) {
        DOM.sudokuModal.classList.add("active");
    }
}

/**
 * Closes Sudoku Gate Modal
 */
function closeSudokuModal() {
    if (DOM.sudokuModal) {
        DOM.sudokuModal.classList.remove("active");
    }
}

/**
 * Validates player's 9x9 Sudoku submission with unlimited attempts
 * Applies 30s penalty on incorrect attempt
 */
function verifySudokuAnswer() {
    if (FinalRoundState.isGameOver) return;

    let isComplete = true;
    let isCorrect = true;

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const initialVal = SUDOKU_INITIAL[r][c];
            if (initialVal === null) {
                const input = DOM.sudokuGrid ? DOM.sudokuGrid.querySelector(`input[data-row="${r}"][data-col="${c}"]`) : null;
                const inputVal = input ? parseInt(input.value.trim(), 10) : NaN;
                if (isNaN(inputVal)) {
                    isComplete = false;
                    isCorrect = false;
                } else if (inputVal !== SUDOKU_SOLUTION[r][c]) {
                    isCorrect = false;
                }
            }
        }
    }

    if (isCorrect && isComplete) {
        FinalRoundState.sudokuSolved = true;
        if (DOM.morseOptionsBadge) {
            DOM.morseOptionsBadge.textContent = `(${FinalRoundState.cheatSheetAccessCount}/${FinalRoundState.maxCheatSheetAccess} Views)`;
        }
        if (DOM.sudokuFeedback) {
            DOM.sudokuFeedback.textContent = "✓ MATRIX ALIGNED — MORSE CHEAT SHEET UNLOCKED!";
            DOM.sudokuFeedback.className = "sudoku-feedback success";
        }
        setTimeout(() => {
            closeSudokuModal();
            openMorseReference();
        }, 400);
    } else {
        // Apply configurable time penalty to the main Final Round timer
        FinalRoundState.timeRemaining = Math.max(0, FinalRoundState.timeRemaining - FinalRoundState.sudokuPenaltySeconds);
        updateTimerDisplay();

        if (DOM.sudokuFeedback) {
            DOM.sudokuFeedback.textContent = `⚠️ INCORRECT MATRIX! -${FinalRoundState.sudokuPenaltySeconds}s TIME PENALTY APPLIED. TRY AGAIN.`;
            DOM.sudokuFeedback.className = "sudoku-feedback error";
        }

        if (FinalRoundState.timeRemaining <= 0) {
            closeSudokuModal();
            handleTimeExpiry();
        }
    }
}

/**
 * Routes Morse Cheat Sheet Access through Sudoku gate or directly if already solved (Max 3 Views)
 */
function openCheatSheetGate() {
    closeOptions();

    if (!FinalRoundState.sudokuSolved) {
        openSudokuModal();
        return;
    }

    // Sudoku is solved — check 3-access limit
    if (FinalRoundState.cheatSheetAccessCount >= FinalRoundState.maxCheatSheetAccess) {
        alert(`Access Limit Reached: You have used all ${FinalRoundState.maxCheatSheetAccess} views of the Morse Cheat Sheet.`);
        return;
    }

    openMorseReference();
}

/**
 * Opens Morse Reference Sheet Modal (Max 3 Views)
 */
function openMorseReference() {
    closeOptions();
    closeSudokuModal();

    if (FinalRoundState.cheatSheetAccessCount >= FinalRoundState.maxCheatSheetAccess) {
        alert(`Access Limit Reached: You have used all ${FinalRoundState.maxCheatSheetAccess} views of the Morse Cheat Sheet.`);
        return;
    }

    FinalRoundState.cheatSheetAccessCount++;

    if (DOM.morseAccessCounter) {
        DOM.morseAccessCounter.textContent = `${FinalRoundState.cheatSheetAccessCount} / ${FinalRoundState.maxCheatSheetAccess} VIEWS USED`;
    }
    if (DOM.morseOptionsBadge) {
        DOM.morseOptionsBadge.textContent = `(${FinalRoundState.cheatSheetAccessCount}/${FinalRoundState.maxCheatSheetAccess} Views)`;
    }

    if (DOM.morseRefModal) {
        DOM.morseRefModal.classList.add("active");
    }
}

/**
 * Closes Morse Reference Sheet Modal
 */
function closeMorseReference() {
    if (DOM.morseRefModal) {
        DOM.morseRefModal.classList.remove("active");
    }
}

/**
 * Populates Morse Alphabet & Numbers from options/morse-reference.js
 */
function populateMorseReferenceTable() {
    if (!DOM.morseGridContainer || typeof morseReferenceData === 'undefined') return;
    DOM.morseGridContainer.innerHTML = "";

    const combinedList = [...(morseReferenceData.alphabet || []), ...(morseReferenceData.numbers || [])];

    combinedList.forEach(item => {
        const card = document.createElement("div");
        card.className = "morse-ref-card";
        card.innerHTML = `
            <div class="ref-char">${item.char}</div>
            <div class="ref-code">${item.code}</div>
        `;
        DOM.morseGridContainer.appendChild(card);
    });
}

/**
 * Plays Morse Code Audio Pulse using Web Audio API
 * @param {string} morseString 
 * @param {HTMLButtonElement} buttonEl 
 */
function playMorseAudio(morseString, buttonEl) {
    if (FinalRoundState.isAudioPlaying) return;

    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!FinalRoundState.audioCtx) {
            FinalRoundState.audioCtx = new AudioCtx();
        }
        if (FinalRoundState.audioCtx.state === 'suspended') {
            FinalRoundState.audioCtx.resume();
        }

        FinalRoundState.isAudioPlaying = true;
        if (buttonEl) buttonEl.classList.add("playing");

        const dotTime = 0.08; // 80ms
        let currentTime = FinalRoundState.audioCtx.currentTime + 0.05;

        for (let i = 0; i < morseString.length; i++) {
            const char = morseString[i];
            if (char === '.') {
                playTone(currentTime, dotTime);
                currentTime += dotTime + dotTime;
            } else if (char === '-') {
                playTone(currentTime, dotTime * 3);
                currentTime += (dotTime * 3) + dotTime;
            } else if (char === ' ') {
                currentTime += dotTime * 2;
            } else if (char === '/') {
                currentTime += dotTime * 4;
            }
        }

        const totalDurationMs = (currentTime - FinalRoundState.audioCtx.currentTime) * 1000;
        setTimeout(() => {
            FinalRoundState.isAudioPlaying = false;
            if (buttonEl) buttonEl.classList.remove("playing");
        }, totalDurationMs);

    } catch (err) {
        console.warn("Audio Context playback error:", err);
        FinalRoundState.isAudioPlaying = false;
        if (buttonEl) buttonEl.classList.remove("playing");
    }
}

function playTone(startTime, duration) {
    const osc = FinalRoundState.audioCtx.createOscillator();
    const gain = FinalRoundState.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(750, startTime); // 750Hz sci-fi tone

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.005);
    gain.gain.setValueAtTime(0.2, startTime + duration - 0.005);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(FinalRoundState.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
}

/**
 * Final Cinematic Sequence Orchestration
 */
const cinematicScript = [
    {
        speaker: "DOCTOR DOOM",
        speakerClass: "speaker-doom",
        text: "You are too late, Odinson. The Timeline Core answers only to Doom. With its power, the multiverse bends to my design, and my empire shall be eternal!"
    },
    {
        speaker: "THOR",
        speakerClass: "speaker-thor",
        text: "You have torn the very fabric of existence, Doom! But Asgard stands united with Midgard. As long as we draw breath, no tyrant shall claim the threads of time!"
    },
    {
        speaker: "DOCTOR DOOM",
        speakerClass: "speaker-doom",
        text: "Foolish god of thunder... witness the wrath of Latveria and the majesty of infinite reality!"
    },
    {
        speaker: "ASSEMBLED HEROES",
        speakerClass: "speaker-thor",
        text: "Hulk roars, Doctor Strange's eldritch portals ignite, Wanda's chaos magic flares, Captain Marvel bursts with cosmic fury, and the Guardians lock their blasters! Thor raises his weapon as thunder rocks the Timeline Core!"
    },
    {
        speaker: "FINAL CLIMAX",
        speakerClass: "speaker-doom",
        text: "Thor leaps into the air shrouded in lightning! Doctor Doom surges forward cloaked in emerald sorcery! The fate of all realities will be decided in this collision!"
    }
];

let cinematicStep = 0;

function launchFinalCinematic() {
    if (DOM.resultModal) DOM.resultModal.classList.remove("active");
    if (DOM.cinematicOverlay) DOM.cinematicOverlay.classList.add("active");
    cinematicStep = 0;
    renderCinematicStep();
}

function renderCinematicStep() {
    if (cinematicStep >= cinematicScript.length) {
        if (DOM.cinematicSpeech) {
            DOM.cinematicSpeech.innerHTML = "<span style='color: var(--thor-cyan); font-size: 1.6rem; font-weight: 700;'>[ EVENT COMPLETED &bull; REALITY RESTORED! ]</span><br><p style='font-size:1rem; color:#e2e8f0; margin-top:8px;'>Thor and the Avengers have secured the Timeline Core. Doctor Doom's invasion is defeated!</p>";
        }
        if (DOM.btnCinematicNext) {
            DOM.btnCinematicNext.textContent = "RETURN TO MAIN EVENT HUB →";
            DOM.btnCinematicNext.onclick = () => window.location.href = "../../index.html";
        }
        return;
    }

    const currentLine = cinematicScript[cinematicStep];
    if (DOM.cinematicSpeaker) {
        DOM.cinematicSpeaker.textContent = currentLine.speaker;
        DOM.cinematicSpeaker.className = `cinematic-speaker ${currentLine.speakerClass}`;
    }
    if (DOM.cinematicSpeech) {
        DOM.cinematicSpeech.textContent = `"${currentLine.text}"`;
    }
}

function advanceCinematic() {
    cinematicStep++;
    renderCinematicStep();
}

/**
 * Attaches UI Event Listeners
 */
function attachEventHandlers() {
    if (DOM.btnSubmit) {
        DOM.btnSubmit.addEventListener("click", checkAnswer);
    }

    if (DOM.puzzleInput) {
        DOM.puzzleInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                checkAnswer();
            }
        });
    }

    // Rules Modal Start Trigger
    if (DOM.btnStartFinalRound) {
        DOM.btnStartFinalRound.addEventListener("click", handleStartFinalRoundClick);
    }

    // Morse Instructions Modal Close Trigger
    if (DOM.btnCloseMorseIntro) {
        DOM.btnCloseMorseIntro.addEventListener("click", closeMorseIntro);
    }

    // Morse Cheat Sheet Buttons
    if (DOM.btnMorseCheatSheet) {
        DOM.btnMorseCheatSheet.addEventListener("click", openCheatSheetGate);
    }
    if (DOM.btnOpenMorseRef) {
        DOM.btnOpenMorseRef.addEventListener("click", openCheatSheetGate);
    }

    // Sudoku Modal Actions
    if (DOM.btnCloseSudoku) {
        DOM.btnCloseSudoku.addEventListener("click", closeSudokuModal);
    }
    if (DOM.btnVerifySudoku) {
        DOM.btnVerifySudoku.addEventListener("click", verifySudokuAnswer);
    }

    // Options Modal Actions
    if (DOM.btnOptions) {
        DOM.btnOptions.addEventListener("click", openOptions);
    }
    if (DOM.btnCloseOptions) {
        DOM.btnCloseOptions.addEventListener("click", closeOptions);
    }

    // Morse Reference Modal Close
    if (DOM.btnCloseMorseRef) {
        DOM.btnCloseMorseRef.addEventListener("click", closeMorseReference);
    }

    // Cinematic Climax Actions
    if (DOM.btnLaunchCinematic) {
        DOM.btnLaunchCinematic.addEventListener("click", launchFinalCinematic);
    }
    if (DOM.btnCinematicNext) {
        DOM.btnCinematicNext.addEventListener("click", advanceCinematic);
    }

    // Modal background click dismissal
    window.addEventListener("click", (e) => {
        if (e.target === DOM.optionsModal) closeOptions();
        if (e.target === DOM.morseRefModal) closeMorseReference();
        if (e.target === DOM.sudokuModal) closeSudokuModal();
    });
}

// Auto-boot on DOM ready
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", () => {
        startFinalRound();
    });
}
