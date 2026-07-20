import { Link } from "react-router-dom";
import { ShieldCheck, Truck, Clock, Award, ArrowRight, ChevronRight } from "lucide-react";
import { useProducts, useCategories } from "@/hooks";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/skeleton/Skeleton";
import {
  PillIcon,
  DumbbellIcon,
  HeartIcon,
  ShieldIcon,
  BrainIcon,
  BabyIcon,
  LeafIcon,
  StethoscopeIcon,
  SparkleIcon,
  BandageIcon,
  EyeIcon,
  ToothIcon,
  HospitalIcon,
} from "@/assets/icons";

type IconComponent = React.ComponentType<{ className?: string }>;

const CATEGORY_ICONS: Record<string, IconComponent> = {
  default: PillIcon,
  vitamins: LeafIcon,
  supplements: DumbbellIcon,
  "baby-care": BabyIcon,
  skincare: SparkleIcon,
  "heart-health": HeartIcon,
  immunity: ShieldIcon,
  "pain-relief": BandageIcon,
  diabetes: StethoscopeIcon,
  "eye-care": EyeIcon,
  dental: ToothIcon,
  "first-aid": HospitalIcon,
};

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Genuine Products", sub: "100% authentic" },
  { icon: Truck, label: "Fast Delivery", sub: "Nairobi same day" },
  { icon: Clock, label: "24/7 Support", sub: "Always available" },
  { icon: Award, label: "Licensed Pharmacy", sub: "PPB certified" },
];

const HEALTH_GOALS: { icon: IconComponent; label: string; slug: string }[] = [
  { icon: PillIcon, label: "Vitamins & Minerals", slug: "vitamins" },
  { icon: DumbbellIcon, label: "Sports Nutrition", slug: "sports-nutrition" },
  { icon: HeartIcon, label: "Heart Health", slug: "heart-health" },
  { icon: ShieldIcon, label: "Immunity Boost", slug: "immunity" },
  { icon: BrainIcon, label: "Brain Health", slug: "brain-health" },
  { icon: BabyIcon, label: "Baby & Kids", slug: "baby-care" },
  { icon: LeafIcon, label: "Herbal & Natural", slug: "herbal" },
  { icon: StethoscopeIcon, label: "Diabetes Care", slug: "diabetes" },
];

export function HomePage() {
  const { products = [], isLoading: productsLoading } = useProducts({ featured: "true", limit: "8" });
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  return (
    <div className="min-h-screen">
      {/* Promo banner */}
      <div className="bg-secondary text-white text-sm py-2 text-center font-medium">
        🎉 Free delivery on orders over KES 2,000 — Use code <strong>HEALTH10</strong> for 10% off your first order
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-light via-white to-secondary-light py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-secondary-light text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-4">
                ✓ Kenya's Trusted Health Store
              </span>
              <h1 className="font-heading font-bold text-4xl md:text-5xl text-text mb-4 leading-tight">
                Your Health,{" "}
                <span className="text-primary">Our Priority</span>
              </h1>
              <p className="text-muted text-lg mb-8 max-w-lg">
                Premium medicines, supplements, and healthcare essentials — genuine products delivered fast across Kenya.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/shop" className="btn-primary text-base px-6 py-3">
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link to="/shop?category=vitamins" className="btn-outline text-base px-6 py-3">
                  Browse Vitamins
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img
                src="/hero.jpg"
                alt="NurseNourish Health Products"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover max-h-96"
              />
              <div className="absolute -bottom-4 -left-4 bg-surface rounded-xl shadow-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary-light rounded-full flex items-center justify-center text-xl">🌿</div>
                <div>
                  <p className="font-heading font-bold text-sm text-text">500+ Products</p>
                  <p className="text-xs text-muted">In stock & ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-surface border-y border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-text">{label}</p>
                  <p className="text-xs text-muted">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Health Goal */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-2xl text-text">Shop by Health Goal</h2>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {HEALTH_GOALS.map((goal) => {
              const Icon = goal.icon;
              return (
                <Link
                  key={goal.slug}
                  to={`/shop?category=${goal.slug}`}
                  className="group flex flex-col items-center gap-2 p-3 bg-surface rounded-xl border border-border hover:border-primary hover:shadow-card transition-all text-center"
                >
                  <Icon className="w-6 h-6 text-primary" />
                  <span className="text-xs font-medium text-text group-hover:text-primary leading-tight">{goal.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-2xl text-text">Shop by Category</h2>
            <Link to="/shop" className="flex items-center gap-1 text-sm text-primary hover:underline font-medium">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-28 bg-border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(categories as any[]).slice(0, 12).map((cat: any) => {
                const IconComponent = CATEGORY_ICONS[cat.slug] || CATEGORY_ICONS.default;
                return (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.slug}`}
                    className="group flex flex-col items-center gap-3 p-4 bg-background rounded-xl border border-border hover:border-primary hover:bg-primary-light transition-all text-center"
                  >
                    <IconComponent className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium text-text group-hover:text-primary leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-2xl text-text">Featured Products</h2>
              <p className="text-muted text-sm mt-1">Handpicked for your health</p>
            </div>
            <Link to="/shop" className="flex items-center gap-1 text-sm text-primary hover:underline font-medium">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(products as any[]).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl text-white mb-4">
            Need help choosing the right supplement?
          </h2>
          <p className="text-primary-light/80 text-lg mb-8">
            Our health experts are available to guide you to the right products for your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+254700000000" className="btn-secondary text-base px-8 py-3">
              📞 Call Us Now
            </a>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary rounded-lg font-medium text-base hover:bg-primary-light transition-colors">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
