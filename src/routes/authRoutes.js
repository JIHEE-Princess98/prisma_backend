import express from "express";
import { login_Ctler, reissueToken_Cltr } from "../controllers/authController";

const router = express.Router();

router.post("/login", login_Ctler);
router.post("/refresh", reissueToken_Cltr);

export default router;
