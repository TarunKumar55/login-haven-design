-- Fix the profile insertion policy to allow PG owners and admins to insert their profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create new policy that allows users to insert with any role as long as it's their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Also ensure the trigger can properly insert profiles for any role
-- The handle_new_user trigger should work with this policy fix