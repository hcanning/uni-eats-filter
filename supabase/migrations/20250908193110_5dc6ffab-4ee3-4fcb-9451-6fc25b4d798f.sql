-- SECURITY: Create single admin user and disable public signups
-- Insert the specific admin user (howard@canning.dev) 
-- Note: The actual user creation will be done through Supabase Auth

-- Create a function to check if email is the authorized admin
CREATE OR REPLACE FUNCTION public.is_authorized_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_email = 'howard@canning.dev';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update the new user function to only allow the authorized admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow howard@canning.dev to get admin role
  IF NEW.email = 'howard@canning.dev' THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'admin');
  ELSE
    -- Reject all other signups by raising an exception
    RAISE EXCEPTION 'Unauthorized registration attempt. This system is restricted to authorized personnel only.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;