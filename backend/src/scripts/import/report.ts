export interface ImportReport {
  totalRead: number;
  imported: number;
  updated: number;
  failed: number;
  categoriesCreated: number;
  brandCreated: boolean;
  errors: string[];
}

export function printReport(report: ImportReport) {
  const total = "===================================";
  console.log(`\n${total}
Import Finished
${total}
Products Read: ${report.totalRead}
Imported: ${report.imported}
Updated: ${report.updated}
Failed: ${report.failed}
Categories Created: ${report.categoriesCreated}
Brand Created: ${report.brandCreated ? "Yes" : "No"}
${report.failed > 0 ? `\nErrors:\n${report.errors.join("\n")}` : ""}
${total}\n`);
}