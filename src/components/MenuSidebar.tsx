import { useState } from 'react';
import { MealFilters, DietaryRestriction } from '@/types/meal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface MenuSidebarProps {
  filters: MealFilters;
  onFiltersChange: (filters: MealFilters) => void;
  onClearFilters: () => void;
}

const categories = [
  { value: 'breakfast', label: 'Breakfast', color: 'bg-category-breakfast/10 text-category-breakfast' },
  { value: 'lunch', label: 'Lunch', color: 'bg-category-lunch/10 text-category-lunch' },
  { value: 'dinner', label: 'Dinner', color: 'bg-category-dinner/10 text-category-dinner' },
  { value: 'snack', label: 'Snack', color: 'bg-category-snack/10 text-category-snack' },
  { value: 'beverage', label: 'Beverage', color: 'bg-category-beverage/10 text-category-beverage' },
] as const;

const dietaryOptions: { value: DietaryRestriction; label: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'nut-free', label: 'Nut-Free' },
  { value: 'keto', label: 'Keto' },
  { value: 'low-sodium', label: 'Low Sodium' },
];

export const MenuSidebar = ({ filters, onFiltersChange, onClearFilters }: MenuSidebarProps) => {
  const [priceRange, setPriceRange] = useState([filters.priceRange.min, filters.priceRange.max]);

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? null : category as any,
    });
  };

  const handleDietaryRestrictionChange = (restriction: DietaryRestriction, checked: boolean) => {
    const updatedRestrictions = checked
      ? [...filters.dietaryRestrictions, restriction]
      : filters.dietaryRestrictions.filter(r => r !== restriction);

    onFiltersChange({
      ...filters,
      dietaryRestrictions: updatedRestrictions,
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    onFiltersChange({
      ...filters,
      priceRange: { min: value[0], max: value[1] },
    });
  };

  const activeFiltersCount = 
    (filters.category ? 1 : 0) + 
    filters.dietaryRestrictions.length + 
    (filters.priceRange.min > 0 || filters.priceRange.max < 25 ? 1 : 0);

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-sidebar-foreground" />
          <h2 className="text-lg font-semibold text-sidebar-foreground">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={category.value}
                checked={filters.category === category.value}
                onCheckedChange={() => handleCategoryChange(category.value)}
              />
              <Label htmlFor={category.value} className="flex-1 cursor-pointer">
                <Badge className={`${category.color} border font-normal`}>
                  {category.label}
                </Badge>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Dietary Restrictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dietaryOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={filters.dietaryRestrictions.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleDietaryRestrictionChange(option.value, checked as boolean)
                }
              />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={25}
              min={0}
              step={0.5}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${priceRange[0].toFixed(2)}</span>
              <span>${priceRange[1].toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};