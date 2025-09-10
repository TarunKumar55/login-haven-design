-- Remove the policy that allows authenticated users direct access to contact details
-- Contact information should ONLY be accessible through the get_listing_contact_info function
DROP POLICY IF EXISTS "Authenticated users can view listing contact details" ON public.pg_listings;

-- The remaining policies are now:
-- 1. "Public view access to basic listing info only" - allows public to see basic info only
-- 2. Admin policies - allow admins full access
-- 3. Owner policies - allow owners to manage their own listings
-- 4. Contact info is ONLY accessible via get_listing_contact_info function for authenticated users

-- Verify the pg_listings_public view excludes sensitive information
-- and ensure it's the recommended way for public access
COMMENT ON VIEW public.pg_listings_public IS 'Public-safe view of listings that excludes sensitive owner contact information. Use this view for public listing displays instead of the main pg_listings table.';