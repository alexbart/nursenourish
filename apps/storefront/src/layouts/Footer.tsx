export function Footer() {
  return (
    <footer className="bg-primary text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">NurseNourish</h3>
            <p className="text-secondary">
              Your trusted partner in everyday wellness. Premium nutritional
              supplements and healthcare essentials delivered across Kenya.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/shop" className="text-secondary hover:text-accent transition">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="text-secondary hover:text-accent transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-secondary hover:text-accent transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <p className="text-secondary">Nairobi, Kenya</p>
            <p className="text-secondary">info@nursenourish.co.ke</p>
          </div>
        </div>

        <div className="border-t border-secondary/20 mt-8 pt-8 text-center text-secondary">
          <p>&copy; {new Date().getFullYear()} NurseNourish. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}