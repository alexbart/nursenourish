import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/api/order";
import { initializePayment } from "@/api/payment";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { toast } from "react-hot-toast";

export function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { items, subtotal, clearCart } = useCartStore();

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (response) => {
      const order = response.data?.data;
      if (order) {
        paymentMutation.mutate({
          orderId: order.id,
          email: user?.email || "",
          amount: subtotal(),
        });
      }
    },
    onError: () => {
      toast.error("Failed to create order");
    },
  });

  const paymentMutation = useMutation({
    mutationFn: initializePayment,
    onSuccess: (response) => {
      const { authorization_url } = response.data?.data;
      if (authorization_url) {
        window.location.href = authorization_url;
      }
    },
    onError: () => {
      toast.error("Payment initialization failed");
    },
  });

  const handlePlaceOrder = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    orderMutation.mutate({
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal: subtotal(),
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-20 flex items-center justify-center">
        <p className="text-muted">Your cart is empty. Add items to checkout.</p>
      </div>
    );
  }

  const isLoading = orderMutation.isPending || paymentMutation.isPending;

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
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
              >
                {isLoading ? "Processing..." : user ? "Place Order & Pay" : "Sign In to Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}