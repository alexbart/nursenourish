export function ProductPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div>
            <div className="bg-surface rounded-2xl overflow-hidden border border-border mb-4">
              <img
                src="/hero.jpg"
                alt="Product"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className="bg-surface rounded-lg overflow-hidden border border-border hover:border-primary transition"
                >
                  <div className="h-20 bg-secondary/10" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="font-heading font-bold text-4xl text-primary mb-4">
              HydroGlow Electrolyte Matrix
            </h1>
            <p className="text-accent font-bold text-3xl mb-6">KES 1,850</p>

            <div className="space-y-6">
              <div>
                <h2 className="font-heading font-semibold text-lg text-primary mb-2">
                  Description
                </h2>
                <p className="text-muted">
                  Premium electrolyte supplement for optimal hydration and mineral
                  balance.
                </p>
              </div>

              <div>
                <h2 className="font-heading font-semibold text-lg text-primary mb-2">
                  Key Ingredients
                </h2>
                <ul className="list-disc list-inside text-muted space-y-1">
                  <li>Sodium</li>
                  <li>Potassium</li>
                  <li>Magnesium</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <button className="w-full lg:w-auto px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition shadow-lg">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}