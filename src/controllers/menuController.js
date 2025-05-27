import {
  findAllMenusService,
  connectMenuToAuthService,
  findMenuByAuthService,
  deleteMenuByAuthService,
} from "../services/menuService.js";
import { resultFormat } from "../utils/requestUtil.js";

/***
 * NAME: "메뉴목록"
 * URL : /api/menu/list
 */
export const findAllMenus_Ctler = async (req, res) => {
  try {
    const data = await findAllMenusService();
    res.status(200).json(
      resultFormat({
        title: "메뉴 트리 조회",
        success: true,
        message: "조회 성공",
        data,
        total: data.length,
      })
    );
  } catch (error) {
    res.status(500).json(
      resultFormat({
        title: "조회 실패",
        success: false,
        message: err.message,
      })
    );
  }
};

/***
 * NAME: "권한별 메뉴 등록"
 * URL : /api/menu/auth/:GRP_AUTH_CD
 * body: [MENU_CD]
 */
export const connectMenuToAuth_Ctler = async (req, res) => {
  const { GRP_AUTH_CD } = req.params;
  const menuCodes = req.body;
  const createBy = req.user?.USER_ID || "jihee98";

  try {
    const result = await connectMenuToAuthService(
      GRP_AUTH_CD,
      menuCodes,
      createBy
    );
    res.status(200).json({
      success: true,
      message: "권한에 메뉴가 일괄 등록되었습니다.",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: `권한별 메뉴 일괄 등록 실패: ${error.message}`,
    });
  }
};

/***
 * NAME: "권한별 메뉴 조회"
 * URL : /api/menu/auth/list/::GRP_AUTH_CD
 *
 */
export const findMenuByAuth_Ctler = async (req, res) => {
  const { GRP_AUTH_CD } = req.params;

  try {
    const menus = await findMenuByAuthService(GRP_AUTH_CD);
    console.log(menus);
    res.status(200).json({
      success: true,
      message: "권한별 메뉴 상세 조회 성공",
      data: menus,
      total: menus.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `조회 실패: ${error.message}`,
    });
  }
};

/***
 * NAME: "권한별 메뉴 수정"
 * URL : /api/menu/auth/update/:GRP_AUTH_CD
 * body: [MENU_CD]
 */
export const deleteMenuByAuth_Ctler = async (req, res) => {
  const { GRP_AUTH_CD } = req.params;
  const menuCodes = req.body;
  const createBy = req.user?.USER_ID || "jihee98";

  try {
    const result = await deleteMenuByAuthService(
      GRP_AUTH_CD,
      menuCodes,
      createBy
    );
    res.status(200).json({
      success: true,
      message: "권한별 메뉴가 수정되었습니다.",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: `수정 실패: ${error.message}`,
    });
  }
};
