import prisma from "../config/db";
import { getKoreaTime } from "../utils/dateUtil";

export const findCustByCode = async (CUST_CD) => {
  return await prisma.tb_mes_cust000.findUnique({
    where: { CUST_CD },
  });
};

// 거래처 생성
export const createCustomer = (data) => {
  return prisma.tb_mes_cust000.create({
    data: {
      ...data,
      REG_DT: getKoreaTime(),
      MOD_DT: getKoreaTime(),
    },
  });
};

// 거래처 조회
export const findCustomer = () => {
  return prisma.tb_mes_cust000.findMany({
    where: { USE_YN: "Y" },
    orderBy: { MOD_DT: "desc" },
    select: {
      CUST_NM: true,
      CEO_NM: true,
      BIZ_NO: true,
      ADDR: true,
      USE_YN: true,
    },
  });
};

//거래처 상세조회
export const findByIdCustomer = (CUST_CD) => {
  return prisma.tb_mes_cust000.findMany({
    where: { CUST_CD },
  });
};

// 거래처 정보 수정
export const updateCustomer = (CUST_CD, updateData) => {
  return prisma.tb_mes_cust000.update({
    where: { CUST_CD },
    data: {
      ...updateData,
      MOD_DT: getKoreaTime(),
    },
  });
};
