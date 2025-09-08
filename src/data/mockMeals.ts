import { Meal } from '@/types/meal';
import breakfastImage from '@/assets/breakfast-meal.jpg';
import lunchImage from '@/assets/lunch-meal.jpg';
import dinnerImage from '@/assets/dinner-meal.jpg';
import vegetarianImage from '@/assets/vegetarian-meal.jpg';

export const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Classic Pancake Stack',
    description: 'Fluffy buttermilk pancakes served with fresh berries, maple syrup, and crispy bacon strips',
    image: breakfastImage,
    price: 8.99,
    category: 'breakfast',
    dietaryRestrictions: [],
    ingredients: ['flour', 'eggs', 'milk', 'butter', 'berries', 'bacon', 'maple syrup'],
    nutrition: {
      calories: 650,
      protein: 22,
      carbs: 75,
      fat: 28
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Caesar Chicken Salad',
    description: 'Grilled chicken breast over fresh romaine lettuce with parmesan cheese, croutons, and Caesar dressing',
    image: lunchImage,
    price: 12.49,
    category: 'lunch',
    dietaryRestrictions: ['gluten-free'],
    ingredients: ['chicken breast', 'romaine lettuce', 'parmesan cheese', 'croutons', 'caesar dressing'],
    nutrition: {
      calories: 420,
      protein: 35,
      carbs: 18,
      fat: 24
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Grilled Salmon Dinner',
    description: 'Atlantic salmon fillet grilled to perfection, served with roasted seasonal vegetables and rice pilaf',
    image: dinnerImage,
    price: 16.99,
    category: 'dinner',
    dietaryRestrictions: ['gluten-free', 'dairy-free'],
    ingredients: ['salmon fillet', 'broccoli', 'carrots', 'bell peppers', 'rice', 'herbs'],
    nutrition: {
      calories: 580,
      protein: 42,
      carbs: 45,
      fat: 26
    },
    availability: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Buddha Bowl Quinoa',
    description: 'Nutritious quinoa bowl with roasted chickpeas, avocado, sweet potato, and tahini dressing',
    image: vegetarianImage,
    price: 11.99,
    category: 'lunch',
    dietaryRestrictions: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: ['quinoa', 'chickpeas', 'avocado', 'sweet potato', 'tahini', 'spinach', 'hemp seeds'],
    nutrition: {
      calories: 520,
      protein: 18,
      carbs: 62,
      fat: 22
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: 'Mediterranean Wrap',
    description: 'Whole wheat wrap filled with hummus, grilled vegetables, feta cheese, and mixed greens',
    image: lunchImage,
    price: 9.49,
    category: 'lunch',
    dietaryRestrictions: ['vegetarian'],
    ingredients: ['whole wheat wrap', 'hummus', 'zucchini', 'bell peppers', 'feta cheese', 'mixed greens'],
    nutrition: {
      calories: 380,
      protein: 16,
      carbs: 48,
      fat: 14
    },
    availability: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: true,
      friday: true
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    name: 'Avocado Toast Special',
    description: 'Multigrain toast topped with smashed avocado, cherry tomatoes, and everything bagel seasoning',
    image: breakfastImage,
    price: 7.99,
    category: 'breakfast',
    dietaryRestrictions: ['vegetarian', 'vegan'],
    ingredients: ['multigrain bread', 'avocado', 'cherry tomatoes', 'everything bagel seasoning', 'lemon'],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 32,
      fat: 18
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '7',
    name: 'BBQ Pulled Pork Sandwich',
    description: 'Slow-cooked pulled pork in BBQ sauce on a brioche bun with coleslaw and pickles',
    image: dinnerImage,
    price: 13.99,
    category: 'dinner',
    dietaryRestrictions: [],
    ingredients: ['pork shoulder', 'BBQ sauce', 'brioche bun', 'coleslaw', 'pickles'],
    nutrition: {
      calories: 680,
      protein: 38,
      carbs: 52,
      fat: 32
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: false,
      friday: true
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '8',
    name: 'Green Smoothie Bowl',
    description: 'Refreshing blend of spinach, banana, mango, and coconut milk topped with granola and berries',
    image: vegetarianImage,
    price: 6.99,
    category: 'breakfast',
    dietaryRestrictions: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: ['spinach', 'banana', 'mango', 'coconut milk', 'granola', 'mixed berries'],
    nutrition: {
      calories: 290,
      protein: 8,
      carbs: 58,
      fat: 6
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: false
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];