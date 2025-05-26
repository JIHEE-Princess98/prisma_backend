import prisma from "../config/db";
import { getKoreaTime } from "../utils/dateUtil";

// 사용자 조회(로그인용)
export const findUserById = (USER_ID) => {
  return prisma.tb_mes_user000.findUnique({
    where: { USER_ID },
  });
};

// 권한 조회
export const findeAuthById = (GRP_AUTH_CD) => {
  return prisma.tb_mes_auth000.findUnique({
    where: { GRP_AUTH_CD },
  });
};

// 리프레시 토큰 저장
export const saveRefreshToken = (USER_ID, refreshToken, time, expireAt) => {
  return prisma.tb_mes_user100.upsert({
    where: { USER_ID },
    update: {
      REFRESH_TOKEN: refreshToken,
      EXPIRED_AT: expireAt,
      UPDATED_AT: time,
    },
    create: {
      USER_ID,
      REFRESH_TOKEN: refreshToken,
      EXPIRED_AT: expireAt,
      CREATED_AT: time,
      UPDATED_AT: time,
    },
  });
};

// 리프레시 토큰 조회
export const findRefreshToken = (USER_ID) => {
  return prisma.tb_mes_user100.findUnique({
    where: { USER_ID },
  });
};

//로그아웃
export const deleteRefreshToken = (USER_ID, time) => {
  return prisma.tb_mes_user100.update({
    where: { USER_ID },
    data: {
      REFRESH_TOKEN: null,
      EXPIRED_AT: null,
      UPDATED_AT: time,
    },
  });
};

// 로그인 시간 기록
export const updateLastLoginAt = (USER_ID, time) => {
  return prisma.tb_mes_user000.update({
    where: { USER_ID },
    data: {
      LAST_LOGIN_AT: time,
    },
  });
};

// 권한 생성
export const createAuth = (authData) => {
  return prisma.tb_mes_auth000.create({
    data: authData,
  });
};

// 마지막 코드 조회
export const getListAuthCnt = async () => {
  const last = await prisma.tb_mes_auth000.findFirst({
    orderBy: {
      GRP_AUTH_CD: "desc",
    },
    where: {
      GRP_AUTH_CD: {
        startsWith: "AUTH", // 안전하게 필터
      },
    },
  });

  return last?.GRP_AUTH_CD || null;
};

// 권한 조회
export const findAllAuth = () => {
  return prisma.tb_mes_auth000.findMany({
    where: { DEL_YN: "N" },
    orderBy: { CREATED_AT: "desc" },
    select: {
      GRP_AUTH_CD: true,
      GRP_AUTH_NM: true,
      GRP_AUTH_RMRK: true,
      USE_YN: true,
    },
  });
};

// 권한 수정
export const updateAuth = async (GRP_AUTH_CD, updateData, UPDATED_BY) => {
  return prisma.tb_mes_auth000.update({
    where: { GRP_AUTH_CD },
    data: {
      ...updateData,
      ...(updateData.USE_YN === "N" && { DEL_YN: "Y" }),
      ...(updateData.USE_YN === "Y" && { DEL_YN: "N" }),
      UPDATED_AT: getKoreaTime(),
      UPDATED_BY: UPDATED_BY,
    },
  });
};

// 권한별 사용자 생성
export const connectUsertoAuth = (GRP_AUTH_CD, USER_ID, time, CREATED_BY) => {
  return prisma.tb_mes_auth010.create({
    data: {
      GRP_AUTH_CD,
      USER_ID,
      CREATED_AT: time,
      CREATED_BY,
    },
  });
};

// 권한별 사용자 목록
export const findByAuthUser = async (GRP_AUTH_CD) => {
  return prisma.tb_mes_auth010.findMany({
    where: { GRP_AUTH_CD },
    select: { USER_ID: true },
  });
};
export const findByIdUser = async (userIds) => {
  return prisma.tb_mes_user000.findMany({
    where: {
      USER_ID: { in: userIds },
    },
    select: {
      USER_ID: true,
      USER_NM: true,
      EMAIL: true,
      DEPT_NM: true,
      USER_TYPE: true,
    },
  });
};

//권한별 사용자 삭제
export const deleteAuthUser = async (GRP_AUTH_CD, USER_ID) => {
  return prisma.tb_mes_auth010.delete({
    where: {
      GRP_AUTH_CD_USER_ID: {
        GRP_AUTH_CD,
        USER_ID,
      },
    },
  });
};

// 권한이 부여되지 않은 사용자 조회
export const findUserNotInAuth = async () => {
  const authUsers = await prisma.tb_mes_auth010.findMany({
    select: { USER_ID: true },
  });

  const userIdInAuth = authUsers.map((data) => data.USER_ID);

  return prisma.tb_mes_user000.findMany({
    where: {
      USER_ID: {
        notIn: userIdInAuth.length > 0 ? userIdInAuth : ["___EMPTY___"],
      },
      DEL_YN: "N",
    },
    select: {
      USER_ID: true,
      USER_NM: true,
      EMAIL: true,
      DEPT_NM: true,
      USER_TYPE: true,
      USE_YN: true,
    },
  });
};
