import * as userModel from "../models/userModel";
import { getKoreaTime } from "../utils/dateUtil";
import { getClientIp } from "../utils/requestUtil";
import bcrypt from "bcrypt";

/**
 * 유저 생성
 */
export const createUserService = async (userData, req) => {
  const {
    USER_ID,
    USER_NM,
    USER_TYPE,
    MBL_TELNO,
    EMAIL,
    PLANT_CD,
    DEPT_NM,
    CNPT_CD,
    USER_RMRK,
    USER_POSITION,
  } = userData;

  //중복검사
  const existingUser = await userModel.findUserById(USER_ID);
  if (existingUser) {
    const error = new Error("이미 존재하는 유저 입니다.");
    error.status = 400;
    throw error;
  }

  const defaultPassword = "1234";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const newUserData = {
    USER_ID,
    USER_NM,
    USER_TYPE,
    USER_PS: hashedPassword,
    MBL_TELNO,
    EMAIL,
    PLANT_CD,
    DEPT_NM,
    CNPT_CD,
    USER_RMRK,
    USER_POSITION,
    IP: getClientIp(req),
    USE_YN: "Y",
    DEL_YN: "N",
    CREATED_AT: getKoreaTime(),
    CREATED_BY: USER_ID,
    UPDATED_AT: getKoreaTime(),
    UPDATED_BY: "",
  };

  return await userModel.createUser(newUserData);
};

/**
 * 비밀번호 변경
 */
export const updatePasswordService = async (USER_ID, USER_PS) => {
  const user = await userModel.findUserById(USER_ID);
  if (!user) {
    const error = new Error("유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  const hashedNPw = await bcrypt.hash(USER_PS, 10);
  return await userModel.updatePassword(USER_ID, hashedNPw, getKoreaTime());
};
