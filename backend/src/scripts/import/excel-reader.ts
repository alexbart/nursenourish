import * as XLSX from "xlsx";
import type { ExcelProductRow } from "./row-validator.js";

export function readExcelFile(filePath: string): ExcelProductRow[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("Excel file has no sheets");
  }
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(`Sheet not found: ${sheetName}`);
  }
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

  return rows.map((row) => ({
    sku: row["SKU Code"] || "",
    productName: row["Product Name & Variant"] || "",
    ingredients: row["Core Active Ingredients"] || "",
    category: row["Category"] || "",
    packSize: row["Pack Size"] || "",
    retailPrice: Number(row["Target Retail (KES)"] || 0),
  }));
}