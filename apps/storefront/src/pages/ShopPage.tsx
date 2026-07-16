import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid2X2, List, X } from "lucide-react";
import { useProducts, useCategories } from "@/hooks";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/skeleton/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A–Z" },
  { value: "newest", label: "Newest First" },
];

function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories = [] } = useCategories();
  const selectedCategory = searchParams.get("category");

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
      params.set("page", "1");
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    setSearchParams(params);
  };

  const hasFilters = selectedCategory || searchParams.get("minPrice") || searchParams.get("maxPrice");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-text flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters
        </h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-danger hover:underline flex items-center gap-1">
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-semibold text-text mb-3">Category</h4>
        <div className="space-y-1">
          <button
            onClick={() => setParam("category", null)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory ? "bg-primary text-white font-medium" : "text-text hover:bg-primary-light hover:text-primary"
            }`}
          >
            All Categories
          </button>
          {(categories as any[]).map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setParam("category", selectedCategory === cat.slug ? null : cat.slug)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-primary text-white font-medium"
                  : "text-text hover:bg-primary-light hover:text-primary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-text mb-3">Price Range (KES)</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") || ""}
            onBlur={(e) => setParam("minPrice", e.target.value || null)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("maxPrice") || ""}
            onBlur={(e) => setParam("maxPrice", e.target.value || null)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div className="mt-2 space-y-1">
          {[["0", "500"], ["500", "1500"], ["1500", "3000"], ["3000", ""]].map(([min, max]) => (
            <button
              key={`${min}-${max}`}
              onClick={() => { setParam("minPrice", min || null); setParam("maxPrice", max || null); }}
              className="block w-full text-left px-3 py-1.5 rounded-lg text-xs text-text hover:bg-primary-light hover:text-primary transition-colors"
            >
              {max ? `KES ${Number(min).toLocaleString()} – ${Number(max).toLocaleString()}` : `KES ${Number(min).toLocaleString()}+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sortValue = searchParams.get("sort") || "";
  const [sortBy, order] = sortValue === "price_asc"
    ? ["price", "asc"]
    : sortValue === "price_desc"
    ? ["price", "desc"]
    : sortValue === "name_asc"
    ? ["name", "asc"]
    : sortValue === "newest"
    ? ["createdAt", "desc"]
    : [undefined, undefined];

  const { products = [], pagination, isLoading, isError, refetch } = useProducts({
    page: searchParams.get("page") || "1",
    limit: "20",
    search: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    sortBy,
    order,
  });

  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  if (isError) return <ErrorState title="Couldn't load products" description="Please try again." onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-text">
            {search ? `Results for "${search}"` : category ? `${category.replace(/-/g, " ")}` : "All Products"}
          </h1>
          {!isLoading && (
            <p className="text-muted text-sm mt-1">
              {pagination?.total ?? products.length} products found
            </p>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-surface rounded-xl border border-border p-4 sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-surface rounded-xl border border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded ${viewMode === "grid" ? "bg-primary-light text-primary" : "text-muted hover:text-primary"}`}
                >
                  <Grid2X2 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded ${viewMode === "list" ? "bg-primary-light text-primary" : "text-muted hover:text-primary"}`}
                >
                  <List size={18} />
                </button>
              </div>
              <select
                value={sortValue}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) params.set("sort", e.target.value);
                  else params.delete("sort");
                  setSearchParams(params);
                }}
                className="text-sm border border-border rounded-lg px-3 py-1.5 focus:border-primary focus:outline-none bg-surface"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
                {[...Array(9)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState icon="🔍" title="No products found" description="Try adjusting your filters or search." />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(products as any[]).map((p: any) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {(products as any[]).map((p: any) => (
                  <a
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="bg-surface rounded-xl border border-border p-4 flex gap-4 hover:shadow-card transition-shadow"
                  >
                    <img
                      src={p.images?.[0]?.imageUrl || "/hero.jpg"}
                      alt={p.name}
                      className="w-24 h-24 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted uppercase mb-1">{p.brand?.name}</p>
                      <h3 className="font-medium text-text mb-2 line-clamp-2">{p.name}</h3>
                      <span className="font-heading font-bold text-primary">KES {p.price?.toLocaleString()}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center mt-8 gap-1">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set("page", String(page));
                      setSearchParams(params);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === pagination.page
                        ? "bg-primary text-white"
                        : "border border-border text-text hover:bg-primary-light hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
