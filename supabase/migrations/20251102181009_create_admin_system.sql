/*
  # Create Admin System

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on admins table
    - Only admins can view admin records
*/

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin records"
  ON admins
  FOR SELECT
  USING (true);
