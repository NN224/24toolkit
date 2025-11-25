-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT CHECK (LENGTH(bio) <= 500),
  location TEXT,
  website TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comparison_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comparison_slug)
);

-- Create user comparison history table
CREATE TABLE IF NOT EXISTS public.user_comparison_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comparison_slug TEXT NOT NULL,
  ip_address TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_comparison_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user profiles
CREATE POLICY "Anyone can view profiles" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for history
CREATE POLICY "Users can view their own history" ON public.user_comparison_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert history" ON public.user_comparison_history
  FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_comparison_slug ON public.user_favorites(comparison_slug);
CREATE INDEX idx_user_history_user_id ON public.user_comparison_history(user_id);
CREATE INDEX idx_user_history_viewed_at ON public.user_comparison_history(viewed_at DESC);

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();
