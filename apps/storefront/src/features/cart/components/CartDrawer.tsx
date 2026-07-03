import { useCartStore } from "../store/cart.store";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-surface border-l border-border z-50 overflow-y-auto">
      <div className="p-6">
        <h2 className="font-heading font-bold text-2xl text-primary mb-6">Shopping Cart</h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex space-x-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-heading font-medium text-primary">{item.name}</h3>
                <p className="text-accent font-bold">KES {item.price.toLocaleString()}</p>
                <div className="flex items-center mt-2 space-x-2">
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
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-muted hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex justify-between mb-4">
            <span className="font-heading font-semibold text-primary">Subtotal</span>
            <span className="font-heading font-bold text-primary">KES {subtotal().toLocaleString()}</span>
          </div>
          <button
            onClick={clearCart}
            className="w-full py-3 border border-border text-text rounded-lg hover:bg-secondary/10 transition mb-2"
          >
            Clear Cart
          </button>
          <a
            href="/cart"
            className="block w-full py-3 bg-primary text-white rounded-lg text-center hover:bg-primary-hover transition"
          >
            View Cart
          </a>
        </div>
      </div>
    </div>
  );
}