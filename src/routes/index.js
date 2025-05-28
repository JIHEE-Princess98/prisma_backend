import express from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import menuRoutes from "./menuRoutes";
import custRoutes from "./customerRoutes";
import quoteRoutes from "./quoteRoutes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/menu", menuRoutes);
router.use("/cust", custRoutes);
router.use("/quote", quoteRoutes);

export default router;
