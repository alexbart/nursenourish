import { Link } from "react-router-dom";
import { useCartStore } from "@/features/cart/store/cart.store";
import { EmptyState } from "@/components/feedback/EmptyState";
import { toast } from "react-hot-toast";

export function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            description="Browse our products and add items to your cart."
          >
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition"
            >
              Continue Shopping
            </Link>
          </EmptyState>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-4xl text-primary mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <table className="w-full bg-surface rounded-2xl border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-heading font-semibold text-primary">Product</th>
                  <th className="text-center p-4 font-heading font-semibold text-primary">Quantity</th>
                  <th className="text-right p-4 font-heading font-semibold text-primary">Price</th>
                  <th className="text-center p-4 font-heading font-semibold text-primary">Remove</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-heading font-medium text-primary">{item.name}</h3>
                          <p className="text-muted text-sm">KES {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-border hover:bg-secondary/10"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-border hover:bg-secondary/10"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right font-heading font-bold text-primary">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          removeItem(item.productId);
                          toast.success("Removed from cart");
                        }}
                        className="text-muted hover:text-red-500"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface rounded-2xl border border-border p-6">
              <h2 className="font-heading font-bold text-xl text-primary mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-heading font-semibold text-primary">KES {subtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className="font-heading font-semibold text-primary">Calculated at checkout</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-heading font-bold text-primary">Total</span>
                    <span className="font-heading font-bold text-primary">KES {subtotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={clearCart}
                className="w-full py-2 border border-border text-text rounded-lg hover:bg-secondary/10 transition mb-3"
              >
                Clear Cart
              </button>
              <button
                disabled
                className="w-full py-2 bg-surface border border-border text-text rounded-lg opacity-50 mb-3"
              >
                Promo Code (Coming Soon)
              </button>
              <Link
                to="/checkout"
                className="block w-full py-3 bg-primary text-white rounded-lg text-center hover:bg-primary-hover transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}