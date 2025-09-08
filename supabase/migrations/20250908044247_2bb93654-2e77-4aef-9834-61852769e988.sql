-- SECURITY FIX: Completely restrict public access to sensitive owner contact information
-- This implements a proper column-level security approach

-- Step 1: Remove the permissive public policy that still exposes sensitive data
DROP POLICY IF EXISTS "Public can view basic approved listing info" ON public.pg_listings;

-- Step 2: Create a secure public view that ONLY exposes non-sensitive columns
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
  
  -- DELIBERATELY EXCLUDED: owner_name, owner_phone, owner_email, owner_address, owner_id
  
FROM public.pg_listings
WHERE status = 'approved' AND is_active = true;

-- Step 3: Set up proper access control
-- Anonymous users can only access the safe public view
GRANT SELECT ON public.pg_listings_public TO anon;
GRANT SELECT ON public.pg_listings_public TO authenticated;

-- Step 4: Create a secure function for authenticated users to get contact info
CREATE OR REPLACE FUNCTION public.get_listing_contact_info(listing_id UUID)
RETURNS TABLE (
  id UUID,
  owner_name TEXT,
  owner_phone TEXT,
  owner_email TEXT,
  owner_address TEXT
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  -- Only return contact info if user is authenticated
  SELECT 
    pg_listings.id,
    pg_listings.owner_name,
    pg_listings.owner_phone,
    pg_listings.owner_email,
    pg_listings.owner_address
  FROM public.pg_listings
  WHERE pg_listings.id = listing_id
    AND pg_listings.status = 'approved'
    AND pg_listings.is_active = true
    AND auth.uid() IS NOT NULL; -- Must be authenticated
$$;

-- Step 5: Grant access to the contact function only to authenticated users
REVOKE ALL ON FUNCTION public.get_listing_contact_info FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_listing_contact_info TO authenticated;

-- Step 6: Ensure no public access to the main table for sensitive data
-- The existing policies for authenticated users, admins, and owners remain intact
-- But no new public policies will be added

COMMENT ON VIEW public.pg_listings_public IS 'Public view of property listings with sensitive owner contact information removed for privacy protection';
COMMENT ON FUNCTION public.get_listing_contact_info IS 'Secure function to retrieve owner contact information for authenticated users only';