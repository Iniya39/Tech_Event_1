/**
 * CHAPTER 1: PIXEL RECALL — Scoring & Analytics System
 * Handles configurable score evaluation and final chapter metrics synthesis.
 */

class ScoringSystem {
    constructor(config = {}) {
        this.baseScore = config.baseScore !== undefined ? config.baseScore : 100;
        this.speedBonusMultiplier = config.speedBonusMultiplier !== undefined ? config.speedBonusMultiplier : 10;
        this.questionTime = config.questionTime !== undefined ? config.questionTime : 20;
    }

    /**
     * Calculates score for a question attempt.
     * @param {boolean} isCorrect 
     * @param {number} remainingTimeSeconds 
     * @returns {number}
     */
    calculateQuestionScore(isCorrect, remainingTimeSeconds) {
        if (!isCorrect) return 0;
        const validRemaining = Math.max(0, Math.min(this.questionTime, remainingTimeSeconds));
        const speedBonus = Math.round(validRemaining * this.speedBonusMultiplier);
        return this.baseScore + speedBonus;
    }

    /**
     * Summarizes detailed metrics across all attempted questions.
     * @param {Array<Object>} questionResults 
     * @returns {Object}
     */
    calculateChapterSummary(questionResults) {
        if (!Array.isArray(questionResults) || questionResults.length === 0) {
            return {
                totalScore: 0,
                correctCount: 0,
                wrongCount: 0,
                timeoutCount: 0,
                accuracyPercentage: 0,
                totalResponseTime: "0.00",
                totalAttemptsUsed: 0,
                totalQuestions: 0
            };
        }

        let totalScore = 0;
        let correctCount = 0;
        let wrongCount = 0;
        let timeoutCount = 0;
        let totalResponseTimeSeconds = 0;
        let totalAttemptsUsed = 0;

        questionResults.forEach(res => {
            totalScore += (res.score || 0);
            totalResponseTimeSeconds += (res.responseTime || 0);
            totalAttemptsUsed += (res.attemptsUsed || 0);

            if (res.isCorrect) {
                correctCount++;
            } else if (res.isTimeout) {
                timeoutCount++;
            } else {
                wrongCount++;
            }
        });

        const totalQuestions = questionResults.length;
        const accuracyPercentage = Math.round((correctCount / totalQuestions) * 100);

        return {
            totalScore,
            correctCount,
            wrongCount,
            timeoutCount,
            accuracyPercentage,
            totalResponseTime: totalResponseTimeSeconds.toFixed(2),
            totalAttemptsUsed,
            totalQuestions
        };
    }
}
