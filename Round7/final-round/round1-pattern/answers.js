// ============================================================ 
// ROUND 7 - STAGE 1: MAT-STYLE PATTERN DECODING 
// HARD DIFFICULTY - ANSWERS DATA & VALIDATION FILE 
// ============================================================ 
 
const round1Answers = { 
 
    1: ["DAUGHTER"], 
    2: ["191"], 
    3: ["B"], 
    4: ["GRANDFATHER"], 
    5: ["65"], 
    6: ["GJTI"], 
    7: ["100"], 
    8: ["15"], 
    9: ["SON"], 
    10: ["121"], 
    11: ["IR"], 
    12: ["132"], 
    13: ["UNCLE"], 
    14: ["28%"], 
    15: ["9.5"] 
}; 
 
function validateRound1Answer(puzzleId, userInput) { 
 
    if (!userInput) return false; 
 
    const normalizedInput = 
        userInput.toString().trim().toUpperCase(); 
 
    const validAnswers = 
        round1Answers[puzzleId] || []; 
 
    return validAnswers 
        .map(ans => ans.toString().trim().toUpperCase()) 
        .includes(normalizedInput); 
} 
 
if (typeof window !== 'undefined') { 
    window.round1Answers = round1Answers; 
    window.validateRound1Answer = validateRound1Answer; 
}