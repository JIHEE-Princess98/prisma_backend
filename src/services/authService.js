import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
  verifyRefreshToken,
} from "../utils/jwtUtil";
import * as authModel from "../models/authModel";
import { getKoreaTime } from "../utils/dateUtil";

export const loginService = async (USER_ID, USER_PS) => {
  const user = await authModel.findUserById(USER_ID);
  if (!user) throw new Error("존재하지 않는 사용자입니다.");

  const isMatch = await bcrypt.compare(USER_PS, user.USER_PS);
  if (!isMatch) throw new Error("비밀번호가 일치하지 않습니다.");

  const payload = {
    USER_ID: user.USER_ID,
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
  });

  return newAccessToken;
};
