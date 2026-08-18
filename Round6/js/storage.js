/**
 * STORAGE.JS - Local Storage & Simulated Server-Side Validation / Backend Endpoint
 * Round 6: CONNECTIONS Technical Competition
 */

const STORAGE_KEY = 'connections_round6_state';
const HISTORY_KEY = 'connections_round6_history';

const StorageModule = (function () {
    
    /**
     * Creates an initial empty game state structure.
     */
    function createInitialState() {
        return {
            roundName: "Connections",
            totalQuestions: 15,
            score: 0,
            correct: 0,
            wrong: 0,
            timeout: 0,
            accuracy: 0,
            totalResponseTime: 0,
            questionResults: [],
            completedAt: null
        };
    }

    /**
     * Saves current state to localStorage.
     */
    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn("Unable to save state to localStorage", e);
        }
    }

    /**
     * Retrieves saved state from localStorage.
     */
    function getState() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : createInitialState();
        } catch (e) {
            console.warn("Unable to read state from localStorage", e);
            return createInitialState();
        }
    }

    /**
     * Clears current active state.
     */
    function clearState() {
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Saves finished round result to history log.
     */
    function saveCompletedRound(finalState) {
        try {
            const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
            history.push(finalState);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.warn("Unable to save history", e);
        }

        // AUTOMATIC SUPABASE DB SCORE TRANSMISSION (ROUND 6)
        if (typeof window !== 'undefined' && window.TournamentDB && typeof window.TournamentDB.saveRoundScore === 'function') {
            const teamId = localStorage.getItem("current_team_id");
            if (teamId) {
                window.TournamentDB.saveRoundScore(teamId, 6, finalState.score || 0)
                    .then(res => console.log("🏆 [Supabase DB] Round 6 score saved under Team ID #" + teamId + ":", res))
                    .catch(err => console.error("❌ [Supabase DB] Error saving Round 6 score:", err));
            }
        }
    }

    return {
        createInitialState,
        saveState,
        getState,
        clearState,
        saveCompletedRound
    };
})();

/**
 * Backend Submission API Endpoint Simulation
 * Production version sends questionId, answer, and responseTime over HTTP.
 * Keeps answer comparison logic encapsulated.
 * 
 * @param {number} questionId 
 * @param {string} submittedAnswer 
 * @param {number} responseTime Seconds taken by user
 * @param {object} questionObject The question configuration
 * @returns {Promise<object>} Validation result object
 */
function submitAnswerToBackend(questionId, submittedAnswer, responseTime, questionObject) {
    return new Promise((resolve) => {
        // Simulate network latency (50ms - 150ms)
        const latency = Math.floor(Math.random() * 100) + 50;

        setTimeout(() => {
            const isCorrect = ValidationModule.isCorrectAnswer(submittedAnswer, questionObject);
            let earnedScore = 0;

            if (isCorrect) {
                const remainingSeconds = Math.max(0, questionObject.timeLimit - Math.floor(responseTime));
                earnedScore = ScoringModule.calculateQuestionScore(
                    questionObject.points,
                    remainingSeconds
                );
            }

            const result = {
                questionId: questionId,
                selectedAnswer: submittedAnswer,
                correctAnswer: questionObject.correctAnswer,
                isCorrect: isCorrect,
                responseTime: parseFloat(responseTime.toFixed(1)),
                score: earnedScore
            };

            resolve(result);
        }, latency);
    });
}

if (typeof window !== 'undefined') {
    window.StorageModule = StorageModule;
    window.submitAnswerToBackend = submitAnswerToBackend;
} else if (typeof globalThis !== 'undefined') {
    globalThis.StorageModule = StorageModule;
    globalThis.submitAnswerToBackend = submitAnswerToBackend;
}

