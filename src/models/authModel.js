import prisma from "../config/db";

// 사용자 조회(로그인용)
export const findUserById = (USER_ID) => {
  return prisma.tb_mes_user000.findUnique({
    where: { USER_ID },
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
