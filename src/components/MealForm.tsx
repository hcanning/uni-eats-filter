import { useState } from 'react';
import { Meal, MealFormData, DietaryRestriction } from '@/types/meal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { imageUploadService } from '@/services/imageUploadService';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
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
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: keyof MealFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let imagePath = formData.image;
      
      // If a new image was uploaded, upload it to Supabase storage
      if (uploadedImage) {
        toast({
          title: "Uploading image...",
          description: "Please wait while we upload your image.",
        });
        
        imagePath = await imageUploadService.uploadImage(uploadedImage);
      }
      
      const ingredients = ingredientsText.split(',').map(item => item.trim()).filter(Boolean);
      onSubmit({ ...formData, ingredients, image: imagePath });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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
        <Label htmlFor="image">Meal Image</Label>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 10MB)</p>
              </div>
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 rounded-lg object-cover border border-border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2"
                onClick={() => {
                  setUploadedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </Button>
            </div>
          )}
          
          {formData.image && !imagePreview && (
            <div className="text-sm text-muted-foreground">
              Current image: {formData.image}
            </div>
          )}
        </div>
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
              step="0.1"
              value={formData.nutrition.calories}
              onChange={(e) => handleNutritionChange('calories', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              min="0"
              step="0.1"
              value={formData.nutrition.protein}
              onChange={(e) => handleNutritionChange('protein', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input
              id="carbs"
              type="number"
              min="0"
              step="0.1"
              value={formData.nutrition.carbs}
              onChange={(e) => handleNutritionChange('carbs', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fat">Fat (g)</Label>
            <Input
              id="fat"
              type="number"
              min="0"
              step="0.1"
              value={formData.nutrition.fat}
              onChange={(e) => handleNutritionChange('fat', parseFloat(e.target.value) || 0)}
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : (meal ? 'Update Meal' : 'Create Meal')}
        </Button>
      </div>
    </form>
  );
};