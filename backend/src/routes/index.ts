import { Router } from "express"; 

import categoryRoutes from "../modules/category/category.routes.js"
import brandRoutes from "../modules/brand/brand.routes.js"
import productRoutes from "../modules/product/product.routes.js"
import stockMovementRoutes from "../modules/stock-movement/stock-movement.routes.js"
import authRoutes from "../modules/auth/routes.js"
import orderRoutes from "../modules/order/routes.js"
import paymentRoutes from "../modules/payment/routes.js"
import adminRoutes from "../modules/admin/admin.routes.js"

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Nursenourish API is healthy",
  });
});

// Aliases to avoid common pluralization/singular mismatches from the frontend
router.use("/categories", categoryRoutes);
router.use("/category", categoryRoutes);

router.use("/brands", brandRoutes);
router.use("/brand", brandRoutes);

router.use("/products", productRoutes);
router.use("/product", productRoutes);
router.use("/stock-movements", stockMovementRoutes);
router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/admin", adminRoutes);

export default router;