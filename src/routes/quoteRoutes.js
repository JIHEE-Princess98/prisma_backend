import express from "express";
import * as quoteController from "../controllers/quoteController.js";
import upload from "../middlewares/uploadMiddlewares.js";
import { authenticateToken } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post(
  "/form",
  authenticateToken,
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "images", maxCount: 10 },
  ]),
  quoteController.createQuoteWithFile_Ctler
);

router.get(
  "/list",
  authenticateToken,
  quoteController.findQuoteWhitFileWithImg_Ctler
);

router.put(
  "/update/:QUOTE_CD",
  authenticateToken,
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "images", maxCount: 10 },
  ]),
  quoteController.updateQuote_Ctler
);

export default router;
