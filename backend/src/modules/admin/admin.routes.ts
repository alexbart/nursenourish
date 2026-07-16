import { Router } from "express";
import { adminGuard } from "../../middlewares/admin.middleware.js";
import {
  getStats,
  listProducts, createProduct, updateProduct, deleteProduct,
  listOrders, updateOrderStatus,
  listUsers, updateUserRole, toggleUserActive,
  listStockMovements,
  importProducts, uploadMiddleware,
} from "./admin.controller.js";

const router = Router();
router.use(adminGuard);

// Dashboard
router.get("/stats", getStats);

// Products
router.get("/products", listProducts);
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Orders
router.get("/orders", listOrders);
router.patch("/orders/:id/status", updateOrderStatus);

// Users
router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/toggle-active", toggleUserActive);

// Stock
router.get("/stock-movements", listStockMovements);

// Import
router.post("/import", uploadMiddleware, importProducts);

export default router;
