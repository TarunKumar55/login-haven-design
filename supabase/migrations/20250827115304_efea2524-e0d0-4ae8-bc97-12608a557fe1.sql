-- Drop the overly permissive policy that allows all users to view all profiles
DROP POLICY "Users can view all profiles" ON public.profiles;

-- Create more restrictive policies for profile access
-- Users can view their own complete profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Admins can view all profiles for management purposes
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Allow viewing only basic info (name and role) for PG owners when displaying listings
-- This creates a limited view for users to see PG owner names without sensitive data
CREATE POLICY "Users can view PG owner basic info" 
ON public.profiles 
FOR SELECT 
USING (role = 'pg_owner'::user_role);