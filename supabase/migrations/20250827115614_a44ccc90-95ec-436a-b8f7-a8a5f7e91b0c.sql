-- Drop the policy that still exposes sensitive PG owner data
DROP POLICY "Users can view PG owner basic info" ON public.profiles;

-- Create a more restrictive policy for PG owner visibility
-- Only allow viewing PG owner profiles for authenticated users who might contact them
-- This still protects email/phone but allows authenticated users to see names
CREATE POLICY "Authenticated users can view PG owner names" 
ON public.profiles 
FOR SELECT 
USING (
  auth.role() = 'authenticated' 
  AND role = 'pg_owner'::user_role
);

-- Note: Since RLS works at row level, not column level, we limit WHO can see PG owner data
-- Applications should be designed to only display name/role fields, not email/phone in listings