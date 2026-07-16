import { prisma } from "../prisma/prisma.js";

async function seed() {
  console.log("Seeding database...");

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      { name: "Vitamins", slug: "vitamins", description: "Essential vitamins" },
      { name: "Minerals", slug: "minerals", description: "Essential minerals" },
      { name: "Fitness", slug: "fitness", description: "Sports nutrition" },
      { name: "Wellness", slug: "wellness", description: "General wellness" },
    ],
    skipDuplicates: true,
  });
  console.log(`Created ${categories.count} categories`);

  // Create brands
  const brands = await prisma.brand.createMany({
    data: [
      { name: "NurseNourish", slug: "nursenourish", description: "Own brand" },
      { name: "Nature Made", slug: "nature-made", description: "Trusted quality" },
      { name: "NOW Foods", slug: "now-foods", description: "Natural formulas" },
    ],
    skipDuplicates: true,
  });
  console.log(`Created ${brands.count} brands`);

  // Get created categories/brands for product seeding
  const vitaminCat = await prisma.category.findUnique({ where: { slug: "vitamins" } });
  const fitnessCat = await prisma.category.findUnique({ where: { slug: "fitness" } });
  const nnBrand = await prisma.brand.findUnique({ where: { slug: "nursenourish" } });

  if (vitaminCat && fitnessCat && nnBrand) {
    const products = await prisma.product.createMany({
      data: [
        {
          name: "Vitamin C 1000mg",
          slug: "vitamin-c-1000mg",
          sku: "NN-VITC-001",
          description: "Immune support supplement",
          price: 1200,
          featured: true,
          categoryId: vitaminCat.id,
          brandId: nnBrand.id,
        },
        {
          name: "Whey Protein",
          slug: "whey-protein",
          sku: "NN-PROTEIN-001",
          description: "Premium whey protein powder",
          price: 2500,
          featured: true,
          categoryId: fitnessCat.id,
          brandId: nnBrand.id,
        },
      ],
      skipDuplicates: true,
    });
    console.log(`Created ${products.count} products`);
  }

  console.log("Seed complete!");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());