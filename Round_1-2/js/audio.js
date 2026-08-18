/**
 * CHAPTER 1: PIXEL RECALL — Web Audio API Synthesizer
 * Generates futuristic sound effects without external audio file dependencies.
 * Disabled by default per project specification.
 */

class SoundEngine {
    constructor() {
        this.isEnabled = false; // Disabled by default
        this.ctx = null;
    }

    /**
     * Lazy-initializes AudioContext on first user interaction.
     */
    initCtx() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /**
     * Toggles audio state on/off.
     * @returns {boolean}
     */
    toggleSound() {
        this.isEnabled = !this.isEnabled;
        if (this.isEnabled) {
            this.initCtx();
            this.playClick();
        }
        return this.isEnabled;
    }

    /**
     * Plays countdown tick synthesizer tone.
     */
    playTick() {
        if (!this.isEnabled || !this.ctx) return;
        this.initCtx();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    /**
     * Plays correct submission futuristic chime.
     */
    playCorrect() {
        if (!this.isEnabled || !this.ctx) return;
        this.initCtx();

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            gain.gain.setValueAtTime(0, now + idx * 0.06);
            gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.06 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.25);
        });
    }

    /**
     * Plays timeout warning tone.
     */
    playTimeout() {
        if (!this.isEnabled || !this.ctx) return;
        this.initCtx();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    /**
     * Plays achievement unlock fanfare.
     */
    playAchievement() {
        if (!this.isEnabled || !this.ctx) return;
        this.initCtx();

        const now = this.ctx.currentTime;
        const melody = [
            { f: 440.00, d: 0.1, t: 0 },     // A4
            { f: 554.37, d: 0.1, t: 0.1 },   // C#5
            { f: 659.25, d: 0.1, t: 0.2 },   // E5
            { f: 880.00, d: 0.5, t: 0.3 }    // A5
        ];

        melody.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.f, now + note.t);

            gain.gain.setValueAtTime(0.25, now + note.t);
            gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + note.t);
            osc.stop(now + note.t + note.d);
        });
    }

    /**
     * Plays UI button click sound.
     */
    playClick() {
        if (!this.isEnabled || !this.ctx) return;
        this.initCtx();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.03);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
    }
}
