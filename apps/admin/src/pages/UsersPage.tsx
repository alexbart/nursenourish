import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, UserCheck, UserX } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/api";
import { Table, Badge, Pagination } from "@/components/ui";

const ROLES = ["", "CUSTOMER", "SUPER_ADMIN", "MANAGER", "INVENTORY_MANAGER", "MARKETING_MANAGER"];

export function UsersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, role, search],
    queryFn: () =>
      adminApi.getUsers({ page: String(page), limit: "20", role: role || undefined, search: search || undefined })
        .then((r) => r.data),
  });

  const roleMut = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => adminApi.updateUserRole(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("Role updated"); },
    onError: () => toast.error("Failed"),
  });

  const toggleMut = useMutation({
    mutationFn: (id: string) => adminApi.toggleUserActive(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("User updated"); },
    onError: () => toast.error("Failed"),
  });

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>

      <div className="card">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9 w-56"
              placeholder="Search users..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select className="input w-48" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
            {ROLES.map((r) => <option key={r} value={r}>{r || "All Roles"}</option>)}
          </select>
        </div>

        <Table headers={["User", "Email", "Phone", "Role", "Orders", "Status", "Joined", "Actions"]} loading={isLoading}>
          {users.map((u: any) => (
            <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                    {u.firstName[0]}{u.lastName[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{u.phone ?? "—"}</td>
              <td className="px-4 py-3">
                <select
                  value={u.role}
                  onChange={(e) => roleMut.mutate({ id: u.id, role: e.target.value })}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary"
                >
                  {ROLES.filter(Boolean).map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                </select>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{u._count.orders}</td>
              <td className="px-4 py-3">
                <span className={`badge ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {u.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleMut.mutate(u.id)}
                  className={`p-1.5 rounded ${u.isActive ? "hover:bg-red-50 text-gray-400 hover:text-red-500" : "hover:bg-green-50 text-gray-400 hover:text-green-500"}`}
                  title={u.isActive ? "Deactivate" : "Activate"}
                >
                  {u.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                </button>
              </td>
            </tr>
          ))}
        </Table>

        {pagination && <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} onPage={setPage} />}
      </div>
    </div>
  );
}
