import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ShoppingCart, ShieldCheck, Truck, RotateCcw, ChevronRight } from "lucide-react";
import { useProduct, useProducts } from "@/hooks";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/skeleton/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useCartStore } from "@/features/cart/store/cart.store";
import { toast } from "react-hot-toast";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);

  const { data: product, isLoading, isError, refetch } = useProduct(slug || "");
  const { products: relatedProducts = [] } = useProducts({
    category: product?.category?.slug,
    limit: "4",
  });

  const addItem = useCartStore((state) => state.addItem);
  const filteredRelated = (relatedProducts as any[]).filter((p: any) => p.id !== product?.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!product) return;
    const imageUrl = product.images?.[selectedImage]?.imageUrl || "/hero.jpg";
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: imageUrl,
      quantity: qty,
      maxQuantity: product.inventory?.quantity || 99,
    });
    toast.success(`${qty} × ${product.name} added to cart`);
  };

  if (isError) return <ErrorState title="Product not found" description="This product doesn't exist or has been removed." onRetry={() => refetch()} />;

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-background py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-3">
              <div className="aspect-square bg-border rounded-xl animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => <div key={i} className="aspect-square bg-border rounded-lg animate-pulse" />)}
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-6 bg-border rounded animate-pulse" style={{ width: `${[75, 40, 100, 60, 80][i]}%` }} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [{ imageUrl: "/hero.jpg" }];
  const inStock = (product.inventory?.quantity ?? 1) > 0;
  const isOnSale = product.salePrice && product.salePrice < product.price;
  const discount = isOnSale ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>{product.name} | NurseNourish</title>
        <meta name="description" content={product.description || `Buy ${product.name} at NurseNourish Kenya`} />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={images[0]?.imageUrl} />
      </Helmet>

      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-primary">Shop</Link>
            {product.category && (
              <>
                <ChevronRight size={14} />
                <Link to={`/shop?category=${product.category.slug}`} className="hover:text-primary">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={14} />
            <span className="text-text truncate max-w-xs">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="bg-surface rounded-xl border border-border overflow-hidden aspect-square">
                <img
                  src={images[selectedImage]?.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img src={img.imageUrl} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.brand?.name && (
                <Link
                  to={`/shop?brand=${product.brand.slug}`}
                  className="text-xs font-semibold text-primary uppercase tracking-wide hover:underline"
                >
                  {product.brand.name}
                </Link>
              )}
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-text mt-2 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-heading font-bold text-3xl text-primary">
                  KES {(isOnSale ? product.salePrice : product.price)?.toLocaleString()}
                </span>
                {isOnSale && (
                  <>
                    <span className="text-lg text-muted line-through">KES {product.price?.toLocaleString()}</span>
                    <span className="badge bg-accent text-white text-sm px-2 py-1">-{discount}%</span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                <span className={`w-2 h-2 rounded-full ${inStock ? "bg-success" : "bg-danger"}`} />
                <span className={`text-sm font-medium ${inStock ? "text-success" : "text-danger"}`}>
                  {inStock ? `In Stock (${product.inventory?.quantity} available)` : "Out of Stock"}
                </span>
              </div>

              {/* Qty + Add to cart */}
              {inStock && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-primary-light text-text transition-colors"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-medium text-sm">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.inventory?.quantity || 99, qty + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-primary-light text-text transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 btn-primary py-3 text-base"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-surface rounded-xl border border-border mb-6">
                {[
                  { icon: ShieldCheck, label: "Genuine Product" },
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: RotateCcw, label: "Easy Returns" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                    <Icon size={20} className="text-primary" />
                    <span className="text-xs text-muted">{label}</span>
                  </div>
                ))}
              </div>

              {/* Product details */}
              <div className="space-y-4">
                {product.description && (
                  <div>
                    <h2 className="font-heading font-semibold text-text mb-2">Description</h2>
                    <p className="text-muted text-sm leading-relaxed">{product.description}</p>
                  </div>
                )}
                {product.ingredients && (
                  <div>
                    <h2 className="font-heading font-semibold text-text mb-2">Key Ingredients</h2>
                    <p className="text-muted text-sm leading-relaxed">{product.ingredients}</p>
                  </div>
                )}
                {product.packSize && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-text">Pack Size:</span>
                    <span className="text-muted">{product.packSize}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-text">SKU:</span>
                    <span className="text-muted font-mono">{product.sku}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {filteredRelated.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-xl text-text">Related Products</h2>
                <Link to={`/shop?category=${product.category?.slug}`} className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {filteredRelated.map((p: any) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
