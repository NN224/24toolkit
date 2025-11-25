/*
  # Create Admin Authentication System

  ## Overview
  This migration sets up a complete admin authentication system using Supabase Auth.

  ## New Table

  ### admins
  - `id` (uuid, primary key) - References auth.users(id)
  - `email` (text) - Admin email (synced from auth)
  - `role` (text) - Admin role (default: 'admin')
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz) - Creation timestamp
  - `last_login` (timestamptz) - Last login time

  ## Security
  - Enable RLS on admins table
  - Only admins can read/write admin records
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin' NOT NULL CHECK (role IN ('admin', 'super_admin')),
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_active ON admins(is_active);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only authenticated admins can access
CREATE POLICY "Admins can view all admin records"
  ON admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update own record"
  ON admins FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Create function to update last_login
CREATE OR REPLACE FUNCTION update_admin_last_login()
RETURNS void AS $$
BEGIN
  UPDATE admins
  SET last_login = now()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON admins TO authenticated;
GRANT UPDATE (last_login) ON admins TO authenticated;