import * as quoteModel from "../models/quoteModel";
import { getKoreaTime } from "../utils/dateUtil";
import { v4 as uuidv4 } from "uuid";

/**
 * 견적서 생성
 */

export const createQuoteWithFile = async (data, file, images) => {
  // 1. QUOTE_CD 생성
  const lastQuote = await quoteModel.findLastQuote();
  const nextQuoteSeq = lastQuote
    ? parseInt(lastQuote.QUOTE_CD.replace("QT", "")) + 1
    : 1;
  const QUOTE_CD = `QT${String(nextQuoteSeq).padStart(3, "0")}`;

  // 2. 견적서 기본 등록
  const qutote = await quoteModel.createQuote({
    QUOTE_CD,
    TITLE: data.TITLE,
    CLIENT_CD: data.CLIENT_CD,
    TOTAL_PRICE: parseFloat(data.TOTAL_PRICE),
  });

  // 3. FILE_ID 생성 및 등록
  const lastFile = await quoteModel.findLastFile();
  const fileSeqStart = lastFile
    ? parseInt(lastFile.FILE_ID.replace("FILE", "")) + 1
    : 1;

  await Promise.all(
    file.map((file, i) =>
      quoteModel.createFile({
        FILE_ID: `FILE${String(fileSeqStart + i).padStart(3, "0")}`,
        QUOTE_CD,
        FILE_NAME: file.originalname,
        FILE_PATH: file.path,
        FILE_SIZE: file.size,
        FILE_TYPE: file.mimetype,
      })
    )
  );

  // 4. IMG_ID 생성 및 등록
  const lastImg = await quoteModel.findLastImg();
  const imgSeqStart = lastImg
    ? parseInt(lastImg.IMG_ID.replace("IMG", "")) + 1
    : 1;

  await Promise.all(
    images.map((img, i) =>
      quoteModel.createImage({
        IMG_ID: `IMG${String(imgSeqStart + i).padStart(3, "0")}`,
        QUOTE_CD,
        IMG_NAME: img.originalname,
        IMG_PATH: img.path,
        IMG_SIZE: img.size,
        IMG_TYPE: img.mimetype,
      })
    )
  );

  return { message: "견적서 등록 완료", QUOTE_CD, qutote };
};

// 견적서 조회
export const findQuoteWhitFileWithImgService = async () => {
  return await quoteModel.findQuoteWhitFileWithImg();
};
