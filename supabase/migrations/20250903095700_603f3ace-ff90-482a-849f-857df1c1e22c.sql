-- First, let's create the missing trigger for auto-creating user profiles
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Check if there are issues with the get_user_role function causing infinite recursion
-- Let's create a safer version that avoids RLS recursion
DROP FUNCTION IF EXISTS public.get_user_role(uuid);

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  -- Use a direct query that bypasses RLS to avoid recursion
  SELECT role FROM public.profiles WHERE id = user_id LIMIT 1;
$$;