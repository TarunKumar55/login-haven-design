-- FINAL FIX: Remove all public access to the main pg_listings table
-- Public users should ONLY access data through the pg_listings_public view

-- Drop the policy that still allows public SELECT access to all columns
DROP POLICY IF EXISTS "Public view access to basic listing info only" ON public.pg_listings;

-- Now the pg_listings table policies are:
-- 1. Admin policies - full access for admins
-- 2. Owner policies - owners can manage their own listings  
-- 3. NO public access to the main table at all

-- Public users can ONLY access listings through:
-- - The pg_listings_public view (which excludes sensitive fields)
-- - The get_listing_contact_info function (for authenticated users only)

-- Ensure the public view is properly accessible
GRANT SELECT ON public.pg_listings_public TO anon;
GRANT SELECT ON public.pg_listings_public TO authenticated;

-- Add a comment explaining the security model
COMMENT ON TABLE public.pg_listings IS 'Main listings table with sensitive owner data. Public access restricted. Use pg_listings_public view for public data and get_listing_contact_info() function for authenticated contact access.';