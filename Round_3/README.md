# 🔴🟢 RED LIGHT CODE RACE // CYBER CIRCUIT

<div align="center">

![Red Light Code Race Banner](public/favicon.svg)

### **Type Fast. Stop on Red. Don't Get Caught.**

A high-octane cyberpunk speed-coding game built with **100% Pure Vanilla HTML5, CSS3, and JavaScript**.  
**Zero Dependencies • Zero Build Tools • Zero Frameworks • Runs Directly in Any Web Browser**

---

</div>

## 🎮 1. Overview & Gameplay Mechanics

**Red Light Code Race** combines mechanical typing precision with the classic Red Light / Green Light game rule. Players race against the clock to reproduce target code snippets character-by-character while navigating strict signal state changes.

### 🟢 Green Light Protocol (`WRITE`)
* **Live Workspace Unlocked**: Type target code directly into the workspace.
* **Character-Level Syntax Highlighting**: Real-time feedback displaying:
  * 🟩 **Emerald Green**: Correct character typed.
  * 🟥 **Crimson Red Underline**: Typo or character mismatch.
  * 🟦 **Pulsing Cyan**: Current active cursor position.
* **Dynamic Score Engine**: Every correct character awards **+10 PTS** along with real-time **Speed Bonus (CPM)**.
* **Submission Ready**: Submit completed code only during Green Light phases.

### 🔴 Red Light Protocol (`STOP!`)
* **Workspace Locked**: All keystrokes are intercepted and blocked from polluting your code.
* **Two-Tier Penalty Engine**:
  1. **Keys 1 to 5 on Red Light**:
     * **Score Deduction**: Each key tapped on Red immediately deducts **-10 PTS** from your live score.
     * **Code Preserved**: Your typed workspace code remains **100% safe**.
     * **Warning Sound**: Plays an 8-bit square wave error tone.
  2. **6th Key and Above on Red Light (`> 5` Characters)**:
     * 💥 **Workspace Cleared**: The entire typed code is deleted immediately.
     * 📉 **Score Wiped**: Your score is reset to **0 PTS**.
     * 🚨 **Violation Logged**: Adds **+1 Violation** count.
     * 🔊 **Alarm Triggered**: Displays a full-screen red warning flash and triggers a two-tone alarm siren.

---

## ✨ 2. Features

- [x] **100% Standalone**: No `node_modules`, no npm, no Vite, no webpack. Double-click `index.html` to run anywhere.
- [x] **Precision Live HUD**: Real-time tracking of Score, Correct Characters / Total, Accuracy %, and Violation counter.
- [x] **Web Audio API Synthesizer**: Native in-browser waveform generator for Green chimes, Red buzzers, mechanical clicks, error blips, sirens, and victory fanfare.
- [x] **HTML5 Canvas Celebration Confetti**: High-FPS zero-dependency particle engine on race completion.
- [x] **Live Multiplayer Leaderboard**: 4 connected racers (Player + 3 AI Ghost bots) with simulated progress and real-time rank sorting.
- [x] **Rank Evaluation System**: Automatically grades runs with **SSS**, **S**, **A**, **B**, or **C** Rank badges.
- [x] **1-Click Telemetry Sharing**: Copy your race stats directly to your clipboard for sharing with friends.
- [x] **Multiple Coding Challenges**: Built-in HTML5 Boilerplate (Easy), Cyberpunk Auth Form (Medium), and Modern SPA Shell (Hard).
- [x] **Cyberpunk Aesthetic**: Integrated dark theme (`#020617`), neon glow borders, scanlines, and cyber matrix background.

---

## 📁 3. Project Directory Structure

```text
Round_3/
│
├── index.html            # Semantic HTML5 markup, HUD, 50/50 Arena, Leaderboard & Modal
│
├── css/
│   └── style.css         # Complete Cyberpunk design system, glows, animations & responsive layout
│
├── js/
│   └── app.js            # Standalone Vanilla JS game engine, Web Audio synth & Canvas confetti
│
├── public/
│   ├── favicon.svg       # Cyber circuit favicon asset
│   └── icons.svg         # SVG icon assets
│
└── README.md             # Project documentation & configuration guide
```

---

## 🚀 4. How to Run

### Method 1: Direct File Launch (No Setup Required)
1. Open your File Explorer.
2. Double-click **[`index.html`](index.html)**.
3. The game will launch in your default web browser (Chrome, Edge, Firefox, Brave, Safari) with all features functional!

### Method 2: Local Static Server (Optional)
If you prefer running via a local web server (e.g. VS Code Live Server or Python):
```bash
# Using Python 3:
python -m http.server 8000

# Open in browser:
http://localhost:8000
```

