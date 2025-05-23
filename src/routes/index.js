import express from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);

export default router;
