import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-heading font-bold text-5xl lg:text-6xl text-primary mb-6">
                Your Trusted Partner in Everyday Wellness
              </h1>
              <p className="text-xl text-muted mb-8 max-w-lg">
                Premium nutritional supplements and healthcare essentials delivered
                across Kenya.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition shadow-lg"
                >
                  Shop Supplements
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/hero.jpg"
                alt="NurseNourish Wellness"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-3xl text-center text-primary mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Vitamins", "Sports", "Women's Health", "Men's Health"].map(
              (category) => (
                <Link
                  key={category}
                  to={`/shop?category=${category.toLowerCase()}`}
                  className="group"
                >
                  <div className="bg-surface rounded-2xl p-6 text-center border border-border hover:shadow-lg transition-all group-hover:-translate-y-1">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-primary">
                      {category}
                    </h3>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-3xl text-center text-primary mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition">
                <div className="h-48 bg-secondary/10" />
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-xl text-primary mb-2">
                    Product {i}
                  </h3>
                  <p className="text-muted mb-4">Premium supplement for your health</p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-2xl text-accent">
                      KES 2,850
                    </span>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}