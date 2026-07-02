import { Router } from "express"; 

import categoryRoutes from "../modules/category/presentation/category.routes.js"
import brandRoutes from "../modules/brand/presentation/brand.routes.js"
import productRoutes from "../modules/product/presentation/product.routes.js"
import stockMovementRoutes from "../modules/stock-movement/stock-movement.routes.js"

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

export default router;