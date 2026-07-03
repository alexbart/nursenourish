import { useParams } from "react-router-dom";
import { useProduct, useProducts } from "@/hooks";
import { ProductCardSkeleton } from "@/components/skeleton/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Button } from "@/components/Button";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useProduct(slug || "");

  const { data: relatedData } = useProducts({
    category: product?.category?.slug,
    limit: "4",
  });

  const relatedProducts = relatedData?.data?.filter((p: any) => p.id !== product?.id) || [];

  if (isError) {
    return (
      <ErrorState
        title="Product not found"
        description="The product you're looking for doesn't exist."
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-96 bg-secondary/20 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-secondary/20 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-secondary/20 rounded animate-pulse" />
              <div className="h-6 w-1/4 bg-secondary/20 rounded animate-pulse" />
              <div className="h-4 w-full bg-secondary/20 rounded animate-pulse" />
              <div className="h-12 w-32 bg-secondary/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-muted mb-6">
          <a href="/" className="hover:text-primary">Home</a>
          <span> / </span>
          <a href="/shop" className="hover:text-primary">Shop</a>
          <span> / </span>
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div>
            <div className="bg-surface rounded-2xl overflow-hidden border border-border mb-4">
              <img
                src={product.images?.[0]?.imageUrl || "/hero.jpg"}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img: any, i: number) => (
                  <button
                    key={img.id}
                    className="bg-surface rounded-lg overflow-hidden border border-border hover:border-primary transition"
                  >
                    <img
                      src={img.imageUrl}
                      alt={`${product.name} ${i + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="font-heading font-bold text-4xl text-primary mb-4">
              {product.name}
            </h1>
            <p className="text-accent font-bold text-3xl mb-6">
              KES {product.price?.toLocaleString()}
            </p>

            {product.inventory && (
              <p className="text-secondary mb-4">
                {product.inventory.quantity > 0
                  ? `${product.inventory.quantity} in stock`
                  : "Out of stock"}
              </p>
            )}

            <div className="space-y-4 mb-8">
              {product.description && (
                <div>
                  <h2 className="font-heading font-semibold text-lg text-primary mb-2">
                    Description
                  </h2>
                  <p className="text-muted">{product.description}</p>
                </div>
              )}

              {product.ingredients && (
                <div>
                  <h2 className="font-heading font-semibold text-lg text-primary mb-2">
                    Key Ingredients
                  </h2>
                  <p className="text-muted">{product.ingredients}</p>
                </div>
              )}

              {product.packSize && (
                <div>
                  <h2 className="font-heading font-semibold text-lg text-primary mb-2">
                    Pack Size
                  </h2>
                  <p className="text-muted">{product.packSize}</p>
                </div>
              )}
            </div>

            <Button className="w-full lg:w-auto" disabled={!product.inventory?.quantity}>
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading font-bold text-2xl text-primary mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related: any) => (
                <a
                  key={related.id}
                  href={`/product/${related.slug}`}
                  className="group bg-surface rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <img
                    src={related.images?.[0]?.imageUrl || "/hero.jpg"}
                    alt={related.name}
                    className="h-40 w-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-primary mb-1">
                      {related.name}
                    </h3>
                    <p className="text-accent font-bold">
                      KES {related.price?.toLocaleString()}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}