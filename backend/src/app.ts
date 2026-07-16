import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  helmet({
    // Required for a cross-origin SPA (storefront) calling this API
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
]
  .filter(Boolean)
  .map((origin) => origin!.replace(/\/+$/, ""));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }
      const normalized = origin.replace(/\/+$/, "");
      if (allowedOrigins.length === 0 || allowedOrigins.includes(normalized)) {
        cb(null, true);
        return;
      }
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registered before route modules load so cold-start DB issues don't block it
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Nursenourish API is healthy",
  });
});

const swaggerSpec = {
  openapi: "3.0.0",
  info: { title: "NurseNourish API", version: "1.0.0" },
  servers: [{ url: "/api/v1" }],
  paths: {
    "/health": {
      get: { summary: "Health check", tags: ["System"] },
    },
    "/products": {
      get: { summary: "List products", tags: ["Products"] },
    },
    "/products/{slug}": {
      get: { summary: "Get product", tags: ["Products"] },
    },
    "/categories": {
      get: { summary: "List categories", tags: ["Categories"] },
    },
    "/auth/register": {
      post: { summary: "Register", tags: ["Auth"] },
    },
    "/auth/login": {
      post: { summary: "Login", tags: ["Auth"] },
    },
    "/orders": {
      post: { summary: "Create order", tags: ["Orders"] },
    },
    "/payments/initialize": {
      post: { summary: "Initialize payment", tags: ["Payments"] },
    },
  },
};

if (process.env.NODE_ENV !== "production") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Load API routes after health is registered (still eager, but Prisma is lazy)
const { default: routes } = await import("./routes/index.js");
app.use("/api/v1", routes);

app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
