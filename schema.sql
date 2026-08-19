-- =============================================================================
-- SUPABASE POSTGRESQL DATABASE SCHEMA SETUP FOR TECH EVENT TOURNAMENT (7 ROUNDS)
-- =============================================================================

-- 0. DROP EXISTING VIEW AND TRUNCATE SCORES TO ENSURE ZERO FAKE SCORES EXIST
DROP VIEW IF EXISTS public.leaderboard CASCADE;
TRUNCATE TABLE public.round_scores CASCADE;

-- 1. CREATE TEAMS TABLE (WITH PASSWORD SUPPORT)
CREATE TABLE IF NOT EXISTS public.teams (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL DEFAULT 'test',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure password column exists if table was created previously
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'test';

-- Table & Column Documentation
COMMENT ON TABLE public.teams IS 'Stores team registration details for the tournament';
COMMENT ON COLUMN public.teams.id IS 'Auto-generated unique identifier for each team';
COMMENT ON COLUMN public.teams.team_name IS 'Unique name of the participating team';
COMMENT ON COLUMN public.teams.password IS 'Team access password for authentication';
COMMENT ON COLUMN public.teams.created_at IS 'Timestamp when the team registered';


-- 2. CREATE ROUND_SCORES TABLE (1 TO 7 ROUNDS)
CREATE TABLE IF NOT EXISTS public.round_scores (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_id BIGINT NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 7),
    score INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_team_round UNIQUE (team_id, round_number)
);

-- Drop old check constraint if modifying existing table to 7 rounds
ALTER TABLE public.round_scores DROP CONSTRAINT IF EXISTS round_scores_round_number_check;
ALTER TABLE public.round_scores ADD CONSTRAINT round_scores_round_number_check CHECK (round_number BETWEEN 1 AND 7);

-- Table & Column Documentation
COMMENT ON TABLE public.round_scores IS 'Stores round scores for tournament teams';
COMMENT ON COLUMN public.round_scores.id IS 'Auto-generated unique score record ID';
COMMENT ON COLUMN public.round_scores.team_id IS 'Foreign key referencing teams(id)';
COMMENT ON COLUMN public.round_scores.round_number IS 'Round number (1 to 7)';
COMMENT ON COLUMN public.round_scores.score IS 'Score achieved in the specified round';
COMMENT ON COLUMN public.round_scores.completed_at IS 'Timestamp when score was recorded';


-- 3. USEFUL INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_round_scores_team_id ON public.round_scores(team_id);
CREATE INDEX IF NOT EXISTS idx_round_scores_round_num ON public.round_scores(round_number);
CREATE INDEX IF NOT EXISTS idx_round_scores_team_round ON public.round_scores(team_id, round_number);


-- 4. ROW LEVEL SECURITY (RLS) SETUP & POLICIES
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.round_scores ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies
DROP POLICY IF EXISTS "Allow public select teams" ON public.teams;
DROP POLICY IF EXISTS "Allow public insert teams" ON public.teams;
DROP POLICY IF EXISTS "Allow public update teams" ON public.teams;
DROP POLICY IF EXISTS "Allow public select round_scores" ON public.round_scores;
DROP POLICY IF EXISTS "Allow public insert round_scores" ON public.round_scores;
DROP POLICY IF EXISTS "Allow public update round_scores" ON public.round_scores;

-- Policies for teams table (Client-side access using anon / publishable key)
CREATE POLICY "Allow public select teams" 
    ON public.teams FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert teams" 
    ON public.teams FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update teams" 
    ON public.teams FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public delete teams" 
    ON public.teams FOR DELETE 
    USING (true);

-- Policies for round_scores table (Client-side access using anon / publishable key)
CREATE POLICY "Allow public select round_scores" 
    ON public.round_scores FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert round_scores" 
    ON public.round_scores FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update round_scores" 
    ON public.round_scores FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public delete round_scores" 
    ON public.round_scores FOR DELETE 
    USING (true);


-- 5. LEADERBOARD VIEW (7 ROUNDS BREAKDOWN)
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    DENSE_RANK() OVER (
        ORDER BY COALESCE(SUM(rs.score), 0) DESC, 
                 MIN(t.created_at) ASC, 
                 t.id ASC
    ) AS rank,
    t.id AS team_id,
    t.team_name,
    MAX(CASE WHEN rs.round_number = 1 THEN rs.score END) AS round_1_score,
    MAX(CASE WHEN rs.round_number = 2 THEN rs.score END) AS round_2_score,
    MAX(CASE WHEN rs.round_number = 3 THEN rs.score END) AS round_3_score,
    MAX(CASE WHEN rs.round_number = 4 THEN rs.score END) AS round_4_score,
    MAX(CASE WHEN rs.round_number = 5 THEN rs.score END) AS round_5_score,
    MAX(CASE WHEN rs.round_number = 6 THEN rs.score END) AS round_6_score,
    MAX(CASE WHEN rs.round_number = 7 THEN rs.score END) AS round_7_score,
    COALESCE(SUM(rs.score), 0) AS total_score
FROM 
    public.teams t
LEFT JOIN 
    public.round_scores rs ON t.id = rs.team_id
GROUP BY 
    t.id, t.team_name
ORDER BY 
    total_score DESC, 
    MIN(t.created_at) ASC, 
    t.id ASC;

-- Grant select permission on view to anon and authenticated roles
GRANT SELECT ON public.leaderboard TO anon, authenticated;


-- =============================================================================
-- 6. DEFAULT DUMMY TEAM CREATION (NO SCORES INCLUDED)
-- NOTE: Scores are created ONLY when a team actually completes a round in the game.
-- =============================================================================

-- Default Dummy User for testing login (Team: test, Password: test)
INSERT INTO public.teams (team_name, password) 
VALUES ('test', 'test') 
ON CONFLICT (team_name) DO UPDATE SET password = EXCLUDED.password;

-- Default Dummy User for testing login (Team: test1, Password: test1)
INSERT INTO public.teams (team_name, password) 
VALUES ('test1', 'test1') 
ON CONFLICT (team_name) DO UPDATE SET password = EXCLUDED.password;

-- Default Dummy User for testing login (Team: TEST2, Password: test2)
INSERT INTO public.teams (team_name, password) 
VALUES ('TEST2', 'test2') 
ON CONFLICT (team_name) DO UPDATE SET password = EXCLUDED.password;

-- Registered Team: pranavi (Password: pranavi@123)
INSERT INTO public.teams (team_name, password) 
VALUES ('pranavi', 'pranavi@123') 
ON CONFLICT (team_name) DO UPDATE SET password = EXCLUDED.password;

-- Registered Team: iniya (Password: iniya@123)
INSERT INTO public.teams (team_name, password) 
VALUES ('iniya', 'iniya@123') 
ON CONFLICT (team_name) DO UPDATE SET password = EXCLUDED.password;
