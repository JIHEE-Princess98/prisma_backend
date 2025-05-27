import express from "express";
import { authenticateToken } from "../middlewares/authMiddlewares";
import {
  findAllMenus_Ctler,
  connectMenuToAuth_Ctler,
  findMenuByAuth_Ctler,
  deleteMenuByAuth_Ctler,
} from "../controllers/menuController";

const router = express.Router();

router.get("/list", authenticateToken, findAllMenus_Ctler);
router.post("/auth/:GRP_AUTH_CD", authenticateToken, connectMenuToAuth_Ctler);
router.get("/auth/list/:GRP_AUTH_CD", authenticateToken, findMenuByAuth_Ctler);
router.put(
  "/auth/update/:GRP_AUTH_CD",
  authenticateToken,
  deleteMenuByAuth_Ctler
);

export default router;
