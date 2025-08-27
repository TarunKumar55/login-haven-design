-- Remove the policy that still allows authenticated users to view PG owner profiles
-- This completely prevents access to PG owner personal information (email, phone)
DROP POLICY "Authenticated users can view PG owner names" ON public.profiles;

-- The remaining policies are now fully secure:
-- 1. Users can only view their own complete profile
-- 2. Admins can view all profiles for management purposes

-- Note: Applications should not display PG owner contact information in listings
-- If owner names are needed for listings, consider storing just the display name 
-- in the pg_listings table directly rather than exposing the full profile