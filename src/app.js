import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import apiRoutes from "./routes/index.js";
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/api", apiRoutes);

app.use(errorHandler);

export default app;
