import express from "express";
import * as quoteController from "../controllers/quoteController.js";
import upload from "../middlewares/uploadMiddlewares.js";

const router = express.Router();

router.post(
  "/form",
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "images", maxCount: 10 },
  ]),
  quoteController.createQuoteWithFile_Ctler
);
router.get("/list", quoteController.findQuoteWhitFileWithImg_Ctler);

export default router;
