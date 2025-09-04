-- Add missing columns to profiles table for storing additional signup data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS organization_name TEXT,
ADD COLUMN IF NOT EXISTS property_count INTEGER;

-- Update the handle_new_user function to store additional signup data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role, organization_name, property_count)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role),
    NEW.raw_user_meta_data->>'organization_name',
    CASE 
      WHEN NEW.raw_user_meta_data->>'property_count' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'property_count')::INTEGER 
      ELSE NULL 
    END
  );
  RETURN NEW;
END;
$$;