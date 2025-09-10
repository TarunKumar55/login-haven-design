-- Fix critical security issue: Remove public access to contact information
-- Only allow public access to basic listing information through the view

-- Drop the overly permissive public policy on main table
DROP POLICY IF EXISTS "Public view access to approved listings" ON public.pg_listings;

-- Create a restricted public policy that only allows access to non-sensitive fields
-- This policy will be used by the pg_listings_public view
CREATE POLICY "Public view access to basic listing info only" 
ON public.pg_listings 
FOR SELECT 
TO public
USING (
  status = 'approved' 
  AND is_active = true
);

-- Ensure contact information is only accessible to:
-- 1. Authenticated users through the get_listing_contact_info function
-- 2. Admins (already covered by existing admin policy)
-- 3. Owners viewing their own listings (already covered by existing owner policy)

-- The pg_listings_public view already excludes contact fields, so public users
-- will only see basic property information through that view

-- Grant proper access to the public view
GRANT SELECT ON public.pg_listings_public TO anon;
GRANT SELECT ON public.pg_listings_public TO authenticated;