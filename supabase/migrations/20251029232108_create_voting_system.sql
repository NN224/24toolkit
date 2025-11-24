/*
  # Create Voting System

  ## Overview
  This migration creates a voting system for comparisons where users can vote for their preferred option.

  ## New Table

  ### votes
  - `id` (uuid, primary key) - Unique vote identifier
  - `comparison_id` (uuid, foreign key) - Reference to comparisons
  - `user_identifier` (text) - User's unique identifier (IP/cookie)
  - `vote_option` (text) - Which option was voted for ('option_a' or 'option_b')
  - `created_at` (timestamptz) - When the vote was cast
  - Unique constraint on (comparison_id, user_identifier) to prevent duplicate votes

  ## Security
  - Enable RLS on votes table
  - Anyone can view vote statistics
  - Anyone can insert votes (once per comparison)

  ## Indexes
  - Index on comparison_id for quick aggregation
  - Composite index on (comparison_id, vote_option) for fast counting
*/

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id uuid REFERENCES comparisons(id) ON DELETE CASCADE NOT NULL,
  user_identifier text NOT NULL,
  vote_option text NOT NULL CHECK (vote_option IN ('option_a', 'option_b')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(comparison_id, user_identifier)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_votes_comparison ON votes(comparison_id);
CREATE INDEX IF NOT EXISTS idx_votes_comparison_option ON votes(comparison_id, vote_option);
CREATE INDEX IF NOT EXISTS idx_votes_created ON votes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for votes
CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert votes"
  ON votes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create function to get vote counts for a comparison
CREATE OR REPLACE FUNCTION get_vote_counts(comp_id uuid)
RETURNS TABLE(option_a_count bigint, option_b_count bigint) AS $$
  SELECT 
    COUNT(*) FILTER (WHERE vote_option = 'option_a') as option_a_count,
    COUNT(*) FILTER (WHERE vote_option = 'option_b') as option_b_count
  FROM votes 
  WHERE comparison_id = comp_id;
$$ LANGUAGE sql STABLE;

-- Create function to check if user has voted
CREATE OR REPLACE FUNCTION has_user_voted(comp_id uuid, user_id text)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM votes 
    WHERE comparison_id = comp_id AND user_identifier = user_id
  );
$$ LANGUAGE sql STABLE;