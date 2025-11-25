-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_choice TEXT NOT NULL CHECK (product_choice IN ('A', 'B')),
  current_price NUMERIC(10, 2),
  currency TEXT DEFAULT 'USD',
  affiliate_link TEXT,
  image_url TEXT,
  brand TEXT,
  model TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comparison_slug, product_choice)
);

-- Create price history table
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price alerts table
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  target_price NUMERIC(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

-- RLS Policies for price history (public read)
CREATE POLICY "Anyone can view price history" ON public.price_history
  FOR SELECT USING (true);

-- RLS Policies for price alerts (users can manage their own)
CREATE POLICY "Users can view their own alerts" ON public.price_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts" ON public.price_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" ON public.price_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" ON public.price_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_products_comparison_slug ON public.products(comparison_slug);
CREATE INDEX idx_price_history_product_id ON public.price_history(product_id);
CREATE INDEX idx_price_history_created_at ON public.price_history(created_at DESC);
CREATE INDEX idx_price_alerts_product_id ON public.price_alerts(product_id);
CREATE INDEX idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX idx_price_alerts_is_active ON public.price_alerts(is_active);

-- Create trigger to add price to history when product price changes
CREATE OR REPLACE FUNCTION track_price_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_price IS DISTINCT FROM OLD.current_price THEN
    INSERT INTO public.price_history (product_id, price, currency, source)
    VALUES (NEW.id, NEW.current_price, NEW.currency, 'manual_update');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_price_change
AFTER UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION track_price_change();

-- Create function to get price trend
CREATE OR REPLACE FUNCTION get_price_trend(prod_id UUID, days INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  price NUMERIC,
  currency TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    AVG(price) as price,
    currency
  FROM public.price_history
  WHERE product_id = prod_id 
    AND created_at >= NOW() - (days || ' days')::INTERVAL
  GROUP BY DATE(created_at), currency
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;
