import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api";
import { Table, Badge, Pagination } from "@/components/ui";

const TYPES = ["", "INITIAL", "PURCHASE", "SALE", "RETURN", "ADJUSTMENT", "DAMAGE"];

export function StockPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-stock", page, type],
    queryFn: () =>
      adminApi.getStockMovements({ page: String(page), limit: "25", type: type || undefined })
        .then((r) => r.data),
  });

  const movements = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Stock Movements</h1>

      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <select className="input w-48" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            {TYPES.map((t) => <option key={t} value={t}>{t || "All Types"}</option>)}
          </select>
        </div>

        <Table headers={["Product", "SKU", "Type", "Quantity", "Reason", "Reference", "Date"]} loading={isLoading}>
          {movements.map((m: any) => (
            <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.product?.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{m.product?.sku}</td>
              <td className="px-4 py-3"><Badge value={m.type} /></td>
              <td className="px-4 py-3">
                <span className={`font-semibold text-sm ${m.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                  {m.quantity > 0 ? "+" : ""}{m.quantity}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{m.reason ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{m.reference ?? "—"}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </Table>

        {pagination && <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} onPage={setPage} />}
      </div>
    </div>
  );
}
