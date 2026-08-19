/**
 * CHAPTER 2: GUESS THE LOGIC — Core Game Engine & State Controller
 * Manages game loop, state machine, timestamp timer, answer submission protection,
 * automated question transitions, feedback rendering, and local storage integration.
 */

class GTLGameEngine {
    constructor(uiCallbacks = {}) {
        this.config = { ...GTL_GAME_CONFIG };
        this.callbacks = uiCallbacks;

        this.scoring = new GTLScoringEngine(this.config);
        this.sound = typeof SoundEngine !== 'undefined' ? new SoundEngine() : null;

        // State Machine States: INTRO, INSTRUCTIONS, COUNTDOWN, QUESTION, SUBMITTED, FEEDBACK, RESULT
        this.currentState = "INTRO";
        this.questions = [...GTL_QUESTION_BANK];
        this.currentQuestionIndex = 0;
        this.totalScore = 0;
        
        // Timer variables (high precision timestamp-based)
        this.remainingTime = this.config.questionTime;
        this.questionStartTime = 0;
        this.timerAnimFrame = null;
        this.isQuestionActive = false;
        this.isSubmitted = false;

        // Question results tracking
        this.questionResults = [];
        this.teamName = typeof loadTeamName === 'function' ? loadTeamName() : "CODE KNIGHTS";
    }

    /**
     * Initializes a fresh game instance.
     */
    initGame() {
        this.questions = [...GTL_QUESTION_BANK];
        this.currentQuestionIndex = 0;
        this.totalScore = 0;
        this.questionResults = [];
        this.isSubmitted = false;
        this.stopTimer();

        this.setState("INTRO");
    }

    /**
     * Safe state transition handler.
     * @param {string} newState 
     */
    setState(newState) {
        // Enforce valid state transitions if needed
        const validStates = ["INTRO", "INSTRUCTIONS", "COUNTDOWN", "QUESTION", "SUBMITTED", "FEEDBACK", "RESULT"];
        if (!validStates.includes(newState)) return;

        this.currentState = newState;
        if (this.callbacks.onStateChange) {
            this.callbacks.onStateChange(newState, this);
        }
    }

