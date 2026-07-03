import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks";
import { ProductCardSkeleton } from "@/components/skeleton/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";

export function CategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories } = useCategories();
  const selectedCategory = searchParams.get("category");

  return (
    <div className="space-y-3">
      <h3 className="font-heading font-semibold text-primary">Categories</h3>
      <div className="space-y-2">
        {categories?.map((category: any) => (
          <button
            key={category.id}
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (selectedCategory === category.slug) {
                params.delete("category");
              } else {
                params.set("category", category.slug);
                params.set("page", "1");
              }
              setSearchParams(params);
            }}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
              selectedCategory === category.slug
                ? "bg-primary text-white"
                : "text-text hover:bg-secondary/10"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isError, refetch } = useProducts({
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "20",
    search: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    brand: searchParams.get("brand") || undefined,
    featured: searchParams.get("featured") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    order: searchParams.get("order") || undefined,
  });

  const products = data?.data || [];
  const pagination = data?.pagination;
  const search = searchParams.get("q") || "";

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load products"
        description="Please try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-4xl text-primary mb-8">
          Shop All Products
        </h1>

        {/* Search Results Indicator */}
        {search && (
          <p className="text-muted mb-6">
            Showing results for: <span className="text-primary font-medium">"{search}"</span>
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64">
            <CategoryFilter />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No products found"
                description="Try adjusting your filters or search criteria."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <a
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group bg-surface rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                  >
                    <img
                      src={product.images?.[0]?.imageUrl || "/hero.jpg"}
                      alt={product.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="p-6">
                      <h3 className="font-heading font-semibold text-xl text-primary mb-2">
                        {product.name}
                      </h3>
                      <p className="text-muted mb-4">{product.brand?.name}</p>
                      <span className="font-heading font-bold text-2xl text-accent">
                        KES {product.price?.toLocaleString()}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page) })}
                        className={`px-4 py-2 rounded-lg ${
                          page === pagination.page
                            ? "bg-primary text-white"
                            : "border border-border text-text hover:bg-primary hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}