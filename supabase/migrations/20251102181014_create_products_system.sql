/*
  # Create Products System

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `category` (text)
      - `rating` (numeric)
      - `price` (numeric)
      - `features` (jsonb)
      - `created_at` (timestamp)

    - `battle_results`
      - `id` (uuid, primary key)
      - `product1_id` (uuid)
      - `product2_id` (uuid)
      - `winner_id` (uuid)
      - `user_id` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public read access
    - Anyone can create battle results
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text NOT NULL,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  price numeric DEFAULT 0,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS battle_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product1_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  product2_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  winner_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create battle results"
  ON battle_results
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view battle results"
  ON battle_results
  FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_battle_results_products ON battle_results(product1_id, product2_id);
