/**
 * CHAPTER 1: PIXEL RECALL — Core Game Controller & State Machine
 * Coordinates timer loop, attempt lifecycle, answer validation, state transitions, and canvas pixelation updates.
 */

const GAME_CONFIG = {
    totalQuestions: 10,
    questionTime: 20,
    maxAttempts: 3,
    baseScore: 100,
    speedBonusMultiplier: 10,
    enableSound: false,
    enableAnimations: true
};

class PixelRecallGame {
    constructor(uiCallbacks = {}) {
        this.config = { ...GAME_CONFIG };
        this.callbacks = uiCallbacks;

        // Core systems
        this.scoring = new ScoringSystem(this.config);
        this.sound = new SoundEngine();

        // State variables
        this.currentState = "SPLASH";
        this.teamName = loadTeamName();
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.attemptsLeft = this.config.maxAttempts;
        this.attemptsUsed = 0;
        
        // Timer tracking
        this.remainingTime = this.config.questionTime;
        this.timerAnimFrame = null;
        this.lastFrameTime = null;
        this.isQuestionActive = false;

        // Performance & audit tracking
        this.totalScore = 0;
        this.questionResults = [];
        this.pixelEngine = null;
    }

    /**
     * Binds the Canvas Pixelation engine instance.
     * @param {PixelationEngine} engine 
     */
    setPixelEngine(engine) {
        this.pixelEngine = engine;
    }

    /**
     * Sets active team name and saves to local storage.
     * @param {string} customTeamName 
     */
    setTeamName(customTeamName) {
        if (customTeamName) {
            this.teamName = customTeamName.trim();
            saveTeamName(this.teamName);
        }
    }

    /**
     * Initializes game with question bank subset based on configured total questions.
     * @param {string} customTeamName 
     */
    initGame(customTeamName) {
        if (customTeamName) {
            this.teamName = customTeamName.trim();
            saveTeamName(this.teamName);
        }

        // Shuffle or pick first N questions
        this.questions = QUESTION_BANK.slice(0, this.config.totalQuestions);
        this.currentQuestionIndex = 0;
        this.totalScore = 0;
        this.questionResults = [];

        this.setState("INTRO");
    }

    /**
     * Safe state transition handler.
     * @param {string} newState 
     */
    setState(newState) {
        this.currentState = newState;
        if (this.callbacks.onStateChange) {
            this.callbacks.onStateChange(newState, this);
        }
    }

