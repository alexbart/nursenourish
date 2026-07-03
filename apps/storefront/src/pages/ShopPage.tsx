export function ShopPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-4xl text-primary mb-8">
          Shop All Products
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h2 className="font-heading font-semibold text-lg text-primary mb-4">
                Filters
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted mb-2">Category</h3>
                  <div className="space-y-2">
                    {["Vitamins", "Sports", "Women's Health", "Men's Health"].map(
                      (cat) => (
                        <label key={cat} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-text">{cat}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted mb-2">Price Range</h3>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 border border-border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-surface rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition"
                >
                  <div className="h-48 bg-secondary/10" />
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-xl text-primary mb-2">
                      Product {i}
                    </h3>
                    <p className="text-muted mb-4">Premium supplement</p>
                    <span className="font-heading font-bold text-2xl text-accent">
                      KES 2,850
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded-lg ${
                      page === 1
                        ? "bg-primary text-white"
                        : "border border-border text-text hover:bg-primary hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}