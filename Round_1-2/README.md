# CHAPTER 1: PIXEL RECALL — Esports Tournament Stage 01

Welcome to **Chapter 1: Pixel Recall**, the first stage of the technology esports tournament. The chapter tests observation, visual recognition, short-term memory, and quick decision-making.

---

## 🎮 CORE GAMEPLAY & RULES

1. **Pixelated Technology Reveal**: Teams are presented with heavily pixelated images representing tech company logos, IDEs, operating systems, cloud platforms, gadgets, and applications.
2. **Dynamic Pixelation Decay**: Images gradually become clearer or remain partially obscured depending on the difficulty tier (Easy, Medium, Hard).
3. **Timer Limit**: Each challenge has a strict **10-second timer** (`const QUESTION_TIME = 10`).
4. **Manual Answer Submission**: No multiple-choice options. Teams type answers manually into a keyboard-accessible input field.
5. **Strict Attempt Lifecycle**:
   - Each question gives the team **3 attempts**.
   - **No instant feedback, wrong-answer animations, error messages, or correct answer reveals are shown after an incorrect attempt**.
   - If an answer is wrong, the attempt counter decrements (`3/3` → `2/3` → `1/3`), and the team remains on the active question with the timer running.
   - If all 3 attempts are used or time expires, 0 points are awarded, and the game advances to the next question.
6. **Scoring Formula**:
   - Base Score: `100` points per correct submission.
   - Speed Bonus: `Math.round(remainingTimeSeconds * 10)` (Max ~150 points per question).
7. **Achievement Unlock**: Successfully completing Chapter 1 triggers the **"FIRST CHALLENGE COMPLETE"** achievement unlock animation and unlocks Chapter 2 progression!

---

## 🛠️ LOCAL SETUP INSTRUCTIONS

Since Chapter 1 is built using modern HTML5, CSS3, and Vanilla JavaScript, no heavy installation or dependencies are required.

### How to Run Locally

1. Open a local Web Server inside the `Event-1` folder, for example using Python:
   ```bash
   python -m http.server 8000
   ```
2. Open your browser and navigate to:
   ```text
   http://localhost:8000
   ```
3. Alternatively, launch `index.html` directly in any modern desktop browser (Chrome, Edge, Firefox, Safari).

---

## 📁 PROJECT FILE STRUCTURE

```text
Event-1/
├── index.html                # Main HTML markup for Splash, Intro, Pre-game, HUD, Question, Result, & Achievement screens
├── css/
│   ├── style.css             # Tournament cyber design system (glassmorphism, glowing HUD, typography, cards)
│   └── animations.css        # Particle glows, screen transitions, countdowns, achievement popups
├── js/
│   ├── app.js                # Application bootstrap, DOM event binding, particle background canvas
│   ├── game.js               # State machine, question flow, attempt management, timer loop
│   ├── questions.js          # Question bank (10+ tech logos across easy/medium/hard, aliases, normalization)
│   ├── scoring.js            # Score formula calculation & chapter summary metrics
│   ├── pixelation.js         # Real-time HTML5 Canvas pixelation & blur reveal engine + placeholder generator
│   ├── audio.js              # Web Audio API sound synthesizer (ticks, correct chime, timeout tone, fanfare)
│   └── storage.js            # LocalStorage persistence & backend API result submission (`submitChapterResult`)
├── assets/
│   ├── images/               # Directory for custom tech logo image assets (e.g., vscode.png, github.png, etc.)
│   ├── icons/                # Game UI icons
│   └── sounds/               # Sound assets directory
└── README.md                 # Project documentation and setup guide
```

---

## ⚙️ CONFIGURATION GUIDE

Tournament organizers can customize game constants by editing the `GAME_CONFIG` object located in `js/game.js`:

```javascript
const GAME_CONFIG = {
    totalQuestions: 10,       // Total questions per chapter round
    questionTime: 20,         // Time limit per question in seconds
    maxAttempts: 3,           // Maximum attempts allowed per question
    baseScore: 100,           // Base score awarded for correct answer
    speedBonusMultiplier: 10, // Multiplier applied to remaining time float
    enableSound: false,       // Default sound state (false = off by default)
    enableAnimations: true    // Dynamic visual transitions flag
};
```

---

## 🖼️ ADDING YOUR CUSTOM IMAGES

To add or replace custom images:
1. Place image files (PNG, SVG, JPG, WEBP) inside the `assets/images/` directory.
2. Open `js/questions.js` and update the `image` path property in the `QUESTION_BANK` array:
   ```javascript
   {
       id: 1,
       image: "assets/images/your_custom_image.png",
       answer: "Visual Studio Code",
       aliases: ["vscode", "vs code"],
       difficulty: "easy"
   }
   ```
3. If an image file is missing, the Canvas Pixelation Engine automatically renders a high-tech fallback logo placeholder so the game executes seamlessly.

---

## 📡 BACKEND & LEADERBOARD EXPORT

When a chapter finishes, `js/storage.js` triggers `submitChapterResult(summaryResult)`, formatting the payload for backend submission:

```json
{
  "teamId": "TEAM_K7L29A",
  "teamName": "CODE KNIGHTS",
  "chapter": 1,
  "chapterName": "Pixel Recall",
  "score": 1420,
  "correct": 9,
  "wrong": 1,
  "timeout": 0,
  "accuracy": 90,
  "totalResponseTime": 34.25,
  "completedAt": "2026-08-10T11:10:00.000Z"
}
```
