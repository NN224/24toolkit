/*
  # Create Comparisons System

  1. New Tables
    - `comparisons`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `title_en` (text) - English title
      - `title_ar` (text) - Arabic title
      - `category` (text) - Category of comparison
      - `status` (text) - pending/approved/rejected
      - `item1_name` (text) - First item name
      - `item2_name` (text) - Second item name
      - `content` (jsonb) - Full comparison content
      - `views` (integer) - View count
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `comparisons` table
    - Add policies for public read access to approved comparisons
    - Add policies for authenticated users to create pending comparisons
*/

CREATE TABLE IF NOT EXISTS comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  category text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  item1_name text NOT NULL,
  item2_name text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved comparisons"
  ON comparisons
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can create pending comparisons"
  ON comparisons
  FOR INSERT
  WITH CHECK (status = 'pending');

CREATE INDEX IF NOT EXISTS idx_comparisons_slug ON comparisons(slug);
CREATE INDEX IF NOT EXISTS idx_comparisons_status ON comparisons(status);
CREATE INDEX IF NOT EXISTS idx_comparisons_category ON comparisons(category);
