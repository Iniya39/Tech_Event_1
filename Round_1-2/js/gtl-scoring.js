/**
 * CHAPTER 2: GUESS THE LOGIC — Configurable Scoring & Performance Rating Engine
 */

const GTL_GAME_CONFIG = {
    totalQuestions: 10,
    questionTime: 30,
    baseScore: 100,
    speedBonusMultiplier: 10
};

class GTLScoringEngine {
    constructor(config = {}) {
        this.config = { ...GTL_GAME_CONFIG, ...config };
    }

    /**
     * Calculates score for a single question response.
     * @param {boolean} isCorrect 
     * @param {number} remainingSeconds 
     * @returns {number}
     */
    calculateQuestionScore(isCorrect, remainingSeconds) {
        if (!isCorrect) return 0;
        
        const seconds = Math.max(0, Math.min(this.config.questionTime, remainingSeconds));
        const speedBonus = Math.round(seconds * this.config.speedBonusMultiplier);
        return this.config.baseScore + speedBonus;
    }

    /**
     * Calculates summary metrics for the full chapter.
     * @param {Array<Object>} questionResults 
     * @returns {Object}
     */
    calculateSummary(questionResults) {
        let totalScore = 0;
        let correctCount = 0;
        let wrongCount = 0;
        let timeoutCount = 0;
        let totalResponseTime = 0;

        questionResults.forEach(res => {
            totalScore += (res.score || 0);
            totalResponseTime += (res.responseTime || 0);

            if (res.isCorrect) {
                correctCount++;
            } else if (res.isTimeout) {
                timeoutCount++;
            } else {
                wrongCount++;
            }
        });

        const totalQ = questionResults.length || this.config.totalQuestions;
        const accuracyPercentage = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
        
        const rating = this.calculateRating(totalScore, accuracyPercentage, correctCount);

        return {
            totalScore,
            correctCount,
            wrongCount,
            timeoutCount,
            accuracyPercentage,
            totalResponseTime: parseFloat(totalResponseTime.toFixed(1)),
            ratingGrade: rating.grade,
            ratingTitle: rating.title,
            ratingDesc: rating.desc
        };
    }

    /**
     * Computes performance rating grade and feedback description.
     * @param {number} totalScore 
     * @param {number} accuracy 
     * @param {number} correctCount 
     * @returns {Object}
     */
    calculateRating(totalScore, accuracy, correctCount) {
        if (totalScore >= 3200 || (correctCount >= 9)) {
            return {
                grade: "S",
                title: "Exceptional",
                desc: "Mastery achieved! Flawless code tracing, instant logic execution, and elite speed under pressure."
            };
        } else if (totalScore >= 2400 || (correctCount >= 7)) {
            return {
                grade: "A",
                title: "Excellent",
                desc: "Outstanding algorithmic reasoning! High accuracy and swift code analysis demonstrated."
            };
        } else if (totalScore >= 1600 || (correctCount >= 5)) {
            return {
                grade: "B",
                title: "Strong",
                desc: "Solid technical competence. Strong understanding of loops, recursion, and data structures."
            };
        } else if (totalScore >= 800 || (correctCount >= 3)) {
            return {
                grade: "C",
                title: "Average",
                desc: "Chapter 2 Completed Successfully! Click proceed to move to Round 3."
            };
        } else {
            return {
                grade: "D",
                title: "Needs Improvement",
                desc: "Logical execution tripped up on tricky state mutations. Review call stack and bitwise operations."
            };
        }
    }
}
