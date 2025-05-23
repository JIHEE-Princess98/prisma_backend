import prisma from "../config/db";
import { getKoreaTime } from "../utils/dateUtil";

// 회원중복검사
export const findUserById = (USER_ID) => {
  return prisma.tb_mes_user000.findUnique({
    where: { USER_ID },
  });
};

//사용자 등록
export const createUser = (userData) => {
  return prisma.tb_mes_user000.create({
    data: userData,
  });
};

//비밀번호 변경
export const updatePassword = (USER_ID, newHashpw, updateAt) => {
  return prisma.tb_mes_user000.update({
    where: { USER_ID },
    data: {
      USER_PS: newHashpw,
      UPDATED_AT: updateAt,
    },
  });
};
