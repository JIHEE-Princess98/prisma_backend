import express from "express";
import {
  login_Ctler,
  reissueToken_Cltr,
  logout_Ctler,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", login_Ctler);
router.post("/refresh", reissueToken_Cltr);
router.post("/logout/:USER_ID", logout_Ctler);

export default router;
