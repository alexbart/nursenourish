import { importCatalog } from "./import/importer.js";

const excelPath = process.argv[2] || "../NurseNourish_Master_Retail_Catalog_2026.xlsx";

importCatalog(excelPath).catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});