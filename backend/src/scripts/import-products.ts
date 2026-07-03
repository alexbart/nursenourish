import * as XLSX from "xlsx";
import { prisma } from "./prisma/prisma.js";
import { createSlug } from "./shared/utils/slug.js";

interface ExcelProduct {
  "SKU Code": string;
  "Product Name & Variant": string;
  "Core Active Ingredients": string;
  Category: string;
  "Pack Size": string;
  "Target Retail (KES)": number;
}

async function importCatalog() {
  console.log("📦 Importing NurseNourish Master Catalog...");

  const workbook = XLSX.readFile("../NurseNourish_Master_Retail_Catalog_2026.xlsx");
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data: ExcelProduct[] = XLSX.utils.sheet_to_json(worksheet);

  let createdCategories = 0;
  let createdProducts = 0;
  let skippedProducts = 0;

  await prisma.$transaction(async (tx) => {
    for (const row of data) {
      const categoryName = row.Category?.trim();
      const categorySlug = categoryName ? createSlug(categoryName) : "uncategorized";

      let category = await tx.category.findUnique({
        where: { slug: categorySlug },
      });

      if (!category && categoryName) {
        category = await tx.category.create({
          data: {
            name: categoryName,
            slug: categorySlug,
            description: null,
          },
        });
        createdCategories++;
      }

      const existingProduct = await tx.product.findUnique({
        where: { sku: row["SKU Code"] },
      });

      if (existingProduct) {
        skippedProducts++;
        continue;
      }

      const productName = row["Product Name & Variant"]?.trim() || "";
      const slug = createSlug(productName);

      await tx.product.create({
        data: {
          sku: row["SKU Code"],
          name: productName,
          slug,
          description: row["Core Active Ingredients"] || null,
          ingredients: row["Core Active Ingredients"] || null,
          packSize: row["Pack Size"] || null,
          price: row["Target Retail (KES)"],
          featured: false,
          prescriptionRequired: false,
          status: "ACTIVE",
          categoryId: category!.id,
          brandId: (await getOrCreateBrand(tx)).id,
        },
      });

      createdProducts++;
    }
  });

  console.log(`✅ Import complete!
     - Products imported: ${createdProducts}
     - Categories created: ${createdCategories}
     - Skipped (duplicates): ${skippedProducts}`);
}

async function getOrCreateBrand(tx: typeof prisma) {
  let brand = await tx.brand.findUnique({
    where: { slug: "nursenourish" },
  });

  if (!brand) {
    brand = await tx.brand.create({
      data: {
        name: "NurseNourish",
        slug: "nursenourish",
        description: "NurseNourish Health & Wellness Products",
      },
    });
  }

  return brand;
}

importCatalog()
  .catch((e) => {
    console.error("❌ Import failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());