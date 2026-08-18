# Thor vs Doctor Doom: Round 7 — The Timeline Core

A cinematic, pure **HTML + CSS + Vanilla JavaScript** implementation of the final three puzzle stages of the *Thor vs Doctor Doom* saga.

---

## ⚡ How to Run in VS Code

### Method 1: Using Live Server (Recommended)
1. Open **Visual Studio Code**.
2. Click **File** &rarr; **Open Folder...** and select:
   ```
   C:\Users\sidda\.gemini\antigravity\scratch\thor-vs-doom
   ```
3. In the VS Code file explorer, right-click on:
   - `final-round/final-round.html` (to play Round 7 directly), or
   - `index.html` (to view the full story saga and launch Round 7)
4. Select **"Open with Live Server"**.
5. Your default web browser will automatically open with the game running!

---

### Method 2: Direct Browser Launch (No Extensions Needed)
1. Open File Explorer and navigate to `C:\Users\sidda\.gemini\antigravity\scratch\thor-vs-doom\final-round\`.
2. Double-click `final-round.html` (or right-click &rarr; Open with Chrome / Edge / Brave).
3. The game runs instantly with zero configuration.

---

### Method 3: Using VS Code Integrated Terminal
1. Open the project folder in VS Code.
2. Open the terminal by pressing `Ctrl + ` `~` (or **Terminal** &rarr; **New Terminal**).
3. Run:
   ```bash
   python -m http.server 8000
   ```
   *or*
   ```bash
   npx serve .
   ```
4. Open your browser and navigate to:
   - `http://localhost:8000/final-round/final-round.html`

---

## 📁 Project Architecture & Content Customization

You can replace questions, answers, images, and reference content anytime **without modifying the game engine logic (`final-round.js`)**:

```
thor-vs-doom/
│
├── final-round/
│   │
│   ├── round1-pattern/
│   │   ├── questions.js      # Edit / add Round 1 MAT reasoning puzzles
│   │   └── answers.js        # Edit Round 1 expected answers & validation
│   │
│   ├── round2-hidden-image/
│   │   ├── questions.js      # Edit Round 2 image metadata and prompt
│   │   ├── answers.js        # Edit Round 2 hidden message ("NEVER SURRENDER")
│   │   └── images/
│   │       └── timeline-core-chamber.svg  # Drop your custom puzzle image here
│   │
│   ├── round3-morse/
│   │   ├── questions.js      # Edit Round 3 Morse transmission puzzles
│   │   └── answers.js        # Edit Round 3 Morse answers
│   │
│   ├── options/
│   │   └── morse-reference.js # International Morse code directory
│   │
│   ├── final-round.html      # Round 7 standalone game UI
│   ├── final-round.css       # Cinematic dark theme styling
│   └── final-round.js        # Reusable Vanilla JS engine
│
├── index.html                # Full saga launcher
├── index.css
└── README.md
```

---

## 🎯 Gameplay Features

1. **Global 7-Minute Timer (`07:00`)**:
   - Single persistent timer across Stage 1 $\rightarrow$ Stage 2 $\rightarrow$ Stage 3.
   - Does not reset between stages or when opening options/reference sheets.
   - At `00:00`, disables inputs and displays final score.

2. **Unified Global Score**:
   - Evaluated across all 13 puzzles: $\text{Score} = (\text{Puzzles Completed} / 13) \times 100$.

3. **Stage 1 (MAT Pattern Decoding)**:
   - 5 mental ability test questions requiring sequence decoding and letter shifts.

4. **Stage 2 (Hidden Message Image Analysis)**:
   - High-detail image inspection with drag-to-pan and zoom controls (+ / - / reset).
   - Validates hidden message `"NEVER SURRENDER"`.

5. **Stage 3 (Morse of the Multiverse)**:
   - 7 Morse transmissions ending with `"SEPARATE THE TIMELINES"`.
   - Includes real-time Web Audio API synthesized Morse beeps.

6. **Hidden Morse Reference**:
   - Accessible strictly via `[ OPTIONS ]` &rarr; `[ Morse Reference ]`.

7. **Final Climax Cinematic**:
   - Dramatic dialogue sequence clashing Thor and Doctor Doom at the Timeline Core.
