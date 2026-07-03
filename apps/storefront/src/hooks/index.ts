import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getProducts, getProductBySlug, getCategories, getBrands } from "@/api";

export function useProducts(params?: Record<string, string>, options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await getProducts(params);
      const responseData = response.data;
      return {
        products: responseData?.data || [],
        pagination: responseData?.pagination || { pages: 0 },
      };
    },
    ...options,
  });
}

export function useProduct(slug: string, options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await getProductBySlug(slug);
      return response.data?.data;
    },
    ...options,
  });
}

export function useCategories(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.data?.data || [];
    },
    ...options,
  });
}

export function useBrands(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await getBrands();
      return response.data?.data || [];
    },
    ...options,
  });
}