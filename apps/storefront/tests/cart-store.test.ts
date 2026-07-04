import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "../src/features/cart/store/cart.store";

describe("Cart Store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("should add items to cart", () => {
    const { addItem } = useCartStore.getState();
    
    addItem({
      id: "1",
      productId: "prod-1",
      name: "Test Product",
      slug: "test-product",
      price: 100,
      quantity: 1,
      maxQuantity: 10,
      image: "/test.jpg",
    });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].name).toBe("Test Product");
  });

  it("should calculate subtotal", () => {
    const { addItem, subtotal } = useCartStore.getState();
    
    addItem({
      id: "1",
      productId: "prod-1",
      name: "Product 1",
      slug: "p1",
      price: 100,
      quantity: 2,
      maxQuantity: 10,
      image: "/p1.jpg",
    });

    addItem({
      id: "2",
      productId: "prod-2",
      name: "Product 2",
      slug: "p2",
      price: 200,
      quantity: 1,
      maxQuantity: 10,
      image: "/p2.jpg",
    });

    expect(subtotal()).toBe(300);
  });

  it("should calculate total items", () => {
    const { addItem, totalItems } = useCartStore.getState();
    
    addItem({
      id: "1",
      productId: "prod-1",
      name: "Product 1",
      slug: "p1",
      price: 100,
      quantity: 3,
      maxQuantity: 10,
      image: "/p1.jpg",
    });

    expect(totalItems()).toBe(3);
  });

  it("should remove items", () => {
    const { addItem, removeItem } = useCartStore.getState();
    
    addItem({
      id: "1",
      productId: "prod-1",
      name: "Product 1",
      slug: "p1",
      price: 100,
      quantity: 1,
      maxQuantity: 10,
      image: "/p1.jpg",
    });

    removeItem("prod-1");
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("should update quantity", () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    
    addItem({
      id: "1",
      productId: "prod-1",
      name: "Product 1",
      slug: "p1",
      price: 100,
      quantity: 1,
      maxQuantity: 10,
      image: "/p1.jpg",
    });

    updateQuantity("prod-1", 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });
});