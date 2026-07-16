import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getProducts, getProductBySlug, getCategories, getBrands } from "@/api";

type ProductParams = Record<string, string | undefined>;

export function useProducts(params?: ProductParams, options?: Partial<UseQueryOptions>) {
  // Strip undefined values so they don't get sent as "undefined" strings
  const cleanParams = params
    ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) as Record<string, string>
    : undefined;

  const query = useQuery({
    queryKey: ["products", cleanParams],
    queryFn: async () => {
      const response = await getProducts(cleanParams);
      const d = response.data;
      return {
        products: d?.data || [],
        pagination: d?.pagination || null,
      };
    },
    ...options,
  });

  return {
    ...query,
    products: query.data?.products ?? [],
    pagination: query.data?.pagination ?? null,
  };
}

export function useProduct(slug: string, options?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await getProductBySlug(slug);
      return response.data?.data;
    },
    enabled: !!slug,
    ...options,
  });
}

export function useCategories(options?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.data?.data || [];
    },
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useBrands(options?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await getBrands();
      return response.data?.data || [];
    },
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}
