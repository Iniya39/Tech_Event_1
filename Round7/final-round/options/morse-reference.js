// ============================================================
// ROUND 7 - OPTIONS / MORSE CODE REFERENCE DATA
// ============================================================
// Accessible strictly via [ OPTIONS ] -> [ Morse Reference ]
// Does NOT reset the puzzle or timer when viewed.

const morseReferenceData = {
    title: "INTERNATIONAL MORSE CODE REFERENCE DATABASE",
    rules: [
        { symbol: ".", name: "Dot", desc: "Short temporal pulse (1 unit)" },
        { symbol: "-", name: "Dash", desc: "Long temporal pulse (3 units)" },
        { symbol: "/", name: "Word Separator", desc: "Separates independent words in multiversal transmissions" }
    ],
    alphabet: [
        { char: "A", code: ".-" },
        { char: "B", code: "-..." },
        { char: "C", code: "-.-." },
        { char: "D", code: "-.." },
        { char: "E", code: "." },
        { char: "F", code: "..-." },
        { char: "G", code: "--." },
        { char: "H", code: "...." },
        { char: "I", code: ".." },
        { char: "J", code: ".---" },
        { char: "K", code: "-.-" },
        { char: "L", code: ".-.." },
        { char: "M", code: "--" },
        { char: "N", code: "-." },
        { char: "O", code: "---" },
        { char: "P", code: ".--." },
        { char: "Q", code: "--.-" },
        { char: "R", code: ".-." },
        { char: "S", code: "..." },
        { char: "T", code: "-" },
        { char: "U", code: "..-" },
        { char: "V", code: "...-" },
        { char: "W", code: ".--" },
        { char: "X", code: "-..-" },
        { char: "Y", code: "-.--" },
        { char: "Z", code: "--.." }
    ],
    numbers: [
        { char: "0", code: "-----" },
        { char: "1", code: ".----" },
        { char: "2", code: "..---" },
        { char: "3", code: "...--" },
        { char: "4", code: "....-" },
        { char: "5", code: "....." },
        { char: "6", code: "-...." },
        { char: "7", code: "--..." },
        { char: "8", code: "---.." },
        { char: "9", code: "----." }
    ]
};

// Attach to window object for modular access in browser
if (typeof window !== 'undefined') {
    window.morseReferenceData = morseReferenceData;
}
