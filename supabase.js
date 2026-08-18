/**
 * Common Supabase Connection & Database Service Module
 * Tech Event Tournament 2026
 * 
 * Provides a single shared Supabase client connection and reusable 
 * helper functions for team authentication, registration, score saving, 
 * score reading, and leaderboard generation.
 * 
 * Compatible with vanilla HTML/JS via script tags or modern ES modules.
 */

// Singleton Supabase Client Instance
let supabaseInstance = null;

/**
 * Initializes and returns the shared Supabase client instance.
 * @returns {object|null} Supabase Client Object
 */
function getSupabaseClient() {
    if (supabaseInstance) return supabaseInstance;

    const config = (typeof window !== 'undefined' && window.SUPABASE_CONFIG)
        ? window.SUPABASE_CONFIG
        : (typeof SUPABASE_CONFIG !== 'undefined' ? SUPABASE_CONFIG : null);

    if (!config || !config.SUPABASE_URL || config.SUPABASE_URL.includes("your-supabase-project-id")) {
        console.warn("Supabase Warning: Credentials have not been filled in 'supabase-config.js'. Please update project URL and key.");
    }

    // Resolve Supabase SDK from global window object (loaded via CDN) or environment
    const supabaseLib = (typeof window !== 'undefined' && window.supabase) 
        ? window.supabase 
        : (typeof supabase !== 'undefined' ? supabase : null);

    if (supabaseLib && typeof supabaseLib.createClient === 'function') {
        supabaseInstance = supabaseLib.createClient(config.SUPABASE_URL, config.SUPABASE_PUBLISHABLE_KEY);
    } else {
        console.error("Supabase Error: SDK library not loaded. Ensure CDN script tag is included in HTML.");
    }

    return supabaseInstance;
}

/**
 * -----------------------------------------------------------------------------
 * TEAM AUTHENTICATION & REGISTRATION HELPERS
 * -----------------------------------------------------------------------------
 */

/**
 * Log in an existing team with Team Name and Password.
 * @param {string} teamName 
 * @param {string} password 
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
async function loginTeam(teamName, password) {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error("Supabase client unavailable") };

    const cleanName = teamName ? teamName.trim() : '';
    const cleanPassword = password ? password.trim() : '';

    if (!cleanName || !cleanPassword) {
        return { data: null, error: new Error("Team Name and Password are required.") };
    }

    const { data, error } = await client
        .from('teams')
        .select('id, team_name, password, created_at')
        .eq('team_name', cleanName)
        .single();

    if (error) {
        return { data: null, error: new Error("Team not found. Please register first or check team name.") };
    }

    if (data.password !== cleanPassword) {
        return { data: null, error: new Error("Invalid password for team '" + cleanName + "'.") };
    }

    // Store team info in localStorage for persistence across pages/rounds
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem("current_team_id", data.id);
        localStorage.setItem("current_team_name", data.team_name);
    }

    return { data: { id: data.id, team_name: data.team_name, created_at: data.created_at }, error: null };
}

/**
 * Register a new team with Team Name and Password.
 * @param {string} teamName - Unique team name.
 * @param {string} password - Password for team access.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
async function createTeam(teamName, password = 'test') {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error("Supabase client unavailable") };

    const cleanName = teamName ? teamName.trim() : '';
    const cleanPassword = password ? password.trim() : 'test';

    if (!cleanName) return { data: null, error: new Error("Team name is required.") };
    if (!cleanPassword) return { data: null, error: new Error("Password is required.") };

    // Try inserting new team
    const { data, error } = await client
        .from('teams')
        .insert([{ team_name: cleanName, password: cleanPassword }])
        .select('id, team_name, created_at')
        .single();

    // If unique constraint violation (23505), team already exists
    if (error && (error.code === '23505' || error.message?.includes('duplicate key'))) {
        return { data: null, error: new Error("Team name '" + cleanName + "' already exists. Please login instead.") };
    }

    if (data && typeof localStorage !== 'undefined') {
        localStorage.setItem("current_team_id", data.id);
        localStorage.setItem("current_team_name", data.team_name);
    }

    return { data, error };
}

/**
 * Retrieve currently authenticated team from localStorage.
 * @returns {{id: string|null, team_name: string|null}}
 */
function getCurrentTeam() {
    if (typeof localStorage === 'undefined') return { id: null, team_name: null };
    return {
        id: localStorage.getItem("current_team_id"),
        team_name: localStorage.getItem("current_team_name")
    };
}

/**
 * Log out the currently authenticated team.
 */
