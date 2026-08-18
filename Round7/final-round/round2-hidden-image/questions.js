// ============================================================
// ROUND 7 - STAGE 2: HIDDEN MESSAGE IMAGE ANALYSIS
// QUESTIONS & IMAGE CONFIGURATION FILE
// ============================================================
// You can replace the image path or question details here anytime
// without changing the core game logic in final-round.js.

const round2Questions = [
    {
        id: 16, // Global puzzle #6
        subId: 1,
        title: "STAGE 2 — TIMELINE CORE IMAGE RECONSTRUCTION (I)",
        subtitle: "Hidden Message Quantum Scan",
        prompt: "A cryptic distress directive is concealed across the intricate architecture, energy conduits, and fractured runic structures of Doctor Doom's Timeline Core. Inspect the chamber thoroughly, discover the hidden letters, and reconstruct the first message.",

        // Path relative to final-round.html or index.html
        imageSrc: "round2-hidden-image/images/round2_img1.jpeg",
        fallbackImageSrc: "round2-hidden-image/images/round2_img1.jpeg",

        imageAlt: "Detailed Timeline Core Chamber with encrypted runes and environmental anomalies",
        inputPlaceholder: "Enter discovered hidden message (e.g. TWO WORDS)...",
        instructions: "Inspect all quadrants of the core chamber. Letters may be embedded in energy cracks, containment rings, Asgardian/Latverian runes, machinery panels, or structural shadows."
    },
    {
        id: 17, // Global puzzle #7
        subId: 2,
        title: "STAGE 2 — TIMELINE CORE IMAGE RECONSTRUCTION (II)",
        subtitle: "Asgardian Resonance Scan",
        prompt: "A second signal has been encoded into the timeline strands, indicating the identity of the threat. Trace the energy flows to extract this word pair.",

        imageSrc: "round2-hidden-image/images/timeline-core-chamber-2.svg",
        fallbackImageSrc: "round2-hidden-image/images/timeline-core-chamber-2.svg",

        imageAlt: "Timeline Core Chamber calibrated to Asgardian frequencies",
        inputPlaceholder: "Enter discovered hidden message (e.g. TWO WORDS)...",
        instructions: "Observe the letters hidden in the cracks, ceiling runes, astrolabe rings, and catwalk seams."
    },
    {
        id: 18, // Global puzzle #8
        subId: 3,
        title: "STAGE 2 — TIMELINE CORE IMAGE RECONSTRUCTION (III)",
        subtitle: "Doom Barrier Override",
        prompt: "Doctor Doom's final defensive barrier is active. Identify the terminal override code embedded in this chamber scan.",

        imageSrc: "round2-hidden-image/images/timeline-core-chamber-3.svg",
        fallbackImageSrc: "round2-hidden-image/images/timeline-core-chamber-3.svg",

        imageAlt: "Timeline Core Chamber with Latverian defense matrix runes",
        inputPlaceholder: "Enter discovered hidden message (e.g. TWO WORDS)...",
        instructions: "Locate all hidden characters to bypass the final barrier."
    }
];

// Attach to window object for modular access in browser
if (typeof window !== 'undefined') {
    window.round2Questions = round2Questions;
}
