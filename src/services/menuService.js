import * as menuModel from "../models/menuModel";

/**
 * 메뉴 목록
 */
export const findAllMenusService = async () => {
  const menus = await menuModel.findAllMenus();

  const menuMap = {};
  const tree = [];

  // menuMap 구성
  menus.forEach((menu) => {
    menu.SUB_MENU = [];
    menuMap[menu.MENU_CD] = menu;
  });

  // 트리 구성
  menus.forEach((menu) => {
    if (menu.PARENT_MENU_CD === "ROOT") {
      tree.push(menu);
    } else {
      const parent = menuMap[menu.PARENT_MENU_CD];
      if (parent) {
        parent.SUB_MENU.push(menu);
      } else {
        console.warn(`부모 메뉴 ${menu.PARENT_MENU_CD} 를 찾을 수 없습니다`);
      }
    }
  });

  return tree;
};

/**
 * 권한별 메뉴 등록
 */
export const connectMenuToAuthService = async (
  GRP_AUTH_CD,
  menuCodes,
  createBy
) => {
  if (!Array.isArray(menuCodes) || menuCodes.length === 0) {
    const error = new Error("등록할 메뉴가 없습니다.");
    error.status = 400;
    throw error;
  }

  return await menuModel.connectMenuToAuth(GRP_AUTH_CD, menuCodes, createBy);
};

/**
 * 권한별 메뉴 조회
 */
const buildMenuTree = (menus) => {
  const map = {};
  const tree = [];

  menus.forEach((menu) => {
    menu.SUB_MENU = [];
    map[menu.MENU_CD] = menu;
  });

  menus.forEach((menu) => {
    if (menu.PARENT_MENU_CD === "ROOT" || !menu.PARENT_MENU_CD) {
      tree.push(menu);
    } else {
      const parent = map[menu.PARENT_MENU_CD];
      if (parent) {
        parent.SUB_MENU.push(menu);
      }
    }
  });

  return tree;
};
export const findMenuByAuthService = async (GRP_AUTH_CD) => {
  const mappings = await menuModel.findMenuCodeByAuth(GRP_AUTH_CD);
  const menuCodes = mappings.map((m) => m.MENU_CD);

  if (menuCodes.length === 0) return [];

  const menu = await menuModel.findeMenuByCode(menuCodes);
  return buildMenuTree(menu);
};

/**
 * 권한별 메뉴 수정
 */
export const deleteMenuByAuthService = async (
  GRP_AUTH_CD,
  menuCode,
  createBy
) => {
  if (!Array.isArray(menuCode)) {
    const error = new Error("수정할 메뉴가 없습니다.");
    error.status = 400;
    throw error;
  }

  // 기존 매핑 삭제
  await menuModel.deleteMenuByAuth(GRP_AUTH_CD);

  //새 메뉴 등록
  return await menuModel.connectMenuToAuth(GRP_AUTH_CD, menuCode, createBy);
};
