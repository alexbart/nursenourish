import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/api";
import { Table, Badge, Pagination, Modal } from "@/components/ui";

const STATUSES = ["", "PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrdersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page, status, search],
    queryFn: () =>
      adminApi.getOrders({
        page: String(page), limit: "20",
        status: status || undefined,
        search: search || undefined,
      }).then((r) => r.data),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateOrderStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); toast.success("Status updated"); },
    onError: () => toast.error("Failed to update status"),
  });

  const orders = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

      <div className="card">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9 w-56"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="input w-44"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s || "All Statuses"}</option>)}
          </select>
        </div>

        <Table headers={["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"]} loading={isLoading}>
          {orders.map((o: any) => (
            <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{o.id.slice(0, 8)}…</td>
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{o.user.firstName} {o.user.lastName}</p>
                <p className="text-xs text-gray-500">{o.user.email}</p>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{o.items.length}</td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">KES {Number(o.total).toLocaleString()}</td>
              <td className="px-4 py-3"><Badge value={o.payment?.status ?? "PENDING"} /></td>
              <td className="px-4 py-3">
                <select
                  value={o.status}
                  onChange={(e) => statusMut.mutate({ id: o.id, status: e.target.value })}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary"
                >
                  {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <button onClick={() => setSelected(o)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-primary">
                  <Eye size={15} />
                </button>
              </td>
            </tr>
          ))}
        </Table>

        {pagination && <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} onPage={setPage} />}
      </div>

      {selected && (
        <Modal title={`Order ${selected.id.slice(0, 8)}…`} onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium">{selected.user.firstName} {selected.user.lastName}</p>
                <p className="text-gray-500">{selected.user.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <Badge value={selected.status} />
              </div>
              <div>
                <p className="text-gray-500">Total</p>
                <p className="font-semibold text-lg">KES {Number(selected.total).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">Items</p>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                {selected.items.map((item: any) => (
                  <div key={item.id} className="px-4 py-3 flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold">KES {(Number(item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
