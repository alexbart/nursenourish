import * as XLSX from "xlsx";

export type LogLevel = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export function log(level: LogLevel, message: string) {
  const colors = {
    INFO: "\x1b[36m",
    SUCCESS: "\x1b[32m",
    WARNING: "\x1b[33m",
    ERROR: "\x1b[31m",
  };
  console.log(`${colors[level]}[${level}]${"\x1b[0m"} ${message}`);
}