import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Phone, MapPin, ChevronDown, Menu, X } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCategories } from "@/hooks";

export function Navbar() {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.totalItems());
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: categories = [] } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-surface shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone size={12} />
              +254 700 000 000
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              Nairobi, Kenya — Free delivery over KES 2,000
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-primary-light/80">✓ Genuine Products</span>
            <span className="text-primary-light/80">✓ Licensed Pharmacy</span>
            <span className="text-primary-light/80">✓ Fast Delivery</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm">NN</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-heading font-bold text-primary text-lg leading-none block">NurseNourish</span>
            <span className="text-muted text-[10px] leading-none">Health & Wellness</span>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative flex">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search medicines, supplements, health products..."
              className="w-full pl-4 pr-12 py-2.5 border-2 border-border rounded-l-lg focus:border-primary focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="px-4 bg-primary text-white rounded-r-lg hover:bg-primary-hover transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-text font-medium">{user.firstName}</span>
              <button onClick={logout} className="text-xs text-muted hover:text-danger transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 text-sm text-text hover:text-primary transition-colors"
            >
              <User size={18} />
              Sign In
            </Link>
          )}

          <Link to="/cart" className="relative p-2 hover:bg-primary-light rounded-lg transition-colors">
            <ShoppingCart size={22} className="text-text" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2 hover:bg-primary-light rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden md:block border-t border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            <Link
              to="/shop"
              className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-b-none hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              <Menu size={15} />
              All Products
            </Link>
            {(categories as any[]).slice(0, 8).map((cat: any) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="px-4 py-2.5 text-sm text-text hover:text-primary hover:bg-primary-light transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
            {(categories as any[]).length > 8 && (
              <Link
                to="/shop"
                className="flex items-center gap-1 px-4 py-2.5 text-sm text-muted hover:text-primary transition-colors whitespace-nowrap"
              >
                More <ChevronDown size={14} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative flex">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-12 py-2.5 border border-border rounded-l-lg focus:border-primary focus:outline-none text-sm"
              />
              <button type="submit" className="px-4 bg-primary text-white rounded-r-lg">
                <Search size={16} />
              </button>
            </div>
          </form>
          <div className="flex flex-col gap-1">
            <Link to="/shop" className="py-2 text-sm font-medium text-text hover:text-primary" onClick={() => setMobileOpen(false)}>All Products</Link>
            {(categories as any[]).map((cat: any) => (
              <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="py-2 text-sm text-text hover:text-primary border-t border-border" onClick={() => setMobileOpen(false)}>
                {cat.name}
              </Link>
            ))}
          </div>
          {user ? (
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-medium">{user.firstName}</span>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-danger">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="block py-2 text-sm font-medium text-primary border-t border-border" onClick={() => setMobileOpen(false)}>
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
