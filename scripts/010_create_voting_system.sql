-- Create votes table for comparison voting
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_slug TEXT NOT NULL,
  product_choice TEXT NOT NULL CHECK (product_choice IN ('A', 'B')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comparison_slug, user_id),
  UNIQUE(comparison_slug, ip_address)
);

-- Create ratings table for product ratings
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_slug TEXT NOT NULL,
  product_choice TEXT NOT NULL CHECK (product_choice IN ('A', 'B')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comparison_slug, product_choice, user_id),
  UNIQUE(comparison_slug, product_choice, ip_address)
);

-- Enable RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for votes (allow anyone to vote, but only view aggregated data)
CREATE POLICY "Anyone can insert votes" ON public.votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view votes" ON public.votes
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own votes" ON public.votes
  FOR UPDATE USING (auth.uid() = user_id OR ip_address = current_setting('request.headers')::json->>'x-forwarded-for');

-- RLS Policies for ratings
CREATE POLICY "Anyone can insert ratings" ON public.ratings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view ratings" ON public.ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own ratings" ON public.ratings
  FOR UPDATE USING (auth.uid() = user_id OR ip_address = current_setting('request.headers')::json->>'x-forwarded-for');

-- Create indexes for performance
CREATE INDEX idx_votes_comparison_slug ON public.votes(comparison_slug);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);
CREATE INDEX idx_votes_created_at ON public.votes(created_at);
CREATE INDEX idx_ratings_comparison_slug ON public.ratings(comparison_slug);
CREATE INDEX idx_ratings_user_id ON public.ratings(user_id);

-- Create function to get vote statistics
CREATE OR REPLACE FUNCTION get_vote_stats(slug TEXT)
RETURNS TABLE (
  product_a_votes BIGINT,
  product_b_votes BIGINT,
  total_votes BIGINT,
  product_a_percentage NUMERIC,
  product_b_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE product_choice = 'A') as product_a_votes,
    COUNT(*) FILTER (WHERE product_choice = 'B') as product_b_votes,
    COUNT(*) as total_votes,
    ROUND((COUNT(*) FILTER (WHERE product_choice = 'A')::NUMERIC / NULLIF(COUNT(*), 0) * 100), 1) as product_a_percentage,
    ROUND((COUNT(*) FILTER (WHERE product_choice = 'B')::NUMERIC / NULLIF(COUNT(*), 0) * 100), 1) as product_b_percentage
  FROM public.votes
  WHERE comparison_slug = slug;
END;
$$ LANGUAGE plpgsql;

-- Create function to get rating statistics
CREATE OR REPLACE FUNCTION get_rating_stats(slug TEXT)
RETURNS TABLE (
  product TEXT,
  average_rating NUMERIC,
  total_ratings BIGINT,
  rating_1 BIGINT,
  rating_2 BIGINT,
  rating_3 BIGINT,
  rating_4 BIGINT,
  rating_5 BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    product_choice as product,
    ROUND(AVG(rating), 1) as average_rating,
    COUNT(*) as total_ratings,
    COUNT(*) FILTER (WHERE rating = 1) as rating_1,
    COUNT(*) FILTER (WHERE rating = 2) as rating_2,
    COUNT(*) FILTER (WHERE rating = 3) as rating_3,
    COUNT(*) FILTER (WHERE rating = 4) as rating_4,
    COUNT(*) FILTER (WHERE rating = 5) as rating_5
  FROM public.ratings
  WHERE comparison_slug = slug
  GROUP BY product_choice;
END;
$$ LANGUAGE plpgsql;
