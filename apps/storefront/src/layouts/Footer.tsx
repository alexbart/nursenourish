import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-text text-white mt-16">
      {/* Newsletter strip */}
      <div className="bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg">Get Health Tips & Exclusive Offers</h3>
            <p className="text-primary-light/80 text-sm">Subscribe to our newsletter</p>
          </div>
          <form className="flex w-full md:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-72 px-4 py-2.5 rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button type="submit" className="px-5 py-2.5 bg-white text-primary rounded-lg font-medium text-sm hover:bg-primary-light transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">NN</span>
              </div>
              <span className="font-heading font-bold text-lg">NurseNourish</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Kenya's trusted online pharmacy and health store. Genuine products, fast delivery, expert advice.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={15} />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram size={15} />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { to: "/shop", label: "Shop All" },
                { to: "/shop?category=vitamins", label: "Vitamins & Supplements" },
                { to: "/shop?category=baby-care", label: "Baby & Kids" },
                { to: "/shop?featured=true", label: "Featured Products" },
                { to: "/cart", label: "My Cart" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { to: "/login", label: "My Account" },
                { to: "/orders", label: "Track Order" },
                { to: "/faq", label: "FAQ" },
                { to: "/returns", label: "Returns Policy" },
                { to: "/privacy", label: "Privacy Policy" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
                Nairobi, Kenya
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-primary shrink-0" />
                <a href="tel:+254700000000" className="hover:text-white transition-colors">+254 700 000 000</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-primary shrink-0" />
                <a href="mailto:info@nursenourish.co.ke" className="hover:text-white transition-colors">info@nursenourish.co.ke</a>
              </li>
            </ul>

            {/* Payment methods */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">We accept</p>
              <div className="flex gap-2 flex-wrap">
                {["M-Pesa", "Visa", "Mastercard", "Paystack"].map((method) => (
                  <span key={method} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} NurseNourish. All rights reserved.</p>
          <p>Licensed by the Pharmacy & Poisons Board of Kenya</p>
        </div>
      </div>
    </footer>
  );
}
