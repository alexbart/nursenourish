import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/api/order";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { toast } from "react-hot-toast";

export function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { items, subtotal, clearCart } = useCartStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order created! Ready for Paystack integration.");
      navigate("/orders");
    },
    onError: () => {
      toast.error("Failed to create order");
    },
  });

  const handlePlaceOrder = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    mutation.mutate({
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-20 flex items-center justify-center">
        <p className="text-muted">Your cart is empty. Add items to checkout.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-4xl text-primary mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-heading font-semibold text-xl text-primary mb-4">Order Review</h2>
            <div className="bg-surface rounded-2xl border border-border p-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b border-border last:border-0">
                  <span>{item.name} × {item.quantity}</span>
                  <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface rounded-2xl border border-border p-6">
              <h2 className="font-heading font-bold text-xl text-primary mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold">KES {subtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className="font-semibold">Calculated at payment</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>KES {subtotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={mutation.isPending}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
              >
                {mutation.isPending ? "Creating..." : user ? "Place Order" : "Sign In to Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}