/**
 * Supabase Project Credentials Configuration
 * 
 * Replace the placeholder values below with your actual Supabase credentials.
 * Find them in Supabase Dashboard -> Project Settings -> API:
 *  - SUPABASE_URL: Project URL (e.g., https://xyzcompany.supabase.co)
 *  - SUPABASE_PUBLISHABLE_KEY: anon / public API key
 * 
 * SECURITY NOTE:
 * DO NOT insert your service-role (secret) key here!
 * Only use the client-side anon/publishable key.
 */

const SUPABASE_CONFIG = {
    SUPABASE_URL: "https://muhtpgtkkljxudcnrfho.supabase.co",
    SUPABASE_PUBLISHABLE_KEY: "sb_publishable_PMsT2Uy_j1qeONcM-TvPNg_ZzvMp47q"
};

// Make available globally in browser environments
if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}

// Export for Node / bundler environments if used
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}
