import { supabase } from '@/integrations/supabase/client';

export const imageUploadService = {
  // Upload image to Supabase storage
  async uploadImage(file: File): Promise<string> {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('meal-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }

    return data.path;
  },

  // Get public URL for uploaded image
  getImageUrl(path: string): string {
    const { data } = supabase.storage
      .from('meal-images')
      .getPublicUrl(path);

    return data.publicUrl;
  },

  // Delete image from storage
  async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('meal-images')
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }
};