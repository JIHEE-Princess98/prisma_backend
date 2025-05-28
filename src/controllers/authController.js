import {
  loginService,
  reissueAccessTokenService,
  logoutService,
  createAuthService,
  connectUsertoAuthService,
  updateAuthService,
  findByAuthUserService,
  deleteAuthUserService,
  findUserNotInAuthService,
} from "../services/authService.js";
import * as authModel from "../models/authModel";
import { resultFormat } from "../utils/requestUtil.js";

/***
 * NAME: "로그인"
 * URL : /api/auth/login
 */
export const login_Ctler = async (req, res) => {
  const { USER_ID, USER_PS } = req.body;

  try {
    const { accessToken, refreshToken, user } = await loginService(
      USER_ID,
      USER_PS
    );

    res.status(200).json(
      resultFormat({
        title: "로그인",
        success: true,
        message: "로그인 성공",
        data: {
          USER_ID: user.USER_ID,
          CNPT_CD: user.CNPT_CD,
          TOKEN: {
            accessToken,
            refreshToken,
          },
        },
      })
    );
  } catch (error) {
    res.status(401).json(
      resultFormat({
        title: "로그인",
        success: false,
        message: error.message,
      })
    );
  }
};

/***
 * NAME: "리프레시토큰 재발급"
 * URL : /api/auth/refresh
 */
export const reissueToken_Cltr = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) throw new Error("Refresh Token이 없습니다.");

    const newAccessToken = await reissueAccessTokenService(refreshToken);

    res.status(200).json(
      resultFormat({
        title: "토큰 재발급",
        success: true,
        message: "Access Token이 재발급되었습니다.",
        data: { accessToken: newAccessToken },
      })
    );
  } catch (error) {
    console.log(error);
    res.status(401).json(
      resultFormat({
        title: "토큰 재발급",
        success: false,
        message: error.message,
      })
    );
  }
};

/***
 * NAME: "로그아웃"
 * URL : /api/auth/logout
 */
export const logout_Ctler = async (req, res) => {
  const { USER_ID } = req.params;

  try {
    await logoutService(USER_ID);
    res.status(200).json(
      resultFormat({
        title: "로그아웃",
        success: true,
        message: "로그아웃 되었습니다.",
      })
    );
  } catch (error) {
    res.status(400).json(
      resultFormat({
        title: "로그아웃",
        success: false,
        message: `로그아웃 실패 : ${error.message}`,
      })
    );
  }
};

/***
 * NAME: "권한 생성"
 * URL : /api/auth/insert
 */
export const createAuth_Ctler = async (req, res) => {
  const authData = req.body;
  const createdBy = req.user?.USER_ID || "test";

  try {
    const newAuth = await createAuthService(authData, createdBy);
    res.status(201).json(
      resultFormat({
        title: "권한 생성",
        success: true,
        message: "권한이 생성되었습니다.",
        data: newAuth,
      })
    );
  } catch (error) {
    res.status(500).json(
      resultFormat({
        title: "권한 생성 실패",
        success: false,
        message: `권한 생성 실패 : ${error.message}`,
      })
    );
  }
};

/***
 * NAME: "권한 조회"
 * URL : /api/auth/list
 */
export const findAllAuth_Ctler = async (req, res) => {
  try {
    const auth = await authModel.findAllAuth();

    res.status(200).json(
      resultFormat({
        title: "권한 목록 조회",
        success: true,
        message: "사용자 목록을 가져왔습니다.",
        data: auth,
        total: auth.length,
      })
    );
  } catch (error) {
    res.status(500).json(
      resultFormat({
        title: "권한 목록 조회",
        success: false,
        message: `권한 조회 실패 : ${error.message}`,
      })
    );
  }
};

/***
 * NAME: "권한 수정"
 * URL : /api/auth/update/:GRP_AUTH_ID
 */
export const updateAuth_Ctler = async (req, res) => {
  const { GRP_AUTH_CD } = req.params;
  const updateData = req.body;
  const UPDATED_BY = req.user.USER_ID;

  try {
    const updateAuth = await updateAuthService(
      GRP_AUTH_CD,
      updateData,
      UPDATED_BY
    );

    res.status(200).json(
      resultFormat({
        title: "권한 수정",
        success: true,
        message: "권한 수정이 완료되었습니다.",
        data: updateAuth,
      })
    );
  } catch (error) {
    res.status(error.status || 500).json(
      resultFormat({
        title: "권한 수정",
        success: false,
        message: `권한 수정 실패 : ${error.message}`,
      })
    );
  }
};

/***
 * NAME: "권한별 사용자 등록"
 * URL : /api/auth/group/user
 */
export const connectUsertoAuth_Ctler = async (req, res) => {
  const { USER_ID, GRP_AUTH_CD } = req.body;
  const createdBy = req.user.USER_ID;

  try {
    const result = await connectUsertoAuthService(
      USER_ID,
      GRP_AUTH_CD,
      createdBy
    );
    res.status(200).json(
      resultFormat({
        title: "권한 부여",
        success: true,
        message: "사용자에게 권한이 부여되었습니다.",
        data: result,
      })
    );
  } catch (error) {
    res.status(error.status || 500).json(
      resultFormat({
        title: "권한 부여 실패",
        success: false,
        message: error.message,
      })
    );
  }
};

/***
 * NAME: "권한별 사용자 조회"
 * URL : /api/auth/group/user/:GRP_AUTH_CD
 */
export const findByAuthUser_Ctler = async (req, res) => {
  const { GRP_AUTH_CD } = req.params;

  try {
    const users = await findByAuthUserService(GRP_AUTH_CD);
    res.status(200).json(
      resultFormat({
        title: "권한별 사용자 목록",
        success: true,
        message: "조회 성공",
        data: users,
        total: users.length,
      })
    );
  } catch (error) {
    res.status(500).json(
      resultFormat({
        title: "권한별 사용자 조회 실패",
        success: false,
        message: error.message,
      })
    );
  }
};

/***
 * NAME: "권한별 사용자 삭제"
 * URL : /api/auth/group/:GRP_AUTH_CD/:USER_ID
 */
export const deleteAuthUser_Ctler = async (req, res) => {
  const { GRP_AUTH_CD, USER_ID } = req.params;

  try {
    await deleteAuthUserService(GRP_AUTH_CD, USER_ID);
    res.status(200).json(
      resultFormat({
        title: "권한 제거",
        success: true,
        message: "사용자가 권한에서 제거되었습니다.",
      })
    );
  } catch (error) {
    res.status(500).json(
      resultFormat({
        title: "권한 제거",
        success: true,
        message: `권한 별 사용자 제거 실패 ${error.message}`,
      })
    );
  }
};

/***
 * NAME: "권한이 부여되지 않은 사용자"
 * URL : /api/auth/group/user/not
 */
export const findUserNotInAuth_Ctler = async (req, res) => {
  try {
    const users = await findUserNotInAuthService();
    res.status(200).json(
      resultFormat({
        title: "권한 미부여 사용자 목록",
        success: true,
        message: "조회 성공",
        data: users,
        total: users.length,
      })
    );
  } catch (error) {
    res.status(error.status || 500).json(
      resultFormat({
        title: "조회 실패",
        success: false,
        message: error.message,
      })
    );
  }
};
