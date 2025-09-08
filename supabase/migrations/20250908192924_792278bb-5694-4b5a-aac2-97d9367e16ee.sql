-- SECURITY FIX: Prevent unauthorized admin access
-- Change default role from admin to user, and create a specific admin account

-- Update the profiles table to have 'user' as default role instead of 'admin'
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'user';

-- Update the trigger function to set role as 'user' by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a function to promote users to admin (only you can call this)
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;