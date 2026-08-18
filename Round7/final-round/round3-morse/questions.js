// ============================================================
// ROUND 7 - STAGE 3: MORSE OF THE MULTIVERSE
// QUESTIONS DATA FILE
// ============================================================
// You can edit, add, or replace Morse questions in this file anytime
// without changing the core game logic in final-round.js.

const round3MorseQuestions = [
    {
        id: 19,
        subId: 1,
        title: "MORSE TRANSMISSION 01",
        stage: "Stage 3 — Temporal Beacon",
        morseCode: "..-. .. .-. .",
        audioSequence: "..-. .. .-. .",
        prompt: "Quantum beacon signal intercepted. Decode the incoming Morse transmission:",
        inputPlaceholder: "Type decoded message..."
    },
    {
        id: 20, // Global puzzle #10 (previously 8)
        subId: 2,
        title: "MORSE TRANSMISSION 02",
        stage: "Stage 3 — Chrono Resonance",
        morseCode: "- .. -- .",
        audioSequence: "- .. -- .",
        prompt: "Dimensional anchor frequency intercepted. Decode the Morse transmission:",
        inputPlaceholder: "Type decoded message..."
    },
    {
        id: 21, // Global puzzle #11 (previously 9)
        subId: 3,
        title: "MORSE TRANSMISSION 03",
        stage: "Stage 3 — Core Waveform",
        morseCode: "-.-. --- .-. .",
        audioSequence: "-.-. --- .-. .",
        prompt: "Doctor Doom's inner containment core frequency. Decode the transmission:",
        inputPlaceholder: "Type decoded message..."
    },
    {
        id: 22, // Global puzzle #12 (previously 10)
        subId: 4,
        title: "MORSE TRANSMISSION 04",
        stage: "Stage 3 — Multiverse Harmonic",
        morseCode: "- .... . / - .. -- . .-.. .. -. .",
        audioSequence: "- .... . / - .. -- . .-.. .. -. .",
        prompt: "Multiversal strand telemetric stream. Notice the '/' word separator:",
        inputPlaceholder: "Type decoded words..."
    },
    {
        id: 23, // Global puzzle #13 (previously 11)
        subId: 5,
        title: "MORSE TRANSMISSION 05",
        stage: "Stage 3 — Structural Instability",
        morseCode: "- .... . / - .. -- . .-.. .. -. . / .. ... / -... .-. --- -.- . -.",
        audioSequence: "- .... . / - .. -- . .-.. .. -. . / .. ... / -... .-. --- -.- . -.",
        prompt: "Critical reality warning intercepted from the Multiversal loom:",
        inputPlaceholder: "Type decoded sentence..."
    },
    {
        id: 24, // Global puzzle #14 (previously 12)
        subId: 6,
        title: "MORSE TRANSMISSION 06",
        stage: "Stage 3 — Temporal Cataclysm",
        morseCode: "- .... . / - .. -- . .-.. .. -. . / .. ... / -.-. --- .-.. .-.. .- .--. ... .. -. --.",
        audioSequence: "- .... . / - .. -- . .-.. .. -. . / .. ... / -.-. --- .-.. .-.. .- .--. ... .. -. --.",
        prompt: "Doctor Doom's reality-warping siphon alert. Decode the full warning:",
        inputPlaceholder: "Type decoded sentence..."
    },
    {
        id: 25, // Global puzzle #15 (previously 13)
        subId: 7,
        title: "FINAL MORSE TRANSMISSION — TIMELINE OVERRIDE",
        stage: "Stage 3 — Core Unlocking Sequence",
        morseCode: "... . .--. .- .-. .- - . / - .... . / - .. -- . .-.. .. -. . ...",
        audioSequence: "... . .--. .- .-. .- - . / - .... . / - .. -- . .-.. .. -. . ...",
        prompt: "FINAL MASTER OVERRIDE COMMAND: Decode the multiversal separation directive to unlock the Timeline Core:",
        inputPlaceholder: "Type final master command..."
    }
];

// Attach to window object for modular access in browser
if (typeof window !== 'undefined') {
    window.round3MorseQuestions = round3MorseQuestions;
}
