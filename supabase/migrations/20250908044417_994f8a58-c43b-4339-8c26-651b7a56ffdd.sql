-- Fix the security definer view issue by using security invoker
-- This ensures the view uses the querying user's permissions, which is safer

-- Drop and recreate the view with proper security settings
DROP VIEW IF EXISTS public.pg_listings_public;
CREATE VIEW public.pg_listings_public WITH (security_invoker=true) AS
SELECT 
  -- Core property information (safe to expose)
  id,
  title,
  description,
  address,
  city,
  state,
  pincode,
  latitude,
  longitude,
  
  -- Property details (safe to expose)
  num_beds,
  has_ac,
  has_wifi,
  has_washing_machine,
  food_type,
  rent_per_month,
  security_deposit,
  
  -- Status and metadata (safe to expose)
  status,
  is_active,
  created_at,
  updated_at,
  approved_at
  
FROM public.pg_listings
WHERE status = 'approved' AND is_active = true;

-- Ensure proper access to the view
GRANT SELECT ON public.pg_listings_public TO anon;
GRANT SELECT ON public.pg_listings_public TO authenticated;

-- Add RLS to the view itself for extra security
ALTER VIEW public.pg_listings_public ENABLE ROW LEVEL SECURITY;

-- Create a policy for the view that allows public access
CREATE POLICY "Public can view approved listings basic info" 
ON public.pg_listings_public 
FOR SELECT 
TO public
USING (status = 'approved' AND is_active = true);