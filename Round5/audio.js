/**
 * AVENGERS // RESISTANCE GRID - Tactical Audio Synthesizer
 * Zero-dependency Web Audio API procedural sound engine
 */

class TacticalAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.initialized = false;

        // Restore mute preference
        const savedMute = localStorage.getItem('avengers_audio_muted');
        if (savedMute !== null) {
            this.isMuted = savedMute === 'true';
        }
    }

    // Initialize AudioContext on first user interaction (browser requirement)
    init() {
        if (!this.initialized) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                    this.initialized = true;
                }
            } catch (e) {
                console.warn("Web Audio API not supported:", e);
            }
        } else if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('avengers_audio_muted', this.isMuted);
        return this.isMuted;
    }

    // Basic oscillator helper with envelope
    _playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15, pitchBend = 0) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            if (pitchBend !== 0) {
                osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + pitchBend), now + duration);
            }

            gain.gain.setValueAtTime(gainVal, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (err) {
            // Audio context error fallback
        }
    }

    // Electronic micro-blip on hover
    playHover() {
        this._playTone(1200, 'sine', 0.04, 0.03, -200);
    }

    // Crisp high-tech interface click
    playClick() {
        this._playTone(880, 'sine', 0.08, 0.1, 400);
    }

    // Tactical Reroll Dice sound
    playReroll() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const pitches = [520, 680, 880, 1100];
        pitches.forEach((freq, idx) => {
            setTimeout(() => {
                this._playTone(freq, 'triangle', 0.06, 0.08, 100);
            }, idx * 45);
        });
    }

    // Tactical Timer Tick (changes urgency based on seconds left)
    playTimerTick(secondsLeft = 45) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        if (secondsLeft <= 5) {
            // High danger emergency chirp
            this._playTone(1500, 'sawtooth', 0.06, 0.15, -400);
            setTimeout(() => this._playTone(1800, 'sine', 0.04, 0.12), 40);
        } else if (secondsLeft <= 10) {
            // Urgent warning tick
            this._playTone(1050, 'square', 0.05, 0.1, -200);
        } else {
            // Subtle standard countdown tick
            this._playTone(700, 'sine', 0.03, 0.04, -100);
        }
    }

    // Option authorization / Lock-in sound (Power charging whoosh)
    playOptionSelect() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) { }
    }

    // Mission Phase Start / Alarm Siren
    playPhaseStart() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const chords = [440, 554.37, 659.25, 880];
        chords.forEach((freq, i) => {
            setTimeout(() => {
                this._playTone(freq, 'sine', 0.25, 0.08, 50);
            }, i * 60);
        });
    }

    // Final Results Triumphant Fanfare
    playVictoryFanfare() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const victoryNotes = [
            { f: 523.25, d: 0.15, delay: 0 },
            { f: 659.25, d: 0.15, delay: 150 },
            { f: 783.99, d: 0.15, delay: 300 },
            { f: 1046.50, d: 0.45, delay: 450 }
        ];

        victoryNotes.forEach(note => {
            setTimeout(() => {
                this._playTone(note.f, 'triangle', note.d, 0.18, 0);
            }, note.delay);
        });
    }

    // Failure / Catastrophe Warning Chord
    playDefeatSound() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const defeatNotes = [400, 370, 330, 280];
        defeatNotes.forEach((freq, idx) => {
            setTimeout(() => {
                this._playTone(freq, 'sawtooth', 0.35, 0.12, -80);
            }, idx * 120);
        });
    }
}

// Global Tactical Audio instance
const tacticalAudio = new TacticalAudioEngine();
