import { useState, useEffect } from 'react';
import { mockMeals, saveMealsToStorage, loadMealsFromStorage } from '@/data/mealLoader';
import { Meal, MealFormData } from '@/types/meal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, ArrowLeft, Search, Filter, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MealForm } from '@/components/MealForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const [meals, setMeals] = useState<Meal[]>(loadMealsFromStorage());

  // Save to localStorage whenever meals change
  useEffect(() => {
    saveMealsToStorage(meals);
  }, [meals]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage'];

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || meal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateMeal = (formData: MealFormData) => {
    const newMeal: Meal = {
      ...formData,
      id: Date.now().toString(),
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setMeals([...meals, newMeal]);
    setIsFormOpen(false);
    toast({
      title: "Meal created",
      description: `${newMeal.name} has been added to the menu.`,
    });
  };

  const handleUpdateMeal = (formData: MealFormData) => {
    if (!editingMeal) return;
    
    const updatedMeal: Meal = {
      ...editingMeal,
      ...formData,
      updatedAt: new Date(),
    };
    
    setMeals(meals.map(meal => meal.id === editingMeal.id ? updatedMeal : meal));
    setEditingMeal(null);
    toast({
      title: "Meal updated",
      description: `${updatedMeal.name} has been updated.`,
    });
  };

  const handleDeleteMeal = (mealId: string) => {
    const meal = meals.find(m => m.id === mealId);
    setMeals(meals.filter(meal => meal.id !== mealId));
    toast({
      title: "Meal deleted",
      description: `${meal?.name} has been removed from the menu.`,
      variant: "destructive",
    });
  };

  const toggleMealAvailability = (mealId: string) => {
    setMeals(meals.map(meal => 
      meal.id === mealId 
        ? { ...meal, isAvailable: !meal.isAvailable, updatedAt: new Date() }
        : meal
    ));
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
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your cafeteria menu</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Meal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Meal</DialogTitle>
                </DialogHeader>
                <MealForm onSubmit={handleCreateMeal} onCancel={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={logout} className="gap-2 text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{meals.length}</div>
                  <div className="text-sm text-muted-foreground">Total Meals</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{meals.filter(m => m.isAvailable).length}</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{meals.filter(m => !m.isAvailable).length}</div>
                  <div className="text-sm text-muted-foreground">Unavailable</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{meals.filter(m => m.dietaryRestrictions.includes('vegetarian')).length}</div>
                  <div className="text-sm text-muted-foreground">Vegetarian</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter & Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search meals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meals List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Meals ({filteredMeals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMeals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{meal.name}</h3>
                          <Badge className={`${getCategoryColor(meal.category)} border capitalize`}>
                            {meal.category}
                          </Badge>
                          <Badge variant={meal.isAvailable ? "default" : "secondary"}>
                            {meal.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{meal.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-primary">${meal.price.toFixed(2)}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{meal.nutrition.calories} cal</span>
                          {meal.dietaryRestrictions.length > 0 && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <div className="flex gap-1">
                                {meal.dietaryRestrictions.slice(0, 2).map((restriction) => (
                                  <Badge key={restriction} variant="outline" className="text-xs">
                                    {restriction}
                                  </Badge>
                                ))}
                                {meal.dietaryRestrictions.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{meal.dietaryRestrictions.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleMealAvailability(meal.id)}
                      >
                        {meal.isAvailable ? 'Disable' : 'Enable'}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingMeal(meal)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Meal</DialogTitle>
                          </DialogHeader>
                          {editingMeal && (
                            <MealForm 
                              meal={editingMeal}
                              onSubmit={handleUpdateMeal}
                              onCancel={() => setEditingMeal(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMeal(meal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;