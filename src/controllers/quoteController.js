import * as quoteService from "../services/quoteService";
import { resultFormat } from "../utils/requestUtil.js";

/***
 * NAME: "견적서 등록"
 * URL : /api/quote/form
 * form-Data
 * data (text)
 * files (file)
 * images (file)
 */
export const createQuoteWithFile_Ctler = async (req, res) => {
  try {
    const quoteData = JSON.parse(req.body.data);
    const files = req.files?.files || [];
    const images = req.files?.images || [];

    const result = await quoteService.createQuoteWithFile(
      quoteData,
      files,
      images
    );
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

/***
 * NAME: "견적서 조회"
 * URL : /api/quote/list
 */
export const findQuoteWhitFileWithImg_Ctler = async (req, res) => {
  try {
    const CNPT_CD = req.user?.CNPT_CD;
    if (!CNPT_CD) {
      return res.status(400).json(
        resultFormat({
          title: "견적서 조회",
          success: false,
          message: "토큰에 거래처 코드가 없습니다.",
        })
      );
    }

    const result = await quoteService.findQuoteWhitFileWithImgService(CNPT_CD);
    res.status(201).json(
      resultFormat({
        title: "견적서 조회",
        success: true,
        message: "견적서 조회에 성공했습니다.",
        data: result,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(
      resultFormat({
        title: "견적서 조회",
        success: false,
        message: `견적서 조회 실패 ${error.message}`,
      })
    );
  }
};

/***
 * NAME: "견적서 등록"
 * URL : /api/quote/update/:QUOTE_CD
 */
export const updateQuote_Ctler = async (req, res) => {
  try {
    const QUOTE_CD = req.params.QUOTE_CD;

    const quoteData = JSON.parse(req.body.data || "{}");
    const deleteFiles = req.body.deleteFiles
      ? JSON.parse(req.body.deleteFiles || "[]")
      : [];
    const deleteImages = req.body.deleteImages
      ? JSON.parse(req.body.deleteImages || "[]")
      : [];

    const files = req.files?.files || [];
    const images = req.files?.images || [];

    const result = await quoteService.updateQuoteService(
      QUOTE_CD,
      quoteData,
      files,
      images,
      deleteFiles,
      deleteImages
    );

    res.status(201).json(
      resultFormat({
        title: "견적서 수정",
        success: true,
        message: "견적서 수정에 성공했습니다.",
        data: result,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(
      resultFormat({
        title: "견적서 수정",
        success: true,
        message: `견적서 수정실패 ${error.message}`,
      })
    );
  }
};
