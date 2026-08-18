/**
 * CHAPTER 1: PIXEL RECALL — Question Bank
 * Questions mapped to PNG technology image assets in assets/images/
 * Case-insensitive answer validation with canonical names and flexible alias matching.
 */

const QUESTION_BANK = [
    // --- EASY TIER (Questions 1 - 3) ---
    {
        id: 1,
        image: "assets/images/nvidia.png",
        answer: "NVIDIA",
        aliases: ["nvidia", "n nvidia", "geforce nvidia", "geforce"],
        difficulty: "easy"
    },
    {
        id: 2,
        image: "assets/images/react.png",
        answer: "React",
        aliases: ["react", "reactjs", "react js", "react native"],
        difficulty: "easy"
    },
    {
        id: 3,
        image: "assets/images/firebase.png",
        answer: "Firebase",
        aliases: ["firebase", "google firebase"],
        difficulty: "easy"
    },

    // --- MEDIUM TIER (Questions 4 - 7) ---
    {
        id: 4,
        image: "assets/images/mongoDB.png",
        answer: "MongoDB",
        aliases: ["mongodb", "mongo db", "mongo"],
        difficulty: "medium"
    },
    {
        id: 5,
        image: "assets/images/grok.png",
        answer: "Grok",
        aliases: ["grok", "grok ai", "xai grok"],
        difficulty: "medium"
    },
    {
        id: 6,
        image: "assets/images/huggingFace.png",
        answer: "Hugging Face",
        aliases: ["hugging face", "huggingface", "huggingface ai", "hf"],
        difficulty: "medium"
    },
    {
        id: 7,
        image: "assets/images/dart.png",
        answer: "Dart",
        aliases: ["dart", "dartlang", "dart lang"],
        difficulty: "medium"
    },

    // --- HARD TIER (Questions 8 - 10) ---
    {
        id: 8,
        image: "assets/images/expo.png",
        answer: "Expo",
        aliases: ["expo", "expo dev", "expo go"],
        difficulty: "hard"
    },
    {
        id: 9,
        image: "assets/images/spring.png",
        answer: "Spring",
        aliases: ["spring", "spring boot", "spring framework"],
        difficulty: "hard"
    },
    {
        id: 10,
        image: "assets/images/intellij_ide.png",
        answer: "IntelliJ IDEA",
        aliases: ["intellij idea", "intellij", "intellij ide", "idea"],
        difficulty: "hard"
    }
];

/**
 * Normalizes input text by trimming, lowercasing, removing extra spaces and non-alphanumeric chars.
 * Allows case-insensitive matching regardless of capitalization (e.g. "nvidia", "NVIDIA", "NvIdIa").
 * @param {string} str 
 * @returns {string}
 */
function normalizeAnswerString(str) {
    if (!str) return "";
    return str
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/gi, "")
        .replace(/\s+/g, " ");
}

/**
 * Validates user submission against question canonical answer and alias list (case-insensitive).
 * @param {string} userSubmission 
 * @param {Object} questionObj 
 * @returns {boolean}
 */
function checkAnswerCorrectness(userSubmission, questionObj) {
    if (!userSubmission || !questionObj) return false;
    
    const normalizedInput = normalizeAnswerString(userSubmission);
    if (!normalizedInput) return false;

    const normalizedCanonical = normalizeAnswerString(questionObj.answer);
    if (normalizedInput === normalizedCanonical) return true;

    if (questionObj.aliases && Array.isArray(questionObj.aliases)) {
        return questionObj.aliases.some(alias => normalizeAnswerString(alias) === normalizedInput);
    }

    return false;
}
