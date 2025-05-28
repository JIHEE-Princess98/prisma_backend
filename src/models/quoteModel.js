import prisma from "../config/db";
import { getKoreaTime } from "../utils/dateUtil";

export const findLastQuote = async () => {
  return await prisma.tb_mes_quote000.findFirst({
    orderBy: { QUOTE_CD: "desc" },
  });
};
export const findLastFile = async () => {
  return await prisma.tb_mes_quote010.findFirst({
    orderBy: { FILE_ID: "desc" },
  });
};
export const findLastImg = async () => {
  return await prisma.tb_mes_quote020.findFirst({
    orderBy: { IMG_ID: "desc" },
  });
};

// 견적서 생성
export const createQuote = (data) => {
  return prisma.tb_mes_quote000.create({
    data: {
      ...data,
      REG_DT: getKoreaTime(),
      MOD_DT: getKoreaTime(),
    },
  });
};

//견적서 파일 생성
export const createFile = (data) => {
  return prisma.tb_mes_quote010.create({
    data: {
      ...data,
      REG_DT: getKoreaTime(),
    },
  });
};

// 견적서 이미지 생성
export const createImage = (data) => {
  return prisma.tb_mes_quote020.create({
    data: {
      ...data,
      REG_DT: getKoreaTime(),
    },
  });
};

//견적서 조회
const convertFilePath = (file) => ({
  ...file,
  FILE_PATH: `/${file.FILE_PATH.replace(/\\/g, "/")}`,
});

const convertImgPath = (img) => ({
  ...img,
  IMG_PATH: `/${img.IMG_PATH.replace(/\\/g, "/")}`,
});

export const findQuoteWhitFileWithImg = async () => {
  const quotes = await prisma.tb_mes_quote000.findMany();

  const result = await Promise.all(
    quotes.map(async (quote) => {
      const files = await prisma.tb_mes_quote010.findMany({
        where: { QUOTE_CD: quote.QUOTE_CD },
      });

      const imgs = await prisma.tb_mes_quote020.findMany({
        where: { QUOTE_CD: quote.QUOTE_CD },
      });

      return {
        ...quote,
        FileData: files.map(convertFilePath),
        ImgData: imgs.map(convertImgPath),
      };
    })
  );
  return result;
};
