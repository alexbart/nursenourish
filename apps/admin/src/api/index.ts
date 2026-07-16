import { api } from "./client";

export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  // Dashboard
  getStats: () => api.get("/admin/stats"),

  // Products
  getProducts: (params?: Record<string, string>) =>
    api.get("/admin/products", { params }),
  createProduct: (data: any) => api.post("/admin/products", data),
  updateProduct: (id: string, data: any) => api.patch(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),

  // Orders
  getOrders: (params?: Record<string, string>) =>
    api.get("/admin/orders", { params }),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/admin/orders/${id}/status`, { status }),

  // Users
  getUsers: (params?: Record<string, string>) =>
    api.get("/admin/users", { params }),
  updateUserRole: (id: string, role: string) =>
    api.patch(`/admin/users/${id}/role`, { role }),
  toggleUserActive: (id: string) =>
    api.patch(`/admin/users/${id}/toggle-active`),

  // Stock
  getStockMovements: (params?: Record<string, string>) =>
    api.get("/admin/stock-movements", { params }),

  // Categories & Brands (for dropdowns)
  getCategories: () => api.get("/categories"),
  getBrands: () => api.get("/brands"),

  // Import
  importProducts: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/admin/import", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
