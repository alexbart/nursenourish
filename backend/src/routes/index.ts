import { Router } from "express"; 

import categoryRoutes from "../modules/category/category.routes.js"
import brandRoutes from "../modules/brand/brand.routes.js"
import productRoutes from "../modules/product/product.routes.js"
import stockMovementRoutes from "../modules/stock-movement/stock-movement.routes.js"
import authRoutes from "../modules/auth/routes.js"

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Nursenourish API is healthy",
  });
});

router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/products", productRoutes);
router.use("/stock-movements", stockMovementRoutes);
router.use("/auth", authRoutes);

export default router;