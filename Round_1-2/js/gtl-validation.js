/**
 * CHAPTER 2: GUESS THE LOGIC — Answer Validation & Anti-Cheating Engine
 * Implements strict, case-insensitive, space-normalized exact answer validation
 * and backend submission integration layer.
 */

/**
 * Normalizes input answer string by trimming, lowercasing, stripping brackets,
 * converting commas to spaces, and standardizing whitespace.
 * 
 * Examples:
 * "[2, 2, 6, 4, 10]" => "2 2 6 4 10"
 * "2,2,6,4,10"       => "2 2 6 4 10"
 * "2 2 6 4 10"       => "2 2 6 4 10"
 * 
 * @param {string} answer 
 * @returns {string}
 */
function normalizeAnswer(answer) {
    if (answer === null || answer === undefined) return "";
    
    let str = String(answer).trim().toLowerCase();

    // Strip square brackets [ ] if present
    str = str.replace(/\[|\]/g, '');

    // Replace all commas with spaces
    str = str.replace(/,/g, ' ');

    // Collapse multiple spaces into single space
    str = str.replace(/\s+/g, ' ').trim();

    return str;
}

/**
 * Validates player answer against question accepted answers without fuzzy matching.
 * Handles array formats with/without brackets, commas, or spaces seamlessly.
 * @param {string} submittedAnswer 
 * @param {Object} questionObj 
 * @returns {boolean}
 */
function checkGTLAnswer(submittedAnswer, questionObj) {
    if (!questionObj) return false;

    const normSubmitted = normalizeAnswer(submittedAnswer);
    if (!normSubmitted) return false;

    // Collect all accepted answer forms (correctAnswer + acceptedAnswers)
    const accepted = Array.isArray(questionObj.acceptedAnswers) 
        ? [questionObj.correctAnswer, ...questionObj.acceptedAnswers]
        : [questionObj.correctAnswer];

    // Check if any accepted answer matches the normalized submission
    if (accepted.some(ans => normalizeAnswer(ans) === normSubmitted)) {
        return true;
    }

    // Secondary fallback: compare with spaces entirely removed for character string answers
    const normSubmittedNoSpaces = normSubmitted.replace(/\s+/g, '');
    return accepted.some(ans => normalizeAnswer(ans).replace(/\s+/g, '') === normSubmittedNoSpaces);
}

/**
 * Architecture function for future backend API submission.
 * Simulates backend validation contract.
 * @param {number|string} questionId 
 * @param {string} submittedAnswer 
 * @param {number} responseTime 
 * @returns {Promise<Object>}
 */
async function submitAnswerToBackend(questionId, submittedAnswer, responseTime) {
    // Find question from modular bank
    const questionObj = GTL_QUESTION_BANK.find(q => q.id === questionId);
    const isCorrect = checkGTLAnswer(submittedAnswer, questionObj);
    
    // Calculate server-side verified score
    let score = 0;
    if (isCorrect && questionObj) {
        const remainingTime = Math.max(0, (GTL_GAME_CONFIG.questionTime || 30) - responseTime);
        score = GTL_GAME_CONFIG.baseScore + Math.round(remainingTime * GTL_GAME_CONFIG.speedBonusMultiplier);
    }

    // Backend response structure payload
    return {
        questionId: questionId,
        submittedAnswer: submittedAnswer,
        responseTime: responseTime,
        isCorrect: isCorrect,
        score: score,
        correctAnswer: questionObj ? questionObj.correctAnswer : ""
    };
}

if (typeof window !== 'undefined') {
    window.normalizeAnswer = normalizeAnswer;
    window.checkGTLAnswer = checkGTLAnswer;
}
if (typeof globalThis !== 'undefined') {
    globalThis.normalizeAnswer = normalizeAnswer;
    globalThis.checkGTLAnswer = checkGTLAnswer;
}

