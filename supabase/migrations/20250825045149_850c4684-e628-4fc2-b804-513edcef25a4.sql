-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('user', 'pg_owner', 'admin');

-- Create profiles table for user information and roles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PG listings table
CREATE TABLE public.pg_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Amenities
  num_beds INTEGER NOT NULL CHECK (num_beds > 0),
  has_ac BOOLEAN NOT NULL DEFAULT false,
  has_wifi BOOLEAN NOT NULL DEFAULT false,
  has_washing_machine BOOLEAN NOT NULL DEFAULT false,
  food_type TEXT CHECK (food_type IN ('veg', 'non_veg', 'both')),
  
  -- Pricing
  rent_per_month DECIMAL(10, 2) NOT NULL CHECK (rent_per_month > 0),
  security_deposit DECIMAL(10, 2),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.profiles(id)
);

-- Create PG images table
CREATE TABLE public.pg_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pg_listing_id UUID NOT NULL REFERENCES public.pg_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for PG images
INSERT INTO storage.buckets (id, name, public) VALUES ('pg-images', 'pg-images', true);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pg_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pg_images ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- PG listings RLS policies
CREATE POLICY "Anyone can view approved listings" ON public.pg_listings
  FOR SELECT USING (status = 'approved' AND is_active = true);

CREATE POLICY "Admins can view all listings" ON public.pg_listings
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "PG owners can view their own listings" ON public.pg_listings
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "PG owners can create listings" ON public.pg_listings
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND 
    public.get_user_role(auth.uid()) = 'pg_owner'
  );

CREATE POLICY "PG owners can update their own pending listings" ON public.pg_listings
  FOR UPDATE USING (
    owner_id = auth.uid() AND 
    status = 'pending' AND
    public.get_user_role(auth.uid()) = 'pg_owner'
  );

CREATE POLICY "Admins can update any listing" ON public.pg_listings
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can delete any listing" ON public.pg_listings
  FOR DELETE USING (public.get_user_role(auth.uid()) = 'admin');

-- PG images RLS policies
CREATE POLICY "Anyone can view images of approved listings" ON public.pg_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pg_listings 
      WHERE id = pg_listing_id 
      AND status = 'approved' 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can view all images" ON public.pg_images
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "PG owners can view images of their listings" ON public.pg_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pg_listings 
      WHERE id = pg_listing_id 
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "PG owners can insert images for their listings" ON public.pg_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pg_listings 
      WHERE id = pg_listing_id 
      AND owner_id = auth.uid()
      AND public.get_user_role(auth.uid()) = 'pg_owner'
    )
  );

CREATE POLICY "PG owners can delete images of their listings" ON public.pg_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.pg_listings 
      WHERE id = pg_listing_id 
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all images" ON public.pg_images
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Storage policies for PG images
CREATE POLICY "Anyone can view PG images" ON storage.objects
  FOR SELECT USING (bucket_id = 'pg-images');

CREATE POLICY "PG owners can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'pg-images' AND
    public.get_user_role(auth.uid()) = 'pg_owner'
  );

CREATE POLICY "PG owners can update their images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'pg-images' AND
    public.get_user_role(auth.uid()) = 'pg_owner'
  );

CREATE POLICY "PG owners can delete their images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'pg-images' AND
    public.get_user_role(auth.uid()) = 'pg_owner'
  );

CREATE POLICY "Admins can manage all PG images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'pg-images' AND
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pg_listings_updated_at
  BEFORE UPDATE ON public.pg_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();