-- Update calories column to allow decimals
ALTER TABLE public.meals 
ALTER COLUMN calories TYPE NUMERIC(6,2);