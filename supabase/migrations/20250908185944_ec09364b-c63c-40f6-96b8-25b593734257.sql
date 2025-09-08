-- Create meals table
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack', 'beverage')),
  dietary_restrictions TEXT[] DEFAULT '{}',
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  calories INTEGER NOT NULL DEFAULT 0 CHECK (calories >= 0),
  protein NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (protein >= 0),
  carbs NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (carbs >= 0),
  fat NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (fat >= 0),
  availability_monday BOOLEAN NOT NULL DEFAULT false,
  availability_tuesday BOOLEAN NOT NULL DEFAULT false,
  availability_wednesday BOOLEAN NOT NULL DEFAULT false,
  availability_thursday BOOLEAN NOT NULL DEFAULT false,
  availability_friday BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Create policies - meals can be viewed by everyone, but only admins can modify
CREATE POLICY "Anyone can view meals" 
ON public.meals 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can insert meals" 
ON public.meals 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update meals" 
ON public.meals 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete meals" 
ON public.meals 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.meals (
  name, description, image, price, category, dietary_restrictions, 
  ingredients, calories, protein, carbs, fat,
  availability_monday, availability_tuesday, availability_wednesday, availability_thursday, availability_friday,
  is_available
) VALUES 
  ('Avocado Toast', 'Fresh avocado on multigrain bread with cherry tomatoes', 'breakfast-meal.jpg', 8.99, 'breakfast', 
   '{"vegetarian"}', '{"avocado", "multigrain bread", "cherry tomatoes", "olive oil", "salt", "pepper"}', 
   320, 8.5, 35.2, 18.1, true, true, true, true, true, true),
   
  ('Grilled Chicken Salad', 'Mixed greens with grilled chicken breast, cherry tomatoes, and balsamic dressing', 'lunch-meal.jpg', 12.99, 'lunch',
   '{"gluten-free"}', '{"mixed greens", "chicken breast", "cherry tomatoes", "cucumber", "red onion", "balsamic vinegar", "olive oil"}',
   285, 28.5, 12.3, 14.2, true, true, true, true, true, true),
   
  ('Salmon Teriyaki', 'Grilled salmon with teriyaki glaze, steamed rice, and vegetables', 'dinner-meal.jpg', 18.99, 'dinner',
   '{"gluten-free"}', '{"salmon fillet", "teriyaki sauce", "jasmine rice", "broccoli", "carrots", "snap peas"}',
   420, 35.2, 45.8, 12.5, true, true, true, true, true, true),
   
  ('Quinoa Buddha Bowl', 'Nutritious bowl with quinoa, roasted vegetables, and tahini dressing', 'vegetarian-meal.jpg', 14.99, 'lunch',
   '{"vegetarian", "vegan", "gluten-free"}', '{"quinoa", "sweet potato", "chickpeas", "kale", "red cabbage", "tahini", "lemon juice"}',
   380, 15.8, 52.3, 16.2, true, true, true, true, true, true);