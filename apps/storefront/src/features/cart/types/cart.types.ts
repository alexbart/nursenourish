export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image: string;
  quantity: number;
  maxQuantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  totalItems: () => number;
}

export type CartStore = CartState;