    /**
     * Starts pre-game 3-2-1 countdown.
     */
    startCountdown() {
        this.setState("COUNTDOWN");
        let count = 3;

        if (this.callbacks.onCountdownTick) {
            this.callbacks.onCountdownTick(count);
        }
        if (this.sound && this.sound.playTick) this.sound.playTick();

        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                if (this.callbacks.onCountdownTick) {
                    this.callbacks.onCountdownTick(count);
                }
                if (this.sound && this.sound.playTick) this.sound.playTick();
            } else {
                clearInterval(timer);
                if (this.callbacks.onCountdownTick) {
                    this.callbacks.onCountdownTick("GO!");
                }
                if (this.sound && this.sound.playTick) this.sound.playTick();

                setTimeout(() => {
                    this.loadQuestion(0);
                }, 600);
            }
        }, 1000);
    }

    /**
     * Loads question at index and resets timer/inputs.
     * @param {number} index 
     */
    loadQuestion(index) {
        if (index >= this.questions.length) {
            this.finishGame();
            return;
        }

        this.currentQuestionIndex = index;
        this.isSubmitted = false;
        const currentQ = this.questions[this.currentQuestionIndex];
        
        this.setState("QUESTION");

        if (this.callbacks.onQuestionLoad) {
            this.callbacks.onQuestionLoad(currentQ, this);
        }

        this.startTimer();
    }

    /**
     * High precision requestAnimationFrame timer using performance.now().
     */
    startTimer() {
        this.stopTimer();
        this.isQuestionActive = true;
        this.questionStartTime = performance.now();
        this.remainingTime = this.config.questionTime;

        const tick = (now) => {
            if (!this.isQuestionActive || this.isSubmitted) return;

            const elapsedSeconds = (now - this.questionStartTime) / 1000;
            this.remainingTime = Math.max(0, this.config.questionTime - elapsedSeconds);
            const timeRatio = this.remainingTime / this.config.questionTime;

            if (this.callbacks.onTimerUpdate) {
                this.callbacks.onTimerUpdate(this.remainingTime, timeRatio);
            }

            if (this.remainingTime <= 0) {
                this.handleTimeout();
                return;
            }

            this.timerAnimFrame = requestAnimationFrame(tick);
        };

        this.timerAnimFrame = requestAnimationFrame(tick);
    }

    /**
     * Halts current active timer loop cleanly.
     */
    stopTimer() {
        this.isQuestionActive = false;
        if (this.timerAnimFrame) {
            cancelAnimationFrame(this.timerAnimFrame);
            this.timerAnimFrame = null;
        }
    }

    /**
     * Handles manual answer submission by player.
     * Anti-cheat: strictly disables double submissions, stops timer immediately.
     * @param {string} submittedAnswer 
     */
    async submitAnswer(submittedAnswer) {
        if (!this.isQuestionActive || this.isSubmitted || this.isSubmitting) return;

        this.isSubmitting = true;

        const responseTime = parseFloat((this.config.questionTime - this.remainingTime).toFixed(2));
        const currentQ = this.questions[this.currentQuestionIndex];

        // Call backend submission architecture function
        const validationResult = await submitAnswerToBackend(currentQ.id, submittedAnswer, responseTime);
        const isCorrect = validationResult.isCorrect;
        const scoreEarned = validationResult.score;

        this.isSubmitting = false;

        if (!isCorrect) {
            // Incorrect answer: Allow n attempts within time limit
            if (this.sound && this.sound.playTimeout) this.sound.playTimeout();
            
            if (this.callbacks.onFeedback) {
                this.callbacks.onFeedback({
                    type: 'INCORRECT',
                    scoreEarned: 0,
                    correctAnswer: currentQ.correctAnswer,
                    gameInstance: this
                });
            }
            return;
        }

        // Correct Answer: Lock & advance
        this.isSubmitted = true;
        this.stopTimer();
        this.setState("SUBMITTED");

        this.totalScore += scoreEarned;

        this.questionResults.push({
            questionId: currentQ.id,
            category: currentQ.category,
            submittedAnswer: submittedAnswer,
            correctAnswer: currentQ.correctAnswer,
            isCorrect: true,
            isTimeout: false,
            responseTime: responseTime,
            score: scoreEarned
        });

        // Trigger Audio & Instant DB Persistence
        if (this.sound && this.sound.playCorrect) this.sound.playCorrect();

        // Instant Database Score Transmission & Realtime Leaderboard Update (Round 2)
        const teamId = localStorage.getItem("current_team_id");
        if (teamId && typeof window !== 'undefined' && window.TournamentDB && typeof window.TournamentDB.saveRoundScore === 'function') {
            window.TournamentDB.saveRoundScore(teamId, 2, this.totalScore)
                .then(res => console.log(`🏆 [Supabase DB] Instant Round 2 score updated: ${this.totalScore}`, res))
                .catch(err => console.error("❌ [Supabase DB Error] Instant score update failed:", err));
        }

        // Trigger UI Feedback State
        this.setState("FEEDBACK");
        if (this.callbacks.onFeedback) {
            this.callbacks.onFeedback({
                type: 'CORRECT',
                scoreEarned: scoreEarned,
                correctAnswer: currentQ.correctAnswer,
                gameInstance: this
            });
        }

        // Automatically move to next question after 1.8 seconds
        setTimeout(() => {
            this.advanceToNextQuestion();
        }, 1800);
    }

    /**
     * Handles question timeout when 30 seconds expire.
     */
    handleTimeout() {
        if (this.isSubmitted) return;

        this.isSubmitted = true;
        this.stopTimer();
        this.setState("SUBMITTED");

        const currentQ = this.questions[this.currentQuestionIndex];
        const responseTime = this.config.questionTime;

        this.questionResults.push({
            questionId: currentQ.id,
            category: currentQ.category,
            submittedAnswer: "",
            correctAnswer: currentQ.correctAnswer,
            isCorrect: false,
            isTimeout: true,
            responseTime: responseTime,
            score: 0
        });

        if (this.sound && this.sound.playTimeout) this.sound.playTimeout();

        this.setState("FEEDBACK");
        if (this.callbacks.onFeedback) {
            this.callbacks.onFeedback({
                type: 'TIMEOUT',
                scoreEarned: 0,
                correctAnswer: currentQ.correctAnswer,
                gameInstance: this
            });
        }

        // Automatically move to next question after 1.8 seconds
        setTimeout(() => {
            this.advanceToNextQuestion();
        }, 1800);
    }

    /**
     * Advances index and triggers next question or final result.
     */
    advanceToNextQuestion() {
        const nextIndex = this.currentQuestionIndex + 1;
        if (nextIndex < this.questions.length) {
            this.loadQuestion(nextIndex);
        } else {
            this.finishGame();
        }
    }

    /**
     * Finalizes Chapter 2 game, calculates performance metrics, saves to localStorage.
     */
    finishGame() {
        this.stopTimer();
        const summary = this.scoring.calculateSummary(this.questionResults);
        
        // Save to localStorage using storage utility
        if (typeof saveGTLResult === 'function') {
            saveGTLResult(summary);
        }

        this.setState("RESULT");
        if (this.callbacks.onGameComplete) {
            this.callbacks.onGameComplete(summary, this);
        }
    }
}
