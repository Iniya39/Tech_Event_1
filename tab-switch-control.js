/**
 * TAB-SWITCH / FOCUS-LOSS CONTROL MODULE
 * Independent tournament-wide tab switch detection & enforcement.
 * Allowed switches: MAX_ALLOWED_SWITCHES (default: 1)
 */
(function (window) {
    'use strict';

    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    const MAX_ALLOWED_SWITCHES = 1;
    const STORAGE_KEY_COUNT = 'tournament_tab_switch_count';
    const STORAGE_KEY_VIOLATED = 'tournament_tab_switch_violated';
    const STORAGE_KEY_TEAM = 'tournament_active_team_id';
    const DEBOUNCE_MS = 1500; // Prevent duplicate events within 1.5 seconds

    let isMonitoring = false;
    let lastSwitchTimestamp = 0;
    let modalOverlay = null;

    // Helper to identify active team session
    function getActiveTeamId() {
        return sessionStorage.getItem('active_team') ||
            sessionStorage.getItem('teamName') ||
            sessionStorage.getItem('teamId') ||
            localStorage.getItem('active_team') ||
            localStorage.getItem('teamName') ||
            'default_team';
    }

    // Ensure session is fresh when a new team registers
    function checkTeamSession() {
        const currentTeam = getActiveTeamId();
        const storedTeam = sessionStorage.getItem(STORAGE_KEY_TEAM);
        if (storedTeam && storedTeam !== currentTeam) {
            sessionStorage.setItem(STORAGE_KEY_COUNT, '0');
            sessionStorage.removeItem(STORAGE_KEY_VIOLATED);
        }
        sessionStorage.setItem(STORAGE_KEY_TEAM, currentTeam);
    }

    function getTabSwitchCount() {
        checkTeamSession();
        const val = sessionStorage.getItem(STORAGE_KEY_COUNT);
        return val ? parseInt(val, 10) : 0;
    }

    function incrementTabSwitchCount() {
        const current = getTabSwitchCount();
        const next = current + 1;
        sessionStorage.setItem(STORAGE_KEY_COUNT, next.toString());
        return next;
    }

    function isTabSwitchLimitExceeded() {
        return getTabSwitchCount() > MAX_ALLOWED_SWITCHES ||
            sessionStorage.getItem(STORAGE_KEY_VIOLATED) === 'true';
    }

    function markViolation() {
        sessionStorage.setItem(STORAGE_KEY_VIOLATED, 'true');
    }

    function resetTabSwitchMonitoring() {
        sessionStorage.setItem(STORAGE_KEY_COUNT, '0');
        sessionStorage.removeItem(STORAGE_KEY_VIOLATED);
        const team = getActiveTeamId();
        sessionStorage.setItem(STORAGE_KEY_TEAM, team);
        removeWarningModal();
    }

    // =========================================================================
    // WARNING & TERMINATION OVERLAY UI
    // =========================================================================
    function showWarningModal(count) {
        removeWarningModal();

        modalOverlay = document.createElement('div');
        modalOverlay.id = 'tab-switch-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(5, 7, 13, 0.96);
            backdrop-filter: blur(14px);
            z-index: 9999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', 'Rajdhani', 'Segoe UI', sans-serif;
            padding: 1.5rem;
            box-sizing: border-box;
        `;

        const card = document.createElement('div');
        card.style.cssText = `
            max-width: 520px;
            width: 100%;
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(239, 68, 68, 0.6);
            border-radius: 16px;
            padding: 2.5rem 2rem;
            text-align: center;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(239, 68, 68, 0.25);
            color: #ffffff;
        `;

        const isExceeded = count > MAX_ALLOWED_SWITCHES;

        if (isExceeded) {
            card.innerHTML = `
                <div style="font-size: 3.5rem; margin-bottom: 1rem; line-height: 1;">⚠️</div>
                <h2 style="font-size: 1.8rem; font-weight: 800; color: #ef4444; margin-bottom: 1rem; letter-spacing: 1px; text-transform: uppercase;">
                    Tab Switch Limit Exceeded
                </h2>
                <p style="font-size: 1.05rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 2rem;">
                    Your attempt has been terminated because you switched away from the tournament more than the allowed number of times (${MAX_ALLOWED_SWITCHES}).
                </p>
                <div style="padding: 1rem; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 8px; color: #fca5a5; font-weight: 700; font-size: 0.95rem; letter-spacing: 1px; text-transform: uppercase;">
                    ATTEMPT TERMINATED • SCORE FROZEN
                </div>
            `;
        } else {
            card.style.borderColor = 'rgba(245, 158, 11, 0.6)';
            card.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.25)';
            card.innerHTML = `
                <div style="font-size: 3.5rem; margin-bottom: 1rem; line-height: 1;">⚡</div>
                <h2 style="font-size: 1.7rem; font-weight: 800; color: #f59e0b; margin-bottom: 1rem; letter-spacing: 1px; text-transform: uppercase;">
                    Tab Switch Warning
                </h2>
                <p style="font-size: 1.05rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 2rem;">
                    Warning: You have used your <strong>${count}</strong> allowed tab switch. One more tab switch will terminate your attempt.
                </p>
                <button id="tab-switch-acknowledge-btn" style="
                    width: 100%;
                    padding: 0.95rem 1.5rem;
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    border: none;
                    border-radius: 8px;
                    color: #ffffff;
                    font-weight: 800;
                    font-size: 1rem;
                    cursor: pointer;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
                ">
                    I Understand &amp; Continue
                </button>
            `;
        }

        modalOverlay.appendChild(card);
        document.body.appendChild(modalOverlay);

        if (!isExceeded) {
            const ackBtn = card.querySelector('#tab-switch-acknowledge-btn');
            if (ackBtn) {
                ackBtn.addEventListener('click', function () {
                    removeWarningModal();
                });
            }
        } else {
            markViolation();
        }
    }

    function removeWarningModal() {
        if (modalOverlay && modalOverlay.parentNode) {
            modalOverlay.parentNode.removeChild(modalOverlay);
        }
        modalOverlay = null;
    }

    // =========================================================================
    // DETECTION & EVENT HANDLING
    // =========================================================================
    function handleTabSwitch(sourceEvent) {
        if (!isMonitoring) return;

        if (isTabSwitchLimitExceeded()) {
            showWarningModal(getTabSwitchCount());
            return;
        }

        const now = Date.now();
        if (now - lastSwitchTimestamp < DEBOUNCE_MS) {
            return; // Ignore duplicate event within debounce window
        }
        lastSwitchTimestamp = now;

        const count = incrementTabSwitchCount();

        if (count > MAX_ALLOWED_SWITCHES) {
            markViolation();
        }
        showWarningModal(count);
    }

    function onVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            handleTabSwitch('visibilitychange');
        }
    }

    function onWindowBlur() {
        if (document.visibilityState === 'hidden') {
            handleTabSwitch('blur');
        }
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================
    function startTabSwitchMonitoring() {
        if (isMonitoring) return;
        isMonitoring = true;

        if (isTabSwitchLimitExceeded()) {
            showWarningModal(getTabSwitchCount());
        }

        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('blur', onWindowBlur);
    }

    function stopTabSwitchMonitoring() {
        isMonitoring = false;
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('blur', onWindowBlur);
    }

    // Auto-check on load if attempt was already violated in a previous round
    window.addEventListener('DOMContentLoaded', function () {
        checkTeamSession();
        if (isTabSwitchLimitExceeded()) {
            showWarningModal(getTabSwitchCount());
        }
    });

    // Expose API on window
    window.TabSwitchControl = {
        start: startTabSwitchMonitoring,
        stop: stopTabSwitchMonitoring,
        reset: resetTabSwitchMonitoring,
        getCount: getTabSwitchCount,
        isExceeded: isTabSwitchLimitExceeded,
        MAX_ALLOWED_SWITCHES: MAX_ALLOWED_SWITCHES
    };

    window.startTabSwitchMonitoring = startTabSwitchMonitoring;
    window.stopTabSwitchMonitoring = stopTabSwitchMonitoring;
    window.resetTabSwitchMonitoring = resetTabSwitchMonitoring;
    window.getTabSwitchCount = getTabSwitchCount;
    window.isTabSwitchLimitExceeded = isTabSwitchLimitExceeded;

})(window);
