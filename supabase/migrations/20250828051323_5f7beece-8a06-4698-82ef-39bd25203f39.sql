-- Add explicit policy to deny anonymous access to profiles table
-- This prevents any potential public access to sensitive user data
CREATE POLICY "Deny anonymous access to profiles" 
ON public.profiles 
FOR ALL 
TO anon 
USING (false);