import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

export function CheckoutPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-4xl text-primary mb-6">Checkout</h1>
          <p className="text-muted mb-8">Checkout will be available after order domain is implemented (Sprint 6).</p>
          <Link
            to="/cart"
            className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}