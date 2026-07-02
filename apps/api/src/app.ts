import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import routes from "./routes/index.js";
import { logger } from "./shared/logger.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  pinoHttp({
    logger,
    customSuccessMessage: (req, res) => `${req.method} ${req.url} - ${res.statusCode}`,
    customErrorMessage: (req, res, error) => `${req.method} ${req.url} - ${res.statusCode} - ${error.message}`,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

setupSwagger(app);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;