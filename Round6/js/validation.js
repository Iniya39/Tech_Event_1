/**
 * VALIDATION.JS - Answer Normalization & Verification Logic
 * Round 6: CONNECTIONS Technical Competition
 */

const ValidationModule = (function () {

    /**
     * Normalizes an answer string according to specification:
     * 1. Trim whitespace
     * 2. Lowercase
     * 3. Remove all spaces
     * 4. Strip extraneous symbols/punctuation for clean string comparison
     * 
     * Example: "  Some Answer  " -> "someanswer"
     * 
     * @param {string} answer 
     * @returns {string} Normalized string
     */
    function normalizeAnswer(answer) {
        if (!answer || typeof answer !== 'string') {
            return '';
        }
        return answer
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '')        // remove all space characters
            .replace(/[^a-z0-9]/g, '');  // remove special punctuation (dashes, underscores, quotes)
    }

    /**
     * Verifies if the user's submitted answer matches the correct answer
     * or any allowed accepted answer variant for the specified question.
     * Exact normalized match required. No fuzzy matching permitted.
     * 
     * @param {string} userAnswer 
     * @param {object} question Question object containing correctAnswer and acceptedAnswers
     * @returns {boolean} True if correct, false otherwise
     */
    function isCorrectAnswer(userAnswer, question) {
        if (!userAnswer || !question) return false;

        const normalizedUser = normalizeAnswer(userAnswer);
        if (!normalizedUser) return false;

        // Check primary correct answer
        const normalizedPrimary = normalizeAnswer(question.correctAnswer);
        if (normalizedUser === normalizedPrimary) {
            return true;
        }

        // Check array of alternative accepted answers if provided
        if (Array.isArray(question.acceptedAnswers)) {
            for (let i = 0; i < question.acceptedAnswers.length; i++) {
                const normalizedAlt = normalizeAnswer(question.acceptedAnswers[i]);
                if (normalizedUser === normalizedAlt) {
                    return true;
                }
            }
        }

        return false;
    }

    return {
        normalizeAnswer,
        isCorrectAnswer
    };
})();

if (typeof window !== 'undefined') window.ValidationModule = ValidationModule;
if (typeof globalThis !== 'undefined') globalThis.ValidationModule = ValidationModule;

