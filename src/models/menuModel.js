import prisma from "../config/db";
import { getKoreaTime } from "../utils/dateUtil";

//메뉴 조회
export const findAllMenus = async () => {
  return await prisma.tb_mes_menu000.findMany({
    orderBy: { SORT_NO: "asc" },
  });
};

//권한별 메뉴 등록
export const connectMenuToAuth = async (GRP_AUTH_CD, menuCodes, createBy) => {
  const data = menuCodes.map((MENU_CD) => ({
    GRP_AUTH_CD,
    MENU_CD,
    CREATED_BY: createBy,
    CREATED_AT: getKoreaTime(),
  }));

  return await prisma.tb_mes_auth020.createMany({
    data,
    skipDuplicates: true,
  });
};

//권한별 메뉴조회
export const findMenuCodeByAuth = async (GRP_AUTH_CD) => {
  return await prisma.tb_mes_auth020.findMany({
    where: { GRP_AUTH_CD },
    select: { MENU_CD: true },
  });
};

// 메뉴코드 배열로 메뉴 상세 조회
export const findeMenuByCode = async (menuCodes) => {
  return await prisma.tb_mes_menu000.findMany({
    where: {
      MENU_CD: { in: menuCodes },
    },
    select: {
      PARENT_MENU_CD: true,
      MENU_CD: true,
      MENU_NM: true,
    },
    orderBy: { SORT_NO: "asc" },
  });
};

//권한별 매핑 수정 (삭제)
export const deleteMenuByAuth = async (GRP_AUTH_CD) => {
  return await prisma.tb_mes_auth020.deleteMany({
    where: { GRP_AUTH_CD },
  });
};
