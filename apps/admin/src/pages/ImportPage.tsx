import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Upload, FileSpreadsheet, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/api";

export function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<any>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const importMut = useMutation({
    mutationFn: (f: File) => adminApi.importProducts(f),
    onSuccess: (res) => {
      setReport(res.data.data);
      setFile(null);
      toast.success("Import completed");
    },
    onError: (e: any) => toast.error(e.response?.data?.error?.message ?? "Import failed"),
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith(".xlsx")) setFile(f);
    else toast.error("Please upload an .xlsx file");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Import Products</h1>
        <p className="text-gray-500 text-sm mt-1">Upload an Excel file to bulk import or update products.</p>
      </div>

      {/* Expected columns */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Expected Excel Columns</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["SKU Code", "Product SKU (unique)"],
            ["Product Name & Variant", "Full product name"],
            ["Category", "Category name"],
            ["Target Retail (KES)", "Retail price"],
            ["Core Active Ingredients", "Description / ingredients"],
            ["Pack Size", "e.g. 60 capsules"],
          ].map(([col, desc]) => (
            <div key={col} className="flex items-start gap-2 text-sm">
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-700 shrink-0">{col}</span>
              <span className="text-gray-500">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`card p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
          dragging ? "border-primary bg-primary/5" : "hover:border-primary/50 hover:bg-gray-50"
        } border-2 border-dashed`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
        />
        {file ? (
          <>
            <FileSpreadsheet size={40} className="text-green-500" />
            <p className="font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
          </>
        ) : (
          <>
            <Upload size={40} className="text-gray-300" />
            <p className="font-medium text-gray-700">Drop your .xlsx file here</p>
            <p className="text-sm text-gray-400">or click to browse</p>
          </>
        )}
      </div>

      {file && (
        <div className="flex gap-3">
          <button
            onClick={() => importMut.mutate(file)}
            disabled={importMut.isPending}
            className="btn-primary"
          >
            {importMut.isPending ? "Importing…" : "Start Import"}
          </button>
          <button onClick={() => setFile(null)} className="btn-ghost">Cancel</button>
        </div>
      )}

      {/* Report */}
      {report && (
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Import Report</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Read", value: report.totalRead, color: "text-gray-900" },
              { label: "Imported", value: report.imported, color: "text-green-600" },
              { label: "Updated", value: report.updated, color: "text-blue-600" },
              { label: "Failed", value: report.failed, color: "text-red-600" },
              { label: "Categories Created", value: report.categoriesCreated, color: "text-purple-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {report.errors?.length > 0 && (
            <div>
              <p className="font-medium text-red-600 mb-2 flex items-center gap-1.5">
                <XCircle size={16} /> {report.errors.length} Errors
              </p>
              <div className="bg-red-50 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1">
                {report.errors.map((e: string, i: number) => (
                  <p key={i} className="text-xs text-red-700 font-mono">{e}</p>
                ))}
              </div>
            </div>
          )}

          {report.failed === 0 && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle size={16} /> All products imported successfully
            </div>
          )}
        </div>
      )}
    </div>
  );
}
