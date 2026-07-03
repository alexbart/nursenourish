import { prisma } from "../../prisma/prisma.js";
import { createSlug } from "../../shared/utils/slug.js";
import { log } from "./logger.js";
import { readExcelFile } from "./excel-reader.js";
import { validateRow } from "./row-validator.js";
import { transformRowToDto } from "./transformer.js";
import { printReport, type ImportReport } from "./report.js";

export async function importCatalog(excelPath: string) {
  const report: ImportReport = {
    totalRead: 0,
    imported: 0,
    updated: 0,
    failed: 0,
    categoriesCreated: 0,
    brandCreated: false,
    errors: [],
  };

  log("INFO", "Starting catalog import...");

  const rows = readExcelFile(excelPath);
  report.totalRead = rows.length;

  const brand = await getOrCreateBrand();
  report.brandCreated = true;

  const categories = new Map<string, string>();
  for (const categoryName of getAllCategories(rows)) {
    const category = await getOrCreateCategory(categoryName);
    categories.set(categoryName, category.id);
    if (category.justCreated) report.categoriesCreated++;
  }

  for (const row of rows) {
    const validated = validateRow(row);
    if (!validated) {
      report.failed++;
      report.errors.push(`Invalid row: ${JSON.stringify(row)}`);
      continue;
    }

    try {
      const categoryId = categories.get(validated.category);
      if (!categoryId) {
        report.failed++;
        report.errors.push(`Category not found: ${validated.category}`);
        continue;
      }

      const existing = await prisma.product.findUnique({
        where: { sku: validated.sku },
      });

      if (existing) {
        await prisma.product.update({
          where: { sku: validated.sku },
          data: {
            name: validated.productName,
            description: validated.ingredients || null,
            packSize: validated.packSize || null,
            price: validated.retailPrice,
          },
        });
        report.updated++;
        log("INFO", `Updated: ${validated.productName}`);
      } else {
        await prisma.product.create({
          data: {
            ...transformRowToDto(validated, categoryId, brand.id),
            slug: createSlug(validated.productName),
            images: {
              create: { imageUrl: "/images/products/placeholder.webp" },
            },
          },
        });
        report.imported++;
        log("SUCCESS", `Imported: ${validated.productName}`);
      }
    } catch (error: any) {
      report.failed++;
      report.errors.push(`Error importing ${row["SKU Code"]}: ${error.message}`);
      log("ERROR", `Failed: ${row["SKU Code"]}`);
    }
  }

  printReport(report);
  await prisma.$disconnect();
}

function getAllCategories(rows: { category: string }[]): Set<string> {
  return new Set(rows.map((r) => r.category).filter(Boolean));
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
      data: {
        name,
        slug,
        description: null,
      },
    });
    return { id: category.id, justCreated: true };
  }

  return { id: category.id, justCreated: false };
}