function logoutTeam() {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem("current_team_id");
        localStorage.removeItem("current_team_name");
    }
}

/**
 * Retrieve team by ID.
 * @param {number|string} teamId - Team ID.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
async function getTeam(teamId) {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error("Supabase client unavailable") };

    const { data, error } = await client
        .from('teams')
        .select('id, team_name, created_at')
        .eq('id', teamId)
        .single();

    return { data, error };
}

/**
 * Retrieve team by Team Name.
 * @param {string} teamName - Team Name.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
async function getTeamByName(teamName) {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error("Supabase client unavailable") };

    const { data, error } = await client
        .from('teams')
        .select('id, team_name, created_at')
        .eq('team_name', teamName.trim())
        .single();

    return { data, error };
}

/**
 * -----------------------------------------------------------------------------
 * SCORE RECORDING & LEADERBOARD HELPERS
 * -----------------------------------------------------------------------------
 */

/**
 * Save or update score for a specific team and round.
 * Uses upsert to guarantee only ONE score record exists per team per round.
 * @param {number|string} teamId - Unique Team ID.
 * @param {number} roundNumber - Round number (1 through 6).
 * @param {number} score - Score achieved.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
async function saveRoundScore(teamId, roundNumber, score) {
    const client = getSupabaseClient();
    if (!client) {
        const err = new Error("Supabase client unavailable. Check supabase-config.js credentials.");
        console.error("❌ [Supabase DB Error]", err);
        return { data: null, error: err };
    }

    const parsedTeamId = parseInt(teamId, 10);
    if (!parsedTeamId || isNaN(parsedTeamId)) {
        const err = new Error("Missing or invalid teamId ('" + teamId + "'). Team must be registered/logged in.");
        console.error("❌ [Supabase DB Error]", err);
        return { data: null, error: err };
    }

    const parsedRoundNum = parseInt(roundNumber, 10);
    if (!parsedRoundNum || parsedRoundNum < 1 || parsedRoundNum > 7) {
        const err = new Error("Invalid round number (" + roundNumber + "). Must be between 1 and 7.");
        console.error("❌ [Supabase DB Error]", err);
        return { data: null, error: err };
    }

    const parsedScore = parseInt(score, 10);
    const finalScoreVal = isNaN(parsedScore) ? 0 : parsedScore;

    console.log(`[Supabase DB] Transmitting Score: Team ID #${parsedTeamId}, Round ${parsedRoundNum}, Score ${finalScoreVal}...`);

    const { data, error } = await client
        .from('round_scores')
        .upsert(
            {
                team_id: parsedTeamId,
                round_number: parsedRoundNum,
                score: finalScoreVal,
                completed_at: new Date().toISOString()
            },
            { onConflict: 'team_id,round_number' }
        )
        .select()
        .single();

    if (error) {
        console.error(`❌ [Supabase DB Error] Failed to save score for Team #${parsedTeamId}, Round ${parsedRoundNum}:`, error);
    } else {
        console.log(`🏆 [Supabase DB Success] Saved score for Team #${parsedTeamId}, Round ${parsedRoundNum}:`, data);
    }

    return { data, error };
}

/**
 * Fetch all round scores recorded for a given team ID.
 * @param {number|string} teamId - Team ID.
 * @returns {Promise<{data: Array|null, error: object|null}>}
 */
async function getTeamScores(teamId) {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error("Supabase client unavailable") };

    const { data, error } = await client
        .from('round_scores')
        .select('*')
        .eq('team_id', teamId)
        .order('round_number', { ascending: true });

    return { data, error };
}

/**
 * Fetch the full tournament leaderboard sorted by total score descending.
 * @returns {Promise<{data: Array|null, error: object|null}>}
 */
async function getLeaderboard() {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error("Supabase client unavailable") };

    const { data, error } = await client
        .from('leaderboard')
        .select('*')
        .order('rank', { ascending: true });

    return { data, error };
}

// Expose globally on `window.TournamentDB` for standard browser script tags
if (typeof window !== 'undefined') {
    window.TournamentDB = {
        getSupabaseClient,
        loginTeam,
        createTeam,
        getCurrentTeam,
        logoutTeam,
        getTeam,
        getTeamByName,
        saveRoundScore,
        getTeamScores,
        getLeaderboard
    };
}

// Export for module systems (Node / ES6 imports)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getSupabaseClient,
        loginTeam,
        createTeam,
        getCurrentTeam,
        logoutTeam,
        getTeam,
        getTeamByName,
        saveRoundScore,
        getTeamScores,
        getLeaderboard
    };
}
