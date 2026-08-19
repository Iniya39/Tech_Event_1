/**
 * GAME.JS - Core Game Engine, Timer, Multiple Attempts Logic & Image Renderer
 * Round 6: CONNECTIONS Technical Competition
 */

const GameEngine = (function () {

    // Web Audio API Context for sound effects
    let audioCtx = null;
    let soundEnabled = false;

    // Engine State
    let currentState = 'INTRO'; // INTRO | COUNTDOWN | QUESTION | SUBMITTED | FEEDBACK | RESULT
    let currentQuestionIndex = 0;
    let activeQuestion = null;
    let timerInterval = null;
    let secondsRemaining = 100;
    let questionStartTime = 0;
    let attemptsCount = 0;
    let isSubmitting = false;

    // Game Metrics Session Data
    let sessionData = StorageModule.createInitialState();

    /**
     * Toggles sound on/off
     */
    function toggleSound() {
        soundEnabled = !soundEnabled;
        if (soundEnabled && !audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        return soundEnabled;
    }

    /**
     * Web Audio API Synthesizer for Retro-Futuristic Sound Effects
     */
    function playSound(type) {
        if (!soundEnabled || !audioCtx) return;
        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const now = audioCtx.currentTime;

            if (type === 'tick') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'countdown') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'go') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(880, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'correct') {
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, idx) => {
                    const noteOsc = audioCtx.createOscillator();
                    const noteGain = audioCtx.createGain();
                    noteOsc.type = 'sine';
                    noteOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
                    noteGain.gain.setValueAtTime(0.15, now + idx * 0.08);
                    noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
                    noteOsc.connect(noteGain);
                    noteGain.connect(audioCtx.destination);
                    noteOsc.start(now + idx * 0.08);
                    noteOsc.stop(now + idx * 0.08 + 0.25);
                });
            } else if (type === 'wrong') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(120, now + 0.2);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'timeout') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.setValueAtTime(200, now + 0.15);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (type === 'complete') {
                const notes = [440, 554.37, 659.25, 880];
                notes.forEach((freq, idx) => {
                    const noteOsc = audioCtx.createOscillator();
                    const noteGain = audioCtx.createGain();
                    noteOsc.type = 'triangle';
                    noteOsc.frequency.setValueAtTime(freq, now + idx * 0.12);
                    noteGain.gain.setValueAtTime(0.2, now + idx * 0.12);
                    noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);
                    noteOsc.connect(noteGain);
                    noteGain.connect(audioCtx.destination);
                    noteOsc.start(now + idx * 0.12);
                    noteOsc.stop(now + idx * 0.12 + 0.4);
                });
            }
        } catch (e) {
            console.warn("Audio playback error:", e);
        }
    }

    /**
     * Switches DOM screens smoothly.
     */
    function showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });

        const target = document.getElementById(screenId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }
    }

    /**
     * Starts the Game Sequence from Intro to 3-2-1 Countdown.
     */
    function startGameSequence() {
        sessionData = StorageModule.createInitialState();
        currentQuestionIndex = 0;
        currentState = 'COUNTDOWN';

        showScreen('screen-countdown');
        startCountdownOverlay();
    }

    /**
     * Runs 3 -> 2 -> 1 -> GO! animated countdown.
     */
    function startCountdownOverlay() {
        const countDisplay = document.getElementById('countdown-number');
        let count = 3;
        countDisplay.textContent = count;
        playSound('countdown');

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                countDisplay.textContent = count;
                playSound('countdown');
            } else if (count === 0) {
                countDisplay.textContent = "GO!";
                playSound('go');
            } else {
                clearInterval(interval);
                loadQuestion(0);
            }
        }, 1000);
    }

    /**
     * Loads question at index into UI and starts 90s timer.
     */
    function loadQuestion(index) {
        if (index >= CONNECTIONS_QUESTIONS.length) {
            finishRound();
            return;
        }

        currentQuestionIndex = index;
        activeQuestion = CONNECTIONS_QUESTIONS[index];
        currentState = 'QUESTION';
        attemptsCount = 0;
        isSubmitting = false;
        secondsRemaining = activeQuestion.timeLimit || 100;
        questionStartTime = Date.now();

        // Reset HUD & Input
        showScreen('screen-question');
        // Tab-switch monitoring temporarily disabled
        // if (typeof window.startTabSwitchMonitoring === 'function') {
        //     window.startTabSwitchMonitoring();
        // }
        updateHUD();
        renderQuestionImage(activeQuestion);

        const answerInput = document.getElementById('user-answer-input');
        const submitBtn = document.getElementById('submit-answer-btn');
        const feedbackBanner = document.getElementById('feedback-banner');
        const hintEl = document.querySelector('.input-hint');

        answerInput.value = '';
        answerInput.disabled = false;
        submitBtn.disabled = false;
        answerInput.classList.remove('shake-input');
        feedbackBanner.classList.add('hidden');
        feedbackBanner.className = 'feedback-banner hidden';

        if (hintEl) {
            hintEl.textContent = "Unlimited attempts allowed within 100s! Exact spelling required.";
            hintEl.style.color = "var(--text-dim)";
        }

        // Set focus to input field
        setTimeout(() => answerInput.focus(), 100);

        // Start 90s Question Timer
        startTimer();
    }

    /**
     * Renders HUD metrics.
     */
    function updateHUD() {
        const questionNumEl = document.getElementById('hud-question-num');
        const scoreEl = document.getElementById('hud-score');
        const timerEl = document.getElementById('hud-timer');
        const diffBadge = document.getElementById('hud-difficulty-badge');
        const progressFill = document.getElementById('hud-progress-fill');

        questionNumEl.textContent = `${currentQuestionIndex + 1} / ${CONNECTIONS_QUESTIONS.length}`;
        scoreEl.textContent = sessionData.score;
        timerEl.textContent = `${secondsRemaining}s`;
        timerEl.className = 'hud-val timer-val';

        // Update Difficulty Tag
        diffBadge.textContent = activeQuestion.difficulty.toUpperCase();
        diffBadge.className = 'diff-tag';
        if (activeQuestion.difficulty === 'Challenging') diffBadge.classList.add('diff-challenging');
        else if (activeQuestion.difficulty === 'Very Challenging') diffBadge.classList.add('diff-very-challenging');
        else if (activeQuestion.difficulty === 'Difficult') diffBadge.classList.add('diff-difficult');
        else if (activeQuestion.difficulty === 'Expert') diffBadge.classList.add('diff-expert');
        else if (activeQuestion.difficulty === 'Final Challenge') diffBadge.classList.add('diff-final');

        // Progress Bar
        const pct = ((currentQuestionIndex + 1) / CONNECTIONS_QUESTIONS.length) * 100;
        progressFill.style.width = `${pct}%`;
    }

    let lastTickedSecond = -1;

    /**
     * Timer countdown logic using high-precision timestamp calculation.
     */
    function startTimer() {
        clearInterval(timerInterval);
        const timerEl = document.getElementById('hud-timer');
        const progressFill = document.getElementById('hud-progress-fill');
        const totalDuration = (activeQuestion && activeQuestion.timeLimit) ? activeQuestion.timeLimit : 100;
        lastTickedSecond = totalDuration;

        if (progressFill) {
            progressFill.style.transition = 'none';
            progressFill.style.width = '100%';
            void progressFill.offsetWidth;
            progressFill.style.transition = 'width 0.2s linear';
        }

        const updateTimer = () => {
            if (currentState !== 'QUESTION' || isSubmitting) return;

            const elapsedSeconds = (Date.now() - questionStartTime) / 1000;
            const remaining = Math.max(0, Math.ceil(totalDuration - elapsedSeconds));
            secondsRemaining = remaining;
            timerEl.textContent = `${remaining}s`;

            if (progressFill) {
                const pct = Math.max(0, Math.min(100, (remaining / totalDuration) * 100)).toFixed(1);
                progressFill.style.width = `${pct}%`;
            }

            if (remaining !== lastTickedSecond) {
                lastTickedSecond = remaining;
                if (remaining <= 10 && remaining > 5) {
                    timerEl.className = 'hud-val timer-val warning';
                    playSound('tick');
                } else if (remaining <= 5 && remaining > 0) {
                    timerEl.className = 'hud-val timer-val critical';
                    playSound('tick');
                }
            }

            if (remaining <= 0) {
                clearInterval(timerInterval);
                handleTimeout();
            }
        };

        updateTimer();
        timerInterval = setInterval(updateTimer, 100);
    }

    /**
     * Renders the custom image for the current question.
     */
    function renderQuestionImage(question) {
        const gridContainer = document.getElementById('dynamic-image-grid');
        gridContainer.innerHTML = '';
        gridContainer.className = 'single-image-wrapper animate-slide-up';

        const wrapper = document.createElement('div');
        wrapper.className = 'question-image-card glass-panel';

        wrapper.innerHTML = `
            <div class="image-preview-container">
                <img src="${question.imageSrc}" alt="${question.title}" class="connection-main-img" onerror="this.onerror=null; this.src='assets/images/q1/img1.png';" />
            </div>
        `;
        gridContainer.appendChild(wrapper);
    }

    /**
     * Handles User Form Answer Submission with N Attempts support.
     */
    function handleAnswerSubmit(userTypedAnswer) {
        if (isSubmitting || currentState !== 'QUESTION') return;

        const trimmed = (userTypedAnswer || '').trim();
        if (!trimmed) return;

        attemptsCount++;
        const isCorrect = ValidationModule.isCorrectAnswer(trimmed, activeQuestion);

        const answerInput = document.getElementById('user-answer-input');
        const hintEl = document.querySelector('.input-hint');

        if (isCorrect) {
            // CORRECT ANSWER: Stop timer, reward score, and advance
            isSubmitting = true;
            currentState = 'SUBMITTED';
            clearInterval(timerInterval);

            answerInput.disabled = true;
            document.getElementById('submit-answer-btn').disabled = true;

            const responseTime = (Date.now() - questionStartTime) / 1000;
            const remainingSecs = Math.max(0, secondsRemaining);
            const scoreEarned = ScoringModule.calculateQuestionScore(activeQuestion.points, remainingSecs);

            const result = {
                questionId: activeQuestion.id,
                selectedAnswer: trimmed,
                correctAnswer: activeQuestion.correctAnswer,
                isCorrect: true,
                attempts: attemptsCount,
                responseTime: parseFloat(responseTime.toFixed(1)),
                score: scoreEarned
            };

            processResult(result);
        } else {
            // INCORRECT ATTEMPT: Keep timer running, allow infinite attempts!
            playSound('wrong');
            
            // Visual shake feedback on input
            answerInput.classList.remove('shake-input');
            void answerInput.offsetWidth; // trigger reflow
            answerInput.classList.add('shake-input');

            answerInput.value = '';
            answerInput.focus();

            if (hintEl) {
                hintEl.textContent = `✕ Incorrect attempt #${attemptsCount}. Keep trying!`;
                hintEl.style.color = "var(--color-danger)";
            }
        }
    }

    /**
     * Handles Question Timeout event.
     */
    function handleTimeout() {
        if (isSubmitting || currentState !== 'QUESTION') return;
        isSubmitting = true;
        currentState = 'SUBMITTED';

        const answerInput = document.getElementById('user-answer-input');
        const submitBtn = document.getElementById('submit-answer-btn');

        answerInput.disabled = true;
        submitBtn.disabled = true;

        const result = {
            questionId: activeQuestion.id,
            selectedAnswer: attemptsCount > 0 ? `(${attemptsCount} failed attempts)` : "(TIMEOUT)",
            correctAnswer: activeQuestion.correctAnswer,
            isCorrect: false,
            attempts: attemptsCount,
            responseTime: activeQuestion.timeLimit,
            score: 0,
            isTimeout: true
        };

        processResult(result);
    }

    /**
     * Processes submission result and triggers feedback.
     */
    function processResult(result) {
        sessionData.questionResults.push(result);
        sessionData.totalResponseTime += result.responseTime;

        const feedbackBanner = document.getElementById('feedback-banner');
        const statusEl = document.getElementById('feedback-status');
        const pointsEl = document.getElementById('feedback-points');
        const correctAnsEl = document.getElementById('feedback-correct-answer');

        if (result.isCorrect) {
            sessionData.correct++;
            sessionData.score += result.score;

            // Instant Database Score Transmission & Realtime Leaderboard Update (Round 6)
            const teamId = localStorage.getItem("current_team_id");
            if (teamId && typeof window !== 'undefined' && window.TournamentDB && typeof window.TournamentDB.saveRoundScore === 'function') {
                window.TournamentDB.saveRoundScore(teamId, 6, sessionData.score)
                    .then(res => console.log(`🏆 [Supabase DB] Instant Round 6 score updated: ${sessionData.score}`, res))
                    .catch(err => console.error("❌ [Supabase DB Error] Instant score update failed:", err));
            }

            statusEl.textContent = "✓ CORRECT";
            pointsEl.textContent = `+${result.score} POINTS`;
            correctAnsEl.innerHTML = `Solved in ${result.attempts} attempt${result.attempts > 1 ? 's' : ''}!`;
            feedbackBanner.className = "feedback-banner correct-banner";
            playSound('correct');
        } else if (result.isTimeout) {
            sessionData.timeout++;
            statusEl.textContent = "TIME'S UP";
            pointsEl.textContent = "+0 POINTS";
            correctAnsEl.innerHTML = ""; // Do NOT display correct answer
            feedbackBanner.className = "feedback-banner timeout-banner";
            playSound('timeout');
        } else {
            sessionData.wrong++;
            statusEl.textContent = "✕ INCORRECT";
            pointsEl.textContent = "+0 POINTS";
            correctAnsEl.innerHTML = ""; // Do NOT display correct answer
            feedbackBanner.className = "feedback-banner wrong-banner";
            playSound('wrong');
        }

        feedbackBanner.classList.remove('hidden');
        document.getElementById('hud-score').textContent = sessionData.score;

        currentState = 'FEEDBACK';
        StorageModule.saveState(sessionData);

        // Advance automatically after 2.5 seconds
        setTimeout(() => {
            loadQuestion(currentQuestionIndex + 1);
        }, 2500);
    }

    /**
     * Round Complete - Displays Final Results.
     */
    function finishRound() {
        currentState = 'RESULT';
        clearInterval(timerInterval);

        sessionData.completedAt = new Date().toISOString();
        sessionData.accuracy = Math.round((sessionData.correct / sessionData.totalQuestions) * 100);

        const maxBasePoints = CONNECTIONS_QUESTIONS.reduce((acc, q) => acc + q.points, 0);
        const rank = ScoringModule.calculatePerformanceRank(sessionData.score, sessionData.correct, maxBasePoints);

        StorageModule.saveCompletedRound(sessionData);
        StorageModule.clearState();

        showScreen('screen-result');
        playSound('complete');

        // Render Result Metrics
        document.getElementById('result-score').textContent = sessionData.score;
        document.getElementById('result-correct').textContent = `${sessionData.correct} / ${sessionData.totalQuestions}`;
        document.getElementById('result-wrong').textContent = sessionData.wrong;
        document.getElementById('result-timeout').textContent = sessionData.timeout;
        document.getElementById('result-accuracy').textContent = `${sessionData.accuracy}%`;
        document.getElementById('result-total-time').textContent = `${Math.round(sessionData.totalResponseTime)}s`;

        // Render Performance Rank Badge
        const rankBadge = document.getElementById('result-rank-badge');
        const rankTitle = document.getElementById('result-rank-title');
        rankBadge.textContent = rank.title.charAt(0);
        rankBadge.className = `rank-badge ${rank.class}`;
        rankTitle.textContent = rank.title;

        // Render Summary Breakdown Table
        renderSummaryTable(sessionData.questionResults);
    }

    /**
     * Renders detailed question breakdown table.
     */
    function renderSummaryTable(results) {
        const tbody = document.getElementById('result-table-body');
        tbody.innerHTML = '';

        results.forEach((res, idx) => {
            const qObj = CONNECTIONS_QUESTIONS[idx] || {};
            const tr = document.createElement('tr');

            let statusBadge = '';
            if (res.isCorrect) {
                statusBadge = `<span class="badge-status status-correct">CORRECT</span>`;
            } else if (res.isTimeout) {
                statusBadge = `<span class="badge-status status-timeout">TIMEOUT</span>`;
            } else {
                statusBadge = `<span class="badge-status status-wrong">WRONG</span>`;
            }

            tr.innerHTML = `
                <td>Q${idx + 1}</td>
                <td><span class="diff-tag ${getDiffClass(qObj.difficulty)}">${qObj.difficulty || ''}</span></td>
                <td>${escapeHTML(res.selectedAnswer || '-')}</td>
                <td><strong>${res.isCorrect ? escapeHTML(qObj.correctAnswer || '') : '—'}</strong></td>
                <td>${statusBadge}</td>
                <td>${res.attempts || 1}</td>
                <td>${res.responseTime}s</td>
                <td><strong>+${res.score}</strong></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function getDiffClass(diff) {
        if (diff === 'Challenging') return 'diff-challenging';
        if (diff === 'Very Challenging') return 'diff-very-challenging';
        if (diff === 'Difficult') return 'diff-difficult';
        if (diff === 'Expert') return 'diff-expert';
        if (diff === 'Final Challenge') return 'diff-final';
        return '';
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    return {
        toggleSound,
        startGameSequence,
        handleAnswerSubmit,
        loadQuestion
    };
})();
