// ============================================================
// ROUND 7 - STAGE 2: HIDDEN MESSAGE IMAGE ANALYSIS
// ANSWERS DATA & VALIDATION FILE
// ============================================================
// You can edit or replace the hidden message answers in this file anytime
// without changing the core game logic in final-round.js.

const round2Answers = {
    // Puzzle ID to valid answer(s) mapping
    16: ["NEVER SURRENDER", "NEVERSURRENDER", "DOOM SHIELD", "DOOMSHIELD", "ASGARD FORCE", "ASGARDFORCE", "SILENT KILLER", "SILENTKILLER"],
    17: ["ASGARD FORCE", "ASGARDFORCE", "SILENT KILLER", "SILENTKILLER", "NEVER SURRENDER", "NEVERSURRENDER", "DOOM SHIELD", "DOOMSHIELD"],
    18: ["DOOM SHIELD", "DOOMSHIELD", "NEVER SURRENDER", "NEVERSURRENDER", "ASGARD FORCE", "ASGARDFORCE", "SILENT KILLER", "SILENTKILLER"]
};

/**
 * Validates player answer for Round 2 Hidden Image puzzle
 * Normalizes input: removes leading/trailing spaces and converts to uppercase
 * Also handles optional internal space tolerance
 * @param {number|string} puzzleId
 * @param {string} userInput 
 * @returns {boolean}
 */
function validateRound2Answer(puzzleId, userInput) {
    if (!userInput) return false;
    const cleanInput = userInput.toString().trim().toUpperCase();
    const compactInput = cleanInput.replace(/\s+/g, "");
    
    const validAnswers = round2Answers[puzzleId] || [];
    return validAnswers.some(ans => {
        const cleanExpected = ans.trim().toUpperCase();
        const compactExpected = cleanExpected.replace(/\s+/g, "");
        return cleanInput === cleanExpected || compactInput === compactExpected;
    });
}

// Attach to window object for modular access in browser
if (typeof window !== 'undefined') {
    window.round2Answers = round2Answers;
    window.validateRound2Answer = validateRound2Answer;
}
