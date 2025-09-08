-- Temporarily allow public access for testing
-- Update policies to allow anyone to modify meals for now
DROP POLICY "Only authenticated users can insert meals" ON public.meals;
DROP POLICY "Only authenticated users can update meals" ON public.meals;  
DROP POLICY "Only authenticated users can delete meals" ON public.meals;

-- Create temporary policies that allow anyone to modify meals
CREATE POLICY "Anyone can insert meals (temporary)" 
ON public.meals 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update meals (temporary)" 
ON public.meals 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete meals (temporary)" 
ON public.meals 
FOR DELETE 
USING (true);