---

## ⚙️ 5. Configuration & Customization Guide

All game mechanics, timings, challenge snippets, and audio parameters are cleanly organized and configurable inside [`js/app.js`](js/app.js):

### 🧩 A. Adding or Modifying Code Snippets
Navigate to the `CODE_SNIPPETS` array at the top of [`js/app.js`](js/app.js):

```javascript
const CODE_SNIPPETS = [
  {
    id: 'custom-snippet',
    title: 'Your Custom Challenge Title',
    difficulty: 'MEDIUM',       // 'EASY' | 'MEDIUM' | 'HARD' | 'CYBER'
    language: 'javascript',     // Programming language tag
    code: `function cyberRace() {
  console.log("Speed code protocol active!");
}`,
    description: 'A brief description of your coding challenge.'
  }
];
```

---

### ⏱️ B. Signal Cycle Timings (Green / Red Duration)
Inside the `scheduleNextLightChange()` function in [`js/app.js`](js/app.js):

```javascript
// Green Light: 4000ms - 9000ms (4 to 9 seconds)
const greenDuration = Math.floor(Math.random() * 5000) + 4000;

// Red Light: 3000ms - 7000ms (3 to 7 seconds)
const redDuration = Math.floor(Math.random() * 4000) + 3000;
```

---

### 🚨 C. Penalty Thresholds & Point Values
Inside the keydown event listener in [`js/app.js`](js/app.js):

```javascript
// Penalty applied per red keypress (Keys 1 to 5):
state.redKeyPenalty += 10; // Deducts 10 PTS per key

// Critical threshold for clearing workspace & score:
if (state.redKeyPresses > 5) {
  triggerViolation('6TH RED KEYPRESS DETECTED: ENTIRE CODE & SCORE WIPED');
  return;
}
```

---

### 📊 D. Score & Ranking Grade Configuration
Inside the `calculateLiveScore()` and `getGrade()` functions in [`js/app.js`](js/app.js):

$$\text{Live Score} = \max\left(0, (\text{Correct Chars} \times 10) + \text{Speed Bonus} - (\text{Violations} \times 50) - \text{RedKeyPenalty}\right)$$

```javascript
function getGrade(score, accuracy, violations) {
  if (score >= 400 && accuracy >= 98 && violations === 0) return { title: 'SSS RANK', class: 'grade-sss' };
  if (score >= 250 && accuracy >= 90) return { title: 'S RANK', class: 'grade-s' };
  if (score >= 150) return { title: 'A RANK', class: 'grade-a' };
  if (score >= 80) return { title: 'B RANK', class: 'grade-b' };
  return { title: 'C RANK', class: 'grade-c' };
}
```

---

### 🤖 E. AI Ghost Racers Telemetry
Inside the `state.ghosts` configuration array in [`js/app.js`](js/app.js):

```javascript
ghosts: [
  { id: '1', name: 'CYBER_SAMURAI_99', colorClass: 'color-samurai', progress: 0, cpm: 320, violations: 0 },
  { id: '2', name: 'NEON_CODER_X',     colorClass: 'color-neon',    progress: 0, cpm: 280, violations: 0 },
  { id: '3', name: 'GLITCH_HACKER',    colorClass: 'color-glitch',  progress: 0, cpm: 350, violations: 0 }
]
```

---

## 🔊 6. Web Audio Synthesizer Reference

The game uses the browser's native `AudioContext` to synthesize waveforms dynamically:

| Event | Wave Type | Frequency / Sequence | Purpose |
| :--- | :--- | :--- | :--- |
| **Green Light** | `triangle` | $523.25\text{ Hz} \rightarrow 1046.50\text{ Hz}$ ($C_5 \rightarrow C_6$) | Upbeat ascending permission chime |
| **Red Light** | `sawtooth` | $220\text{ Hz} \rightarrow 110\text{ Hz}$ ($A_3 \rightarrow A_2$) | Low descending warning buzz |
| **Key Press** | `sine` | $800\text{ Hz} - 1000\text{ Hz}$ | Mechanical switch click feedback |
| **Red Warning** | `square` | $150\text{ Hz}$ | Low error tone for illegal red tap |
| **Violation** | `sawtooth` + `square` | $440\text{ Hz} / 220\text{ Hz} / 480\text{ Hz}$ | Two-tone emergency siren alarm |
| **Victory** | `triangle` | $C_5, E_5, G_5, C_6$ ($523 - 1046\text{ Hz}$) | Arpeggiated victory celebration fanfare |

---

## 📄 7. License

This project is open-source and free for personal, educational, and portfolio use.
