/*
  # Create Products and Battle System Tables

  ## Overview
  This migration creates the AI Battle system tables for interactive product comparisons.

  ## New Tables

  ### 1. products
  - `id` (uuid, primary key) - Unique product identifier
  - `name_en` (text) - Product name in English
  - `name_ar` (text) - Product name in Arabic
  - `slug` (text, unique) - URL-friendly identifier
  - `category_id` (uuid, foreign key) - Reference to categories
  - `logo_url` (text) - Product logo image URL
  - `image_url` (text) - Product main image URL
  - `primary_color` (text) - Brand primary color (hex)
  - `specs` (jsonb) - Product specifications and features
  - `base_score` (integer) - Base quality score (0-100)
  - `price_range` (text) - Price range indicator
  - `description_en` (text) - Product description in English
  - `description_ar` (text) - Product description in Arabic
  - `pros` (jsonb) - List of advantages
  - `cons` (jsonb) - List of disadvantages
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. battle_results
  - `id` (uuid, primary key) - Unique battle identifier
  - `product_a_id` (uuid, foreign key) - First product reference
  - `product_b_id` (uuid, foreign key) - Second product reference
  - `winner_id` (uuid, foreign key) - Winner product reference
  - `product_a_score` (integer) - Product A total score
  - `product_b_score` (integer) - Product B total score
  - `scores_breakdown` (jsonb) - Detailed scores by category
  - `view_count` (integer) - Number of times viewed
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. product_comparison_link
  - `id` (uuid, primary key) - Unique link identifier
  - `product_id` (uuid, foreign key) - Product reference
  - `comparison_id` (uuid, foreign key) - Comparison reference
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for products and battle results
  - Public insert access for battle results (logged battles)
  - Restricted write access for product management (admin only)

  ## Indexes
  - Lookup indexes on slugs and foreign keys
  - Performance indexes on frequently queried fields
  - Battle history indexes for analytics
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  logo_url text DEFAULT '',
  image_url text DEFAULT '',
  primary_color text DEFAULT '#3498db',
  specs jsonb DEFAULT '{}',
  base_score integer DEFAULT 75 CHECK (base_score >= 0 AND base_score <= 100),
  price_range text DEFAULT 'medium',
  description_en text DEFAULT '',
  description_ar text DEFAULT '',
  pros jsonb DEFAULT '[]',
  cons jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create battle_results table
CREATE TABLE IF NOT EXISTS battle_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_a_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  product_b_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  winner_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  product_a_score integer DEFAULT 0 CHECK (product_a_score >= 0 AND product_a_score <= 100),
  product_b_score integer DEFAULT 0 CHECK (product_b_score >= 0 AND product_b_score <= 100),
  scores_breakdown jsonb DEFAULT '{}',
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create product_comparison_link table (links products to existing comparisons)
CREATE TABLE IF NOT EXISTS product_comparison_link (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  comparison_id uuid REFERENCES comparisons(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, comparison_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_score ON products(base_score DESC);
CREATE INDEX IF NOT EXISTS idx_battle_results_products ON battle_results(product_a_id, product_b_id);
CREATE INDEX IF NOT EXISTS idx_battle_results_winner ON battle_results(winner_id);
CREATE INDEX IF NOT EXISTS idx_battle_results_created ON battle_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_comparison_link_product ON product_comparison_link(product_id);
CREATE INDEX IF NOT EXISTS idx_product_comparison_link_comparison ON product_comparison_link(comparison_id);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_comparison_link ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for battle_results (public read and insert)
CREATE POLICY "Anyone can view battle results"
  ON battle_results FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create battle results"
  ON battle_results FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update battle view count"
  ON battle_results FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for product_comparison_link (public read)
CREATE POLICY "Anyone can view product comparison links"
  ON product_comparison_link FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create trigger for products updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
