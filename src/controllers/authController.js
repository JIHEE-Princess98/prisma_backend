import {
  loginService,
  reissueAccessTokenService,
  logoutService,
} from "../services/authService.js";
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
