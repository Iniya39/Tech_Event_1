/**
 * APP.JS - Application Initialization & Event Listener Wiring
 * Round 6: CONNECTIONS Technical Competition
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // UI Element References
    const startBtn = document.getElementById('start-game-btn');
    const restartBtn = document.getElementById('restart-game-btn');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    const soundText = document.getElementById('sound-text');
    const answerForm = document.getElementById('answer-form');
    const answerInput = document.getElementById('user-answer-input');

    // Start Game Event
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            GameEngine.startGameSequence();
        });
    }

    // Restart Game Event
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            GameEngine.startGameSequence();
        });
    }

    // Sound Toggle Event
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            const enabled = GameEngine.toggleSound();
            if (enabled) {
                soundIcon.textContent = '🔊';
                soundText.textContent = 'SOUND ON';
                soundToggleBtn.style.borderColor = 'var(--primary-cyan)';
                soundToggleBtn.style.color = 'var(--primary-cyan)';
            } else {
                soundIcon.textContent = '🔇';
                soundText.textContent = 'SOUND OFF';
                soundToggleBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                soundToggleBtn.style.color = 'var(--text-main)';
            }
        });
    }

    // Form Submission (Submit Button / Enter Key)
    if (answerForm) {
        answerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const typedVal = answerInput.value;
            GameEngine.handleAnswerSubmit(typedVal);
        });
    }
});
