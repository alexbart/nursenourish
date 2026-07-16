import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ChevronRight } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cart.store";
import { toast } from "react-hot-toast";

export function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-20">
        <div className="text-center">
          <ShoppingBag size={64} className="text-border mx-auto mb-4" />
          <h2 className="font-heading font-bold text-2xl text-text mb-2">Your cart is empty</h2>
          <p className="text-muted mb-6">Browse our products and add items to your cart.</p>
          <Link to="/shop" className="btn-primary px-8 py-3 text-base">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={14} />
          <span className="text-text">Shopping Cart</span>
        </nav>

        <h1 className="font-heading font-bold text-2xl text-text mb-6">
          Shopping Cart <span className="text-muted font-normal text-lg">({items.length} {items.length === 1 ? "item" : "items"})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-surface rounded-xl border border-border p-4 flex gap-4">
                <Link to={`/product/${item.slug}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover border border-border"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.slug}`} className="font-medium text-text hover:text-primary line-clamp-2 text-sm leading-snug">
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted mt-1">KES {item.price.toLocaleString()} each</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-primary-light text-text transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-primary-light text-text transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-heading font-bold text-primary">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => { removeItem(item.productId); toast.success("Removed from cart"); }}
                        className="p-1.5 text-muted hover:text-danger transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => { clearCart(); toast.success("Cart cleared"); }}
              className="text-sm text-muted hover:text-danger transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-xl border border-border p-5 sticky top-24">
              <h2 className="font-heading font-bold text-lg text-text mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium">KES {subtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Delivery</span>
                  <span className={subtotal() >= 2000 ? "text-success font-medium" : "font-medium"}>
                    {subtotal() >= 2000 ? "FREE" : "Calculated at checkout"}
                  </span>
                </div>
                {subtotal() < 2000 && (
                  <p className="text-xs text-muted bg-secondary-light text-secondary px-3 py-2 rounded-lg">
                    Add KES {(2000 - subtotal()).toLocaleString()} more for free delivery
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-3 mb-5">
                <div className="flex justify-between font-heading font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">KES {subtotal().toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full py-3 text-base justify-center"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/shop"
                className="block text-center text-sm text-muted hover:text-primary mt-3 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
