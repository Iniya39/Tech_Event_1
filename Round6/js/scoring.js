/**
 * SCORING.JS - Game Configuration, Point Calculation & Rank Thresholds
 * Round 6: CONNECTIONS Technical Competition
 */

const GAME_CONFIG = {
    totalQuestions: 15,
    defaultQuestionTime: 100,
    speedBonusMultiplier: 5,
    
    // Performance Ranks & Configurable Score/Accuracy Thresholds
    ranks: {
        S: { minAccuracy: 90, minScoreRatio: 0.85, title: "S — Exceptional", class: "rank-s" },
        A: { minAccuracy: 75, minScoreRatio: 0.70, title: "A — Excellent", class: "rank-a" },
        B: { minAccuracy: 50, minScoreRatio: 0.50, title: "B — Strong", class: "rank-b" },
        C: { minAccuracy: 0,  minScoreRatio: 0,    title: "C — Needs Improvement", class: "rank-c" }
    }
};

const ScoringModule = (function () {

    /**
     * Calculates the score for a correctly answered question.
     * Score = basePoints + (remainingSeconds * speedBonusMultiplier)
     * 
     * @param {number} basePoints 
     * @param {number} remainingSeconds 
     * @returns {number} Calculated total question score
     */
    function calculateQuestionScore(basePoints, remainingSeconds) {
        const secondsLeft = Math.max(0, Math.floor(remainingSeconds));
        const speedBonus = secondsLeft * GAME_CONFIG.speedBonusMultiplier;
        return basePoints + speedBonus;
    }

    /**
     * Evaluates final player performance rank (S, A, B, C) based on accuracy percentage and total score ratio.
     * 
     * @param {number} totalScore 
     * @param {number} correctCount 
     * @param {number} maxPossibleScore 
     * @returns {object} Rank details
     */
    function calculatePerformanceRank(totalScore, correctCount, maxPossibleScore) {
        const accuracy = (correctCount / GAME_CONFIG.totalQuestions) * 100;
        const scoreRatio = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) : 0;

        if (accuracy >= GAME_CONFIG.ranks.S.minAccuracy || scoreRatio >= GAME_CONFIG.ranks.S.minScoreRatio) {
            return GAME_CONFIG.ranks.S;
        } else if (accuracy >= GAME_CONFIG.ranks.A.minAccuracy || scoreRatio >= GAME_CONFIG.ranks.A.minScoreRatio) {
            return GAME_CONFIG.ranks.A;
        } else if (accuracy >= GAME_CONFIG.ranks.B.minAccuracy || scoreRatio >= GAME_CONFIG.ranks.B.minScoreRatio) {
            return GAME_CONFIG.ranks.B;
        } else {
            return GAME_CONFIG.ranks.C;
        }
    }

    return {
        calculateQuestionScore,
        calculatePerformanceRank
    };
})();

if (typeof window !== 'undefined') {
    window.GAME_CONFIG = GAME_CONFIG;
    window.ScoringModule = ScoringModule;
} else if (typeof globalThis !== 'undefined') {
    globalThis.GAME_CONFIG = GAME_CONFIG;
    globalThis.ScoringModule = ScoringModule;
}
