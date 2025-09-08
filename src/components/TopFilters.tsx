import { useState } from 'react';
import { MealFilters, DietaryRestriction } from '@/types/meal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Filter, X, ChevronDown, DollarSign } from 'lucide-react';

interface TopFiltersProps {
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

export const TopFilters = ({ filters, onFiltersChange, onClearFilters }: TopFiltersProps) => {
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [dietaryDropdownOpen, setDietaryDropdownOpen] = useState(false);
  const [priceFocused, setPriceFocused] = useState(false);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, category as any]
      : filters.categories.filter(c => c !== category);

    onFiltersChange({
      ...filters,
      categories: updatedCategories,
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

  const handleMaxPriceChange = (value: string) => {
    setMaxPriceInput(value);
    const numValue = parseFloat(value) || 25; // Default to 25 if empty or invalid
    const validValue = Math.min(Math.max(numValue, 0), 25); // Clamp between 0 and 25
    onFiltersChange({
      ...filters,
      maxPrice: validValue,
    });
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.dietaryRestrictions.length + 
    (filters.maxPrice < 25 ? 1 : 0);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Filters Label */}
          <div className="flex items-center gap-2 min-w-fit">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Filters</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {activeFiltersCount}
              </Badge>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Category Dropdown */}
            <DropdownMenu open={categoryDropdownOpen} onOpenChange={setCategoryDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between min-w-[140px]">
                  {filters.categories.length > 0 ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {filters.categories.length} categor{filters.categories.length === 1 ? 'y' : 'ies'}
                    </Badge>
                  ) : (
                    "Category"
                  )}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category.value}
                    checked={filters.categories.includes(category.value)}
                    onCheckedChange={(checked) => handleCategoryChange(category.value, checked)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Badge className={`${category.color} border font-normal`}>
                      {category.label}
                    </Badge>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dietary Restrictions Dropdown */}
            <DropdownMenu open={dietaryDropdownOpen} onOpenChange={setDietaryDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between min-w-[160px]">
                  {filters.dietaryRestrictions.length > 0 ? (
                    <Badge className="bg-success/10 text-success border-success/20">
                      {filters.dietaryRestrictions.length} dietary
                    </Badge>
                  ) : (
                    "Dietary"
                  )}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Dietary Restrictions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dietaryOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={filters.dietaryRestrictions.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleDietaryRestrictionChange(option.value, checked)
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Price Input */}
            <div className="flex items-center gap-2 min-w-[180px]">
              <label htmlFor="max-price" className="text-sm text-muted-foreground whitespace-nowrap">
                Max Price:
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="max-price"
                  type="text"
                  value={maxPriceInput}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                  onFocus={() => setPriceFocused(true)}
                  onBlur={() => setPriceFocused(false)}
                  className="pl-9 w-24"
                  placeholder={priceFocused ? '' : '15.00'}
                />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};