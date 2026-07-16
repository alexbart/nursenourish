import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { requireParam } from "../../shared/routeParams.js";
import { adminService } from "./admin.service.js";
import { productService } from "../product/product.service.js";
import { createProductSchema } from "../product/product.validator.js";

// Dashboard
export const getStats = asyncHandler(async (_req, res) => {
  const stats = await adminService.getStats();
  res.json({ data: stats });
});

// Products
export const listProducts = asyncHandler(async (req, res) => {
  const result = await productService.search(req.query as any);
  res.json({ data: result.products, pagination: result.pagination });
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = createProductSchema.parse(req.body);
  const product = await productService.create(data);
  res.status(201).json({ data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const data = createProductSchema.partial().parse(req.body);
  const product = await productService.update(requireParam(req.params.id), data);
  res.json({ data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.delete(requireParam(req.params.id));
  res.status(204).send();
});

// Orders
export const listOrders = asyncHandler(async (req, res) => {
  const result = await adminService.getOrders(req.query as any);
  res.json({ data: result.orders, pagination: result.pagination });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await adminService.updateOrderStatus(
    requireParam(req.params.id),
    req.body.status
  );
  res.json({ data: order });
});

// Users
export const listUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getUsers(req.query as any);
  res.json({ data: result.users, pagination: result.pagination });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserRole(
    requireParam(req.params.id),
    req.body.role
  );
  res.json({ data: user });
});

export const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await adminService.toggleUserActive(requireParam(req.params.id));
  res.json({ data: user });
});

// Stock movements
export const listStockMovements = asyncHandler(async (req, res) => {
  const result = await adminService.getStockMovements(req.query as any);
  res.json({ data: result.movements, pagination: result.pagination });
});

// Import
import multer from "multer";
import os from "os";

const upload = multer({ dest: os.tmpdir() });
export const uploadMiddleware = upload.single("file");

export const importProducts = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const report = await adminService.importFromFile(req.file.path);
  res.json({ data: report });
});
