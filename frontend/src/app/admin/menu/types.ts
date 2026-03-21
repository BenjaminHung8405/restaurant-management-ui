export type MenuItemStatus = "active" | "inactive";

export interface MenuItem {
  id: string | number;
  name: string;
  category: string;
  category_id?: string;
  price: number;
  status: MenuItemStatus;
  image_url: string;
  description?: string;
  is_featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
}
