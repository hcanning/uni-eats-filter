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

const STORAGE_KEY = 'meals_data';

// Convert JSON data to properly typed Meal objects
const convertJsonToMeals = (data: any[]): Meal[] => {
  return data.map((mealData: any) => ({
    ...mealData,
    image: imageMap[mealData.image] || mealData.image,
    createdAt: new Date(mealData.createdAt),
    updatedAt: new Date(mealData.updatedAt),
  }));
};

// Save meals to localStorage (never modifies the JSON file)
export const saveMealsToStorage = (meals: Meal[]): void => {
  const mealsForStorage = meals.map(meal => ({
    ...meal,
    createdAt: meal.createdAt.toISOString(),
    updatedAt: meal.updatedAt.toISOString(),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mealsForStorage));
};

// Load meals from localStorage or fallback to JSON file
export const loadMealsFromStorage = (): Meal[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedData = JSON.parse(stored);
      return convertJsonToMeals(parsedData);
    }
  } catch (error) {
    console.warn('Failed to load meals from localStorage, falling back to JSON file');
  }
  
  // Fallback to original JSON file (read-only)
  return convertJsonToMeals(mealsData);
};

// Initial load - this is the main export
export const mockMeals = loadMealsFromStorage();