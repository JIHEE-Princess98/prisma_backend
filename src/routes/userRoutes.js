import express from "express";
import {
  createUser_Ctler,
  updatePassword_Ctler,
} from "../controllers/userController";

const router = express.Router();

router.post("/insert", createUser_Ctler);
router.post("/pw/change/:USER_ID", updatePassword_Ctler);

export default router;
