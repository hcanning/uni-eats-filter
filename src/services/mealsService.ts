import { supabase } from '@/integrations/supabase/client';
import { Meal, MealFormData, DietaryRestriction } from '@/types/meal';
import breakfastImage from '@/assets/breakfast-meal.jpg';
import lunchImage from '@/assets/lunch-meal.jpg';
import dinnerImage from '@/assets/dinner-meal.jpg';
import vegetarianImage from '@/assets/vegetarian-meal.jpg';

// Map image filenames to actual imports
const imageMap: Record<string, string> = {
  'breakfast-meal.jpg': breakfastImage,
  'lunch-meal.jpg': lunchImage,
  'dinner-meal.jpg': dinnerImage,
  'vegetarian-meal.jpg': vegetarianImage,
};

// Convert database row to Meal object
const convertDbRowToMeal = (row: any): Meal => ({
  id: row.id,
  name: row.name,
  description: row.description,
  image: imageMap[row.image] || row.image,
  price: parseFloat(row.price),
  category: row.category,
  dietaryRestrictions: row.dietary_restrictions as DietaryRestriction[],
  ingredients: row.ingredients,
  nutrition: {
    calories: parseFloat(row.calories),
    protein: parseFloat(row.protein),
    carbs: parseFloat(row.carbs),
    fat: parseFloat(row.fat),
  },
  availability: {
    monday: row.availability_monday,
    tuesday: row.availability_tuesday,
    wednesday: row.availability_wednesday,
    thursday: row.availability_thursday,
    friday: row.availability_friday,
  },
  isAvailable: row.is_available,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

// Convert Meal to database format
const convertMealToDbFormat = (meal: MealFormData) => ({
  name: meal.name,
  description: meal.description,
  image: meal.image,
  price: meal.price,
  category: meal.category,
  dietary_restrictions: meal.dietaryRestrictions,
  ingredients: meal.ingredients,
  calories: meal.nutrition.calories,
  protein: meal.nutrition.protein,
  carbs: meal.nutrition.carbs,
  fat: meal.nutrition.fat,
  availability_monday: meal.availability.monday,
  availability_tuesday: meal.availability.tuesday,
  availability_wednesday: meal.availability.wednesday,
  availability_thursday: meal.availability.thursday,
  availability_friday: meal.availability.friday,
});

export const mealsService = {
  // Fetch all meals
  async getAllMeals(): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching meals:', error);
      throw new Error('Failed to fetch meals');
    }

    return data?.map(convertDbRowToMeal) || [];
  },

  // Create a new meal
  async createMeal(mealData: MealFormData): Promise<Meal> {
    const dbData = convertMealToDbFormat(mealData);
    
    const { data, error } = await supabase
      .from('meals')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('Error creating meal:', error);
      throw new Error('Failed to create meal');
    }

    return convertDbRowToMeal(data);
  },

  // Update an existing meal
  async updateMeal(id: string, mealData: MealFormData): Promise<Meal> {
    const dbData = convertMealToDbFormat(mealData);
    
    const { data, error } = await supabase
      .from('meals')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating meal:', error);
      throw new Error('Failed to update meal');
    }

    return convertDbRowToMeal(data);
  },

  // Delete a meal
  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting meal:', error);
      throw new Error('Failed to delete meal');
    }
  },

  // Toggle meal availability
  async toggleMealAvailability(id: string, isAvailable: boolean): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .update({ is_available: isAvailable })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling meal availability:', error);
      throw new Error('Failed to toggle meal availability');
    }

    return convertDbRowToMeal(data);
  },
};