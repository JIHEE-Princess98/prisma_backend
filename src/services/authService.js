import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
  verifyRefreshToken,
} from "../utils/jwtUtil";
import * as authModel from "../models/authModel";
import * as userModel from "../models/userModel";
import { getKoreaTime } from "../utils/dateUtil";
import prisma from "../config/db";

//로그인
export const loginService = async (USER_ID, USER_PS) => {
  const user = await authModel.findUserById(USER_ID);
  if (!user) throw new Error("존재하지 않는 사용자입니다.");

  const isMatch = await bcrypt.compare(USER_PS, user.USER_PS);
  if (!isMatch) throw new Error("비밀번호가 일치하지 않습니다.");

  const payload = {
    USER_ID: user.USER_ID,
    CNPT_CD: user.CNPT_CD,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const expireAt = getRefreshTokenExpiry();
  const now = getKoreaTime();

  await authModel.saveRefreshToken(USER_ID, refreshToken, now, expireAt);
  await authModel.updateLastLoginAt(USER_ID, now);

  return { accessToken, refreshToken, user };
};

export const reissueAccessTokenService = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  const userTokenRecord = await authModel.findRefreshToken(decoded.USER_ID);

  if (!userTokenRecord || userTokenRecord.REFRESH_TOKEN !== refreshToken) {
    const error = new Error("유효하지 않은 리프레시 토큰입니다.");
    error.status = 401;
    throw error;
  }

  const newAccessToken = generateAccessToken({
    USER_ID: decoded.USER_ID,
    CNPT_CD: decoded.CNPT_CD,
  });

  return newAccessToken;
};

//로그아웃
export const logoutService = async (USER_ID) => {
  const now = getKoreaTime();
  const userToken = await authModel.findRefreshToken(USER_ID, now);

  if (!userToken) {
    const error = new Error(
      "이미 로그아웃되었거나 존재하지 않는 사용자 입니다."
    );
    error.status = 400;
    throw error;
  }

  await authModel.deleteRefreshToken(USER_ID);
  return true;
};

// 권한 생성
export const createAuthService = async (authData, createdBy) => {
  const lastCode = await authModel.getListAuthCnt();
  const nextNumber = lastCode
    ? parseInt(lastCode.replace("AUTH", ""), 10) + 1
    : 1;
  const newCode = "AUTH" + String(nextNumber).padStart(3, "0");

  const now = getKoreaTime();

  const newAuthData = {
    GRP_AUTH_CD: newCode,
    ...authData,
    DEL_YN: "N",
    USE_YN: "Y",
    CREATED_AT: now,
    CREATED_BY: createdBy,
    UPDATED_AT: now,
    UPDATED_BY: null,
  };

  return await authModel.createAuth(newAuthData);
};

// 권한수정
export const updateAuthService = async (
  GRP_AUTH_CD,
  updateData,
  UPDATED_BY
) => {
  const existing = await authModel.findeAuthById(GRP_AUTH_CD);
  if (!existing) {
    const error = new Error("존재하지 않는 권한값입니다.");
    error.status = 404;
    throw error;
  }
  return await authModel.updateAuth(GRP_AUTH_CD, updateData, UPDATED_BY);
};

// 권한별 사용자 생성
export const connectUsertoAuthService = async (
  USER_ID,
  GRP_AUTH_CD,
  createBy
) => {
  const user = await userModel.findByIdUser(USER_ID);
  if (!user) {
    const error = new Error("해당 사용자가 존재 하지 않습니다.");
    error.status = 404;
    throw error;
  }

  //중복 권한 방지
  const exists = await prisma.tb_mes_auth010.findUnique({
    where: { GRP_AUTH_CD_USER_ID: { GRP_AUTH_CD, USER_ID } },
  });

  if (exists) {
    const error = new Error("이미 해당 권한이 부여된 사용자입니다.");
    error.status = 400;
    throw error;
  }

  return await authModel.connectUsertoAuth(
    GRP_AUTH_CD,
    USER_ID,
    getKoreaTime(),
    createBy
  );
};

// 권한별 사용자 조회
export const findByAuthUserService = async (GRP_AUTH_CD) => {
  const idList = await authModel.findByAuthUser(GRP_AUTH_CD);
  const userIds = idList.map((data) => data.USER_ID);

  if (userIds.length === 0) return [];

  const users = await authModel.findByIdUser(userIds);
  return users;
};

// 권한별 사용자 삭제
export const deleteAuthUserService = async (GRP_AUTH_CD, USER_ID) => {
  return await authModel.deleteAuthUser(GRP_AUTH_CD, USER_ID);
};

// 권한이 부여되지 않은 사용자 리스트
export const findUserNotInAuthService = async () => {
  return await authModel.findUserNotInAuth();
};
