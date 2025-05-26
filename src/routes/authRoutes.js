import express from "express";
import {
  login_Ctler,
  reissueToken_Cltr,
  logout_Ctler,
  createAuth_Ctler,
  findAllAuth_Ctler,
  connectUsertoAuth_Ctler,
} from "../controllers/authController";
import { authenticateToken } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/login", login_Ctler);
router.post("/refresh", authenticateToken, reissueToken_Cltr);
router.post("/logout/:USER_ID", authenticateToken, logout_Ctler);
router.post("/insert", authenticateToken, createAuth_Ctler);
router.get("/list", authenticateToken, findAllAuth_Ctler);
router.post("/group/user", authenticateToken, connectUsertoAuth_Ctler);

export default router;
