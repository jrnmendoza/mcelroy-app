-- Drop existing tables if re-running
DROP TABLE IF EXISTS group_decisions;
DROP TABLE IF EXISTS responses;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS journal_sessions;

-- Create tables

CREATE TABLE IF NOT EXISTS journal_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    join_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'lobby', -- lobby, active, completed
    current_stage INTEGER NOT NULL DEFAULT 0,
    active_question TEXT,
    reveal_results BOOLEAN DEFAULT false,
    discussion_mode BOOLEAN DEFAULT false,
    host_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES journal_sessions(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(id, session_id)
);

CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES journal_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(session_id, user_id, question_id)
);

CREATE TABLE IF NOT EXISTS group_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES journal_sessions(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    final_group_answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(session_id, question_id)
);

-- Enable Row Level Security
ALTER TABLE journal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_decisions ENABLE ROW LEVEL SECURITY;

-- Enable Realtime
-- Realtime is enabled for these tables so the presenter view updates live
alter publication supabase_realtime add table journal_sessions;
alter publication supabase_realtime add table participants;
alter publication supabase_realtime add table responses;
alter publication supabase_realtime add table group_decisions;

-- RLS Policies

-- journal_sessions
-- Anyone can create a session (acting as host)
CREATE POLICY "Anyone can create a session" ON journal_sessions
    FOR INSERT WITH CHECK (auth.uid() = host_id);

-- Anyone can read active sessions
CREATE POLICY "Anyone can read sessions" ON journal_sessions
    FOR SELECT USING (true);

-- Only the host can update the session state
CREATE POLICY "Host can update session" ON journal_sessions
    FOR UPDATE USING (auth.uid() = host_id);


-- participants
-- Users can join a session (insert themselves)
CREATE POLICY "Users can join session" ON participants
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can read their own participation, and hosts can read all participants for their session
CREATE POLICY "Users read own and hosts read all participants" ON participants
    FOR SELECT USING (
        auth.uid() = id OR 
        EXISTS (SELECT 1 FROM journal_sessions WHERE id = participants.session_id AND host_id = auth.uid())
    );


-- responses
-- Users can insert their own responses
CREATE POLICY "Users can insert own responses" ON responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own responses
CREATE POLICY "Users can update own responses" ON responses
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can read their own responses, hosts can read all responses for their session
CREATE POLICY "Users read own and hosts read all responses" ON responses
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (SELECT 1 FROM journal_sessions WHERE id = responses.session_id AND host_id = auth.uid())
    );


-- group_decisions
-- Only host can insert/update group decisions
CREATE POLICY "Host can insert group decisions" ON group_decisions
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM journal_sessions WHERE id = group_decisions.session_id AND host_id = auth.uid())
    );

CREATE POLICY "Host can update group decisions" ON group_decisions
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM journal_sessions WHERE id = group_decisions.session_id AND host_id = auth.uid())
    );

-- Everyone can read group decisions
CREATE POLICY "Everyone can read group decisions" ON group_decisions
    FOR SELECT USING (true);
