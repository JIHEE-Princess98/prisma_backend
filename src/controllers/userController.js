import {
  createUserService,
  updatePasswordService,
  findByIdUserService,
} from "../services/userService.js";
import * as userModel from "../models/userModel.js";
import { resultFormat } from "../utils/requestUtil.js";

/***
 * NAME: "사용자 등록"
 * URL : /api/user/insert
 */
export const createUser_Ctler = async (req, res, next) => {
  try {
    const newUser = await createUserService(req.body, req);
    res.status(201).json(
      resultFormat({
        title: "회원가입",
        success: true,
        message: "회원가입에 성공했습니다.",
        data: newUser,
      })
    );
  } catch (error) {
    res.status(400).json(
      resultFormat({
        title: "회원가입",
        success: false,
        message: error.message,
      })
    );
  }
};

/***
 * NAME: "비밀번호 변경"
 * URL : /api/user/pw/change/:USER_ID
 */
export const updatePassword_Ctler = async (req, res, next) => {
  const { USER_ID } = req.params;
  const { USER_PS } = req.body;

  try {
    await updatePasswordService(USER_ID, USER_PS);

    res.status(200).json(
      resultFormat({
        title: "비밀번호 변경",
        success: true,
        message: "비밀번호가 성공적으로 변경되었습니다.",
      })
    );
  } catch (error) {
    res.status(400).json(
      resultFormat({
        title: "비밀번호 변경",
        success: false,
        message: error.message,
      })
    );
  }
};

/***
 * NAME: "사용자 조회"
 * URL : /api/user/list
 */
export const findAllUser_Ctler = async (req, res) => {
  try {
    const users = await userModel.findAllUser();

    res.status(200).json(
      resultFormat({
        title: "사용자 목록 조회",
        success: true,
        message: "사용자 목록을 가져왔습니다.",
        data: users,
        total: users.length,
      })
    );
  } catch (error) {
    res.status(500).json(
      resultFormat({
        title: "사용자 목록 조회",
        success: false,
        message: `사용자 조회 실패 : ${error.message}`,
      })
    );
  }
};

/***
 * NAME: "사용자 상세조회"
 * URL : /api/user/list/:USER_ID
 */
export const findByIdUser_Ctler = async (req, res) => {
  const { USER_ID } = req.params;

  try {
    const user = await findByIdUserService(USER_ID);
    res.status(200).json(
      resultFormat({
        title: "사용자 상세 조회",
        success: true,
        message: "사용자 정보를 조회했습니다.",
        data: user,
      })
    );
  } catch (error) {
    res.status(error.status || 500).json(
      resultFormat({
        title: "사용자 상세 조회",
        success: false,
        message: `사용자 조회 실패 : ${error.message}`,
      })
    );
  }
};
