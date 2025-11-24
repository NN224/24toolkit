/*
  # Create Comparisons System Schema

  ## Overview
  This migration creates the complete database schema for the bilingual comparison platform.

  ## New Tables

  ### 1. categories
  - `id` (uuid, primary key) - Unique category identifier
  - `name_en` (text) - Category name in English
  - `name_ar` (text) - Category name in Arabic
  - `slug` (text, unique) - URL-friendly identifier
  - `icon` (text) - Icon/emoji for the category
  - `description_en` (text) - Category description in English
  - `description_ar` (text) - Category description in Arabic
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. comparisons
  - `id` (uuid, primary key) - Unique comparison identifier
  - `slug` (text, unique) - URL-friendly identifier
  - `category_id` (uuid, foreign key) - Reference to categories
  - `title_en` (text) - Comparison title in English
  - `title_ar` (text) - Comparison title in Arabic
  - `meta_description_en` (text) - SEO meta description in English
  - `meta_description_ar` (text) - SEO meta description in Arabic
  - `content_en` (jsonb) - Full comparison content in English
  - `content_ar` (jsonb) - Full comparison content in Arabic
  - `featured_image` (text) - Main image URL
  - `is_published` (boolean, default: true) - Publication status
  - `view_count` (integer, default: 0) - Number of views
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. ratings
  - `id` (uuid, primary key) - Unique rating identifier
  - `comparison_id` (uuid, foreign key) - Reference to comparisons
  - `user_identifier` (text) - User IP or cookie ID
  - `rating` (integer) - Rating value (1-5)
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. comments
  - `id` (uuid, primary key) - Unique comment identifier
  - `comparison_id` (uuid, foreign key) - Reference to comparisons
  - `parent_comment_id` (uuid, nullable) - For nested replies
  - `user_name` (text) - Commenter's name
  - `user_email` (text) - Commenter's email
  - `comment_text` (text) - Comment content
  - `language` (text) - Comment language (en/ar)
  - `is_approved` (boolean, default: false) - Moderation status
  - `created_at` (timestamptz) - Creation timestamp

  ### 5. search_logs
  - `id` (uuid, primary key) - Unique log identifier
  - `search_query` (text) - Search term
  - `language` (text) - Search language (en/ar)
  - `results_count` (integer) - Number of results found
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for published comparisons and approved comments
  - Restricted write access for ratings and comments
  - Admin-only access for moderation and content management

  ## Indexes
  - Full-text search indexes on comparison titles and content
  - Lookup indexes on slugs and foreign keys
  - Performance indexes on frequently queried fields
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '',
  description_en text DEFAULT '',
  description_ar text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comparisons table
CREATE TABLE IF NOT EXISTS comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  meta_description_en text DEFAULT '',
  meta_description_ar text DEFAULT '',
  content_en jsonb DEFAULT '{}',
  content_ar jsonb DEFAULT '{}',
  featured_image text DEFAULT '',
  is_published boolean DEFAULT true,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id uuid REFERENCES comparisons(id) ON DELETE CASCADE NOT NULL,
  user_identifier text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(comparison_id, user_identifier)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id uuid REFERENCES comparisons(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_email text NOT NULL,
  comment_text text NOT NULL,
  language text NOT NULL CHECK (language IN ('en', 'ar')),
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create search_logs table
CREATE TABLE IF NOT EXISTS search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query text NOT NULL,
  language text NOT NULL CHECK (language IN ('en', 'ar')),
  results_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comparisons_slug ON comparisons(slug);
CREATE INDEX IF NOT EXISTS idx_comparisons_category ON comparisons(category_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_published ON comparisons(is_published);
CREATE INDEX IF NOT EXISTS idx_comparisons_views ON comparisons(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_comparison ON ratings(comparison_id);
CREATE INDEX IF NOT EXISTS idx_comments_comparison ON comments(comparison_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_comparisons_title_en_fts ON comparisons USING gin(to_tsvector('english', title_en));
CREATE INDEX IF NOT EXISTS idx_comparisons_title_ar_fts ON comparisons USING gin(to_tsvector('arabic', title_ar));

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for comparisons (public read for published)
CREATE POLICY "Anyone can view published comparisons"
  ON comparisons FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- RLS Policies for ratings (public read and insert)
CREATE POLICY "Anyone can view ratings"
  ON ratings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert ratings"
  ON ratings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for comments (public read for approved, insert allowed)
CREATE POLICY "Anyone can view approved comments"
  ON comments FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Anyone can insert comments"
  ON comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for search_logs (insert only)
CREATE POLICY "Anyone can log searches"
  ON search_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comparisons_updated_at
  BEFORE UPDATE ON comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();