import express from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import menuRoutes from "./menuRoutes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/menu", menuRoutes);

export default router;
