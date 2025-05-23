import express from "express";
import {
  login_Ctler,
  reissueToken_Cltr,
  logout_Ctler,
} from "../controllers/authController";
import { authenticateToken } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/login", login_Ctler);
router.post("/refresh", authenticateToken, reissueToken_Cltr);
router.post("/logout/:USER_ID", authenticateToken, logout_Ctler);

export default router;
