-- Drop existing SELECT policy to recreate it more comprehensively
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a comprehensive SELECT policy that ensures proper access control
CREATE POLICY "Users can only view their own profile data" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Create a separate policy for admins to view all profiles (for legitimate admin functions)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);