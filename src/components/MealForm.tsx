import { useState } from 'react';
import { Meal, MealFormData, DietaryRestriction } from '@/types/meal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MealFormProps {
  meal?: Meal;
  onSubmit: (data: MealFormData) => void;
  onCancel: () => void;
}

const dietaryOptions: { value: DietaryRestriction; label: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'nut-free', label: 'Nut-Free' },
  { value: 'keto', label: 'Keto' },
  { value: 'low-sodium', label: 'Low Sodium' },
];

const categories = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
  { value: 'beverage', label: 'Beverage' },
] as const;

export const MealForm = ({ meal, onSubmit, onCancel }: MealFormProps) => {
  const [formData, setFormData] = useState<MealFormData>({
    name: meal?.name || '',
    description: meal?.description || '',
    image: meal?.image || '',
    price: meal?.price || 0,
    category: meal?.category || 'lunch',
    dietaryRestrictions: meal?.dietaryRestrictions || [],
    ingredients: meal?.ingredients || [],
    nutrition: meal?.nutrition || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
    availability: meal?.availability || {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
    },
  });

  const [ingredientsText, setIngredientsText] = useState(
    meal?.ingredients.join(', ') || ''
  );

  const handleInputChange = (field: keyof MealFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNutritionChange = (field: keyof MealFormData['nutrition'], value: number) => {
    setFormData(prev => ({
      ...prev,
      nutrition: { ...prev.nutrition, [field]: value }
    }));
  };

  const handleAvailabilityChange = (day: keyof MealFormData['availability'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: { ...prev.availability, [day]: checked }
    }));
  };

  const handleDietaryRestrictionChange = (restriction: DietaryRestriction, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, restriction]
        : prev.dietaryRestrictions.filter(r => r !== restriction)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = ingredientsText.split(',').map(item => item.trim()).filter(Boolean);
    onSubmit({ ...formData, ingredients });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Meal Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => handleInputChange('image', e.target.value)}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
          <Input
            id="ingredients"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="chicken, lettuce, tomato, etc."
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nutrition Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              min="0"
              value={formData.nutrition.calories}
              onChange={(e) => handleNutritionChange('calories', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              min="0"
              value={formData.nutrition.protein}
              onChange={(e) => handleNutritionChange('protein', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input
              id="carbs"
              type="number"
              min="0"
              value={formData.nutrition.carbs}
              onChange={(e) => handleNutritionChange('carbs', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fat">Fat (g)</Label>
            <Input
              id="fat"
              type="number"
              min="0"
              value={formData.nutrition.fat}
              onChange={(e) => handleNutritionChange('fat', parseInt(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dietary Restrictions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {dietaryOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`dietary-${option.value}`}
                checked={formData.dietaryRestrictions.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleDietaryRestrictionChange(option.value, checked as boolean)
                }
              />
              <Label htmlFor={`dietary-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Availability</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(formData.availability).map(([day, available]) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day}`}
                checked={available}
                onCheckedChange={(checked) => 
                  handleAvailabilityChange(day as keyof MealFormData['availability'], checked as boolean)
                }
              />
              <Label htmlFor={`day-${day}`} className="text-sm capitalize">
                {day}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {meal ? 'Update Meal' : 'Create Meal'}
        </Button>
      </div>
    </form>
  );
};