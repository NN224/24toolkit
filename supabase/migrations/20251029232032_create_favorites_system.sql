/*
  # Create Favorites/Bookmarks System

  ## Overview
  This migration creates a favorites system allowing users to bookmark their favorite comparisons.

  ## New Table

  ### favorites
  - `id` (uuid, primary key) - Unique identifier
  - `user_identifier` (text) - User's unique identifier (from localStorage/cookie)
  - `comparison_id` (uuid, foreign key) - Reference to comparisons table
  - `created_at` (timestamptz) - When the bookmark was added
  - Unique constraint on (user_identifier, comparison_id) to prevent duplicates

  ## Security
  - Enable RLS on favorites table
  - Users can read/write their own favorites based on user_identifier
  - No authentication required (uses local user identifier)

  ## Indexes
  - Index on user_identifier for fast lookup
  - Index on comparison_id for analytics
  - Composite index on (user_identifier, comparison_id) for quick existence checks
*/

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL,
  comparison_id uuid REFERENCES comparisons(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_identifier, comparison_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_identifier);
CREATE INDEX IF NOT EXISTS idx_favorites_comparison ON favorites(comparison_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_comparison ON favorites(user_identifier, comparison_id);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can remove own favorites"
  ON favorites FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create function to get favorite count for a comparison
CREATE OR REPLACE FUNCTION get_favorites_count(comp_id uuid)
RETURNS bigint AS $$
  SELECT COUNT(*) FROM favorites WHERE comparison_id = comp_id;
$$ LANGUAGE sql STABLE;

-- Create function to check if user has favorited a comparison
CREATE OR REPLACE FUNCTION is_favorited(comp_id uuid, user_id text)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM favorites 
    WHERE comparison_id = comp_id AND user_identifier = user_id
  );
$$ LANGUAGE sql STABLE;