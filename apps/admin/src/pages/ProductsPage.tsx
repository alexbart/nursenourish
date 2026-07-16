import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi } from "@/api";
import { Table, Badge, Pagination, Modal } from "@/components/ui";

function ProductForm({ initial, onSave, onClose }: { initial?: any; onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    sku: initial?.sku ?? "",
    price: initial?.price ?? "",
    salePrice: initial?.salePrice ?? "",
    categoryId: initial?.categoryId ?? "",
    brandId: initial?.brandId ?? "",
    description: initial?.description ?? "",
    ingredients: initial?.ingredients ?? "",
    packSize: initial?.packSize ?? "",
    featured: initial?.featured ?? false,
    prescriptionRequired: initial?.prescriptionRequired ?? false,
    status: initial?.status ?? "ACTIVE",
  });

  const { data: cats } = useQuery({ queryKey: ["categories"], queryFn: () => adminApi.getCategories().then((r) => r.data.data) });
  const { data: brands } = useQuery({ queryKey: ["brands"], queryFn: () => adminApi.getBrands().then((r) => r.data.data) });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
          <input className="input" value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="Auto-generated if empty" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pack Size</label>
          <input className="input" value={form.packSize} onChange={(e) => set("packSize", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
          <input className="input" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} required min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (KES)</label>
          <input className="input" type="number" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)} min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select className="input" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} required>
            <option value="">Select category</option>
            {(cats ?? []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <select className="input" value={form.brandId} onChange={(e) => set("brandId", e.target.value)} required>
            <option value="">Select brand</option>
            {(brands ?? []).map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="input" value={form.status} onChange={(e) => set("status", e.target.value)}>
            {["ACTIVE", "DRAFT", "ARCHIVED", "OUT_OF_STOCK"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea className="input" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Key Ingredients</label>
          <textarea className="input" rows={2} value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded" />
          <label htmlFor="featured" className="text-sm text-gray-700">Featured product</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="rx" checked={form.prescriptionRequired} onChange={(e) => set("prescriptionRequired", e.target.checked)} className="rounded" />
          <label htmlFor="rx" className="text-sm text-gray-700">Prescription required</label>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        <button type="submit" className="btn-primary">{initial ? "Save Changes" : "Create Product"}</button>
      </div>
    </form>
  );
}

export function ProductsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<null | "create" | any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", page, search],
    queryFn: () => adminApi.getProducts({ page: String(page), limit: "20", search: search || undefined }).then((r) => r.data),
  });

  const createMut = useMutation({
    mutationFn: (d: any) => adminApi.createProduct(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("Product created"); setModal(null); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message ?? "Failed"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: any) => adminApi.updateProduct(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("Product updated"); setModal(null); },
    onError: (e: any) => toast.error(e.response?.data?.error?.message ?? "Failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("Product deleted"); },
    onError: () => toast.error("Failed to delete"),
  });

  const products = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button onClick={() => setModal("create")} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <Table
          headers={["Product", "SKU", "Category", "Price", "Stock", "Status", "Actions"]}
          loading={isLoading}
        >
          {products.map((p: any) => (
            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={p.images?.[0]?.imageUrl || "/placeholder.png"} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.brand?.name}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.sku}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{p.category?.name}</td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">KES {Number(p.price).toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`badge ${(p.inventory?.quantity ?? 0) === 0 ? "bg-red-100 text-red-700" : (p.inventory?.quantity ?? 0) <= 5 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                  {p.inventory?.quantity ?? 0}
                </span>
              </td>
              <td className="px-4 py-3"><Badge value={p.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button onClick={() => setModal(p)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-primary">
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete "${p.name}"?`)) deleteMut.mutate(p.id); }}
                    className="p-1.5 hover:bg-red-50 rounded text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        {pagination && (
          <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} onPage={setPage} />
        )}
      </div>

      {modal && (
        <Modal
          title={modal === "create" ? "Add Product" : `Edit: ${modal.name}`}
          onClose={() => setModal(null)}
          size="lg"
        >
          <ProductForm
            initial={modal === "create" ? undefined : modal}
            onSave={(d) => modal === "create" ? createMut.mutate(d) : updateMut.mutate({ id: modal.id, data: d })}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
