import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getProducts, getProductBySlug, getCategories, getBrands } from "@/api";

export function useProducts(params?: Record<string, string>, options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    ...options,
  });
}

export function useProduct(slug: string, options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    ...options,
  });
}

export function useCategories(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    ...options,
  });
}

export function useBrands(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
    ...options,
  });
}