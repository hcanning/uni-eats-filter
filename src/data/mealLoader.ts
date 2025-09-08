import { Meal } from '@/types/meal';
import breakfastImage from '@/assets/breakfast-meal.jpg';
import lunchImage from '@/assets/lunch-meal.jpg';
import dinnerImage from '@/assets/dinner-meal.jpg';
import vegetarianImage from '@/assets/vegetarian-meal.jpg';
import mealsData from './meals.json';

// Map image filenames to actual imports
const imageMap: Record<string, string> = {
  'breakfast-meal.jpg': breakfastImage,
  'lunch-meal.jpg': lunchImage,
  'dinner-meal.jpg': dinnerImage,
  'vegetarian-meal.jpg': vegetarianImage,
};

// Convert JSON data to properly typed Meal objects
export const loadMeals = (): Meal[] => {
  return mealsData.map((mealData: any) => ({
    ...mealData,
    image: imageMap[mealData.image] || mealData.image,
    createdAt: new Date(mealData.createdAt),
    updatedAt: new Date(mealData.updatedAt),
  }));
};

export const mockMeals = loadMeals();