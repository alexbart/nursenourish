import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cart.store";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const imageUrl = product.images?.[0]?.imageUrl || "/hero.jpg";
  const inStock = (product.inventory?.quantity ?? 1) > 0;
  const isOnSale = product.salePrice && product.salePrice < product.price;
  const discount = isOnSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: imageUrl,
      quantity: 1,
      maxQuantity: product.inventory?.quantity || 99,
    });
    toast.success("Added to cart");
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-surface rounded-xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOnSale && (
            <span className="badge bg-accent text-white">-{discount}%</span>
          )}
          {!inStock && (
            <span className="badge bg-gray-500 text-white">Out of Stock</span>
          )}
        </div>
        {/* Quick add overlay */}
        {inStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:bg-primary-hover shadow-md"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {product.brand?.name && (
          <span className="text-xs text-muted uppercase tracking-wide mb-1">{product.brand.name}</span>
        )}
        <h3 className="font-medium text-sm text-text leading-snug mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-heading font-bold text-primary text-base">
            KES {(isOnSale ? product.salePrice : product.price)?.toLocaleString()}
          </span>
          {isOnSale && (
            <span className="text-xs text-muted line-through">
              KES {product.price?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="w-full py-2 text-sm font-medium rounded-lg transition-colors
            bg-primary-light text-primary hover:bg-primary hover:text-white
            disabled:opacity-40 disabled:pointer-events-none"
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </Link>
  );
}
