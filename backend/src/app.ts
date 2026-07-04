import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import routes from "./routes/index.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Swagger docs
const swaggerSpec = {
  openapi: "3.0.0",
  info: { title: "NurseNourish API", version: "1.0.0" },
  servers: [{ url: "/api/v1" }],
  paths: {
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

app.use("/api/v1", routes);

app.use(notFoundMiddleware);

app.use(errorHandler);

export default app;