import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();


app.use(helmet());


app.use(
  cors({
    origin: true,
    credentials: true
}
));

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes)

app.use(notFoundMiddleware)

app.use(errorHandler)



export default app;