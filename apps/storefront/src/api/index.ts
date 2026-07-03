import { api } from "@/lib/api";

export const getProducts = (params?: Record<string, string>) =>
  api.get("/products", { params });

export const getProductBySlug = (slug: string) => api.get(`/products/${slug}`);

export const getCategories = () => api.get("/categories");

export const getBrands = () => api.get("/brands");