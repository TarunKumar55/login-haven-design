-- Temporarily disable the role escalation trigger to update your account to admin
ALTER TABLE public.profiles DISABLE TRIGGER prevent_role_escalation_trigger;

-- Update your current user account to admin role
UPDATE public.profiles 
SET role = 'admin'::user_role 
WHERE id = '707ce34e-8668-4b44-822a-aac1865f18ba';

-- Re-enable the trigger
ALTER TABLE public.profiles ENABLE TRIGGER prevent_role_escalation_trigger;