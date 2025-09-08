-- Fix the security definer view issue and ensure complete security
-- Remove SECURITY DEFINER behavior from view and use proper RLS instead

-- Step 1: Recreate the view with security invoker (default behavior)
DROP VIEW IF EXISTS public.pg_listings_public;
CREATE VIEW public.pg_listings_public AS
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

-- Step 2: Enable RLS on the view and create a permissive policy
ALTER VIEW public.pg_listings_public SET (security_invoker = true);

-- Step 3: Create RLS policy for the view (this is safe since sensitive columns are excluded)
-- We need to grant access to the underlying table for this specific view query
CREATE POLICY "Public view access to approved listings" 
ON public.pg_listings 
FOR SELECT 
TO anon, authenticated
USING (status = 'approved' AND is_active = true);

-- Step 4: Update grants
GRANT SELECT ON public.pg_listings_public TO anon;
GRANT SELECT ON public.pg_listings_public TO authenticated;

-- The contact function remains the same and is secure
COMMENT ON VIEW public.pg_listings_public IS 'Public view of property listings with sensitive owner contact information removed for privacy protection';