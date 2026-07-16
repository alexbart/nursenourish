import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingCart, Users, DollarSign, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { adminApi } from "@/api";
import { StatCard, Badge } from "@/components/ui";

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getStats().then((r) => r.data.data),
    refetchInterval: 60_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  const chartData = (data?.revenueByDay ?? []).map((d: any) => ({
    day: new Date(d.day).toLocaleDateString("en-KE", { month: "short", day: "numeric" }),
    revenue: d.revenue,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={data?.totalProducts ?? 0}
          icon={<Package size={22} />}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Total Orders"
          value={data?.totalOrders ?? 0}
          icon={<ShoppingCart size={22} />}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="Customers"
          value={data?.totalUsers ?? 0}
          icon={<Users size={22} />}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          label="Total Revenue"
          value={`KES ${Number(data?.totalRevenue ?? 0).toLocaleString()}`}
          icon={<DollarSign size={22} />}
          color="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Revenue — Last 30 Days</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066CC" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0066CC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [`KES ${Number(v).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#0066CC" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No revenue data yet</div>
          )}
        </div>

        {/* Order status breakdown */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {(data?.ordersByStatus ?? []).map((s: any) => (
              <div key={s.status} className="flex items-center justify-between">
                <Badge value={s.status} />
                <span className="font-semibold text-gray-900">{s._count.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {(data?.recentOrders ?? []).map((order: any) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{order.items.length} items · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">KES {Number(order.total).toLocaleString()}</p>
                  <Badge value={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            <h2 className="font-semibold text-gray-900">Low Stock Alerts</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {(data?.lowStock ?? []).length === 0 ? (
              <p className="px-5 py-8 text-center text-gray-400 text-sm">All products are well stocked</p>
            ) : (
              (data?.lowStock ?? []).map((inv: any) => (
                <div key={inv.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{inv.product.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{inv.product.sku}</p>
                  </div>
                  <span className={`badge ${inv.quantity === 0 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                    {inv.quantity} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
