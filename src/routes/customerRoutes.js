import express from "express";
import { authenticateToken } from "../middlewares/authMiddlewares";
import {
  createCustomer_Ctler,
  findCustomer_Ctler,
  findByIdCust_Ctler,
  updateCust_Ctler,
} from "../controllers/customerController";

const router = express.Router();

router.post("/insert", authenticateToken, createCustomer_Ctler);
router.get("/list", authenticateToken, findCustomer_Ctler);
router.get("/list/:CUST_CD", authenticateToken, findByIdCust_Ctler);
router.put("/update/:CUST_CD", authenticateToken, updateCust_Ctler);

export default router;
