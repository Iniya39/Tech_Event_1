/**
 * TOURNAMENT APP BOOTSTRAP — UI Binding & Game Integration
 * Connects Chapter 1 (Pixel Recall) and Chapter 2 (Guess The Logic) engines with DOM interface.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Canvas Pixelation Engine Init (Optional canvas buffer)
    const canvasElement = document.getElementById('pixel-canvas');
    const pixelationEngine = typeof PixelationEngine !== 'undefined' ? new PixelationEngine(canvasElement) : null;

    // DOM UI Elements — Screens Map
    const screens = {
        SPLASH: document.getElementById('splash-screen'),
        INTRO: document.getElementById('intro-screen'),
        INSTRUCTIONS: document.getElementById('instructions-screen'),
        QUESTION: document.getElementById('question-screen'),
        RESULT: document.getElementById('result-screen'),
        GTL_INTRO: document.getElementById('gtl-intro-screen'),
        GTL_INSTRUCTIONS: document.getElementById('gtl-instructions-screen'),
        GTL_QUESTION: document.getElementById('gtl-question-screen'),
        GTL_RESULT: document.getElementById('gtl-result-screen')
    };

    const countdownOverlay = document.getElementById('countdown-overlay');
    const countdownNumber = document.getElementById('countdown-number');
    const achievementOverlay = document.getElementById('achievement-overlay');

    // Chapter 1 Elements
    const splashTeamInput = document.getElementById('splash-team-input');
    const btnSplashStart = document.getElementById('btn-splash-start');
    const btnIntroStart = document.getElementById('btn-intro-start');
    const btnInstructionsReady = document.getElementById('btn-instructions-ready');
    const btnSoundToggle = document.getElementById('btn-sound-toggle');
    const answerForm = document.getElementById('answer-form');
    const inputAnswer = document.getElementById('input-answer');
    const btnSubmitAnswer = document.getElementById('btn-submit-answer');

    const btnReplay = document.getElementById('btn-replay');
    const btnClaimAchievement = document.getElementById('btn-claim-achievement');
    const btnAchievementContinue = document.getElementById('btn-achievement-continue');
    const btnAchievementCh2 = document.getElementById('btn-achievement-ch2');
    const btnChapter2Unlock = document.getElementById('btn-chapter-2-unlock');

    const challengeImage = document.getElementById('challenge-image');
    const hudTeamName = document.getElementById('hud-team-name');
    const hudScore = document.getElementById('hud-score');
    const hudQuestionCounter = document.getElementById('hud-question-counter');
    const hudAttempts = document.getElementById('hud-attempts');
    const hudTimer = document.getElementById('hud-timer');

    const challengeStepTitle = document.getElementById('challenge-step-title');
    const timerSecondsLabel = document.getElementById('timer-seconds-label');
    const timerBarFill = document.getElementById('timer-bar-fill');
    const timeoutBanner = document.getElementById('timeout-banner');
    const attemptsPips = document.getElementById('attempts-pips') ? document.getElementById('attempts-pips').children : [];

    const resultTotalScore = document.getElementById('result-total-score');
    const resultAccuracy = document.getElementById('result-accuracy');
    const resultCorrect = document.getElementById('result-correct');
    const resultWrong = document.getElementById('result-wrong');
    const resultTimeout = document.getElementById('result-timeout');
    const resultResponseTime = document.getElementById('result-response-time');

    // Chapter 2 GTL Elements
    const btnGtlStart = document.getElementById('btn-gtl-start');
    const btnGtlInstructionsReady = document.getElementById('btn-gtl-instructions-ready');
    const gtlAnswerForm = document.getElementById('gtl-answer-form');
    const gtlInputAnswer = document.getElementById('gtl-input-answer');
    const btnGtlSubmit = document.getElementById('btn-gtl-submit');
    const btnGtlReplay = document.getElementById('btn-gtl-replay');
    const btnGtlBackCh1 = document.getElementById('btn-gtl-back-ch1');

    const gtlHudQuestionCounter = document.getElementById('gtl-hud-question-counter');
    const gtlHudScore = document.getElementById('gtl-hud-score');
    const gtlHudTimer = document.getElementById('gtl-hud-timer');
    const gtlTimerMetric = document.getElementById('gtl-timer-metric');
    const gtlProgressFill = document.getElementById('gtl-progress-fill');

    const gtlBadgeCategory = document.getElementById('gtl-badge-category');
    const gtlBadgeDifficulty = document.getElementById('gtl-badge-difficulty');
    const gtlPromptText = document.getElementById('gtl-prompt-text');

    const gtlFeedbackOverlay = document.getElementById('gtl-feedback-overlay');
    const gtlFeedbackCard = document.getElementById('gtl-feedback-card');
    const gtlFeedbackTitle = document.getElementById('gtl-feedback-title');
    const gtlFeedbackSub = document.getElementById('gtl-feedback-sub');
    const gtlFeedbackReveal = document.getElementById('gtl-feedback-reveal');
    const gtlRevealText = document.getElementById('gtl-reveal-text');

    const gtlResultScore = document.getElementById('gtl-result-score');
    const gtlResultCorrect = document.getElementById('gtl-result-correct');
    const gtlResultWrong = document.getElementById('gtl-result-wrong');
    const gtlResultTimeout = document.getElementById('gtl-result-timeout');
    const gtlResultAccuracy = document.getElementById('gtl-result-accuracy');
    const gtlResultTotalTime = document.getElementById('gtl-result-total-time');

    const gtlRatingBadge = document.getElementById('gtl-rating-badge');
    const gtlRatingTitle = document.getElementById('gtl-rating-title');
    const gtlRatingDesc = document.getElementById('gtl-rating-desc');

    /**
     * Reveals Chapter 2 unlock buttons if Chapter 1 is completed.
     */
    function updateChapter2UnlockVisibility() {
        if (typeof isChapter1Completed === 'function' && isChapter1Completed()) {
            if (btnChapter2Unlock) btnChapter2Unlock.style.display = 'inline-block';
            if (btnAchievementCh2) btnAchievementCh2.style.display = 'inline-block';
        }
    }

    // Check Chapter 2 unlock on launch
    updateChapter2UnlockVisibility();

    // ==========================================================================
    // CHAPTER 1 ENGINE INSTANTIATION
    // ==========================================================================
    const game = new PixelRecallGame({
        onStateChange: (newState) => {
            Object.values(screens).forEach(scr => {
                if (scr) scr.classList.remove('active');
            });

            if (screens[newState]) {
                screens[newState].classList.add('active');
            }

            if (newState === 'QUESTION' || newState === 'GTL_QUESTION') {
                // Tab-switch monitoring temporarily disabled
                // if (typeof window.startTabSwitchMonitoring === 'function') {
                //     window.startTabSwitchMonitoring();
                // }
            }

            if (newState === 'COUNTDOWN') {
                countdownOverlay.classList.add('active');
            } else {
                countdownOverlay.classList.remove('active');
            }

            if (newState === 'ACHIEVEMENT_UNLOCK') {
                achievementOverlay.classList.add('active');
            } else {
                achievementOverlay.classList.remove('active');
            }
        },

        onCountdownTick: (value) => {
            countdownNumber.textContent = value;
        },

        onQuestionLoad: (q, gameInstance) => {
            if (challengeImage) {
                challengeImage.src = q.image;
                challengeImage.style.display = 'block';
                challengeImage.style.opacity = '1';
                challengeImage.style.visibility = 'visible';
                challengeImage.style.filter = 'blur(2.0px)';
            }

            if (hudTeamName) hudTeamName.textContent = `TEAM: ${gameInstance.teamName.toUpperCase()}`;
            hudScore.textContent = String(gameInstance.totalScore).padStart(4, '0');
            hudQuestionCounter.textContent = `${String(gameInstance.currentQuestionIndex + 1).padStart(2, '0')}/${String(gameInstance.config.totalQuestions).padStart(2, '0')}`;
            if (hudAttempts) hudAttempts.textContent = `${gameInstance.config.maxAttempts}/${gameInstance.config.maxAttempts}`;
            hudTimer.textContent = `${gameInstance.config.questionTime.toFixed(1)}s`;

            challengeStepTitle.textContent = `PIXEL RECALL — CHALLENGE ${String(gameInstance.currentQuestionIndex + 1).padStart(2, '0')} / ${String(gameInstance.config.totalQuestions).padStart(2, '0')}`;

            timerBarFill.style.transition = 'none';
            timerBarFill.style.width = '100%';
            void timerBarFill.offsetWidth;
            timerBarFill.style.transition = 'width 0.1s linear';
            timerBarFill.classList.remove('warning');
            timerSecondsLabel.textContent = `TIME LEFT: ${gameInstance.config.questionTime.toFixed(1)}s`;

            if (attemptsPips && attemptsPips.length) Array.from(attemptsPips).forEach(pip => pip.classList.remove('used'));

            inputAnswer.value = '';
            inputAnswer.disabled = false;
            btnSubmitAnswer.disabled = false;
            timeoutBanner.classList.remove('active');

            setTimeout(() => {
                inputAnswer.focus();
            }, 100);
        },

        onTimerUpdate: (remainingTime, timeRatio) => {
            const pct = Math.max(0, Math.min(100, timeRatio * 100)).toFixed(1);
            timerBarFill.style.width = `${pct}%`;

            const timeStr = `${Math.max(0, remainingTime).toFixed(1)}s`;
            hudTimer.textContent = timeStr;
            timerSecondsLabel.textContent = `TIME LEFT: ${timeStr}`;

            if (challengeImage) {
                const blurPx = Math.max(0, timeRatio * 2.0).toFixed(1);
                challengeImage.style.filter = blurPx > 0.1 ? `blur(${blurPx}px)` : 'none';
                challengeImage.style.display = 'block';
                challengeImage.style.opacity = '1';
            }

            if (remainingTime <= 3.0) {
                timerBarFill.classList.add('warning');
            }
        },

        onAnswerCorrect: (scoreEarned, gameInstance) => {
            inputAnswer.disabled = true;
            btnSubmitAnswer.disabled = true;
            if (challengeImage) {
                challengeImage.style.filter = 'none';
            }
            hudScore.textContent = String(gameInstance.totalScore).padStart(4, '0');
        },

        onAnswerIncorrect: (remainingAttempts, usedCount, gameInstance) => {
            if (hudAttempts) hudAttempts.textContent = `${remainingAttempts}/${gameInstance.config.maxAttempts}`;

            if (attemptsPips && attemptsPips[usedCount - 1]) {
                attemptsPips[usedCount - 1].classList.add('used');
            }

            inputAnswer.value = '';
            inputAnswer.focus();
        },

        onAttemptsExhausted: () => {
            inputAnswer.disabled = true;
            btnSubmitAnswer.disabled = true;
        },

        onTimeout: () => {
            inputAnswer.disabled = true;
            btnSubmitAnswer.disabled = true;
            timeoutBanner.classList.add('active');
        },

        onChapterComplete: (summary, payload) => {
            latestResultPayload = payload;
            resultTotalScore.textContent = String(summary.totalScore).padStart(4, '0');
            resultAccuracy.textContent = `${summary.accuracyPercentage}%`;
            resultCorrect.textContent = summary.correctCount;
            resultWrong.textContent = summary.wrongCount;
            resultTimeout.textContent = summary.timeoutCount;
            resultResponseTime.textContent = `${summary.totalResponseTime}s`;

            // Mark Chapter 1 completed & unlock Chapter 2
            if (typeof saveChapter1Completed === 'function') {
                saveChapter1Completed();
            }
            updateChapter2UnlockVisibility();
        }
    });

    let latestResultPayload = null;
    const jsonExportOverlay = document.getElementById('json-export-overlay');
    const jsonPreviewCode = document.getElementById('json-preview-code');
    const btnExportJson = document.getElementById('btn-export-json');
    const btnCloseJson = document.getElementById('btn-close-json');
    const btnCopyJson = document.getElementById('btn-copy-json');

    if (pixelationEngine) {
        game.setPixelEngine(pixelationEngine);
    }

    // ==========================================================================
    // CHAPTER 2 ENGINE INSTANTIATION
    // ==========================================================================
    const gtlGame = new GTLGameEngine({
        onStateChange: (newState) => {
            Object.values(screens).forEach(scr => {
                if (scr) scr.classList.remove('active');
            });

            if (newState === 'INTRO' && screens.GTL_INTRO) screens.GTL_INTRO.classList.add('active');
            if (newState === 'INSTRUCTIONS' && screens.GTL_INSTRUCTIONS) screens.GTL_INSTRUCTIONS.classList.add('active');
            if (newState === 'COUNTDOWN') {
                if (screens.GTL_QUESTION) screens.GTL_QUESTION.classList.add('active');
                countdownOverlay.classList.add('active');
            } else {
                countdownOverlay.classList.remove('active');
            }
            if ((newState === 'QUESTION' || newState === 'SUBMITTED' || newState === 'FEEDBACK') && screens.GTL_QUESTION) {
                screens.GTL_QUESTION.classList.add('active');
            }
            if (newState === 'RESULT' && screens.GTL_RESULT) screens.GTL_RESULT.classList.add('active');
        },

        onCountdownTick: (value) => {
            countdownNumber.textContent = value;
        },

        onQuestionLoad: (q, gameInstance) => {
            gtlFeedbackOverlay.classList.remove('active');

            gtlHudQuestionCounter.textContent = `${String(gameInstance.currentQuestionIndex + 1).padStart(2, '0')} / ${String(gameInstance.questions.length).padStart(2, '0')}`;
            gtlHudScore.textContent = String(gameInstance.totalScore).padStart(4, '0');
            gtlHudTimer.textContent = `${gameInstance.config.questionTime.toFixed(1)}s`;
            gtlTimerMetric.classList.remove('warning');

            gtlProgressFill.style.transition = 'none';
            gtlProgressFill.style.width = '100%';
            void gtlProgressFill.offsetWidth;
            gtlProgressFill.style.transition = 'width 0.1s linear';
            gtlProgressFill.classList.remove('warning');

            gtlBadgeCategory.textContent = q.category;
            gtlBadgeDifficulty.textContent = q.difficulty;
            gtlPromptText.textContent = q.prompt || "Analyze the code and determine the output:";

            renderPseudocode(q.code);

            gtlInputAnswer.value = '';
            gtlInputAnswer.disabled = false;
            btnGtlSubmit.disabled = false;

            setTimeout(() => {
                gtlInputAnswer.focus();
            }, 100);
        },

        onTimerUpdate: (remainingTime, timeRatio) => {
            const timeStr = `${Math.max(0, remainingTime).toFixed(1)}s`;
            gtlHudTimer.textContent = timeStr;

            const pct = Math.max(0, Math.min(100, timeRatio * 100)).toFixed(1);
            gtlProgressFill.style.width = `${pct}%`;

            if (remainingTime <= 5.0) {
                gtlTimerMetric.classList.add('warning');
                gtlProgressFill.classList.add('warning');
            }
        },

        onFeedback: (feedback) => {
            gtlFeedbackCard.className = `gtl-feedback-card ${feedback.type.toLowerCase()}`;

            if (feedback.type === 'CORRECT') {
                gtlInputAnswer.disabled = true;
                btnGtlSubmit.disabled = true;
                gtlFeedbackTitle.textContent = '✓ CORRECT';
                gtlFeedbackSub.textContent = `+${feedback.scoreEarned} POINTS`;
                gtlFeedbackReveal.style.display = 'none';
                gtlFeedbackOverlay.classList.add('active');
            } else if (feedback.type === 'INCORRECT') {
                gtlFeedbackTitle.textContent = '✕ INCORRECT';
                gtlFeedbackSub.textContent = 'TRY AGAIN ';
                gtlFeedbackReveal.style.display = 'none';
                gtlFeedbackOverlay.classList.add('active');

                setTimeout(() => {
                    gtlFeedbackOverlay.classList.remove('active');
                    gtlInputAnswer.value = '';
                    gtlInputAnswer.disabled = false;
                    btnGtlSubmit.disabled = false;
                    gtlInputAnswer.focus();
                }, 800);
            } else {
                gtlInputAnswer.disabled = true;
                btnGtlSubmit.disabled = true;
                gtlFeedbackTitle.textContent = "TIME'S UP!";
                gtlFeedbackSub.textContent = '0 POINTS';
                gtlRevealText.textContent = feedback.correctAnswer;
                gtlFeedbackReveal.style.display = 'block';
                gtlFeedbackOverlay.classList.add('active');
            }

            gtlHudScore.textContent = String(feedback.gameInstance.totalScore).padStart(4, '0');
        },

        onGameComplete: (summary, gameInstance) => {
            gtlResultScore.textContent = String(summary.totalScore).padStart(4, '0');
            const totalQ = gameInstance ? gameInstance.questions.length : 10;
            gtlResultCorrect.textContent = `${summary.correctCount} / ${totalQ}`;
            gtlResultWrong.textContent = summary.wrongCount;
            gtlResultTimeout.textContent = summary.timeoutCount;
            gtlResultAccuracy.textContent = `${summary.accuracyPercentage}%`;
            gtlResultTotalTime.textContent = `${summary.totalResponseTime}s`;

            if (gtlRatingBadge) {
                gtlRatingBadge.style.display = 'none';
            }
            gtlRatingTitle.textContent = summary.ratingTitle;
            gtlRatingDesc.textContent = summary.ratingDesc;
        }
    });

    /**
     * Renders code line numbers and syntax highlighted Java code safely in a single pass.
     * @param {string} rawCode 
     */
    function renderPseudocode(rawCode) {
        const lineNumsContainer = document.getElementById('gtl-line-numbers');
        const codeTextContainer = document.getElementById('gtl-code-text');
        if (!lineNumsContainer || !codeTextContainer) return;

        const lines = rawCode.split('\n');
        lineNumsContainer.innerHTML = lines.map((_, i) => i + 1).join('<br>');

        const tokenRegex = /(".*?"|'.*?')|\b(class|public|static|void|int|String|boolean|char|if|else|return|for|import|new|null)\b|\b(mystery|calc|solve|main|println|print|toString|charAt|substring|push|pop|peek|add|remove)\b|\b(\d+)\b|(==|<=|>=|\+\+|--|\+=|-=|\*=|\/=|\+|\-|\*|\/|%|=|!|<|>|\^|&|\|)/g;
        const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const highlightedCode = lines.map(line => {
            return line.replace(tokenRegex, (match, str, kw, fn, num, op) => {
                if (str) return `<span class="token-string">${escapeHtml(str)}</span>`;
                if (kw) return `<span class="token-keyword">${escapeHtml(kw)}</span>`;
                if (fn) return `<span class="token-fn">${escapeHtml(fn)}</span>`;
                if (num) return `<span class="token-number">${escapeHtml(num)}</span>`;
                if (op) return `<span class="token-op">${escapeHtml(op)}</span>`;
                return escapeHtml(match);
            });
        }).join('\n');

        codeTextContainer.innerHTML = highlightedCode;
    }

    // Prefill team name
    if (splashTeamInput) splashTeamInput.value = loadTeamName();

    // Chapter 1 Event Handlers
    const startTournamentHandler = () => {
        const name = (splashTeamInput && splashTeamInput.value) ? splashTeamInput.value.trim() : 'CYBER KNIGHTS';
        game.setTeamName(name);
        game.initGame(name);
    };

    if (btnSplashStart) btnSplashStart.addEventListener('click', startTournamentHandler);

    if (btnIntroStart) btnIntroStart.addEventListener('click', () => game.startCountdown());
    if (btnInstructionsReady) btnInstructionsReady.addEventListener('click', () => game.startCountdown());
    if (btnSoundToggle) {
        btnSoundToggle.addEventListener('click', () => {
            const isEnabled = game.sound.toggleSound();
            btnSoundToggle.textContent = isEnabled ? '🔊 SOUND ON' : '🔊 SOUND OFF';
            btnSoundToggle.classList.toggle('active', isEnabled);
        });
    }

    if (answerForm) {
        answerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = inputAnswer.value.trim();
            if (val) game.submitAnswer(val);
        });
    }

    if (btnReplay) btnReplay.addEventListener('click', () => game.initGame('CYBER KNIGHTS'));
    if (btnExportJson) {
        btnExportJson.addEventListener('click', () => {
            if (latestResultPayload) {
                jsonPreviewCode.textContent = JSON.stringify(latestResultPayload, null, 2);
                jsonExportOverlay.classList.add('active');
            }
        });
    }
    if (btnCloseJson) btnCloseJson.addEventListener('click', () => jsonExportOverlay.classList.remove('active'));
    if (btnCopyJson) {
        btnCopyJson.addEventListener('click', () => {
            if (jsonPreviewCode.textContent) {
                navigator.clipboard.writeText(jsonPreviewCode.textContent).then(() => {
                    const origText = btnCopyJson.textContent;
                    btnCopyJson.textContent = 'COPIED TO CLIPBOARD!';
                    setTimeout(() => { btnCopyJson.textContent = origText; }, 2000);
                });
            }
        });
    }

    if (btnClaimAchievement) btnClaimAchievement.addEventListener('click', () => game.triggerAchievementUnlock());
    if (btnAchievementContinue) {
        btnAchievementContinue.addEventListener('click', () => {
            achievementOverlay.classList.remove('active');
            game.initGame(splashTeamInput.value);
        });
    }

    // ==========================================================================
    // CHAPTER 2 EVENT HANDLERS & NAVIGATION
    // ==========================================================================
    const launchGTL = () => {
        const transOverlay = document.getElementById('chapter-transition-overlay');
        if (transOverlay) {
            transOverlay.style.display = 'flex';
            setTimeout(() => {
                transOverlay.style.display = 'none';
                if (achievementOverlay) achievementOverlay.classList.remove('active');
                gtlGame.initGame();
            }, 1200);
        } else {
            if (achievementOverlay) achievementOverlay.classList.remove('active');
            gtlGame.initGame();
        }
    };

    window.triggerChapterTransition = function (targetChapter) {
        if (targetChapter === 2) {
            if (game && typeof game.stopTimerLoop === 'function') {
                game.stopTimerLoop();
            }
            launchGTL();
        } else if (targetChapter === 3) {
            if (gtlGame && typeof gtlGame.stopTimer === 'function') {
                gtlGame.stopTimer();
            }
            window.location.href = '../Round_3/index.html';
        }
    };

    if (btnChapter2Unlock) btnChapter2Unlock.addEventListener('click', launchGTL);
    if (btnAchievementCh2) btnAchievementCh2.addEventListener('click', launchGTL);

    if (btnGtlStart) btnGtlStart.addEventListener('click', () => gtlGame.setState('INSTRUCTIONS'));
    if (btnGtlInstructionsReady) btnGtlInstructionsReady.addEventListener('click', () => gtlGame.startCountdown());

    if (gtlAnswerForm) {
        gtlAnswerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = gtlInputAnswer.value.trim();
            if (val) {
                gtlGame.submitAnswer(val);
            }
        });
    }

    if (btnGtlReplay) btnGtlReplay.addEventListener('click', () => gtlGame.initGame());
    if (btnGtlBackCh1) {
        btnGtlBackCh1.addEventListener('click', () => {
            game.setState('RESULT');
            updateChapter2UnlockVisibility();
        });
    }

    // Dynamic Background Particle Grid Animation
    initCyberBackgroundCanvas();
});

/**
 * Renders an animated high-tech particle grid background.
 */
function initCyberBackgroundCanvas() {
    const bgCanvas = document.getElementById('cyber-bg-canvas');
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext('2d');

    let width = bgCanvas.width = window.innerWidth;
    let height = bgCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = bgCanvas.width = window.innerWidth;
        height = bgCanvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1
    }));

    function draw() {
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        });

        requestAnimationFrame(draw);
    }

    draw();
}
