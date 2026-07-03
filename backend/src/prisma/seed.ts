import { prisma } from "../prisma/prisma.js";

async function seed() {
  console.log("🌱 Seeding database...");

  await prisma.category.createMany({
    data: [
      { name: "Vitamins & Supplements", slug: "vitamins-supplements" },
      { name: "Sports Nutrition", slug: "sports-nutrition" },
      { name: "Women's Health", slug: "womens-health" },
      { name: "Men's Health", slug: "mens-health" },
      { name: "Baby Care", slug: "baby-care" },
      { name: "Personal Care", slug: "personal-care" },
      { name: "Prescription Medicines", slug: "prescription-medicines" },
      { name: "OTC Medicines", slug: "otc-medicines" },
    ],
    skipDuplicates: true,
  });

  await prisma.brand.createMany({
    data: [
      { name: "Vitabiotics", slug: "vitabiotics" },
      { name: "Centrum", slug: "centrum" },
      { name: "Nature's Bounty", slug: "natures-bounty" },
      { name: "Seven Seas", slug: "seven-seas" },
      { name: "Ensure", slug: "ensure" },
      { name: "GSK", slug: "gsk" },
      { name: "Bayer", slug: "bayer" },
    ],
    skipDuplicates: true,
  });

  const categories = await prisma.category.findMany();
  const brands = await prisma.brand.findMany();

  const products = [];
  const productNames = [
    "Centrum Multivitamin 100 Tablets",
    "Vitabiotics Vitamin C 500mg 100 Capsules",
    "Nature's Bounty Omega-3 120 Softgels",
    "Seven Seas Pregnancy Multivitamin",
    "Ensure Plus Vanilla Powder 400g",
    "Centrum Silver Men 50+ 120 Tablets",
    "Vitabiotics Wellwoman 84 Tablets",
    "GSK Caltrate 600+D 120 Tablets",
  ];

  for (let i = 0; i < 50; i++) {
    const name = productNames[i % productNames.length];
    const slug = `${name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${i + 1}`;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];

    products.push({
      name,
      slug,
      sku: `NN-${brand.name.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(6, "0")}`,
      description: `High-quality ${name} for your health needs.`,
      price: Math.floor(Math.random() * 5000) + 500,
      salePrice: Math.random() > 0.7 ? Math.floor(Math.random() * 4000) + 400 : null,
      featured: Math.random() > 0.8,
      prescriptionRequired: category.slug === "prescription-medicines",
      categoryId: category.id,
      brandId: brand.id,
    });
  }

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  const createdProducts = await prisma.product.findMany();
  for (const product of createdProducts) {
    await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: Math.floor(Math.random() * 100),
        reservedQuantity: 0,
      },
    });
  }

  console.log("✅ Seed complete!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());