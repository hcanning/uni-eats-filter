import { Meal } from '@/types/meal';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Users } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
}

export const MealCard = ({ meal }: MealCardProps) => {
  const getDietaryBadgeVariant = (restriction: string) => {
    switch (restriction) {
      case 'vegetarian':
      case 'vegan':
        return 'dietary-badge vegetarian';
      case 'gluten-free':
        return 'dietary-badge gluten-free';
      case 'dairy-free':
        return 'dietary-badge dairy-free';
      default:
        return 'dietary-badge';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breakfast':
        return 'bg-category-breakfast/10 text-category-breakfast border-category-breakfast/20';
      case 'lunch':
        return 'bg-category-lunch/10 text-category-lunch border-category-lunch/20';
      case 'dinner':
        return 'bg-category-dinner/10 text-category-dinner border-category-dinner/20';
      case 'snack':
        return 'bg-category-snack/10 text-category-snack border-category-snack/20';
      case 'beverage':
        return 'bg-category-beverage/10 text-category-beverage border-category-beverage/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="meal-card group">
      <div className="relative overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${getCategoryColor(meal.category)} border font-medium capitalize`}>
            {meal.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/90 text-foreground font-semibold">
            ${meal.price.toFixed(2)}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1">{meal.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{meal.description}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {meal.dietaryRestrictions.map((restriction) => (
            <span key={restriction} className={getDietaryBadgeVariant(restriction)}>
              {restriction}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{meal.nutrition.calories} cal</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span className="price-range">${meal.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Protein: {meal.nutrition.protein}g</span>
            <span>Carbs: {meal.nutrition.carbs}g</span>
            <span>Fat: {meal.nutrition.fat}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};