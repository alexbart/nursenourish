export interface ProductImage {
  id: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  ingredients: string | null;
  usageInstructions: string | null;
  warnings: string | null;
  price: number;
  salePrice: number | null;
  featured: boolean;
  prescriptionRequired: boolean;
  status: string;
  categoryId: string;
  brandId: string;
  category?: import("./category.js").Category;
  brand?: import("./brand.js").Brand;
  images?: ProductImage[];
  inventory?: Inventory;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  reorderLevel: number;
  updatedAt: Date;
}