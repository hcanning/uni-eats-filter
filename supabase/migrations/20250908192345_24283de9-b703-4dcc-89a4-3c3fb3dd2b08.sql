-- SECURITY FIX: Remove dangerous temporary policies and implement secure authentication-based policies

-- Drop the insecure temporary policies
DROP POLICY "Anyone can insert meals (temporary)" ON public.meals;
DROP POLICY "Anyone can update meals (temporary)" ON public.meals;
DROP POLICY "Anyone can delete meals (temporary)" ON public.meals;

-- Create secure authentication-based policies
CREATE POLICY "Only authenticated admins can insert meals" 
ON public.meals 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only authenticated admins can update meals" 
ON public.meals 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only authenticated admins can delete meals" 
ON public.meals 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);