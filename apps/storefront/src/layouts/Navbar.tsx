import { Link } from "react-router-dom";
import { SearchBar } from "@/components/search/SearchBar";

export function Navbar() {
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
            <button className="p-2 text-text hover:text-primary transition">
              <span className="sr-only">Cart</span>
              🛒
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}