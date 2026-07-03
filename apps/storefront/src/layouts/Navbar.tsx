import { Link } from "react-router-dom";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { SearchBar } from "@/components/search/SearchBar";

export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.jpg" alt="NurseNourish" className="h-8 w-auto" />
            <span className="font-heading font-bold text-primary text-xl">
              NurseNourish
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-text hover:text-primary transition">
              Home
            </Link>
            <Link to="/shop" className="text-text hover:text-primary transition">
              Shop
            </Link>
            <Link to="/categories" className="text-text hover:text-primary transition">
              Categories
            </Link>
            <Link to="/about" className="text-text hover:text-primary transition">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <SearchBar />
            <Link
              to="/cart"
              className="relative p-2 text-text hover:text-primary transition"
            >
              <span className="sr-only">Cart</span>
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-primary">{user.firstName}</span>
                <button
                  onClick={logout}
                  className="text-sm text-muted hover:text-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm text-text hover:text-primary transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}