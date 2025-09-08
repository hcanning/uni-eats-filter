export interface Meal {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage';
  dietaryRestrictions: DietaryRestriction[];
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
  };
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type DietaryRestriction = 
  | 'vegetarian' 
  | 'vegan' 
  | 'gluten-free' 
  | 'dairy-free' 
  | 'nut-free' 
  | 'keto' 
  | 'low-sodium';

export interface MealFilters {
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage' | null;
  dietaryRestrictions: DietaryRestriction[];
  maxPrice: number;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
}

export interface MealFormData {
  name: string;
  description: string;
  image: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage';
  dietaryRestrictions: DietaryRestriction[];
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
  };
}