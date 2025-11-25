/*
  # Admin Content Management Policies

  ## Overview
  This migration creates RLS policies that allow authenticated admin users to manage all content
  in the system including comparisons, categories, and comments.

  ## Security Changes
  
  ### 1. Comparisons Table
  - Admins can view all comparisons (published and drafts)
  - Admins can insert new comparisons
  - Admins can update any comparison
  - Admins can delete any comparison

  ### 2. Categories Table
  - Admins can insert new categories
  - Admins can update any category
  - Admins can delete any category

  ### 3. Comments Table
  - Admins can view all comments (approved and pending)
  - Admins can update any comment (for moderation)
  - Admins can delete any comment

  ## Important Notes
  - All admin policies check that the user exists in the admins table with is_active = true
  - These policies work alongside existing public policies
  - Admin access is restricted to authenticated users only
*/

-- ============================================
-- COMPARISONS: Admin Policies
-- ============================================

-- Admins can view all comparisons (including drafts)
CREATE POLICY "Admins can view all comparisons"
  ON comparisons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  );

-- Admins can insert comparisons
CREATE POLICY "Admins can insert comparisons"
  ON comparisons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  );

-- Admins can update any comparison
CREATE POLICY "Admins can update comparisons"
  ON comparisons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  );

-- Admins can delete any comparison
CREATE POLICY "Admins can delete comparisons"
  ON comparisons FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  );

-- ============================================
-- CATEGORIES: Admin Policies
-- ============================================

-- Admins can insert categories
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  );

-- Admins can update categories
CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  );

-- Admins can delete categories
CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  );

-- ============================================
-- COMMENTS: Admin Policies
-- ============================================

-- Admins can view all comments (including unapproved)
CREATE POLICY "Admins can view all comments"
  ON comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  );

-- Admins can update any comment (for moderation)
CREATE POLICY "Admins can update comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  );

-- Admins can delete any comment
CREATE POLICY "Admins can delete comments"
  ON comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid() 
      AND admins.is_active = true
    )
  );
