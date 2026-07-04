import { prisma } from "../../prisma/prisma.js";
import { createSlug } from "../../shared/utils/slug.js";
import type { ImportReport } from "./report.js";
import XLSX from "xlsx";

export async function importCatalog(excelPath: string): Promise<ImportReport> {
  const report: ImportReport = {
    totalRead: 0,
    imported: 0,
    updated: 0,
    failed: 0,
    categoriesCreated: 0,
    brandCreated: false,
    errors: [],
  };

  console.log("📦 Starting catalog import...");

  const workbook = XLSX.readFile(excelPath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

  report.totalRead = rawRows.length;

  const brand = await getOrCreateBrand();
  report.brandCreated = true;

  const categoryMap = new Map<string, string>();
  const categorySet = new Set<string>();

  for (const row of rawRows) {
    const category = String(row["Category"] || "").trim();
    if (category && !categoryMap.has(category)) {
      categorySet.add(category);
    }
  }

  for (const categoryName of categorySet) {
    const category = await getOrCreateCategory(categoryName);
    categoryMap.set(categoryName, category.id);
    if (category.justCreated) report.categoriesCreated++;
  }

  for (const row of rawRows) {
    try {
      const sku = String(row["SKU Code"] || "").trim();
      const skuCode = row["SKU Code"] || "unknown";
      const categoryName = String(row["Category"] || "").trim();
      const productName = String(row["Product Name & Variant"] || "").trim();
      const retailPrice = Number(row["Target Retail (KES)"] || 0);

      if (!sku || !productName || !categoryName || retailPrice <= 0) {
        report.failed++;
        report.errors.push(`Invalid row: SKU=${skuCode}`);
        continue;
      }

      const categoryId = categoryMap.get(categoryName);
      if (!categoryId) {
        report.failed++;
        report.errors.push(`Category not found: ${categoryName}`);
        continue;
      }

      const existing = await prisma.product.findUnique({
        where: { sku },
      });

      if (existing) {
        await prisma.product.update({
          where: { sku },
          data: {
            name: productName,
            description: String(row["Core Active Ingredients"] || "") || null,
            packSize: String(row["Pack Size"] || "") || null,
            price: retailPrice,
          },
        });
        report.updated++;
        console.log(`✓ Updated: ${productName}`);
      } else {
        await prisma.product.create({
          data: {
            sku,
            name: productName,
            slug: createSlug(productName),
            description: String(row["Core Active Ingredients"] || "") || null,
            ingredients: String(row["Core Active Ingredients"] || "") || null,
            packSize: String(row["Pack Size"] || "") || null,
            price: retailPrice,
            brandId: brand.id,
            categoryId,
            images: {
              create: { imageUrl: "/images/products/placeholder.webp" },
            },
          },
        });
        report.imported++;
        console.log(`✓ Imported: ${productName}`);
      }
    } catch (error: any) {
      report.failed++;
      const skuCode = row["SKU Code"] || "unknown";
      report.errors.push(`Error: SKU=${skuCode}, ${error.message}`);
    }
  }

  await prisma.$disconnect();
  return report;
}

async function getOrCreateBrand() {
  let brand = await prisma.brand.findUnique({
    where: { slug: "nursenourish" },
  });

  if (!brand) {
    brand = await prisma.brand.create({
      data: {
        name: "NurseNourish",
        slug: "nursenourish",
        description: "NurseNourish Health & Wellness Products",
      },
    });
  }

  return brand;
}

async function getOrCreateCategory(name: string): Promise<{ id: string; justCreated: boolean }> {
  const slug = createSlug(name);
  let category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    category = await prisma.category.create({
      data: { name, slug, description: null },
    });
    return { id: category.id, justCreated: true };
  }

  return { id: category.id, justCreated: false };
}