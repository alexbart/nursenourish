import cliProgress from "cli-progress";
import chalk from "chalk";
import { importCatalog } from "./import/importer.js";

const excelPath = process.argv[2] || "../NurseNourish_Master_Retail_Catalog_2026.xlsx";

const progressBar = new cliProgress.SingleBar({
  format: "Importing |" + chalk.cyan("{bar}") + "| {percentage}% || {value}/{total} products || {message}",
  hideCursor: true,
});

console.time("Elapsed");
progressBar.start(1, 0, { message: "Starting..." });

const report = await importCatalog(excelPath);

console.timeEnd("Elapsed");

console.log(`
====================================
Catalog Import Completed
====================================
Products Read       ${report.totalRead}
Imported            ${report.imported}
Updated             ${report.updated}
Skipped             ${report.failed - report.totalRead + report.imported + report.updated}
Failed              ${report.failed}
Categories Created  ${report.categoriesCreated}
====================================`);