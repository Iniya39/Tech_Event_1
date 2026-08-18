// ============================================================
// ROUND 7 - STAGE 3: MORSE OF THE MULTIVERSE
// ANSWERS DATA & VALIDATION FILE
// ============================================================
// You can edit, add, or replace expected Morse answers in this file anytime
// without changing the core game logic in final-round.js.

const round3MorseAnswers = {
    // Global Puzzle IDs (19 to 25)
    19: ["FIRE"],
    20: ["TIME"],
    21: ["CORE"],
    22: ["THE TIMELINE", "THETIMELINE"],
    23: ["THE TIMELINE IS BROKEN", "THETIMELINEISBROKEN"],
    24: ["THE TIMELINE IS COLLAPSING", "THETIMELINEISCOLLAPSING"],
    25: ["SEPARATE THE TIMELINES", "SEPARATETHETIMELINES"],

    // Sub-IDs (1 to 7) fallback
    1: ["FIRE"],
    2: ["TIME"],
    3: ["CORE"],
    4: ["THE TIMELINE", "THETIMELINE"],
    5: ["THE TIMELINE IS BROKEN", "THETIMELINEISBROKEN"],
    6: ["THE TIMELINE IS COLLAPSING", "THETIMELINEISCOLLAPSING"],
    7: ["SEPARATE THE TIMELINES", "SEPARATETHETIMELINES"]
};

/**
 * Validates player answer for a Round 3 Morse puzzle
 * Normalizes input: collapses multiple internal spaces, trims, and converts to uppercase
 * Also supports compact (no space) comparison for multi-word answers
 * @param {number|string} puzzleId 
 * @param {string} userInput 
 * @returns {boolean}
 */
function validateRound3MorseAnswer(puzzleId, userInput) {
    if (!userInput) return false;
    const cleanInput = userInput
        .toString()
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();
    const compactInput = userInput
        .toString()
        .trim()
        .replace(/\s+/g, "")
        .toUpperCase();
        
    let validAnswers = round3MorseAnswers[puzzleId] || [];

    // Fallback: If not found directly, check if puzzleId matches a question in round3MorseQuestions
    if (validAnswers.length === 0 && typeof round3MorseQuestions !== 'undefined' && Array.isArray(round3MorseQuestions)) {
        const matchingQ = round3MorseQuestions.find(q => q.id === puzzleId || q.subId === puzzleId);
        if (matchingQ) {
            if (matchingQ.id && round3MorseAnswers[matchingQ.id]) {
                validAnswers = round3MorseAnswers[matchingQ.id];
            } else if (matchingQ.subId && round3MorseAnswers[matchingQ.subId]) {
                validAnswers = round3MorseAnswers[matchingQ.subId];
            } else if (matchingQ.answer) {
                validAnswers = Array.isArray(matchingQ.answer) ? matchingQ.answer : [matchingQ.answer];
            }
        }
    }

    return validAnswers.some(ans => {
        const cleanExpected = ans
            .toString()
            .trim()
            .replace(/\s+/g, " ")
            .toUpperCase();
        const compactExpected = ans
            .toString()
            .trim()
            .replace(/\s+/g, "")
            .toUpperCase();
        return cleanInput === cleanExpected || compactInput === compactExpected;
    });
}

// Attach to window object for modular access in browser
if (typeof window !== 'undefined') {
    window.round3MorseAnswers = round3MorseAnswers;
    window.validateRound3MorseAnswer = validateRound3MorseAnswer;
}
