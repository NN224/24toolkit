/*
  # Create Voting System

  1. New Tables
    - `votes`
      - `id` (uuid, primary key)
      - `comparison_id` (uuid, foreign key)
      - `user_id` (text) - Anonymous user identifier
      - `vote` (text) - item1/item2
      - `created_at` (timestamp)

    - `ratings`
      - `id` (uuid, primary key)
      - `comparison_id` (uuid, foreign key)
      - `user_id` (text) - Anonymous user identifier
      - `rating` (integer) - 1-5 stars
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow anyone to vote and rate
    - Prevent duplicate votes from same user
*/

CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id uuid REFERENCES comparisons(id) ON DELETE CASCADE NOT NULL,
  user_id text NOT NULL,
  vote text NOT NULL CHECK (vote IN ('item1', 'item2')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(comparison_id, user_id)
);

CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id uuid REFERENCES comparisons(id) ON DELETE CASCADE NOT NULL,
  user_id text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(comparison_id, user_id)
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can vote"
  ON votes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view votes"
  ON votes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can rate"
  ON ratings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view ratings"
  ON ratings
  FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_votes_comparison ON votes(comparison_id);
CREATE INDEX IF NOT EXISTS idx_ratings_comparison ON ratings(comparison_id);
