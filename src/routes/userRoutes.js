import express from "express";
import {
  createUser_Ctler,
  updatePassword_Ctler,
  findAllUser_Ctler,
  findByIdUser_Ctler,
  updateUser_Ctler,
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/insert", authenticateToken, createUser_Ctler);
router.post("/pw/change/:USER_ID", authenticateToken, updatePassword_Ctler);
router.get("/list", authenticateToken, findAllUser_Ctler);
router.get("/list/:USER_ID", authenticateToken, findByIdUser_Ctler);
router.put("/update/:USER_ID", authenticateToken, updateUser_Ctler);
export default router;