    /**
     * Starts the pre-game 3-2-1 countdown.
     */
    startCountdown() {
        this.setState("COUNTDOWN");
        let count = 3;
        if (this.callbacks.onCountdownTick) {
            this.callbacks.onCountdownTick(count);
        }
        this.sound.playTick();

        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                if (this.callbacks.onCountdownTick) {
                    this.callbacks.onCountdownTick(count);
                }
                this.sound.playTick();
            } else {
                clearInterval(timer);
                if (this.callbacks.onCountdownTick) {
                    this.callbacks.onCountdownTick("GO!");
                }
                this.sound.playTick();
                setTimeout(() => {
                    this.loadCurrentQuestion();
                }, 600);
            }
        }, 1000);
    }

    /**
     * Loads active question and starts timer tick loop.
     */
    loadCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.finishChapter();
            return;
        }

        const currentQ = this.questions[this.currentQuestionIndex];
        this.attemptsLeft = this.config.maxAttempts;
        this.attemptsUsed = 0;
        this.remainingTime = this.config.questionTime;
        this.lastSubmittedAnswer = "";

        this.setState("QUESTION");

        if (this.callbacks.onQuestionLoad) {
            this.callbacks.onQuestionLoad(currentQ, this);
        }

        if (this.pixelEngine) {
            this.pixelEngine.loadImage(currentQ.image, currentQ.answer).then(() => {
                this.pixelEngine.render(1.0, currentQ.difficulty);
            }).catch(() => {});
        }

        this.startTimerLoop();
    }

    /**
     * High precision requestAnimationFrame timer loop.
     */
    startTimerLoop() {
        this.stopTimerLoop();
        this.questionStartTime = performance.now();
        this.remainingTime = this.config.questionTime;
        this.isQuestionActive = true;

        const tick = (now) => {
            if (!this.isQuestionActive) return;

            try {
                const elapsedSeconds = (now - this.questionStartTime) / 1000;
                this.remainingTime = Math.max(0, this.config.questionTime - elapsedSeconds);
                const timeRatio = this.remainingTime / this.config.questionTime;

                if (this.pixelEngine) {
                    const currentQ = this.questions[this.currentQuestionIndex];
                    this.pixelEngine.render(timeRatio, currentQ ? currentQ.difficulty : 'easy');
                }

                if (this.callbacks.onTimerUpdate) {
                    this.callbacks.onTimerUpdate(this.remainingTime, timeRatio);
                }

                if (this.remainingTime <= 0) {
                    this.handleTimeout();
                    return;
                }
            } catch (err) {
                console.error("Timer tick error:", err);
            }

            if (this.isQuestionActive) {
                this.timerAnimFrame = requestAnimationFrame(tick);
            }
        };

        this.timerAnimFrame = requestAnimationFrame(tick);
    }

    /**
     * Halts current timer loop.
     */
    stopTimerLoop() {
        this.isQuestionActive = false;
        if (this.timerAnimFrame) {
            cancelAnimationFrame(this.timerAnimFrame);
            this.timerAnimFrame = null;
        }
    }

    /**
     * Handles manual answer submission from player.
     * @param {string} inputAnswer 
     */
    submitAnswer(inputAnswer) {
        if (!this.isQuestionActive) return;

        this.lastSubmittedAnswer = inputAnswer;
        const currentQ = this.questions[this.currentQuestionIndex];
        const isCorrect = checkAnswerCorrectness(inputAnswer, currentQ);
        this.attemptsUsed++;

        if (isCorrect) {
            // --- CORRECT ANSWER FLOW ---
            this.stopTimerLoop();
            
            const responseTime = parseFloat((this.config.questionTime - this.remainingTime).toFixed(2));
            const questionScore = this.scoring.calculateQuestionScore(true, this.remainingTime);
            this.totalScore += questionScore;

            this.questionResults.push({
                questionId: currentQ.id,
                correctAnswer: currentQ.answer,
                selectedAnswer: inputAnswer,
                isCorrect: true,
                isTimeout: false,
                attemptsUsed: this.attemptsUsed,
                responseTime: responseTime,
                score: questionScore
            });

            this.sound.playCorrect();

            if (this.callbacks.onAnswerCorrect) {
                this.callbacks.onAnswerCorrect(questionScore, this);
            }

            // Render fully clear image on success
            if (this.pixelEngine) {
                this.pixelEngine.render(0.0, currentQ.difficulty);
            }

            // Proceed smoothly to next question
            setTimeout(() => {
                this.advanceToNextQuestion();
            }, 900);

        } else {
            // --- INCORRECT ANSWER FLOW ---
            // Remain active on question until the player gets it right or time expires
            if (this.callbacks.onAnswerIncorrect) {
                this.callbacks.onAnswerIncorrect(999, this.attemptsUsed, this);
            }
        }
    }

    /**
     * Handles question timeout when timer reaches 0.0s.
     */
    handleTimeout() {
        this.stopTimerLoop();
        const currentQ = this.questions[this.currentQuestionIndex];

        this.questionResults.push({
            questionId: currentQ.id,
            correctAnswer: currentQ.answer,
            selectedAnswer: this.lastSubmittedAnswer || "",
            isCorrect: false,
            isTimeout: true,
            attemptsUsed: this.attemptsUsed,
            responseTime: this.config.questionTime,
            score: 0
        });

        this.sound.playTimeout();

        if (this.callbacks.onTimeout) {
            this.callbacks.onTimeout(this);
        }

        setTimeout(() => {
            this.advanceToNextQuestion();
        }, 1200);
    }

    /**
     * Increments index and moves to next question or results.
     */
    advanceToNextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.loadCurrentQuestion();
        } else {
            this.finishChapter();
        }
    }

    /**
     * Finalizes chapter, generates audit summary, and triggers Result screen.
     */
    finishChapter() {
        this.stopTimerLoop();
        const summary = this.scoring.calculateChapterSummary(this.questionResults);
        summary.teamName = this.teamName;

        const payload = submitChapterResult(summary);

        if (this.callbacks.onChapterComplete) {
            this.callbacks.onChapterComplete(summary, payload, this);
        }

        this.setState("RESULT");
    }

    /**
     * Triggers Achievement Unlock screen with fanfare.
     */
    triggerAchievementUnlock() {
        this.setState("ACHIEVEMENT_UNLOCK");
        this.sound.playAchievement();
    }
}
