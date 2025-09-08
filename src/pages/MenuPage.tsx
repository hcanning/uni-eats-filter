import { useState, useMemo, useEffect } from 'react';
import { MealFilters, Meal } from '@/types/meal';
import { mealsService } from '@/services/mealsService';
import { MenuSidebar } from '@/components/MenuSidebar';
import { MealCard } from '@/components/MealCard';
import { DayTabs } from '@/components/DayTabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const getCurrentDay = (): 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
  
  // If it's weekend (0 = Sunday, 6 = Saturday), default to Monday
  if (today === 0 || today === 6) {
    return 'monday';
  }
  
  // Convert to our day format (Monday = 1, so today-1)
  return weekdays[today - 1];
};

const MenuPage = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [filters, setFilters] = useState<MealFilters>({
    category: null,
    dietaryRestrictions: [],
    maxPrice: 25,
    day: getCurrentDay(),
  });

  // Load meals on component mount
  useEffect(() => {
    const loadMeals = async () => {
      try {
        setLoading(true);
        const mealsData = await mealsService.getAllMeals();
        setMeals(mealsData);
      } catch (error) {
        console.error('Failed to load meals:', error);
        toast({
          title: "Error",
          description: "Failed to load meals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, [toast]);

  const filteredMeals = useMemo(() => {
    console.log('Filtering meals:', { 
      totalMeals: meals.length, 
      selectedDay: filters.day,
      meals: meals.map(m => ({ name: m.name, availability: m.availability }))
    });
    
    return meals.filter((meal) => {
      // Filter by day availability
      const dayAvailable = meal.availability[filters.day];
      console.log(`Meal ${meal.name} - ${filters.day} availability:`, dayAvailable);
      if (!dayAvailable) return false;
      
      // Filter by category
      if (filters.category && meal.category !== filters.category) return false;
      
      // Filter by dietary restrictions
      if (filters.dietaryRestrictions.length > 0) {
        const hasAllRestrictions = filters.dietaryRestrictions.every(
          restriction => meal.dietaryRestrictions.includes(restriction)
        );
        if (!hasAllRestrictions) return false;
      }
      
      // Filter by max price
      if (meal.price > filters.maxPrice) {
        return false;
      }
      
      return true;
    });
  }, [meals, filters]);

  const handleClearFilters = () => {
    setFilters({
      category: null,
      dietaryRestrictions: [],
      maxPrice: 25,
      day: filters.day, // Keep the current day
    });
  };

  const handleDayChange = (day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday') => {
    setFilters(prev => ({ ...prev, day }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <MenuSidebar
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">University Cafeteria</h1>
                <p className="text-muted-foreground">Fresh meals for every taste</p>
              </div>
            </div>
            <Link to="/auth">
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Admin Login
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {filters.day === getCurrentDay() ? "Today's Menu" : "Menu"} - {filters.day.charAt(0).toUpperCase() + filters.day.slice(1)}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-medium">
                    {filteredMeals.length} meal{filteredMeals.length !== 1 ? 's' : ''} available
                  </Badge>
                  {filters.category && (
                    <Badge className="capitalize bg-primary/10 text-primary border-primary/20">
                      {filters.category}
                    </Badge>
                  )}
                  {filters.dietaryRestrictions.length > 0 && (
                    <Badge className="bg-success/10 text-success border-success/20">
                      {filters.dietaryRestrictions.length} dietary filter{filters.dietaryRestrictions.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="w-full sm:w-auto">
                <DayTabs selectedDay={filters.day} onDayChange={handleDayChange} />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-lg font-medium text-muted-foreground mb-4">Loading meals...</div>
              </div>
            ) : filteredMeals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ChefHat className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No meals found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or selecting a different day
                </p>
                <Button onClick={handleClearFilters}>Clear all filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMeals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MenuPage;