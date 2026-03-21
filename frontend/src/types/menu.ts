/**
 * Menu Item Data Types
 */

export interface MenuItem {
  id: string;
  name: string;
  category_id: string;
  category_name?: string;
  price: number;
  description?: string;
  image_url?: string;
  status: 'available' | 'unavailable';
  is_featured?: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface MenuItemFormData {
  name: string;
  category_id: string;
  price: string;
  description?: string;
  image_url?: string;
  status: 'available' | 'unavailable';
}
