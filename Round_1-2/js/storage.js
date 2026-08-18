/**
 * CHAPTER 1 & CHAPTER 2 — Persistence & Storage Engine
 * Manages LocalStorage caching, chapter completion state, and result payload formatting.
 */

const STORAGE_KEYS = {
    TEAM_NAME: 'pixel_recall_team_name',
    RESULTS_HISTORY: 'pixel_recall_results_history',
    AUDIO_MUTED: 'pixel_recall_audio_muted',
    CH1_COMPLETED: 'pixel_recall_ch1_completed',
    GTL_LATEST_RESULT: 'gtl_latest_result',
    GTL_RESULTS_HISTORY: 'gtl_results_history'
};

/**
 * Marks Chapter 1 as completed in local storage.
 */
function saveChapter1Completed() {
    try {
        localStorage.setItem(STORAGE_KEYS.CH1_COMPLETED, 'true');
    } catch (e) {
        console.warn("LocalStorage save error:", e);
    }
}

/**
 * Checks if Chapter 1 has been completed.
 * @returns {boolean}
 */
function isChapter1Completed() {
    try {
        return localStorage.getItem(STORAGE_KEYS.CH1_COMPLETED) === 'true';
    } catch (e) {
        return false;
    }
}

/**
 * Submits Chapter 1 final results to local storage.
 * @param {Object} summaryResult 
 * @returns {Object}
 */
function submitChapterResult(summaryResult) {
    saveChapter1Completed();

    const payload = {
        teamId: summaryResult.teamId || `TEAM_${Date.now().toString(36).toUpperCase()}`,
        teamName: summaryResult.teamName || 'CODE KNIGHTS',
        chapter: 1,
        chapterName: "Pixel Recall",
        score: summaryResult.totalScore || 0,
        correct: summaryResult.correctCount || 0,
        wrong: summaryResult.wrongCount || 0,
        timeout: summaryResult.timeoutCount || 0,
        accuracy: summaryResult.accuracyPercentage || 0,
        totalResponseTime: parseFloat(summaryResult.totalResponseTime) || 0.0,
        completedAt: new Date().toISOString()
    };

    try {
        const history = getChapterResultsHistory();
        history.unshift(payload);
        localStorage.setItem(STORAGE_KEYS.RESULTS_HISTORY, JSON.stringify(history));
    } catch (e) {
        console.warn("Unable to save results to LocalStorage:", e);
    }

    // AUTOMATIC SUPABASE DATABASE SCORE TRANSMISSION (ROUND 1)
    if (typeof window !== 'undefined' && window.TournamentDB && typeof window.TournamentDB.saveRoundScore === 'function') {
        const teamId = localStorage.getItem("current_team_id");
        if (teamId && !window._r1Submitted) {
            window._r1Submitted = true;
            window.TournamentDB.saveRoundScore(teamId, 1, payload.score)
                .then(res => {
                    if (res && res.error) {
                        window._r1Submitted = false;
                        console.error("❌ [Supabase DB Error] Round 1 score save failed:", res.error);
                    } else {
                        console.log("🏆 [Supabase DB Success] Round 1 score saved under Team ID #" + teamId + ":", res.data);
                    }
                })
                .catch(err => {
                    window._r1Submitted = false;
                    console.error("❌ [Supabase DB Error] Failed to save Round 1 score to database:", err);
                });
        } else if (!teamId) {
            console.warn("⚠️ [Supabase DB Warning] No team logged in (current_team_id missing in localStorage). Round 1 score not saved to DB.");
        }
    }

    console.log("=========================================");
    console.log("[TOURNAMENT API TRANSMISSION] Chapter 1 Result:");
    console.log(JSON.stringify(payload, null, 2));
    console.log("=========================================");

    return payload;
}

/**
 * Retrieves past completed Chapter 1 results.
 * @returns {Array<Object>}
 */
function getChapterResultsHistory() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.RESULTS_HISTORY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

/**
 * Saves Chapter 2 Guess The Logic results to local storage.
 * @param {Object} summary 
 * @returns {Object}
 */
function saveGTLResult(summary) {
    const payload = {
        score: summary.totalScore,
        correct: summary.correctCount,
        wrong: summary.wrongCount,
        timeout: summary.timeoutCount,
        accuracy: summary.accuracyPercentage,
        totalTime: summary.totalResponseTime,
        ratingGrade: summary.ratingGrade,
        ratingTitle: summary.ratingTitle,
        completedAt: new Date().toISOString()
    };

    try {
        localStorage.setItem(STORAGE_KEYS.GTL_LATEST_RESULT, JSON.stringify(payload));
        const history = getGTLResultsHistory();
        history.unshift(payload);
        localStorage.setItem(STORAGE_KEYS.GTL_RESULTS_HISTORY, JSON.stringify(history));
    } catch (e) {
        console.warn("LocalStorage save GTL error:", e);
    }

    // AUTOMATIC SUPABASE DATABASE SCORE TRANSMISSION (ROUND 2)
    if (typeof window !== 'undefined' && window.TournamentDB && typeof window.TournamentDB.saveRoundScore === 'function') {
        const teamId = localStorage.getItem("current_team_id");
        if (teamId && !window._r2Submitted) {
            window._r2Submitted = true;
            window.TournamentDB.saveRoundScore(teamId, 2, payload.score)
                .then(res => {
                    if (res && res.error) {
                        window._r2Submitted = false;
                        console.error("❌ [Supabase DB Error] Round 2 score save failed:", res.error);
                    } else {
                        console.log("🏆 [Supabase DB Success] Round 2 score saved under Team ID #" + teamId + ":", res.data);
                    }
                })
                .catch(err => {
                    window._r2Submitted = false;
                    console.error("❌ [Supabase DB Error] Failed to save Round 2 score to database:", err);
                });
        } else if (!teamId) {
            console.warn("⚠️ [Supabase DB Warning] No team logged in (current_team_id missing in localStorage). Round 2 score not saved to DB.");
        }
    }

    console.log("=========================================");
    console.log("[TOURNAMENT API TRANSMISSION] Chapter 2 Result:");
    console.log(JSON.stringify(payload, null, 2));
    console.log("=========================================");

    return payload;
}

/**
 * Retrieves latest Chapter 2 result from LocalStorage.
 * @returns {Object|null}
 */
function getGTLLatestResult() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.GTL_LATEST_RESULT);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
}

/**
 * Retrieves GTL results history.
 * @returns {Array<Object>}
 */
function getGTLResultsHistory() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.GTL_RESULTS_HISTORY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

/**
 * Saves team name into LocalStorage.
 * @param {string} teamName 
 */
function saveTeamName(teamName) {
    if (!teamName) return;
    try {
        localStorage.setItem(STORAGE_KEYS.TEAM_NAME, teamName.trim());
    } catch (e) {}
}

/**
 * Loads last used team name.
 * @returns {string}
 */
function loadTeamName() {
    try {
        return localStorage.getItem(STORAGE_KEYS.TEAM_NAME) || "CODE KNIGHTS";
    } catch (e) {
        return "CODE KNIGHTS";
    }
}
